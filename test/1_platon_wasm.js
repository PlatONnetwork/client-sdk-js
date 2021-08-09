var Web3 = require("../packages/web3/src");
var web3 = undefined;
var RLP = require("rlp");
var _ = require('underscore');
var fs = require("fs-extra");

var chai = require("chai");
var assert = chai.assert;
var abi = require("../packages/web3-eth-abi/src");
var utils = require("../packages/web3-utils/src");
var Accounts = require("../packages/web3-eth-accounts");

const provider = "http://127.0.0.1:6789"; // 请更新成自己的 http 节点
web3 = new Web3(provider);
const chainId = 201030; // 请更新成自己的节点id
const privateKey = "0x983759fe9aac227c535b21d78792d79c2f399b1d43db46ae6d50a33875301557"; // 请更新成自己的私钥(必须有十六进制前缀0x)
//const address = utils.toBech32Address("lax","0x27E74FbD0d11eDeD263e8eC25dBb2670B82b8EF8"); // 合约地址(如果不测试部署就更换)
let from = ""
const waitTime = 10000; // 发送一个交易愿意等待的时间，单位ms
const binFilePath = './test/wasm/js_contracttest.wasm';
const abiFilePath = './test/wasm/js_contracttest.abi.json';

let gas = undefined;
let gasPrice = undefined;

let contract = undefined;

let ret;

