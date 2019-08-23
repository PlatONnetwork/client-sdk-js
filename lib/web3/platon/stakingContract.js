var Constant = require('./constant.js');
var PlatonCommon = require('./common.js');
var rlp = require('rlp');
class StakingContract {
    constructor() {
        this.address = Constant.CONTRACT_ADDRESS.stakingContract //合约地址
        this.proposalAddress = Constant.CONTRACT_ADDRESS.ProposalContract
    }
    init(web3, cid, paramobj) {
        this.web3 = web3
        this.cid = cid
        this.from = paramobj.from
        this.privateKey = paramobj.privateKey
    }

    /**
     * 发起质押 1000
     * @param from  发起方
     * @param privateKey  发起方私钥
     * @param value 发送金额
     * @param typ 金额类型
     * @param benifitAddress 收益账户
     * @param nodeId 节点Id
     * @param externalId 外部Id
     * @param nodeName 节点名称
     * @param website 第三方主页
     * @param details 节点的描述
     * @param amount 质押的von
     * @param programVersion 程序的真实版本，治理rpc获取
     * @param programVersionSign 程序的真实版本签名，治理rpc获取
     * @param blsPubKey bls的公钥
     * @returns {Promise<any>}
     */
    staking(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.staking
            this.getProgramVersion().then(res => {
                const programVersion = res.data.ProgramVersion;
                const tmpprogramVersionSign = res.data.ProgramVersionSign;
                let tmpfrom = param1.from ? param1.from : this.from,
                    tmpprivateKey = param1.privateKet
                        ? param1.privateKet
                        : this.privateKey;
                let param = [
                    funcType,
                    params.typ,
                    params.benifitAddress,
                    '0x' + params.nodeId,
                    params.externalId,
                    params.nodeName,
                    params.website,
                    params.details,
                    params.amount,
                    programVersion,
                    tmpprogramVersionSign,
                    params.blsPubKey
                ]
                const platOnData = PlatonCommon.getPlatONData(param)
                const tmpgas =
                    Constant.GAS.constantGas +
                    Constant.GAS.stakingContractGas +
                    Constant.GAS.stakingGas +
                    PlatonCommon.getTransactionDataPrice(platOnData)
                const gas = this.web3.toHex(tmpgas) //'0x13678'
                const gasprice = Constant.GASPRICE.gasPrice;
                // debugger
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
                        this.cid,
                        number,
                        this.address,
                        platOnData,
                        gas,
                        gasprice,
                    )
                        .then(data => {
                            resolve(data) //0x0233289cd9f3b80d3c69b3f39d5b2d7c6e62934f1966a9a8097bb884b44479a4
                        })
                        .catch(error => {
                            reject(error)
                        })
                })
            })
        })
    }
    /**
     * 修改质押信息 1001
     * @param from  发起方
     * @param privateKey  发起方私钥
     * @param value 发送金额
     * @param benifitAddress 收益账户
     * @param nodeId 节点Id
     * @param externalId 外部Id
     * @param nodeName 节点名称
     * @param website 第三方主页
     * @param details 节点的描述
     * @returns {Promise<any>}
     */
    updateStakingInfo(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.updateStakingInfo
            let param = [
                funcType,
                params.benifitAddress,
                '0x' + params.nodeId,
                params.externalId,
                params.nodeName,
                params.website,
                params.details,
            ]
            const platOnData = PlatonCommon.getPlatONData(param)
            const tmpgas =
                Constant.GAS.constantGas +
                Constant.GAS.stakingContractGas +
                Constant.GAS.updateStakingInfoGas +
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
                    this.cid,
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
     * 撤销质押 1003
     * @param from  发起方
     * @param privateKey  发起方私钥
     * @param value 发送金额
     * @param nodeId 节点Id
     * @returns {Promise<any>}
     */
    unStaking(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.unStaking
            let param = [funcType, '0x' + params.nodeId]
            const platOnData = PlatonCommon.getPlatONData(param)
            const tmpgas =
                Constant.GAS.constantGas +
                Constant.GAS.stakingContractGas +
                Constant.GAS.unStakingGas +
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
                    this.cid,
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
     * 增持质押 1002
     * @param from  发起方
     * @param privateKey  发起方私钥
     * @param value 发送金额
     * @param nodeId 节点Id
     * @param typ 金额类型
     * @param amount 质押的von
     * @returns {Promise<any>}
     */
    addStaking(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.addStaking
            let param = [
                funcType,
                '0x' + params.nodeId,
                params.typ,
                params.amount,
            ]
            const platOnData = PlatonCommon.getPlatONData(param)
            const tmpgas =
                Constant.GAS.constantGas +
                Constant.GAS.stakingContractGas +
                Constant.GAS.addStakingGas +
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
                    this.cid,
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
     *  查询当前节点的质押信息 1105
     * @param nodeId 验证人的节点Id
     * @returns {Promise<Object>}
     */
    getStakingInfo(params) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.GetStakingInfo
            const param = [funcType, '0x' + params.nodeId]
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
     * 查询节点代码版本(内部调用)2104
     * @returns {Promise<Object>}
     */
    getProgramVersion() {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.getProgramVersion
            let param = [funcType]
            const platOnData = PlatonCommon.getPlatONData(param)
            this.web3.platon.call({
                    from: this.proposalAddress,
                    to: this.proposalAddress,
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
module.exports = new StakingContract;