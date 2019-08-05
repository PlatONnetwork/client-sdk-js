
var Constant = require('./constant.js');
var PlatonCommon = require('./common.js');
class StakingContract {
    constructor() {
        this.address = Constant.CONTRACT_ADDRESS.stakingContract; //合约地址
    }
    init(web3,cid){
        this.web3 = web3;
        this.cid = cid;
    }
    /**
     * 发起质押
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
     * @param processVersion 程序的真实版本，治理rpc获取
     * @returns {Promise<any>}
     */
    staking(params){
        return new Promise((resolve, reject)=>{
            const funcType = Constant.FUNCTYPE.staking
            let param = [funcType,params.typ,params.benifitAddress,'0x'+params.nodeId,params.externalId,params.nodeName,params.website,params.details,params.amount,params.processVersion];
            const platOnData = PlatonCommon.getPlatONData(param);
            this.web3.platon.getTransactionCount(params.from, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const number = data.toString(16);
                PlatonCommon.sendTransaction(this.web3,params.from,params.privateKey,params.value,this.cid,number,this.address,platOnData).then(data=>{
                    resolve(data)
                }).catch((error)=>{
                    reject(error);
                })
            })
        });
    }
    /**
     * 修改质押信息
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
    updateStakingInfo(params){
        return new Promise((resolve, reject)=>{
            const funcType = Constant.FUNCTYPE.updateStakingInfo
            let param = [funcType,params.benifitAddress,'0x'+params.nodeId,params.externalId,params.nodeName,params.website,params.details];
            const platOnData = PlatonCommon.getPlatONData(param);
            this.web3.platon.getTransactionCount(params.from, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const number = data.toString(16);
                PlatonCommon.sendTransaction(this.web3,params.from,params.privateKey,params.value,this.cid,number,this.address,platOnData).then(data=>{
                    resolve(data)
                }).catch((error)=>{
                    reject(error);
                })
            })
        });
    }
    /**
     * 撤销质押
     * @param from  发起方
     * @param privateKey  发起方私钥
     * @param value 发送金额
     * @param nodeId 节点Id
     * @returns {Promise<any>}
     */
    unStaking(params){
        return new Promise((resolve, reject)=>{
            const funcType = Constant.FUNCTYPE.unStaking
            let param = [funcType,'0x'+params.nodeId];
            const platOnData = PlatonCommon.getPlatONData(param);
            this.web3.platon.getTransactionCount(params.from, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const number = data.toString(16);
                PlatonCommon.sendTransaction(this.web3,params.from,params.privateKey,params.value,this.cid,number,this.address,platOnData).then(data=>{
                    resolve(data)
                }).catch((error)=>{
                    reject(error);
                })
            })
        });
    }
    /**
     * 增持质押
     * @param from  发起方
     * @param privateKey  发起方私钥
     * @param value 发送金额
     * @param nodeId 节点Id
     * @param typ 金额类型
     * @param amount 质押的von
     * @returns {Promise<any>}
     */
    addStaking(params){
        return new Promise((resolve, reject)=>{
            const funcType = Constant.FUNCTYPE.addStaking
            let param = [funcType,'0x'+params.nodeId,params.typ,params.amount];
            const platOnData = PlatonCommon.getPlatONData(param);
            this.web3.platon.getTransactionCount(params.from, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const number = data.toString(16);
                PlatonCommon.sendTransaction(this.web3,params.from,params.privateKey,params.value,this.cid,number,this.address,platOnData).then(data=>{
                    resolve(data)
                }).catch((error)=>{
                    reject(error);
                })
            })
        });
    }
    /**
     *  获取质押信息
     * @param nodeId 验证人的节点Id
     * @returns {Promise<Object>}
     */
    GetStakingInfo(params){
        return new Promise((resolve, reject)=>{
            const funcType = Constant.FUNCTYPE.GetStakingInfo
            const param = [funcType,'0x'+params.nodeId];
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
        });
    }
}
module.exports = new StakingContract;
