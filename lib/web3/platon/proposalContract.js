var Constant = require('./constant');
var PlatonCommon = require('./common');

class ProposalContract {
    constructor() {
        this.address = Constant.CONTRACT_ADDRESS.ProposalContract //合约地址
    }
    init(web3, cid, paramobj) {
        this.web3 = web3
        this.cid = cid
        this.from = paramobj.from
        this.privateKey = paramobj.privateKey
    }

    /**
     * 提交文本提案 2000
     *@param from  发起方
     *@param privateKey  发起方私钥
     *@param value 发送金额
     *@param verifier 提交提案的验证人
     *@param pIDID string(uint64) pIDID
     * @returns {Promise<Object>}
     */
    submitText(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.submitText
            let param = [
                funcType,
                '0x' + params.verifier,
                params.pIDID,
            ]
            const platOnData = PlatonCommon.getPlatONData(param)
            const tmpgas = Constant.GAS.constantGas + Constant.GAS.zhiliContractGas + Constant.GAS.submitTextGas + PlatonCommon.getTransactionDataPrice(platOnData);
            const gas = this.web3.toHex(tmpgas);
            const gasprice = this.web3.toHex(Constant.GASPRICE.submitTextGasprice);
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
     * 提交参数提案 2002  0.7.1版本没有这个api
     *@param from  发起方
     *@param privateKey  发起方私钥
     *@param value 发送金额
     *@param verifier 提交提案的验证人
     *@param url 提案URL
     *@param endVotingBlock 提案投票截止块高
     *@param paramName 参数名称
     *@param currentValue 当前值
     *@param newValue 新的值
     * @returns {Promise<Object>}
     */
    submitParam(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.submitParam
            let param = [
                funcType,
                '0x' + params.verifier,
                params.url,
                params.endVotingBlock,
                params.paramName,
                params.currentValue,
                params.newValue,
            ]
            const platOnData = PlatonCommon.getPlatONData(param);
            const tmpgas = Constant.GAS.constantGas + Constant.GAS.zhiliContractGas + Constant.GAS.submitParamGas + PlatonCommon.getTransactionDataPrice(platOnData);
            const gas = this.web3.toHex(tmpgas);
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
     * 提交升级提案 2001
     *@param from  发起方
     *@param privateKey  发起方私钥
     *@param value 发送金额
     *@param verifier 提交提案的验证人
     *@param pIDID string(uint64) pIDID
     *@param newVersion 升级版本
     *@param endVotingRounds 投票共识轮数量

     * @returns {Promise<Object>}
     */
    submitVersion(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.submitVersion
            let param = [
                funcType,
                '0x' + params.verifier,
                params.pIDID,
                params.newVersion,
                params.endVotingRounds,
            ]
            const platOnData = PlatonCommon.getPlatONData(param);
            const tmpgas = Constant.GAS.constantGas + Constant.GAS.zhiliContractGas + Constant.GAS.submitVersionGas + PlatonCommon.getTransactionDataPrice(platOnData);
            const gas = this.web3.toHex(tmpgas);
            const gasprice = this.web3.toHex(Constant.GASPRICE.submitVersionGasprice);
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
     * 给提案投票 2003
     *@param from  发起方
     *@param privateKey  发起方私钥
     *@param value 发送金额
     *@param verifier 投票验证人
     *@param proposalID 提案ID
     *@param option 投票选项
     * @param programVersion 节点代码版本
     * @param versionSign 代码版本签名
     * @returns {Promise<Object>}
     */
    vote(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.vote;
            this.getProgramVersion().then(res => {
                const programVersion = res.data.ProgramVersion;
                const versionSign = res.data.ProgramVersionSign;
                 let tmpfrom = param1.from ? param1.from : this.from,
                    tmpprivateKey = param1.privateKet
                        ? param1.privateKet
                        : this.privateKey;
                let param = [
                    funcType,
                    '0x' + params.verifier,
                    params.proposalID,
                    params.option,
                    programVersion,
                    versionSign,
                ]
                const platOnData = PlatonCommon.getPlatONData(param);
                const tmpgas = Constant.GAS.constantGas + Constant.GAS.zhiliContractGas + Constant.GAS.voteGas + PlatonCommon.getTransactionDataPrice(platOnData);
                const gas = this.web3.toHex(tmpgas);
                const gasprice = Constant.GASPRICE.gasPrice;
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

        })
    }

    /**
     * 版本声明 2004
     *@param from  发起方
     *@param privateKey  发起方私钥
     *@param value 发送金额
     *@param verifier 声明的节点，只能是验证人/候选人
     *@param programVersion 声明的版本 有rpc的getProgramVersion接口获取
     *@param versionSign 声明的版本签名 有rpc的getProgramVersion接口获取
     * @returns {Promise<Object>}
     */

    declareVersion(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.declareVersion;
            this.getProgramVersion().then(res => {
                const programVersion = res.data.ProgramVersion;
                const versionSign = res.data.ProgramVersionSign;
                let param = [funcType, '0x' + params.verifier, programVersion, versionSign]
                const platOnData = PlatonCommon.getPlatONData(param);
                const tmpgas = Constant.GAS.constantGas + Constant.GAS.zhiliContractGas + Constant.GAS.declareVersionGas + PlatonCommon.getTransactionDataPrice(platOnData);
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

        })
    }

    /**
     * 提交取消提案 2005
     *@param from  发起方
     *@param privateKey  发起方私钥
     *@param value 发送金额
     *@param verifier 提交提案的验证人
     *@param pIDID string(uint64) pIDID
     *@param endVotingRounds 投票共识轮数量
     *@param tobeCanceledProposalID 待取消的升级提案ID
     * @returns {Promise<Object>}
     */

    submitCancel(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.submitCancel
            let param = [
                funcType,
                '0x' + params.verifier,
                params.pIDID,
                params.endVotingRounds,
                params.tobeCanceledProposalID,
            ]
            const platOnData = PlatonCommon.getPlatONData(param);
            const tmpgas = Constant.GAS.constantGas + Constant.GAS.zhiliContractGas + Constant.GAS.submitCancel + PlatonCommon.getTransactionDataPrice(platOnData);
            const gas = this.web3.toHex(tmpgas);
            const gasprice = this.web3.toHex(Constant.GASPRICE.submitCancelGasprice);
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
     * 查询提案 2100
     * @param proposalID 提案ID
     * @returns {Promise<Object>}
     */

    getProposal(params) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.getProposal
            let param = [funcType, params.proposalID]
            const platOnData = PlatonCommon.getPlatONData(param)
            this.web3.platon.call({
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
     * 查询提案列表 2102
     * @returns {Promise<Object>}
     */

    listProposal() {
            return new Promise((resolve, reject) => {
                const funcType = Constant.FUNCTYPE.listProposal
                let param = [funcType]
                const platOnData = PlatonCommon.getPlatONData(param)
                this.web3.platon.call({
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
         * 查询提案结果 2101
         * @param proposalID 提案ID
         * @returns {Promise<Object>}
         */
    getTallyResult(params) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.getTallyResult
            let param = [funcType, params.proposalID]
            const platOnData = PlatonCommon.getPlatONData(param)
            this.web3.platon.call({
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
     * 查询节点的链生效版本 2103
     * @returns {Promise<Object>}
     */
    getActiveVersion() {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.getActiveVersion
            let param = [funcType]
            const platOnData = PlatonCommon.getPlatONData(param)
            this.web3.platon.call({
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
     * 查询可治理参数列表 2105 0.7.1版本没有这个api
     * @returns {Promise<Object>}
     */
    listParam() {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.listParam
            let param = [funcType]
            const platOnData = PlatonCommon.getPlatONData(param)
            this.web3.platon.call({
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

module.exports = new ProposalContract;