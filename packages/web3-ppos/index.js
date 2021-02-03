var RLP = require('rlp');
// var EU = require('ethereumjs-util');
// var BN = require('bn.js');
// var Common = require('ethereumjs-common');
// var EthereumTx = require('ethereumjs-tx');
// var axios = require('axios');
var utils = require('web3-utils');

const main_net_hrp = "atp";
const test_net_hrp = "atx";
const main_net_chainid = 201018;

const paramsOrder = {
    '1000': ['typ', 'benefitAddress', 'nodeId', 'externalId', 'nodeName', 'website', 'details', 'amount', 'rewardPer', 'programVersion', 'programVersionSign', 'blsPubKey', 'blsProof'],
    '1001': ['benefitAddress', 'nodeId', 'rewardPer', 'externalId', 'nodeName', 'website', 'details'],
    '1002': ['nodeId', 'typ', 'amount'],
    '1003': ['nodeId'],
    '1004': ['typ', 'nodeId', 'amount'],
    '1005': ['stakingBlockNum', 'nodeId', 'amount'],
    '1100': [],
    '1101': [],
    '1102': [],
    '1103': ['addr'],
    '1104': ['stakingBlockNum', 'delAddr', 'nodeId'],
    '1105': ['nodeId'],
    '1200': [],
    '1201': [],
    '1202': [],

    '2000': ['verifier', 'pIDID'],
    '2001': ['verifier', 'pIDID', 'newVersion', 'endVotingRounds'],
    '2002': ['verifier', 'pIDID', 'module', 'name', 'newValue'],
    '2005': ['verifier', 'pIDID', 'endVotingRounds', 'tobeCanceledProposalID'],
    '2003': ['verifier', 'proposalID', 'option', 'programVersion', 'versionSign'],
    '2004': ['verifier', 'programVersion', 'versionSign'],
    '2100': ['proposalID'],
    '2101': ['proposalID'],
    '2102': [],
    '2103': [],
    '2104': ['module', 'name'],
    '2105': ['proposalID', 'blockHash'],
    '2106': ['module'],

    '3000': ['typ', 'data'],
    '3001': ['typ', 'addr', 'blockNumber'],

    '4000': ['account', 'plan'],
    '4100': ['account'],

    '5000': [],
    '5100': ['address', 'nodeIDs'],
}

function objToParams(params) {
    if (!Array.isArray(params)) {
        let pars = [params.funcType]
        let order = paramsOrder[params.funcType];
        for (const key of order) {
            pars.push(params[key])
        }
        return pars;
    }
    return params;
}

// 将ppos传进来的参数转为 data 字段
function paramsToData(params) {
    let arr = [];
    for (let param of params) {
        arr.push('0x' + RLP.encode(param).toString('hex'));
    }
    let rlpData = '0x' + RLP.encode(arr).toString('hex');
    return rlpData;
}

function funcTypeToBech32(hrp, funcType) {
    if (funcType >= 1000 && funcType < 2000) return utils.toBech32Address(hrp, '0x1000000000000000000000000000000000000002');
    if (funcType >= 2000 && funcType < 3000) return utils.toBech32Address(hrp, '0x1000000000000000000000000000000000000005');
    if (funcType >= 3000 && funcType < 4000) return utils.toBech32Address(hrp, '0x1000000000000000000000000000000000000004');
    if (funcType >= 4000 && funcType < 5000) return utils.toBech32Address(hrp, '0x1000000000000000000000000000000000000001');
    if (funcType >= 5000 && funcType < 6000) return utils.toBech32Address(hrp, '0x1000000000000000000000000000000000000006');
}

function pposHexToObj(hexStr) {
    hexStr = hexStr.toLowerCase().startsWith('0x') ? hexStr.substring(2) : hexStr;
    let str = Buffer.from(hexStr, 'hex').toString();
    try {
        str = JSON.parse(str);
        if (typeof str.Data === 'string') {
            try {
                str.Data = JSON.parse(str.Data);
            } catch (error) { }
        }
    } catch (error) { }
    return str;
}

var PPOS = function PPOS(chainId) {
    this.setChainId = function (chainId) {
        this.hrp = main_net_hrp;
        if (chainId === undefined) {
            if (this._platon !== undefined) {
                let chainIdHex = this._platon.currentProvider.chainId;
                if (chainIdHex != undefined)
                    chainId = utils.hexToNumber(chainIdHex);
            }
        }
        if (chainId === undefined || chainId !== main_net_chainid) {
            hrp = test_net_hrp
        }
    }
    this.setPlatonInstance = function (platon, chainId) {
        this._platon = platon;
        this.setChainId(chainId);
    }
    this.setChainId(chainId);
}

