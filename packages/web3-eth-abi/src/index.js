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
 * @file index.js
 * @author Marek Kotewicz <marek@parity.io>
 * @author Fabian Vogelsteller <fabian@frozeman.de>
 * @date 2018
 */

var _ = require('underscore');
var utils = require('web3-utils');
var RLP = require('rlp');

var EthersAbi = require('ethers/utils/abi-coder').AbiCoder;
var ethersAbiCoder = new EthersAbi(function (type, value) {
    if (type.match(/^u?int/) && !_.isArray(value) && (!_.isObject(value) || value.constructor.name !== 'BN')) {
        return value.toString();
    }
    return value;
});

// result method
function Result() {
}

/**
 * ABICoder prototype should be used to encode/decode solidity params of any type
 */
var ABICoder = function () {
    this.type = 0; // 默认是solidity
};

/**
 * 设置类型，0 是solidity合约，1是wasm合约
 *
 * @method setType
 * @param {String|Object} functionName
 * @return {String} encoded function name
 */
ABICoder.prototype.setType = function (type) {
    this.type = type;
};

/**
 * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
 *
 * @method encodeFunctionSignature
 * @param {String|Object} functionName
 * @return {String} encoded function name
 */
ABICoder.prototype.encodeFunctionSignature = function (functionName) {
    if (_.isObject(functionName)) {
        functionName = utils._jsonInterfaceMethodToString(functionName);
    }

    return utils.sha3(functionName).slice(0, 10);
};

/**
 * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
 *
 * @method encodeEventSignature
 * @param {String|Object} functionName
 * @return {String} encoded function name
 */
ABICoder.prototype.encodeEventSignature = function (functionName) {
    if (_.isObject(functionName)) {
        functionName = utils._jsonInterfaceMethodToString(functionName);
    }

    return utils.sha3(functionName);
};

/**
 * Should be used to encode plain param
 *
 * @method encodeParameter
 *
 * @param {String|Object} type
 * @param {any} param
 *
 * @return {String} encoded plain param
 */
ABICoder.prototype.encodeParameter = function (type, param) {
    return this.encodeParameters([type], [param]);
};

/**
 * Should be used to encode list of params
 *
 * @method encodeParameters
 *
 * @param {Array<String|Object>} types
 * @param {Array<any>} params
 *
 * @return {String} encoded list of params
 */
ABICoder.prototype.encodeParameters = function (types, params) {
    console.log("encodeParameters Call:", types, params);
    if (this.type) {
        let arrRlp = [];
        // wasm 函数编码规则 RLP.encode([funcName, RLP.encode(param1), RLP.encode(param2), ... , RLP.encode(paramN)]) [备注：官方文档是错的]
        // 在这里只对 funcName 后面的 params 进行编码
        // @todo 不能简单的直接编码，要根据类型来编码
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            const paramType = types[i].type;
            if (paramType === "string") {
                arrRlp.push(RLP.encode(param));
            } else if (paramType === "uint8") {
                arrRlp.push(param);
            } else if (paramType === "uint16") {
                arrRlp.push(param);
            } else if (paramType === "uint32") {
                arrRlp.push(param);
            } else if (paramType === "uint64") {
                let data = new utils.BN(param);
                if (data.toString() === "0") data = 0;
                arrRlp.push(data);
            } else if (paramType === "bool") {
                arrRlp.push(param ? 1 : 0);
            }
        }
        return arrRlp;
    } else {
        return ethersAbiCoder.encode(
            this.mapTypes(types),
            params.map(function (param) {
                if (utils.isBN(param) || utils.isBigNumber(param)) {
                    return param.toString(10);
                }
                return param;
            })
        );
    }
};

/**
 * Map types if simplified format is used
 *
 * @method mapTypes
 * @param {Array} types
 * @return {Array}
 */
ABICoder.prototype.mapTypes = function (types) {
    var self = this;
    var mappedTypes = [];
    types.forEach(function (type) {
        if (self.isSimplifiedStructFormat(type)) {
            var structName = Object.keys(type)[0];
            mappedTypes.push(
                Object.assign(
                    self.mapStructNameAndType(structName),
                    {
                        components: self.mapStructToCoderFormat(type[structName])
                    }
                )
            );

            return;
        }

        mappedTypes.push(type);
    });

    return mappedTypes;
};

