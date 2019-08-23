var Constant = require('./constant');
var PlatonCommon = require('./common');

class SlashContract {
    constructor() {
        this.address = Constant.CONTRACT_ADDRESS.slashContract //合约地址
    }
    init(web3, cid, paramobj) {
        this.chainId = cid
        this.web3 = web3
        this.from = paramobj.from
        this.privateKey = paramobj.privateKey
    }
    /**
     * 举报多签 3000
     *@param from  发起方
     *@param privateKey  发起方私钥
     *@param value 发送金额
     *@param data 证据的json值
     * @returns {Promise<Object>}
     */
    reportDoubleSign(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.reportDoubleSign
            let tmpdata = JSON.stringify(params.data)
            let param = [funcType, tmpdata]
            const platOnData = PlatonCommon.getPlatONData(param)
            const tmpgas =
                Constant.GAS.constantGas +
                Constant.GAS.jubaoContractGas +
                Constant.GAS.reportDoubleSignGas +
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
     * 查询接口是否已经被举报多签 3001
     *@param typ 代表双签类型, 1：prepare，2：viewChange
     *@param addr 举报的节点地址
     *@param blockNumber 多签的块高
     * @returns {Promise<Object>}
     */

    checkDuplicateSign(params) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.checDoubleSign
            let param = [funcType, params.typ, params.addr, params.blockNumber]
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

module.exports = new SlashContract;