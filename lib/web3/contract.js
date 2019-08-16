/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file contract.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2014
 */

var utils = require('../utils/utils');
var coder = require('../solidity/coder');
var SolidityEvent = require('./event');
var SolidityFunction = require('./function');
var AllEvents = require('./allevents');
var sha3 = require('../utils/sha3');//lyx
var rlp = require('rlp');

/**
 * Should be called to encode constructor params
 *
 * @method encodeConstructorParams
 * @param {Array} abi
 * @param {Array} constructor params
 */
var encodeConstructorParams = function (abi, params) {
    return abi.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
        return coder.encodeParams(types, params);
    })[0] || '';
};

/**
 * Should be called to encode constructor params
 *
 * @method encodeConstructorParams
 * @param {JSON} abi
 * @param {Array} bin
 * @author liangyanxiang
 */
var encodePlatONParams = function (abi, bin) {
    var types = ['buffer', 'string',];
    var params = [bin, JSON.stringify(abi),];
    return coder.encodePlatONParams(1, types, params);
};

/**
 * @description 解析data
 * @param {json} abi
 * @param {object} log
 * @returns [] result
 * @author liangyanxiang
 */
var decodePlatONLog = function (abi, log) {
    var result = [],
        json = null;

    var { topics, data } = log,
        bufList = rlp.decode(data);

    // for (var item of abi) {
    //     if (item.type === 'event' && '0x' + sha3(item.name) == topics[0]) {
    //         json = item
    //         break;
    //     }
    // }

    if (!topics) return null

    abi.map(function (item) {
        if (item.type === 'event' && '0x' + sha3(item.name) == topics[0]) {
            json = item
        }
    })

    if (!json) throw `没有找到event类型`

    inputTypes = json.inputs.map(function (i) {
        return i.type;
    });

    if (bufList.length !== inputTypes.length) {
        throw new Error('长度不一致');
    }
    for (const key in inputTypes) {
        if (bufList[key].length == 0) {
            result.push(0);
            continue;
        }
        switch (inputTypes[key]) {
            case 'string':
                result.push(bufList[key].toString())
                break;
            case 'int32': case 'int64': case 'uint64':
                result.push(bufList[key][0].toString())
                break;
            default:
                result.push(bufList[key][0].toString())
                break;
        }
    }

    return result
}

var decodePlatONCall = function (abi, str, fnName) {
    function string2(str) {
        var code = parseInt(str.substr(2, 64), 16),
            dataLength = parseInt(str.substr(66, 64), 16) * 2,
            data = str.substr(130, dataLength),
            StrHex = "";

        for (var i = 0; i < dataLength; i = i + 2) {
            var str = data.substr(i, 2); //16进制；

            var n = parseInt(str, 16); //10进制；
            StrHex = StrHex + String.fromCharCode(n);
        }

        return StrHex
    }

 /*  //十六进制字符串转字节数组
    function string2(str)

    {

        var pos = 0;

        var len = str.length;

        if(len %2 != 0)

        {

            return null;

        }

        len /= 2;

        var hexA = new Array();

        for(var i=0; i<len; i++)

        {

            var s = str.substr(pos, 2);

            var v = parseInt(s, 16);

            hexA.push(v);

            pos += 2;

        }

        return hexA;

    }*/
    function  hexToString (str){
        return new Buffer(str).toJSON('utf8')
    }
    function num2(str) {
        return Number(str)
    }

    if (str == '0x') {
        return {
            code: 0,
            data: str,
        }
    }

    if (fnName) {
        let item= abi.filter((item) => {
            return item.name==fnName
        })
        if (item.length) {
            return {
                code: 0,
                data: item[0].outputs[0].type != 'string' ? num2(str) : string2(str),
            }
        } else {
            throw new Error('在abi中找不到对应的：' + fnName);
        }
    }

    return {
        code: 0,
        data:utils.toUtf8(str),
    }
}

/**
 * Should be called to add functions to contract object
 *
 * @method addFunctionsToContract
 * @param {Contract} contract
 * @param {Array} abi
 */