/**
 * Check if type is simplified struct format
 *
 * @method isSimplifiedStructFormat
 * @param {string | Object} type
 * @returns {boolean}
 */
ABICoder.prototype.isSimplifiedStructFormat = function (type) {
    return typeof type === 'object' && typeof type.components === 'undefined' && typeof type.name === 'undefined';
};

/**
 * Maps the correct tuple type and name when the simplified format in encode/decodeParameter is used
 *
 * @method mapStructNameAndType
 * @param {string} structName
 * @return {{type: string, name: *}}
 */
ABICoder.prototype.mapStructNameAndType = function (structName) {
    var type = 'tuple';

    if (structName.indexOf('[]') > -1) {
        type = 'tuple[]';
        structName = structName.slice(0, -2);
    }

    return { type: type, name: structName };
};

/**
 * Maps the simplified format in to the expected format of the ABICoder
 *
 * @method mapStructToCoderFormat
 * @param {Object} struct
 * @return {Array}
 */
ABICoder.prototype.mapStructToCoderFormat = function (struct) {
    var self = this;
    var components = [];
    Object.keys(struct).forEach(function (key) {
        if (typeof struct[key] === 'object') {
            components.push(
                Object.assign(
                    self.mapStructNameAndType(key),
                    {
                        components: self.mapStructToCoderFormat(struct[key])
                    }
                )
            );

            return;
        }

        components.push({
            name: key,
            type: struct[key]
        });
    });

    return components;
};

/**
 * Encodes a function call from its json interface and parameters.
 *
 * @method encodeFunctionCall
 * @param {Array} jsonInterface
 * @param {Array} params
 * @return {String} The encoded ABI for this function call
 */
ABICoder.prototype.encodeFunctionCall = function (jsonInterface, params) {
    return this.encodeFunctionSignature(jsonInterface) + this.encodeParameters(jsonInterface.inputs, params).replace('0x', '');
};

/**
 * Should be used to decode bytes to plain param
 *
 * @method decodeParameter
 * @param {String} type
 * @param {String} bytes
 * @return {Object} plain param
 */
ABICoder.prototype.decodeParameter = function (type, bytes) {
    return this.decodeParameters([type], bytes)[0];
};

/**
 * Should be used to decode list of params
 *
 * @method decodeParameter
 * @param {Array} outputs
 * @param {String} bytes
 * @return {Array} array of plain params
 */
