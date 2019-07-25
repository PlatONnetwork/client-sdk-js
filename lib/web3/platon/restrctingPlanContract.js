var Constant = require('web3/lib/web3/platon/constant');
var PlatonCommon = require('web3/lib/web3/platon/common');
var rlp = require('rlp');

class RestrictingPlanContract {
    constructor() {
        this.address = Constant.CONTRACT_ADDRESS.restrictingPlanContract; //合约地址
    }

    init(web3,cid) {
        this.chainId = cid
        this.web3 = web3
    };

    /**
    * 创建锁仓计划
    *@param from  发起方
    *@param privateKey  发起方私钥
    *@param value 发送金额
    *@param account 锁仓释放到账账户
    *@param Plan []RestrictingPlan类型的列表数组
     * @returns {Promise<Object>}
    */

    createRestrictingPlan(from, privateKey, value, account, plan){
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.createRestrictingPlan;
            let param = [];
            let arr = [];
            for(let v of plan){
                arr.push([v.Epoch,v.Amount])
            }
            param = [funcType, account, arr]
             const platOnData = PlatonCommon.getPlatONData(param)
            this.web3.platon.getTransactionCount(from, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const number = data.toString(16);
                PlatonCommon.sendTransaction(this.web3, from, privateKey, value, this.chainId, number, this.address, platOnData).then(data => {
                    resolve(data)
                }).catch((error)=>{
                    reject(error);
                })
            })
        })
    }


    /**
    * 获取锁仓信息
    *@param from  发起方
    *@param privateKey  发起方私钥
    *@param value 发送金额
    *@param account 锁仓释放到账账户
     * @returns {Promise<Object>}
    */

    getRestrictingInfo(from, privateKey, value, account) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.getRestrictingInfo;
            let param = [funcType, account];
            const platOnData = PlatonCommon.getPlatONData(param);
            this.web3.platon.call({
                from:this.address,
                to:this.address,
                data: platOnData
            },(err,result)=>{
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
}

module.exports = new RestrictingPlanContract;