const contractSend = async (method, arguments) => {
//    let to = utils.decodeBech32Address("lax", contract.options.address);
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

        var hrp = await web3.platon.getAddressHrp()
        var ethAccounts = new Accounts(web3, hrp);
        from = ethAccounts.privateKeyToAccount(privateKey).address;
        var net_type = hrp;
        let abi = JSON.parse((await fs.readFile(abiFilePath)).toString());

        let bin = (await fs.readFile(binFilePath)).toString("hex");
        let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
        contract = new web3.platon.Contract(abi, "", { vmType: 1, net_type: net_type }); // 默认一个address，如果要是部署合约，可以替换掉
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
            ret = await contractSend("setUint16", [num]);
            ret = await contractCall("getUint16", []);
            assert.strictEqual(ret, num);
        }
    });

    it("wasm call setUint32 getUint32", async function () {
        let nums = [0, 4294967295, _.random(0, 4294967295)]; // 两个边界值，一个中间的随机数
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            ret = await contractSend("setUint32", [num]);
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
    
   /*
    // C++ 的 char 类型编译出来之后是 int8 类型
    it("wasm call setChar(setInt8) getChar", async function () {
        let nums = [1, 2, _.random(1, 2)]; // 两个边界值，一个中间的随机数
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setChar", [num]);
            ret = await contractCall("getChar", []);
            assert.strictEqual(ret, num);
        }
    });

    it("wasm call setInt8 getInt8", async function () {
        let nums = [-128, 127, _.random(-128, 127)]; // 两个边界值，一个中间的随机数
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setInt8", [num]);
            ret = await contractCall("getInt8", []);
            assert.strictEqual(ret, num);
        }
    });

    it("wasm call setInt16 getInt16", async function () {
        let nums = [-32767, 32767, _.random(-32767, 32768)]; // 两个边界值，一个中间的随机数
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setInt16", [num]);
            ret = await contractCall("getInt16", []);
            assert.strictEqual(ret, num);
        }
    });

    it("wasm call setInt32 getInt32", async function () {
        let nums = [-2147483648, 2147483647, _.random(-2147483648, 2147483647)]; // 两个边界值，一个中间的随机数
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setInt32", [num]);
            ret = await contractCall("getInt32", []);
            assert.strictEqual(ret, num);
        }
    });

    it("wasm call setInt64 getInt64", async function () {
        let nums = ["-9223372036854775808", "9223372036854775807", _.random(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)]; // 两个边界值，一个中间的随机数
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setInt64", [num]);
            ret = await contractCall("getInt64", []);
            assert.strictEqual(ret, num.toString());
        }
    });*/

    it("wasm call setString getString", async function () {
        this.timeout(waitTime);
        const str = randomString();
        await contractSend("setString", [str]);
        ret = await contractCall("getString", []);
        assert.strictEqual(ret, str);
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

    it("wasm call setVector getVector", async function () {
        this.timeout(waitTime);
        let nums = [0, 65535, _.random(0, 65535), _.random(0, 65535), _.random(0, 65535), _.random(0, 65535)];
        await contractSend("setVector", [nums]);
        ret = await contractCall("getVector", []);
        assert.deepEqual(ret, nums);
    });

    it("wasm call setMap getMap", async function () {
        this.timeout(waitTime);
        let maps = [["name", "lucy"], ["age", "18"], ["sex", "female"]];
        let len = _.random(0, 10);
        for (let i = 0; i < len; i++) {
            maps.push([randomString(_.random(1, 10)), randomString(_.random(1, 100))])
        }
        await contractSend("setMap", [maps]);
        ret = await contractCall("getMap", []);

        // map 是无序的，需要先排序才好比较
        maps = _.sortBy(maps, '0');
        ret = _.sortBy(ret, '0');
        assert.deepEqual(maps, ret);
    });
    /*
    it("wasm call testMultiParams(message, int32_t, bool)", async function () {
        this.timeout(waitTime);
        let message = [randomString()];
        let num = _.random(-2147483648, 2147483647);
        let flag = _.random(0, 1) ? true : false;

        await contractSend("testMultiParams", [message, num, flag]);

        ret = await contractCall("getMessage", []);
        assert.deepEqual(ret, message);

        ret = await contractCall("getInt32", []);
        assert.strictEqual(ret, num);

        ret = await contractCall("getBool", []);
        assert.strictEqual(ret, flag);
    });

    it.skip("wasm call setFloat getFloat", async function () {
        let nums = [-1.68, 0, 1.68];
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setFloat", [num]);
            ret = await contractCall("getFloat", []);
            assert.isTrue(Math.abs(num - ret) <= Number.EPSILON); // 浮点数有精度问题，不会全等
        }
    });

    it.skip("wasm call setDouble getDouble", async function () {
        let nums = [-1.68, 0, 1.68];
        this.timeout(waitTime * nums.length);
        for (const num of nums) {
            await contractSend("setDouble", [num]);
            ret = await contractCall("getDouble", []);
            assert.isTrue(Math.abs(num - ret) <= Number.EPSILON); // 浮点数有精度问题，不会全等
        }
    });*/

    it("wasm call setArray getArray (array<std::string, 10>)", async function () {
        this.timeout(waitTime);

        const len = 10;
        let strs = []
        for (let i = 0; i < len; i++) {
            strs.push(randomString((i + 1) * 5))
        }
        await contractSend("setArray", [strs]);
        ret = await contractCall("getArray", []);
        assert.deepEqual(ret, strs);
    });

    /*
    it("wasm call setPair getPair (pair<std::string, int32_t>)", async function () {
        this.timeout(waitTime);
        let pair = [randomString(), _.random(-2147483648, 2147483647)]
        await contractSend("setPair", [pair]);
        ret = await contractCall("getPair", []);
        assert.deepEqual(ret, pair);
    });*/

    it("wasm call setSet getSet (set<string>)", async function () {
        this.timeout(waitTime);
        let set = [randomString(), randomString(), randomString()]
        await contractSend("setSet", [set]);
        ret = await contractCall("getSet", []);
        set = _.sortBy(set, '0');
        ret = _.sortBy(ret, '0');
        assert.deepEqual(ret, set);
    });

    // bytes 是 uint8[]
    it("wasm call setBytes getBytes", async function () {
        let bytes = Buffer.from([_.random(0, 255), _.random(0, 255), _.random(0, 255)]);
        this.timeout(waitTime);
        await contractSend("setBytes", [bytes]);
        ret = await contractCall("getBytes", []);
        assert.strictEqual(Buffer.compare(bytes, ret), 0); // 他们两个buffer应该要等于
    });

    /*
    it("wasm call setFixedHash getFixedHash", async function () {
        this.timeout(waitTime);
        let hexStr = web3.utils.randomHex(256).replace("0x", ""); //定义的256
        await contractSend("setFixedHash", [hexStr]);
        ret = await contractCall("getFixedHash", []);

        assert.strictEqual(ret, hexStr); // 他们两个buffer应该要等于
    });*/

    // list 跟 vector 一样的编码
    // 底层暂时还不支持整个合约测试，先注释掉
    it("wasm call setList getList", async function () {
        this.timeout(waitTime);
        let listStrs = ["1", "hello", "world"];
        await contractSend("setList", [listStrs]);
        ret = await contractCall("getList", []);

        assert.deepEqual(ret, listStrs);
    });

})


