var Constant = require('./constant.js');
var PlatonCommon = require('./common.js');
class NodeContract {
    constructor() {
        this.address = Constant.CONTRACT_ADDRESS.nodeContract; //合约地址
    }
    init(web3, cid) {
            this.web3 = web3;
            this.cid = cid;
        }
        /**
         * 查询当前结算周期的验证人队列 1100
         * @returns {Promise<Object>}
         */
    getVerifierList() {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.GetVerifierList
            let param = [funcType];
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
        });
    }

    /**
     *  查询当前共识周期的验证人列表 1101
     * @returns {Promise<Object>}
     */
    getValidatorList() {
            return new Promise((resolve, reject) => {
                const funcType = Constant.FUNCTYPE.GetValidatorList
                let param = [funcType];
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
            });
        }
        /**
         *  查询所有实时的候选人列表 1102
         * @returns {Promise<Object>}
         */
    getCandidateList() {
        return new Promise((resolve, reject) => {
            const funcType = Constant.FUNCTYPE.GetCandidateList
            const param = [funcType];
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
        });
    }
}
module.exports = new NodeContract;