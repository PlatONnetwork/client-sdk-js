var Constant = require('./constant.js');
var PlatonCommon = require('./common.js');

class DelegateContract {
    constructor() {
        this.address = Constant.CONTRACT_ADDRESS.delegateContract //合约地址
    }

    init(web3, cid, paramobj) {
        this.chainId = cid
        this.web3 = web3
        this.from = paramobj.from
        this.privateKey = paramobj.privateKey
    }
    /**
     * 发起委托1004
     *@param from  发起方
     *@param privateKey  发起方私钥
     *@param value 发送金额
     *@param typ 金额类型
     *@param nodeId 节点ID
     *@param amount 委托的金额
     *@returns {Promise<Object>}
     */
    delegate(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.delegate
            let param = [
                funcType,
                params.typ,
                '0x' + params.nodeId,
                params.amount,
            ]
            const platOnData = PlatonCommon.getPlatONData(param)
            const tmpgas =
                Constant.GAS.constantGas +
                Constant.GAS.stakingContractGas +
                Constant.GAS.delegateGas +
                PlatonCommon.getTransactionDataPrice(platOnData)
            const gas = this.web3.toHex(tmpgas);
            const gasprice = Constant.GASPRICE.gasPrice;
            let tmpfrom = param1.from ? param1.from : this.from,
                tmpprivateKey = param1.privateKet
                    ? param1.privateKet
                    : this.privateKey
            this.web3.platon.getTransactionCount(tmpfrom, (err, data) => {
                if (err) {
                    reject(err)
                    return
                }
                const number = data.toString(16)
                PlatonCommon.sendTransaction(
                    this.web3,
                    tmpfrom,
                    tmpprivateKey,
                    params.value,
                    this.chainId,
                    number,
                    this.address,
                    platOnData,
                    gas,
                    gasprice,
                )
                    .then(data => {
                        resolve(data)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        })
    }

    /**
     * 撤销委托1005
     *@param from  发起方
     *@param privateKey  发起方私钥
     *@param value 发送金额
     *@param stakingBlockNum 质押唯一标识
     *@param nodeId 节点ID
     *@param amount 委托的金额
     * @returns {Promise<Object>}
     */

    withdrewDelegate(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.undelegate
            let param = [
                funcType,
                params.stakingBlockNum,
                '0x' + params.nodeId,
                params.amount,
            ]
            const platOnData = PlatonCommon.getPlatONData(param)
            const tmpgas =
                Constant.GAS.constantGas +
                Constant.GAS.stakingContractGas +
                Constant.GAS.undelegateGas +
                PlatonCommon.getTransactionDataPrice(platOnData)
            const gas = this.web3.toHex(tmpgas);
            const gasprice = Constant.GASPRICE.gasPrice;
            let tmpfrom = param1.from ? param1.from : this.from,
                tmpprivateKey = param1.privateKet
                    ? param1.privateKet
                    : this.privateKey;
            this.web3.platon.getTransactionCount(tmpfrom, (err, data) => {
                if (err) {
                    reject(err)
                    return
                }
                const number = data.toString(16)
                PlatonCommon.sendTransaction(
                    this.web3,
                    tmpfrom,
                    tmpprivateKey,
                    params.value,
                    this.chainId,
                    number,
                    this.address,
                    platOnData,
                    gas,
                    gasprice,
                )
                    .then(data => {
                        resolve(data)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        })
    }

    /**
     *  查询当前账户地址所委托的节点的NodeID和质押Id 1103
     * @param addr 委托人的账户地址
     * @returns {Promise<Object>}
     */
    getRelatedListByDelAddr(params) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.getRelatedListByDelAddr
            let param = [funcType, params.addr]
            const platOnData = PlatonCommon.getPlatONData(param)
            this.web3.platon.call(
                {
                    from: this.address,
                    to: this.address,
                    data: platOnData,
                },
                (err, result) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    const decodeObj = PlatonCommon.decodePlatONCall(result)
                    const obj = PlatonCommon.handleResult(decodeObj)
                    resolve(obj)
                },
            )
        })
    }

    /**
     *  查询当前单个委托信息 1104
     * @param stakingBlockNum 发起质押时的区块高度
     * @param delAddr 委托人账户地址
     * @param nodeId 验证人的节点Id
     * @returns {Promise<Object>}
     */
    getDelegateInfo(params) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.getDelegateInfo
            let param = [
                funcType,
                params.stakingBlockNum,
                params.delAddr,
                '0x' + params.nodeId,
            ]
            const platOnData = PlatonCommon.getPlatONData(param)
            this.web3.platon.call(
                {
                    from: this.address,
                    to: this.address,
                    data: platOnData,
                },
                (err, result) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    const decodeObj = PlatonCommon.decodePlatONCall(result)
                    const obj = PlatonCommon.handleResult(decodeObj)
                    resolve(obj)
                },
            )
        })
    }

      /**
     * 获取已完成的交易信息
     * @param hash 交易hash
     */
    getTransactionReceipt(hash) {
        return new Promise((resolve, reject) => {
             this.web3.platon.getTransactionReceipt(hash, (err, result) => {
                 if (err) {
                     reject(err);
                 } else {
                     const res = rlp.decode(result.logs[0].data);
                     const obj = res.toString()
                     resolve(obj);
                 }
            })
        })

    }
}
module.exports = new DelegateContract;