/**
 * call方式调用内置合约
 * @param params 内置合约调用参数
 * @returns {Promise<string>} 返回结果
 */
PPOS.prototype.call = async function (params) {
    try {
        let rawTx = {};
        params = objToParams(params);
        rawTx.data = paramsToData(params);
        rawTx.to = funcTypeToBech32(this.hrp, params[0]);
        let data = await this._platon.call(rawTx);
        return Promise.resolve(pposHexToObj(data));
    } catch (error) {
        return Promise.reject(error);
    }
};
/**
 * send方式调用内置合约
 * @param params 合约调用参数
 * @param other 其他参数，json形式，可以设置gas和gasPrice
 * @returns {Promise<*>} 结果
 */
PPOS.prototype.send = async function (params, other, privateKey) {
    try {
        let rawTx = await this.buildTransaction(params, other);
        if (privateKey === undefined) {
            // for Samurai
            return this._platon.sendTransaction(rawTx);
        } else {
            if ((rawTx.from === undefined) && (privateKey !== undefined)) {
                let pk = this.hrp === main_net_hrp ?
                    this._platon.accounts.privateKeyToAccount(privateKey).address.mainnet :
                    this._platon.accounts.privateKeyToAccount(privateKey).address.testnet;
                rawTx.from = pk;
            }
            if (rawTx.from === undefined || rawTx.from === null)
                return Promise.reject("from can not be null");
            let signTx = await this._platon.accounts.signTransaction(rawTx, privateKey);
            // 发送交易
            return this._platon.sendSignedTransaction(signTx.rawTransaction);
        }
    } catch (error) {
        return Promise.reject(error);
    }
};
/**
 * 构建未签名的Transaction
 * @param params 调用参数
 * @param other 其他参数，json形式，可以设置gas和gasPrice
 * @returns {Promise<{}>} 结果
 */
PPOS.prototype.buildTransaction = async function (params, other) {
    try {
        let address = (other && other.from) ||
            (this._platon && this.this._platon.currentProvider && this._platon.currentProvider.selectedAddress);
        let nonce = (other && other.nonce) ||
            (address && await this._platon.getTransactionCount(address));
        let rawTx = {};
        params = objToParams(params);
        rawTx.data = paramsToData(params);
        rawTx.from = address;
        rawTx.to = funcTypeToBech32(this.hrp, params[0]);
        rawTx.gas = (other && other.gas) || this.gas || '0xf4240';
        rawTx.gasPrice = (other && other.gasPrice) || this.gasPrice || '0x746a528800';
        rawTx.nonce = utils.numberToHex(nonce);
        if (this.hrp === main_net_hrp) rawTx.chainId = main_net_chainid;
        return Promise.resolve(rawTx);
    } catch (error) {
        return Promise.reject(error);
    }
}
PPOS.prototype.estimateGasThenSend = async function (params, other, privateKey) {
    try {
        let rawTx = await this.buildTransaction(params, other);
        let gas = this._platon.estimateGas(rawTx);
        rawTx.gas = gas;
        if (privateKey === undefined) {
            // for Samurai
            return this._platon.sendTransaction(rawTx);
        } else {
            let signTx = await this._platon.accounts.signTransaction(rawTx, privateKey);
            // 发送交易
            return this._platon.sendSignedTransaction(signTx.rawTransaction);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}
PPOS.prototype.estimateGasGaspriceThenSend = async function (params, other, privateKey) {
    try {
        let rawTx = await this.buildTransaction(params, other);
        let gasPrice = await this._platon.getGasPrice();
        let gas = await this._platon.estimateGas(rawTx);
        rawTx.gas = gas;
        rawTx.gasPrice = gasPrice;
        if (privateKey === undefined) {
            // for Samurai
            return this._platon.sendTransaction(rawTx);
        } else {
            let signTx = await this._platon.accounts.signTransaction(rawTx, privateKey);
            // 发送交易
            return this._platon.sendSignedTransaction(signTx.rawTransaction);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}
/**
 * 将16进制字符串转换为Buffer
 * @param {string} hexStr 16进制字符串，可以以‘0x’开头。
 * @returns {Buffer} Buffer
 */
PPOS.hexToBuffer = function (hexStr) {
    hexStr = hexStr.startsWith('0x') || hexStr.startsWith('0X') ? hexStr.substring(2) : hexStr;
    return Buffer.from(hexStr, 'hex');
};

module.exports = PPOS;
