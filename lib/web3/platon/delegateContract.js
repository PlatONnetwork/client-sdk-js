var Constant = require('./constant.js');
var PlatonCommon = require('./common.js');

class DelegateContract {
    constructor() {
        this.address = Constant.CONTRACT_ADDRESS.delegateContract; //合约地址
    }

    init(web3,cid) {
        this.chainId = cid;
        this.web3 = web3;
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
    delegate(from, privateKey, value, typ, nodeId, amount) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.delegate;
            let param = [funcType, typ, '0x'+nodeId, amount];
            const platOnData = PlatonCommon.getPlatONData(param);
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
     * 撤销委托1005
    *@param from  发起方
    *@param privateKey  发起方私钥
    *@param value 发送金额
    *@param stakingBlockNum 质押唯一标识
    *@param nodeId 节点ID
    *@param amount 委托的金额
     * @returns {Promise<Object>}
    */

    withdrewDelegate(from, privateKey, value, stakingBlockNum, nodeId, amount) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.undelegate;
            let param = [funcType, stakingBlockNum, '0x'+nodeId, amount];
            const platOnData = PlatonCommon.getPlatONData(param);
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
    *  查询当前账户地址所委托的节点的NodeID和质押Id
    * @param addr 委托人的账户地址
    * @returns {Promise<Object>}
    */
    GetRelatedListByDelAddr(addr){
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.getRelatedListByDelAddr;
            let param = [funcType, addr];
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
            })
        })
    }

    /**
    *  查询当前单个委托信息
    * @param stakingBlockNum 发起质押时的区块高度
    * @param delAddr 委托人账户地址
    * @param nodeId 验证人的节点Id
    * @returns {Promise<Object>}
    */
    GetDelegateInfo(stakingBlockNum, delAddr, nodeId) {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.getDelegateInfo;
            let param = [funcType, stakingBlockNum, delAddr, '0x'+nodeId];
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
            })
        })
    }
}
module.exports = new DelegateContract;
