
var utils = require('../../utils/utils');
var coder = require('../../solidity/coder');
var SolidityEvent = require('../event');
var SolidityFunction = require('../function');
var AllEvents = require('../allevents');
var sha3 = require('../../utils/sha3');//lyx
var rlp = require('rlp');
var Tx = require('ethereumjs-tx');
var Constant = require('./constant.js');

class PlatonCommon {
    constructor() {

    }
    /**
     * @description 编码data
     */
    getPlatONData(params){
        var arr = [];
        for(let v of params){
            arr.push(rlp.encode(v))
        }
        var encode = rlp.encode(arr),
            result = encode.toString('hex');
        return '0x'+ result;
    }

    /**
     * @description 解码data
     */
    decodePlatONCall(str){
        if (str == '0x') {
            return {
                code: 0,
                data: str,
            }
        }
        return {
            code: 0,
            data: utils.toUtf8(str)
        }
    }
    /**
     * @description 签名
     */
    sign(privateKey,params){
        const bufKey = Buffer.from(privateKey,'hex');
        let tx = new Tx(params);
        tx.sign(bufKey);
        let serializedTx = tx.serialize();
        return '0x' + serializedTx.toString('hex');
    }
    /**
     * @description 处理返回结果
     */
    handleResult(decodeObj){
        const json = JSON.parse(decodeObj.data)
        let obj = {}
        obj.result = json.Status;
        obj.data = utils.isJson(json.Data)?JSON.parse(json.Data):json.Data;
        obj.err = json.ErrMsg;
        return obj
    }
    /**
     * @description 发起交易
     */
    sendTransaction(web3,from,privateKey,value,cid,number,address,param){
        return new Promise((resolve, reject)=>{
            const params = {
                nonce: '0x' + number,
                // nonce: '0x' + 999,
                "gas":Constant.GAS.gas,
                "gasPrice":Constant.GAS.gasPrice,
                data: param,
                from: from,
                to: address,
                // value:"0x0",
                value: value?(Number(web3.toVon(value, 'lat'))):"0x0",
                chainId: Number(cid)
            };
            web3.platon.sendRawTransaction(this.sign(privateKey,params),(err, hash)=>{
                console.log(err,hash);
                /*web3.platon.getTransactionReceipt(hash, (code, data) => {
                    console.log('sendRawTransaction code==', code,data);
                    if(code==1000){
                        reject('超时');
                    }
                    if(data.logs && data.logs.length>0){
                        const result = this.decodePlatONLog(data.logs[0]);
                        console.log('sendRawTransaction result==', result);
                        resolve({hash:hash,result:result});
                    }else{
                        resolve({hash:hash});
                    }
                })*/
                if(!err){
                    resolve({
                        result:true,
                        data:hash,
                    });
                }else{
                    reject(err);
                }
            });
        })

    }
}
module.exports = new PlatonCommon;
