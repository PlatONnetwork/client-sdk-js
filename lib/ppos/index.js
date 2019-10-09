var RLP = require('rlp');
var EU = require('ethereumjs-util');
var BN = require('bn.js');
var Common = require('ethereumjs-common');
var EthereumTx = require('ethereumjs-tx');
var axios = require('axios');
const paramsOrder = {
    '1000': ['typ', 'benefitAddress', 'nodeId', 'externalId', 'nodeName', 'website', 'details', 'amount', 'programVersion', 'programVersionSign', 'blsPubKey', 'blsProof'],
    '1001': ['benefitAddress', 'nodeId', 'externalId', 'nodeName', 'website', 'details'],
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

    '2000': ['verifier', 'pIDID'],
    '2001': ['verifier', 'pIDID', 'newVersion', 'endVotingRounds'],
    '2005': ['verifier', 'pIDID', 'endVotingRounds', 'tobeCanceledProposalID'],
    '2003': ['verifier', 'proposalID', 'option', 'programVersion', 'versionSign'],
    '2004': ['verifier', 'programVersion', 'versionSign'],
    '2100': ['proposalID'],
    '2101': ['proposalID'],
    '2102': [],
    '2103': [],
    '2105': [],

    '3000': ['typ', 'data'],
    '3001': ['typ', 'addr', 'blockNumber'],

    '4000': ['account', 'plan'],
    '4100': ['account'],
}

function decodeBlockLogs(block) {
    let logs = block.logs;
    if (Array.isArray(logs)) {
        for (let log of logs) {
            try {
                log.dataStr = JSON.parse(RLP.decode(log.data).toString());
            } catch (error) { }
        }
    }
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

// 休眠，单位ms
async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
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

// 根据函数类型，选择对应的 to 地址。
function funcTypeTo(funcType) {
    if (funcType >= 1000 && funcType < 2000) return '0x1000000000000000000000000000000000000002';
    if (funcType >= 2000 && funcType < 3000) return '0x1000000000000000000000000000000000000005';
    if (funcType >= 3000 && funcType < 4000) return '0x1000000000000000000000000000000000000004';
    if (funcType >= 4000 && funcType < 5000) return '0x1000000000000000000000000000000000000001';
}

// 使用私钥对交易进行签名
function signTx(privateKey, chainId, rawTx) {
    privateKey = privateKey.toLowerCase().startsWith('0x') ? privateKey.substring(2) : privateKey;
    const customCommon = Common.default.forCustomChain(
        'mainnet',
        {
            name: 'my-network',
            chainId: 1,
            chainId: chainId,
        },
        'petersburg'
    );

    let tx = new EthereumTx.Transaction(rawTx, { common: customCommon });
    tx.sign(Buffer.from(privateKey, 'hex'));
    let rawTransaction = tx.serialize().toString('hex');
    if (!rawTransaction.startsWith('0x')) {
        rawTransaction = '0x' + rawTransaction;
    }
    return rawTransaction;
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

function PPOS(setting) {
    if (setting.provider) {
        this.provider = setting.provider;
        this.client = axios.create({ baseURL: setting.provider });
    }
    if (setting.chainId) this.chainId = setting.chainId;
    if (setting.privateKey) this.privateKey = setting.privateKey.toLowerCase().startsWith('0x') ? setting.privateKey.substring(2) : setting.privateKey;
    if (setting.gas) this.gas = setting.gas;
    if (setting.gasPrice) this.gasPrice = setting.gasPrice;
}

PPOS.prototype.updateSetting = function (setting) {
    if (setting.provider) { this.provider = setting.provider; this.client = axios.create({ baseURL: setting.provider }); }
    if (setting.chainId) this.chainId = setting.chainId;
    if (setting.privateKey) this.privateKey = setting.privateKey.toLowerCase().startsWith('0x') ? setting.privateKey.substring(2) : setting.privateKey;
    if (setting.gas) this.gas = setting.gas;
    if (setting.gasPrice) this.gasPrice = setting.gasPrice;
    if (setting.retry) this.retry = setting.retry;
    if (setting.interval) this.interval = setting.interval;
};

PPOS.prototype.getSetting = function () {
    return {
        provider: this.provider,
        chainId: this.chainId,
        privateKey: this.privateKey,
        gas: this.gas,
        gasPrice: this.gasPrice,
        retry: this.retry,
        interval: this.interval
    };
};

PPOS.prototype.bigNumBuf = function (intStr, radix, byteLen) {
    radix = radix || 10;
    let num = new BN(intStr, radix);
    byteLen = byteLen || Math.ceil(num.byteLength() / 8) * 8; // 好像宽度没用...
    return num.toTwos(byteLen).toBuffer();
};

PPOS.prototype.hexStrBuf = function (hexStr) {
    hexStr = hexStr.startsWith('0x') || hexStr.startsWith('0X') ? hexStr.substring(2) : hexStr;
    return Buffer.from(hexStr, 'hex');
};

PPOS.prototype.rpc = async function (method, params) {
    try {
        params = params || [];
        const data = { "jsonrpc": "2.0", "method": method, "params": params, "id": new Date().getTime() }
        let replay = await this.client.post("", data);
        if (replay.status === 200) {
            return Promise.resolve(replay.data.result);
        } else {
            return Promise.reject("request error");
        }
    } catch (error) {
        return Promise.reject(error)
    }
};

PPOS.prototype.call = async function (params) {
    try {
        let rawTx = {};
        params = objToParams(params);
        rawTx.data = paramsToData(params);
        rawTx.to = funcTypeTo(params[0]);
        let data = await this.rpc("platon_call", [rawTx, "latest"]);
        return Promise.resolve(pposHexToObj(data));
    } catch (error) {
        return Promise.reject(error);
    }
};

PPOS.prototype.send = async function (params, other) {
    if (this.privateKey === undefined || this.chainId === undefined) return Promise.reject("Please call updateSetting to set privateKey or chainId");
    try {
        let privateKey = this.privateKey;
        let chainId = this.chainId;

        let address = EU.bufferToHex(EU.privateToAddress('0x' + privateKey));
        let nonce = await this.rpc("platon_getTransactionCount", [address, 'latest']);

        let rawTx = {};
        params = objToParams(params);
        rawTx.data = paramsToData(params);
        rawTx.from = address;
        rawTx.to = funcTypeTo(params[0]);
        rawTx.gas = (other && other.gas) || this.gas || '0x76c0000';
        rawTx.gasPrice = (other && other.gasPrice) || this.gasPrice || '0x9184e72a000000';
        rawTx.nonce = nonce;

        let rawTransaction = signTx(privateKey, chainId, rawTx);

        let hash = await this.rpc("platon_sendRawTransaction", [rawTransaction]);
        if (!hash) return Promise.reject('no hash');

        let retry = (other && other.retry) || this.retry || 600;
        let interval = (other && other.interval) || this.interval || 100;
        const errMsg = `getTransactionReceipt txHash ${hash} interval ${interval}ms by ${retry} retry failed`;
        while (retry) {
            const receipt = await this.rpc('platon_getTransactionReceipt', [hash]);
            if (receipt) {
                decodeBlockLogs(receipt);
                return Promise.resolve(receipt);
            }
            await sleep(interval);
            retry -= 1;
        }
        return Promise.reject(errMsg);
    } catch (error) {
        return Promise.reject(error);
    }
};

module.exports = PPOS;
