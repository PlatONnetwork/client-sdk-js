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
var BigInteger = require("big-integer");

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
    this.vmType = 0; // 默认是solidity
    this.abi = []; // 因为要对结构体编解码，需要将所有的 abi 数据都传进来
    this.netType = "lax"; // 网络类型，需要根据此值进行对返回的address进行bech32编码
};

/**
 * 设置类型，0 是solidity合约，1是wasm合约
 *
 * @method setType
 * @param {Number} type
 */
ABICoder.prototype.setVmType = function (vmType_) {
    this.vmType = vmType_;
};

/**
 * 设置网络类型/bech32地址前缀
 *
 * @method setNetType
 * @param {String} type
 */
ABICoder.prototype.setNetType = function (netType_) {
    this.netType = netType_;
};

/**
 * 判断是否是一个基础类型
 *
 * @method baseType
 * @param {String} type
 */
ABICoder.prototype.baseType = function (type) {
    return type.indexOf("int") >= 0 || type === "string" || type === "bool";
};

/**
 * 设置abi数据
 *
 * @method setAbi
 * @param {Array} abi
 */
ABICoder.prototype.setAbi = function (abi) {
    this.abi = abi;
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
    // keccak256(rlp(EVENT名称字符串)) 得到的[32]byte
    if (this.vmType) {
        functionName = RLP.encode(functionName.split("(")[0]);
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
    // console.log("encodeParameters Call:", types, params);
    if (this.vmType) {
        let arrRlp = [];
        // wasm 函数编码规则 RLP.encode([funcName, param1, param2, ... , paramN])
        // 在这里只对 funcName 后面的 params 进行编码
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            const type = types[i].type;
            const name = types[i].name;
            // console.log(type, name, param);
            let buf;
            if (type === "string") {
                arrRlp.push(Buffer.from(param));
            } else if (type.startsWith("uint") && !type.endsWith("]")) {
                let bnInt = new utils.BN(param);
                if (bnInt.toString() === "0") bnInt = 0;
                arrRlp.push(bnInt);
            } else if (type === "bool") {
                arrRlp.push(param ? 1 : 0);
            } else if (type.startsWith("int") && !type.endsWith("]")){
                // 用zigzag编码进行转换
                var paramTmp = (param << 1) ^ (param >> 63)
                let bnInt = new utils.BN(paramTmp);
                if (bnInt.toString() === "0") bnInt = 0;
                arrRlp.push(bnInt);
            } else if (type === "float") {
                buf = Buffer.alloc(4);
                buf.writeFloatBE(param);
                arrRlp.push(buf);
            } else if (type === "double") {
                buf = Buffer.alloc(8);
                buf.writeDoubleBE(param);
                arrRlp.push(buf);
            } else if (type.endsWith("]")) {
                var vecLen = type.substr(type.indexOf('[') + 1).split(']')[0];
                // array, vector(即数组) uint8[2] uint16[2], uint16[] uint16[]....
                let vecType = type.split("[")[0];
                if (vecType === "uint8" && vecLen === "")  {
                    // 不定长参数类型 uint8[] uint16[]....
                    arrRlp.push(Buffer.from(param)); // uint8 直接送进去
                } else {
                    // 定长参数类型 uint8[2] uint16[2]....
                    let data = [];
                    // 对数组的每个元素进行编码，但要注意编码回来的是一个数组。需要第一个数
                    for (const p of param) {
                        data.push(this.encodeParameters([{
                            type: vecType,
                            name: ''
                        }], [p])[0]);
                    }
                    arrRlp.push(data);
                }
            } else if (type.startsWith("list")) {
                // list 跟vector一样编码 uint16[]
                let i1 = type.indexOf('<');
                let i2 = type.indexOf('>');
                let lType = type.substring(i1 + 1, i2);
                let data = [];
                // 对数组的每个元素进行编码，但要注意编码回来的是一个数组。需要第一个数
                for (const p of param) {
                    data.push(this.encodeParameters([{
                        type: lType,
                        name: ''
                    }], [p])[0]);
                }
                arrRlp.push(data);
            } else if (type.startsWith("map")) {
                // map<string,string>
                let i1 = type.indexOf('<');
                let i2 = type.indexOf(',');
                let i3 = type.indexOf('>');
                let kType = type.substring(i1 + 1, i2);
                let vType = type.substring(i2 + 1, i3);

                let data = [];
                // 分别对Map的key, value进行编码，但要注意编码回来的是一个数组。需要第一个数
                for (const p of param) {
                    let kValue = this.encodeParameters([{
                        type: kType,
                        name: ''
                    }], [p[0]])[0];
                    let vValue = this.encodeParameters([{
                        type: vType,
                        name: ''
                    }], [p[1]])[0];
                    data.push([kValue, vValue]);
                }
                arrRlp.push(data);
            } else if (type.startsWith("pair")) {
                // map<string,string>
                let i1 = type.indexOf('<');
                let i2 = type.indexOf(',');
                let i3 = type.indexOf('>');
                let kType = type.substring(i1 + 1, i2);
                let vType = type.substring(i2 + 1, i3);

                // 分别对Pair的key, value进行编码，但要注意编码回来的是一个数组。需要第一个数
                let kValue = this.encodeParameters([{
                    type: kType,
                    name: ''
                }], [param[0]])[0];
                let vValue = this.encodeParameters([{
                    type: vType,
                    name: ''
                }], [param[1]])[0];

                arrRlp.push([kValue, vValue]);
            } else if (type.startsWith("set")) {
                // map<string,string>
                let i1 = type.indexOf('<');
                let i2 = type.indexOf('>');
                let kType = type.substring(i1 + 1, i2);
                let data = [];
                for (const p of param) {
                    data.push(this.encodeParameters([{
                        type: kType,
                        name: ''
                    }], [p])[0]);
                }
                arrRlp.push(data); // 要以数组返回
            } else if (type === "struct") {
                // 确定是结构体了，那就找到结构体的描述进行递归编码
                let structType = this.abi.find(item => item.name === name && item.type === 'struct');
                if (!structType) {
                    throw new Error(`通过名字 ${type.name} 找不到结构体`);
                } else {
                    arrRlp.push(this.encodeParameters(structType.inputs, param));
                }
            } else if (type === "FixedHash<20>") {
		        var p = param;
                if(utils.isBech32Address(param)) {
                    p = utils.decodeBech32Address(param).replace("0x", "");
                }
                arrRlp.push(Buffer.from(p, "hex"));
            } else if(type.startsWith("FixedHash")){
                arrRlp.push(Buffer.from(param));
            } else {
                // 剩下往结构体靠
                let structType = this.abi.find(item => item.name === type);
                if (!structType) {
                    throw new Error(`通过名字 ${type} 找不到结构体`);
                } else {
                    // 找到结构体了递归搞起来
                    arrRlp.push(this.encodeParameters(structType.inputs, param));
                }
            }
        }
        return arrRlp;
    } else {
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            const type = types[i].type;
            if (type === "address" || types[i] === "address") {
                params[i] = utils.decodeBech32Address(param)
            } else if (type === "address[]"|| types[i] === "address[]") {
                for(let j=0; j < param.length; j++) {
                    params[i][j] = utils.decodeBech32Address(param[j])
                }
            } 
        }
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
 * Add 32 bytes of bits, more than 32 bytes return the hash value of the original data
 *
 * @method HandleEventIndexParam
 *
 * @param param string
 * @param isNumber bool
 *
 * @return {String} encoded list of params
 */
const HandleEventIndexParam = function (param, isNumber) {
    // 换成十六进制
    if (isNumber == true) {
        param = utils.toHex(param)
    }

    if (param.length > 2 && param.substr(0, 2) === "0x") {
        param = param.substr(2);
    }

    var maxLen = 64
    var len = param.length
    
    var hex = ["0x"]
    if (len > maxLen) {
        // 超出长度返回hash
        return utils.sha3(utils.hexToBytes('0x'+param));  
    } else {
            // 字节数组转成十六进制字符串
        var i = 0
        // 补0
        for (i = 0; i < maxLen-len ; i++) {
            hex.push("0")
        }
        for (i = 0; i < len ; i++) {
            hex.push(param[i])
        }
        hex = hex.join("");
        return hex
    }
}

const stringTo32Bytes = function (param) {    
    var bytes = Buffer.from(param)
    var len = bytes.length
    var hex = ["0x"]
    if (len > 32) {
        // 超出长度返回hash
        return utils.sha3(bytes);
    } else {
        // 字节数组转成十六进制字符串
        var i = 0
        // 补0
        for (i = 0; i < 32-len ; i++) {
            hex.push("00")
        }
        for (i = 0; i < len ; i++) {
            var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        hex = hex.join("");
        return hex
    }
}

/**
 * Should be used to encode list of event params (wasm)
 *
 * @method encodeEventParameters
 *
 * @param {Array<String|Object>} types
 * @param {Array<any>} params
 *
 * @return {String} encoded list of params
 */
ABICoder.prototype.encodeEventParameters = function (types, params) {
    let eventData = "";

    // wasm event编码规则
    // 在这里只对 event 后面的 topics的params 进行编码
    const param = params;
    const type = types;
    if (type === "string") {
        eventData = stringTo32Bytes(param);
    } else if (type.startsWith("uint") && !type.endsWith("]")) {
        let bnInt = new utils.BN(param);
        eventData = HandleEventIndexParam(bnInt.toString(), true)
    }else if (type === "bool") {
        eventData = HandleEventIndexParam(param ? '1' : '0', true);
    } else if (type.startsWith("int") && !type.endsWith("]")){
        // 用zigzag编码进行转换
        var paramTmp = (param << 1) ^ (param >> 63)
        let bnInt = new utils.BN(paramTmp);
        eventData = HandleEventIndexParam(bnInt.toString(), true)
    } else if (type.endsWith("]")) {
        // vector(即数组) uint16[]
        let data = [];
        let vecType = type.split("[")[0];
        if (vecType === "uint8" || vecType === "int8") {
             // int8/uint8 直接送进去
             eventData = HandleEventIndexParam(utils.bytesToHex(Buffer.from(param)), false);
        } else {
            // 对数组的每个元素进行编码，但要注意编码回来的是一个数组。需要第一个数
            for (const p of param) {
                data.push(this.encodeParameters([{
                    type: vecType,
                    name: ''
                }], [p])[0]);
            }
            eventData = HandleEventIndexParam(RLP.encode(data).toString('hex'), false);
        }
    } else if (type.startsWith("list")) {
        // list 跟vector一样编码 uint16[]
        let i1 = type.indexOf('<');
        let i2 = type.indexOf('>');
        let lType = type.substring(i1 + 1, i2);
        
        let data = [];
        if (lType === "uint8" || lType === "int8") {
            // int8/uint8 直接送进去
            eventData = HandleEventIndexParam(utils.bytesToHex(Buffer.from(param)), false);
        } else {
           // 对数组的每个元素进行编码，但要注意编码回来的是一个数组。需要第一个数
           for (const p of param) {
               data.push(this.encodeParameters([{
                   type: lType,
                   name: ''
               }], [p])[0]);
           }
           eventData = HandleEventIndexParam(RLP.encode(data).toString('hex'), false);
        }
    } else if (type.startsWith("map")) {
        // map<string,string>
        let i1 = type.indexOf('<');
        let i2 = type.indexOf(',');
        let i3 = type.indexOf('>');
        let kType = type.substring(i1 + 1, i2);
        let vType = type.substring(i2 + 1, i3);

        let data = [];
        // 分别对Map的key, value进行编码，但要注意编码回来的是一个数组。需要第一个数
        for (const p of param) {
            let kValue = this.encodeParameters([{
                type: kType,
                name: ''
            }], [p[0]])[0];
            let vValue = this.encodeParameters([{
                type: vType,
                name: ''
            }], [p[1]])[0];
            data.push([kValue, vValue]);
        }
        eventData = HandleEventIndexParam(RLP.encode(data).toString('hex'), false);
    } else if (type.startsWith("pair")) {
        // map<string,string>
        let i1 = type.indexOf('<');
        let i2 = type.indexOf(',');
        let i3 = type.indexOf('>');
        let kType = type.substring(i1 + 1, i2);
        let vType = type.substring(i2 + 1, i3);
        let data = [];
        // 分别对Pair的key, value进行编码，但要注意编码回来的是一个数组。需要第一个数
        let kValue = this.encodeParameters([{
            type: kType,
            name: ''
        }], [param[0]])[0];
        let vValue = this.encodeParameters([{
            type: vType,
            name: ''
        }], [param[1]])[0];

        data.push([kValue, vValue]);
        eventData = HandleEventIndexParam(RLP.encode(data[0]).toString('hex'), false);
    } else if (type.startsWith("set")) {
        // map<string,string>
        let i1 = type.indexOf('<');
        let i2 = type.indexOf('>');
        let kType = type.substring(i1 + 1, i2);
        let data = [];
        for (const p of param) {
            data.push(this.encodeParameters([{
                type: kType,
                name: ''
            }], [p])[0]);
        }
        // data = [data]; // 要以数组返回
        eventData = HandleEventIndexParam(RLP.encode(data).toString('hex'), false);
    } else if (type === "struct") {
        // 确定是结构体了，那就找到结构体的描述进行递归编码
        let structType = this.abi.find(item => item.name === name && item.type === 'struct');
        if (!structType) {
            throw new Error(`通过名字 ${type.name} 找不到结构体`);
        } else {
            let data = [];
            data.push(this.encodeParameters(structType.inputs, param));
            eventData = HandleEventIndexParam(RLP.encode(data[0]).toString('hex'), false);
        }
    } else if (type === "FixedHash<20>") {
        var p = param;
        if(utils.isBech32Address(param)) {
            p = utils.decodeBech32Address(param).replace("0x", "");
        }
        let data = [];
        data.push(Buffer.from(p, "hex"));
        eventData = HandleEventIndexParam(data[0].toString('hex'), false);
    } else if(type.startsWith("FixedHash")){
        let data = [];
        data.push(Buffer.from(param));
        eventData = HandleEventIndexParam(data[0].toString('hex'), false);
    } else {
        // 剩下往结构体靠
        let structType = this.abi.find(item => item.name === type);
        if (!structType) {
            throw new Error(`通过名字 ${type} 找不到结构体`);
        } else {
            // 找到结构体了递归搞起来
            let data = [];
            data.push(this.encodeParameters(structType.inputs, param));
            eventData = HandleEventIndexParam(RLP.encode(data[0]).toString('hex'), false);
        }
    }
    return eventData;
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
    // console.log("decodeParameters Call:", outputs, bytes);
    if (this.vmType) {
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

        // C++ 只能返回一个数据
        let type = outputs[0].type;
        let name = outputs[0].name;
        // 再次递归进来的时候，就不要进行rlp解码了。
        let buf = typeof bytes === "string" ? RLP.decode(Buffer.from(bytes, "hex")) : bytes;
        let data = buf;
        // console.log("decodeParameters Call:", type, bytes, buf);
        if (type === "string") {
            data = buf.toString();
        } else if (type.startsWith("uint") && !type.endsWith("]")) {
            let digit = parseInt(type.replace("uint", ""));
            let bigInt = BigInteger(buf.toString("hex"), 16);
            data = digit <= 32 ? bigInt.toJSNumber() : bigInt.toString();
        } else if (type === "bool") {
            buf = Buffer.concat([Buffer.alloc(8), buf]);
            data = buf.readUInt8(buf.length - 1) === 1;
        } else if (type === "int8") {
            buf = Buffer.concat([Buffer.alloc(1), buf]);
            data = buf.readInt8(buf.length - 1);
        } else if (type === "int16") {
            buf = Buffer.concat([Buffer.alloc(2), buf]);
            data = buf.readInt16BE(buf.length - 2);
        } else if (type === "int32") {
            let bi = BigInteger(buf.toString("hex"), 16);
            let bi1 = bi.shiftRight(1);
            let bi2 = bi.and(1).multiply(-1);
            data = parseInt(bi1.xor(bi2).toString());
        } else if (type === "int64") {
            let bi = BigInteger(buf.toString("hex"), 16);
            let bi1 = bi.shiftRight(1);
            let bi2 = bi.and(1).multiply(-1);
            data = bi1.xor(bi2).toString();
        } else if (type === "float") {
            // 注意float跟double都有精度的损失
            data = buf.readFloatBE();
        } else if (type === "double") {
            data = buf.readDoubleBE();
        } else if (type.endsWith("]")) {
            // vector(即数组)
            var lastEnd = type.lastIndexOf("[");
            let vecType = type.substring(0, lastEnd);
            if (Buffer.isBuffer(data)) {
                // 说明他是一个bytes，不要处理
            } else {
                // 对数组的每个元素进行编码，但要注意编码回来的是一个数组。需要第一个数
                for (let i = 0; i < data.length; i++) {
                    data[i] = this.decodeParameters([{
                        type: vecType,
                        name: ''
                    }], data[i]);
                }
            }
        } else if (type.startsWith("list")) {
            // list 跟vector一样编码 uint16[]
            let i1 = type.indexOf('<');
            let i2 = type.indexOf('>');
            let lType = type.substring(i1 + 1, i2);
            for (let i = 0; i < data.length; i++) {
                data[i] = this.decodeParameters([{
                    type: lType,
                    name: ''
                }], data[i]);
            }
        } else if (type.startsWith("map")) {
            // map<string,string>
            let i1 = type.indexOf('<');
            let i2 = type.indexOf(',');
            let i3 = type.indexOf('>');
            let kType = type.substring(i1 + 1, i2);
            let vType = type.substring(i2 + 1, i3);
            // 进一步根据类型对buffer解码
            for (let i = 0; i < data.length; i++) {
                data[i][0] = this.decodeParameters([{
                    type: kType,
                    name: ''
                }], data[i][0]);

                data[i][1] = this.decodeParameters([{
                    type: vType,
                    name: ''
                }], data[i][1]);
            }
        } else if (type.startsWith("pair")) {
            // map<string,string>
            let i1 = type.indexOf('<');
            let i2 = type.indexOf(',');
            let i3 = type.indexOf('>');
            let kType = type.substring(i1 + 1, i2);
            let vType = type.substring(i2 + 1, i3);
            // 进一步根据类型对buffer解码

            data[0] = this.decodeParameters([{
                type: kType,
                name: ''
            }], data[0]);

            data[1] = this.decodeParameters([{
                type: vType,
                name: ''
            }], data[1]);

        } else if (type.startsWith("set")) {
            // map<string,string>
            let i1 = type.indexOf('<');
            let i2 = type.indexOf('>');
            let kType = type.substring(i1 + 1, i2);
            for (let i = 0; i < data.length; i++) {
                data[i] = this.decodeParameters([{
                    type: kType,
                    name: ''
                }], data[i]);
            }
        } else if (type === "struct") {
            // 确定是结构体了，那就找到结构体的描述进行递归解码
            let structType = this.abi.find(item => item.name === name && item.type === 'struct');
            // console.log(structType);
            if (!structType) {
                throw new Error(`通过名字 ${type.name} 找不到结构体`);
            } else {
                // 找到结构体了递归搞起来
                for (let i = 0; i < structType.inputs.length; i++) {
                    const input = structType.inputs[i];
                    data[i] = this.decodeParameters([input], data[i])
                }
            }
        } else if (type.startsWith("FixedHash")) {
            data = data.toString("hex");
            if (type.endsWith("<20>")) {
                data = utils.toBech32Address(this.netType, data);
            }
        } else {
            // 剩下往结构体靠
            let structType = this.abi.find(item => item.name === type);
            // console.log(structType);
            if (!structType) {
                throw new Error(`通过名字 ${type} 找不到结构体`);
            } else {
                // 找到结构体了递归搞起来
                for (let i = 0; i < structType.inputs.length; i++) {
                    const input = structType.inputs[i];
                    data[i] = this.decodeParameters([input], data[i])
                }
            }
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
        var netType = this.netType
        outputs.forEach(function (output, i) {
            var decodedValue = res[returnValue.__length__];
            decodedValue = (decodedValue === '0x') ? null : decodedValue;

            if(output.type === "address" || output === "address")
                decodedValue = utils.toBech32Address(netType, decodedValue);
            else if(output.type === "address[]" || output === "address[]") {
                for(let j=0; j < decodedValue.length; j++) {
                    decodedValue[j] = utils.toBech32Address(netType, decodedValue[j]);
                }
            }

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
    // console.log("decodeLog Call:", inputs, data, topics)
    var _this = this;
    topics = _.isArray(topics) ? topics : [topics];

    data = data || '';

    var notIndexedInputs = [];
    var indexedParams = [];
    var topicCount = 0;

    // TODO check for anonymous logs?
    var vmType = this.vmType;
    inputs.forEach(function (input, i) {
        if (input.indexed) {
            let canDecodeType = (['bool', 'int', 'uint', 'address', 'fixed', 'ufixed'].find(function (staticType) {
                return input.type.indexOf(staticType) !== -1;
            }));
            if (canDecodeType) {
                if (vmType) {
                    // 没有进行RLP编码，直接32字节补齐的。**数值**: 大端编码的[]byte
                    let num = utils.hexToNumber(topics[topicCount]);
                    indexedParams[i] = Number.isSafeInteger(num) ? num : utils.hexToNumberString(topics[topicCount]);
                } else {
                    indexedParams[i] = _this.decodeParameter(input.type, topics[topicCount]);
                }
            } else {
                indexedParams[i] = topics[topicCount];
            }
            topicCount++;
        } else {
            notIndexedInputs[i] = input;
        }
    });

    var nonIndexedData = data;
    var notIndexedParams = [];
    if (vmType) {
        let arrData = RLP.decode(Buffer.from(nonIndexedData.replace("0x", ""), "hex")); // 后面的数据是经过RLP编码的
        let j = 0;
        for (let i = 0; i < notIndexedInputs.length; i++) {
            notIndexedParams[i] = notIndexedInputs[i] ? this.decodeParameters([notIndexedInputs[i]], arrData[j++]) : undefined;
        }
    } else {
        notIndexedParams = (nonIndexedData) ? this.decodeParameters(notIndexedInputs, nonIndexedData) : [];
    }

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

ABICoder.prototype.fnvOne64Hash = function (value) {
    let rv = new utils.BN("14695981039346656037");
    let FNV_64_PRIME = new utils.BN("1099511628211");
    let bigIntConst = new utils.BN("ff".repeat(8), 16);

    for (let i=0; i<value.length; i++) {
        rv = rv.mul(FNV_64_PRIME);
        rv = rv.and(bigIntConst);
        rv = rv.xor(new utils.BN(value.charCodeAt(i)));
    }
    return rv;
}

var coder = new ABICoder();

module.exports = coder;
