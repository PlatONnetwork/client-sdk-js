
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
    staking(from,privateKey,value,typ,benifitAddress,nodeId,externalId,nodeName,website,details,amount,processVersion){
        return new Promise((resolve, reject)=>{
            const funcType = Constant.FUNCTYPE.staking
            let param = [funcType,typ,benifitAddress,'0x'+nodeId,externalId,nodeName,website,details,amount,processVersion];
            const platOnData = PlatonCommon.getPlatONData(param);
            this.web3.platon.getTransactionCount(from, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const number = data.toString(16);
                PlatonCommon.sendTransaction(this.web3,from,privateKey,value,this.cid,number,this.address,platOnData).then(data=>{
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
    updateStakingInfo(from,privateKey,value,benifitAddress,nodeId,externalId,nodeName,website,details){
        return new Promise((resolve, reject)=>{
            const funcType = Constant.FUNCTYPE.updateStakingInfo
            let param = [funcType,benifitAddress,'0x'+nodeId,externalId,nodeName,website,details];
            const platOnData = PlatonCommon.getPlatONData(param);
            this.web3.platon.getTransactionCount(from, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const number = data.toString(16);
                PlatonCommon.sendTransaction(this.web3,from,privateKey,value,this.cid,number,this.address,platOnData).then(data=>{
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
    unStaking(from,privateKey,value,nodeId){
        return new Promise((resolve, reject)=>{
            const funcType = Constant.FUNCTYPE.unStaking
            let param = [funcType,'0x'+nodeId];
            const platOnData = PlatonCommon.getPlatONData(param);
            this.web3.platon.getTransactionCount(from, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const number = data.toString(16);
                PlatonCommon.sendTransaction(this.web3,from,privateKey,value,this.cid,number,this.address,platOnData).then(data=>{
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
    addStaking(from,privateKey,value,nodeId,typ,amount){
        return new Promise((resolve, reject)=>{
            const funcType = Constant.FUNCTYPE.addStaking
            let param = [funcType,'0x'+nodeId,typ,amount];
            const platOnData = PlatonCommon.getPlatONData(param);
            this.web3.platon.getTransactionCount(from, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const number = data.toString(16);
                PlatonCommon.sendTransaction(this.web3,from,privateKey,value,this.cid,number,this.address,platOnData).then(data=>{
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
    GetStakingInfo(nodeId){
        return new Promise((resolve, reject)=>{
            const funcType = Constant.FUNCTYPE.GetStakingInfo
            const param = [funcType,'0x'+nodeId];
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