ABICoder.prototype.decodeParameters = function (outputs, bytes) {
    if (this.type) {
        // @todo 不能简单的直接解码，要根据类型来解码
        // 解码规则：RLP.decode(Buffer.from(bytes, "hex")) 再把出来的数据按照 type 去解码。没有官方文档靠猜的......

        // 根据RLP编码规则和过程，RLP解码的输入一律视为二进制字符数组，其过程如下：
        // 1. 根据输入首字节数据，解码数据类型、实际数据长度和位置；
        // 2. 根据类型和实际数据，解码不同类型的数据；
        // 3. 继续解码剩余的数据；
        // 其中，解码数据类型、实际数据类型和位置的规则如下：
        // 1. 如果首字节(prefix)的值在[0x00, 0x7f]范围之间，那么该数据是字符串，且字符串就是首字节本身；
        // 2. 如果首字节的值在[0x80, 0xb7]范围之间，那么该数据是字符串，且字符串的长度等于首字节减去0x80，且字符串位于首字节之后；
        // 3. 如果首字节的值在[0xb8, 0xbf]范围之间，那么该数据是字符串，且字符串的长度的字节长度等于首字节减去0xb7，数据的长度位于首字节之后，且字符串位于数据的长度之后；
        // 4. 如果首字节的值在[0xc0, 0xf7]范围之间，那么该数据是列表，在这种情况下，需要对列表各项的数据进行递归解码。列表的总长度（列表各项编码后的长度之和）等于首字节减去0xc0，且列表各项位于首字节之后；
        // 5. 如果首字节的值在[0xf8, 0xff]范围之间，那么该数据为列表，列表的总长度的字节长度等于首字节减去0xf7，列表的总长度位于首字节之后，且列表各项位于列表的总长度之后；

        let data = {};

        // 暂时只对单个数据解码
        let paramType = outputs[0].type;
        let buf = RLP.decode(Buffer.from(bytes, "hex"));
        console.log("decodeParameters Call:", paramType, bytes, buf);
        if (paramType === "string") {
            buf = RLP.decode(buf);
            data = buf.toString();
        } else if (paramType === "uint8") {
            buf = Buffer.concat([Buffer.alloc(1), buf]); // 数据补齐
            data = buf.readUInt8(buf.length - 1); // 补齐之后要偏移一下
        } else if (paramType === "uint16") {
            buf = Buffer.concat([Buffer.alloc(2), buf]);
            data = buf.readUInt16BE(buf.length - 2);
        } else if (paramType === "uint32") {
            buf = Buffer.concat([Buffer.alloc(4), buf]);
            data = buf.readUInt32BE(buf.length - 4);
        } else if (paramType === "uint64") {
            buf = Buffer.concat([Buffer.alloc(8), buf]);
            data = buf.readBigUInt64BE(buf.length - 8).toString();
        } else if (paramType === "bool") {
            buf = Buffer.concat([Buffer.alloc(8), buf]);
            data = buf.readUInt8(buf.length - 1) === 1;
        }

        return data;
    } else {
        if (outputs.length > 0 && (!bytes || bytes === '0x' || bytes === '0X')) {
            throw new Error(
                'Returned values aren\'t valid, did it run Out of Gas? ' +
                'You might also see this error if you are not using the ' +
                'correct ABI for the contract you are retrieving data from, ' +
                'requesting data from a block number that does not exist, ' +
                'or querying a node which is not fully synced.'
            );
        }

        var res = ethersAbiCoder.decode(this.mapTypes(outputs), '0x' + bytes.replace(/0x/i, ''));
        var returnValue = new Result();
        returnValue.__length__ = 0;

        outputs.forEach(function (output, i) {
            var decodedValue = res[returnValue.__length__];
            decodedValue = (decodedValue === '0x') ? null : decodedValue;

            returnValue[i] = decodedValue;

            if (_.isObject(output) && output.name) {
                returnValue[output.name] = decodedValue;
            }

            returnValue.__length__++;
        });

        return returnValue;
    }
};

/**
 * Decodes events non- and indexed parameters.
 *
 * @method decodeLog
 * @param {Object} inputs
 * @param {String} data
 * @param {Array} topics
 * @return {Array} array of plain params
 */
ABICoder.prototype.decodeLog = function (inputs, data, topics) {
    var _this = this;
    topics = _.isArray(topics) ? topics : [topics];

    data = data || '';

    var notIndexedInputs = [];
    var indexedParams = [];
    var topicCount = 0;

    // TODO check for anonymous logs?

    inputs.forEach(function (input, i) {
        if (input.indexed) {
            indexedParams[i] = (['bool', 'int', 'uint', 'address', 'fixed', 'ufixed'].find(function (staticType) {
                return input.type.indexOf(staticType) !== -1;
            })) ? _this.decodeParameter(input.type, topics[topicCount]) : topics[topicCount];
            topicCount++;
        } else {
            notIndexedInputs[i] = input;
        }
    });


    var nonIndexedData = data;
    var notIndexedParams = (nonIndexedData) ? this.decodeParameters(notIndexedInputs, nonIndexedData) : [];

    var returnValue = new Result();
    returnValue.__length__ = 0;


    inputs.forEach(function (res, i) {
        returnValue[i] = (res.type === 'string') ? '' : null;

        if (typeof notIndexedParams[i] !== 'undefined') {
            returnValue[i] = notIndexedParams[i];
        }
        if (typeof indexedParams[i] !== 'undefined') {
            returnValue[i] = indexedParams[i];
        }

        if (res.name) {
            returnValue[res.name] = returnValue[i];
        }

        returnValue.__length__++;
    });

    return returnValue;
};

var coder = new ABICoder();

module.exports = coder;