var addFunctionsToContract = function (contract) {
    contract.abi.filter(function (json) {
        return json.type === 'function';
    }).map(function (json) {
        return new SolidityFunction(contract._eth, json, contract.address);
    }).forEach(function (f) {
        f.attachToContract(contract);
    });
};

/**
 * Should be called to add events to contract object
 *
 * @method addEventsToContract
 * @param {Contract} contract
 * @param {Array} abi
 */
var addEventsToContract = function (contract) {
    var events = contract.abi.filter(function (json) {
        return json.type === 'event';
    });

    var All = new AllEvents(contract._eth._requestManager, events, contract.address);
    All.attachToContract(contract);

    events.map(function (json) {
        return new SolidityEvent(contract._eth._requestManager, json, contract.address);
    }).forEach(function (e) {
        e.attachToContract(contract);
    });
};


/**
 * Should be called to check if the contract gets properly deployed on the blockchain.
 *
 * @method checkForContractAddress
 * @param {Object} contract
 * @param {Function} callback
 * @returns {Undefined}
 */
var checkForContractAddress = function (contract, callback) {
    var count = 0,
        callbackFired = false;

    // wait for receipt
    var filter = contract._eth.filter('latest', function (e) {
        if (!e && !callbackFired) {
            count++;

            // stop watching after 50 blocks (timeout)
            if (count > 50) {

                filter.stopWatching(function () { });
                callbackFired = true;

                if (callback)
                    callback(new Error('Contract transaction couldn\'t be found after 50 blocks'));
                else
                    throw new Error('Contract transaction couldn\'t be found after 50 blocks');


            } else {

                contract._eth.getTransactionReceipt(contract.transactionHash, function (e, receipt) {
                    if (receipt && receipt.blockHash && !callbackFired) {

                        contract._eth.getCode(receipt.contractAddress, function (e, code) {
                            /*jshint maxcomplexity: 6 */

                            if (callbackFired || !code)
                                return;

                            filter.stopWatching(function () { });
                            callbackFired = true;

                            if (code.length > 3) {

                                // console.log('Contract code deployed!');

                                contract.address = receipt.contractAddress;

                                // attach events and methods again after we have
                                addFunctionsToContract(contract);
                                addEventsToContract(contract);

                                // call callback for the second time
                                if (callback)
                                    callback(null, contract);

                            } else {
                                if (callback)
                                    callback(new Error('The contract code couldn\'t be stored, please check your gas amount.'));
                                else
                                    throw new Error('The contract code couldn\'t be stored, please check your gas amount.');
                            }
                        });
                    }
                });
            }
        }
    });
};

/**
 * Should be called to create new ContractFactory instance
 *
 * @method ContractFactory
 * @param {Array} abi
 */
