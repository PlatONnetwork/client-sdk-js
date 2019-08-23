var Constant = require('./constant');
var PlatonCommon = require('./common');
var rlp = require('rlp');

class RestrictingPlanContract {
    constructor() {
        this.address = Constant.CONTRACT_ADDRESS.restrictingPlanContract; //合约地址
    }

    init(web3, cid, paramobj) {
        this.chainId = cid
        this.web3 = web3
        this.from = paramobj.from
        this.privateKey = paramobj.privateKey
    };

    /**
     * 创建锁仓计划 4000
     *@param from  发起方
     *@param privateKey  发起方私钥
     *@param value 发送金额
     *@param account 锁仓释放到账账户
     *@param Plan []RestrictingPlan类型的列表数组
     * @returns {Promise<Object>}
     */

    createRestrictingPlan(params, param1 = {}) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.createRestrictingPlan;
            let param = [];
            let arr = [];
            for (let v of params.plan) {
                arr.push([v.Epoch, v.Amount])
            }
            param = [funcType, params.account, arr]
            const platOnData = PlatonCommon.getPlatONData(param)
            const tmpgas = Constant.GAS.constantGas + Constant.GAS.restrictingContractGas + Constant.GAS.createRestrictingPlanGas + params.plan.length * 21000 + PlatonCommon.getTransactionDataPrice(platOnData);
            const gas = this.web3.toHex(tmpgas);
            const gasprice = Constant.GASPRICE.gasPrice;
            let tmpfrom = param1.from ? param1.from : this.from,
                tmpprivateKey = param1.privateKet
                    ? param1.privateKet
                    : this.privateKey;
            this.web3.platon.getTransactionCount(tmpfrom, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const number = data.toString(16);
                PlatonCommon.sendTransaction(this.web3, tmpfrom, tmpprivateKey, params.value, this.chainId, number, this.address, platOnData, gas, gasprice).then(data => {
                    resolve(data)
                }).catch((error) => {
                    reject(error);
                })
            })
        })
    }


    /**
     * 获取锁仓信息 4100
     *@param account 锁仓释放到账账户
     * @returns {Promise<Object>}
     */

    getRestrictingInfo(params) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.getRestrictingInfo;
            let param = [funcType, params.account];
            const platOnData = PlatonCommon.getPlatONData(param);
            this.web3.platon.call({
                from: this.address,
                to: this.address,
                data: platOnData
            }, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                    }
                const decodeObj = PlatonCommon.decodePlatONCall(result);
                const obj = PlatonCommon.handleResult(decodeObj);
                resolve(obj);
            });
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

module.exports = new RestrictingPlanContract;