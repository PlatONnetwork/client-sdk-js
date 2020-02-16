var Web3 = require("../packages/web3/src");
var RLP = require("rlp");
var _ = require('underscore');
var fs = require("fs-extra");

var chai = require("chai");
var assert = chai.assert;
var Web3 = require("../packages/web3/src");


const provider = "http://192.168.0.105:6789"; // 请更新成自己的 http 节点
const chainId = 100; // 请更新成自己的节点id
const privateKey = "0xe13ebe4242500201e1bbfcd3372176e05f282595326727c8d4dcfc83daeb40fe"; // 请更新成自己的私钥(必须有十六进制前缀0x)
const from = "0x54a7a3c6822eb222c53f76443772a60b0f9a8bab"; // 请更新成上面私钥对应的地址
const address = "0x2FFc7CBBb28374fa6D86e0BA917fB69333da54F7"; // 合约地址(如果不测试部署就更换)
const waitTime = 10000; // 发送一个交易愿意等待的时间，单位ms
const binFilePath = './test/wasm/js_contracttest.wasm';
const abiFilePath = './test/wasm/js_contracttest.abi.json';

let gas = undefined;
let gasPrice = undefined;

let web3 = undefined;
let contract = undefined;

let ret;

const contractSend = async (method, arguments) => {
    let to = contract.options.address;
    let data = contract.methods[method].apply(contract.methods, arguments).encodeABI();
    let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
    let tx = { gasPrice, gas, nonce, chainId, data, to };
    let signTx = await web3.platon.accounts.signTransaction(tx, privateKey);
    let cret = await web3.platon.sendSignedTransaction(signTx.rawTransaction);
    return cret;
}

const contractCall = async (method, arguments) => {
    let methodObj = contract.methods[method].apply(contract.methods, arguments);
    let cret = await methodObj.call({});
    return cret;
}

const randomString = (len) => {
    len = len || parseInt(Math.random() * 1000);
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

describe("wasm unit test (you must update config before run this test)", function () {
    before(async function () {
        web3 = new Web3(provider);
        gasPrice = web3.utils.numberToHex(await web3.platon.getGasPrice());
        gas = web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit - 1));

        let abi = JSON.parse((await fs.readFile(abiFilePath)).toString());
        contract = new web3.platon.Contract(abi, address, { vmType: 1 }); // 默认一个address，如果要是部署合约，可以替换掉
    });

    it("wasm deploy", async function () {
        this.timeout(waitTime);

        let bin = (await fs.readFile(binFilePath)).toString("hex");
        let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
        let data = contract.deploy({
            data: bin,
            arguments: []
        }).encodeABI();

        let tx = { gasPrice, gas, nonce, chainId, data };
        let signTx = await web3.platon.accounts.signTransaction(tx, privateKey);
        ret = await web3.platon.sendSignedTransaction(signTx.rawTransaction);
        console.log(ret.contractAddress);

        assert.isObject(ret);
        assert.isNotNull(ret.contractAddress);

        // 更新合约地址
        contract.options.address = ret.contractAddress;
    });

    it("wasm call setString getString", async function () {
        this.timeout(waitTime);
        const str = randomString();
        await contractSend("setString", [str]);
        ret = await contractCall("getString", []);
        assert.strictEqual(ret, str);
    });

    it("wasm call setUint8 getUint8", async function () {
        let nums = [0, 255, _.random(0, 255)]; // 两个边界值，一个中间的随机数
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setUint8", [num]);
            ret = await contractCall("getUint8", []);
            assert.strictEqual(ret, num);
        }
    });

    it("wasm call setUint16 getUint16", async function () {
        let nums = [0, 65535, _.random(0, 65535)]; // 两个边界值，一个中间的随机数
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setUint16", [num]);
            ret = await contractCall("getUint16", []);
            assert.strictEqual(ret, num);
        }
    });

    it("wasm call setUint32 getUint32", async function () {
        let nums = [0, 4294967295, _.random(0, 4294967295)]; // 两个边界值，一个中间的随机数
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setUint32", [num]);
            ret = await contractCall("getUint32", []);
            assert.strictEqual(ret, num);
        }
    });

    it("wasm call setUint64 getUint64", async function () {
        // 两个边界值，一个中间的随机数，由于JavaScript最大的安全整数-(2^53 - 1) 到 2^53 - 1(即9007199254740991)，所以超过这个必须以字符串表示送进去给编码
        // 返回值一律用字符串表示，即你送进去数字 3 或者字符串 "3"，返回的数据一律用 "3" 表示
        let nums = [0, "18446744073709551615", _.random(0, 9007199254740991)];
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setUint64", [num]);
            ret = await contractCall("getUint64", []);
            assert.strictEqual(ret, num.toString());
        }
    });

    it("wasm call setBool getBool", async function () {
        let nums = [true, false];
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setBool", [num]);
            ret = await contractCall("getBool", []);
            assert.strictEqual(ret, num);
        }
    });

    // C++ 的 char 类型编译出来之后是 int8 类型
    it("wasm call setChar(setInt8) getChar", async function () {
        let nums = [-128, 127, _.random(-128, 127)]; // 两个边界值，一个中间的随机数
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setChar", [num]);
            ret = await contractCall("getChar", []);
            assert.strictEqual(ret, num);
        }
    });

    it("wasm call setMessage getMessage", async function () {
        this.timeout(waitTime);
        let message = [randomString()];
        await contractSend("setMessage", [message]);
        ret = await contractCall("getMessage", []);
        assert.deepEqual(ret, message);
    });

    it("wasm call setMyMessage getMyMessage", async function () {
        this.timeout(waitTime);

        let head = randomString();
        let body = randomString();
        let end = randomString();
        let myMessage = [[head], body, end];
        await contractSend("setMyMessage", [myMessage]);
        ret = await contractCall("getMyMessage", []);
        assert.deepEqual(ret, myMessage);
    });
})