var ContractFactory = function (eth, abi) {
    this.eth = eth;
    this.abi = abi;

    /**
     * Should be called to create new contract on a blockchain
     *
     * @method new
     * @param {Any} contract constructor param1 (optional)
     * @param {Any} contract constructor param2 (optional)
     * @param {Object} contract transaction object (required)
     * @param {Function} callback
     * @returns {Contract} returns contract instance
     */
    this.new = function () {
        /*jshint maxcomplexity: 7 */

        var contract = new Contract(this.eth, this.abi);

        // parse arguments
        var options = {}; // required!
        var callback;

        var args = Array.prototype.slice.call(arguments);
        if (utils.isFunction(args[args.length - 1])) {
            callback = args.pop();
        }

        var last = args[args.length - 1];
        if (utils.isObject(last) && !utils.isArray(last)) {
            options = args.pop();
        }

        if (options.value > 0) {
            var constructorAbi = abi.filter(function (json) {
                return json.type === 'constructor' && json.inputs.length === args.length;
            })[0] || {};

            if (!constructorAbi.payable) {
                throw new Error('Cannot send value to non-payable constructor');
            }
        }

        var bytes = encodeConstructorParams(this.abi, args);
        options.data += bytes;

        if (callback) {

            // wait for the contract address and check if the code was deployed
            this.eth.sendTransaction(options, function (err, hash) {
                if (err) {
                    callback(err);
                } else {
                    // add the transaction hash
                    contract.transactionHash = hash;

                    // call callback for the first time
                    callback(null, contract);

                    checkForContractAddress(contract, callback);
                }
            });
        } else {
            var hash = this.eth.sendTransaction(options);
            // add the transaction hash
            contract.transactionHash = hash;
            checkForContractAddress(contract);
        }

        return contract;
    };

    /**
     * @description 调用sendRawTransaction部署合约
     * @param 入参：签名后的数据，回调函数
     * @returns
     * @author 梁燕翔
     */
    this.deploy = function () {
        /*jshint maxcomplexity: 7 */

        var contract = new Contract(this.eth, this.abi);

        // parse arguments
        var options = {}; // required!
        var callback;

        var args = Array.prototype.slice.call(arguments);
        if (utils.isFunction(args[args.length - 1])) {
            callback = args.pop();
        }

        var txParams = args[0];

        if (callback) {

            // wait for the contract address adn check if the code was deployed
            this.eth.sendRawTransaction(txParams, function (err, hash) {
                if (err) {
                    callback(err);
                } else {
                    // add the transaction hash
                    contract.transactionHash = hash;

                    // call callback for the first time
                    callback(null, contract);

                    checkForContractAddress(contract, callback);
                }
            });
        } else {
            var hash = this.eth.sendRawTransaction(txParams);
            // add the transaction hash
            contract.transactionHash = hash;
            checkForContractAddress(contract);
        }

        return contract;
    };

    this.new.getData = this.getData.bind(this);
    this.new.getPlatONData = this.getPlatONData.bind(this);//lyx
    this.deploy.getData = this.getData.bind(this);//lyx
    this.deploy.getPlatONData = this.getPlatONData.bind(this);//lyx
};

/**
 * Should be called to create new ContractFactory
 *
 * @method contract
 * @param {Array} abi
 * @returns {ContractFactory} new contract factory
 */
//var contract = function (abi) {
//return new ContractFactory(abi);
//};



/**
 * Should be called to get access to existing contract on a blockchain
 *
 * @method at
 * @param {Address} contract address (required)
 * @param {Function} callback {optional)
 * @returns {Contract} returns contract if no callback was passed,
 * otherwise calls callback function (err, contract)
 */
ContractFactory.prototype.at = function (address, callback) {
    var contract = new Contract(this.eth, this.abi, address);

    // this functions are not part of prototype,
    // because we dont want to spoil the interface
    addFunctionsToContract(contract);
    addEventsToContract(contract);

    if (callback) {
        callback(null, contract);
    }
    return contract;
};

/**
 * Gets the data, which is data to deploy plus constructor params
 *
 * @method getData
 */
ContractFactory.prototype.getData = function () {
    var options = {}; // required!
    var args = Array.prototype.slice.call(arguments);

    var last = args[args.length - 1];
    if (utils.isObject(last) && !utils.isArray(last)) {
        options = args.pop();
    }

    var bytes = encodeConstructorParams(this.abi, args);
    options.data += bytes;

    return options.data;
};

/**
 * 获取数据，这是部署的数据加上构造函数params。
 *
 * @method getData
 * @author liangyanxiang
 */
ContractFactory.prototype.getPlatONData = function (bin) {
    var options = {}; // required!
    var data = encodePlatONParams(this.abi, bin);
    options.data = '0x' + data;

    return options.data;
};

/**
 * Should be called to create new contract instance
 *
 * @method Contract
 * @param {Array} abi
 * @param {Address} contract address
 */
var Contract = function (eth, abi, address) {
    this._eth = eth;
    this.transactionHash = null;
    this.address = address;
    this.abi = abi;
    this.decodePlatONLog = decodePlatONLog.bind(this, abi);
    this.decodePlatONCall = decodePlatONCall.bind (this, abi);

};

module.exports = ContractFactory;
