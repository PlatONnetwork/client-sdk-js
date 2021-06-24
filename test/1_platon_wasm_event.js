var Web3 = require("../packages/web3/src");
var web3 = undefined;
var RLP = require("rlp");
var _ = require('underscore');
var fs = require("fs-extra");

var chai = require("chai");
var assert = chai.assert;
var abi = require("../packages/web3-eth-abi/src");
var utils = require("../packages/web3-utils/src");
var Accounts = require("../packages/web3-eth-accounts/src");

const provider = "http://127.0.0.1:6789"; // 请更新成自己的 http 节点
web3 = new Web3(provider);
const chainId = 201030; // 请更新成自己的节点id
const privateKey = "0x983759fe9aac227c535b21d78792d79c2f399b1d43db46ae6d50a33875301557"; // 请更新成自己的私钥(必须有十六进制前缀0x)
const contractAddress = ""
const waitTime = 10000; // 发送一个交易愿意等待的时间，单位ms
const binFilePath = './test/wasm/eventTopic.wasm';
const abiFilePath = './test/wasm/eventTopic.abi.json';

let gas = undefined;
let gasPrice = undefined;

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

const getEventInfo = async (contract, eventName, eventFilter, fromBlockNum) => {
    console.log("\n====================start get Event:【", eventName,"】===================");
    
    let rpcId = await contract.newFilter(eventName, {filter: eventFilter, fromBlock: fromBlockNum,
        toBlock: "latest"})
    // console.log("rpcId:", rpcId)

    let eventInfo = await contract.getFilterLogs(rpcId)
    return eventInfo
}

let from = ""
describe("wasm event unit test (you must update config before run this test)", function () {
    before(async function () {
        web3 = new Web3(provider);
        gasPrice = web3.utils.numberToHex(await web3.platon.getGasPrice());
        gas = web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit - 1));
        
        var hrp = await web3.platon.getAddressHrp()
        var ethAccounts = new Accounts(web3, hrp);
        from = ethAccounts.privateKeyToAccount(privateKey).address;  // 请更新成上面私钥对应的地址
        var net_type = hrp

        let abi = JSON.parse((await fs.readFile(abiFilePath)).toString());
         // 默认一个address，如果要是部署合约，可以替换掉
        contract = new web3.platon.Contract(abi, contractAddress, { vmType: 1, net_type: net_type });
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

    it("wasm call setStringAndAddressAndBoolean, call stringAndAddrAndBoolean event", async function () {
        this.timeout(waitTime);
        name = "this is event test"
        address = contract.options.address
        b = true
        ret = await contractSend("setStringAndAddressAndBoolean", [name, address, b]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
    
        var filter = { topic1: name, topic2: address, topic3: b}
        eventInfo = await getEventInfo(contract, 'stringAndAddrAndBoolean', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 4
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setIntNumber, call intNumber event", async function () {
        this.timeout(waitTime);
        i8 = 1
        i16 = 20
        i32 = 246567
        ret = await contractSend("setIntNumber", [i8, i16, i32]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);

        var filter = {
            topic1: i8, 
            topic2: i16,
            topic3: i32,
        }
    
        eventInfo = await getEventInfo(contract, 'intNumber', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 4
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setUintNumber, call uintNumber event", async function () {
        this.timeout(waitTime);
        ui8 = 1
        ui16 = 20
        ui32 = 246567
    
        ret = await contractSend("setUintNumber", [ui8, ui16, ui32]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);

        var filter = {
            topic1: ui8, 
            topic2: ui16,
            topic3: ui32,
        }
    
        eventInfo = await getEventInfo(contract, 'uintNumber', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 4
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setIntArray, call intArray event", async function () {
        this.timeout(waitTime);
        i8Array = [-1,-1]
        i16Array = [-1,-1]
        ret = await contractSend("setIntArray", [i8Array, i16Array]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
        
        var filter = {
            topic1: i8Array, 
            topic2: i16Array,
        }
    
        eventInfo = await getEventInfo(contract, 'intArray', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 3
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setUintArray, call uintArray event", async function () {
        this.timeout(waitTime);
        ui8Array = [1, 1]
        ui16Array = [1, 1]
        ret = await contractSend("setUintArray", [ui8Array, ui16Array]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);

        var filter = {
            topic1: ui8Array, 
            topic2: ui16Array,
        }    
        eventInfo = await getEventInfo(contract, 'uintArray', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 3
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setIntVector, call intVector event", async function () {
        this.timeout(waitTime);
        i8Array = []
        i16Array = []
        for( i = 0; i < 100; ++i ){
            i8Array.push(-10+i)
        }
    
        for( i = 0; i < 100; ++i ){
            i16Array.push(-10+i)
        }
    
        ret = await contractSend("setIntVector", [i8Array, i16Array]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
    
        var filter = {
            topic1: i8Array, 
            topic2: i16Array,
        }
        eventInfo = await getEventInfo(contract, 'intVector', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 3
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setUintVector, call uintVector event", async function () {
        this.timeout(waitTime);
        ui8Array = []
        ui16Array = []
        for( i = 0; i < 100; ++i ){
            ui8Array.push(1+i)
        }
    
        for( i = 0; i < 100; ++i ){
            ui16Array.push(100+i)
        }
    
        ret = await contractSend("setUintVector", [ui8Array, ui16Array]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
    
        var filter = {
            topic1: ui8Array, 
            topic2: ui16Array,
        }
        eventInfo = await getEventInfo(contract, 'uintVector', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 3
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setUintList, call uintList event", async function () {
        this.timeout(waitTime);
        ui8Array = []
        ui16Array = []
        
        for( i = 0; i < 100; ++i ){
            ui8Array.push(1+i)
        }
    
        for( i = 0; i < 100; ++i ){
            ui16Array.push(100+i)
        }
    
        ret = await contractSend("setUintList", [ui8Array, ui16Array]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
    
        var filter = {
            topic1: ui8Array, 
            topic2: ui16Array,
        }

        eventInfo = await getEventInfo(contract, 'uintList', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 3
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setIntList, call intList event", async function () {
        this.timeout(waitTime);
        i8Array = []
        i16Array = []
        for( i = 0; i < 100; ++i ){
            i8Array.push(-50+i)
        }
    
        for( i = 0; i < 100; ++i ){
            i16Array.push(-50+i)
        }
    
        ret = await contractSend("setIntList", [i8Array, i16Array]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
    
        var filter = {
            topic1: i8Array, 
            topic2: i16Array,
        }
        eventInfo = await getEventInfo(contract, 'intList', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 3
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setMap, call uintMap event", async function () {
        this.timeout(waitTime);
        let m1 = new Map();
        let m2 = new Map();
        ui8Array = []
        ui16Array = []
        
        for( i = 0; i < 10; ++i ){
            ui8 = 1+i
            // 添加键
            m1.set(ui8, "test_m1");
        }
    
        for( i = 0; i < 10; ++i ){
            ui16 = 1+i
            // 添加键
            m2.set(ui16, "test_m2");
        }
        
        ret = await contractSend("setMap", [m1, m2]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
    
        var filter = {
            topic1: m1, 
            topic2: m2,
        }
        
        eventInfo = await getEventInfo(contract, 'uintMap', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 3
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setPair, call uintPair event", async function () {
        this.timeout(waitTime);
 
        let p1 = {1:"test1_value",2:"test1_value",3:"test1_value",4:"test1_value"}
        let p2 = {1:"test2_value",2:"test2_value",3:"test2_value",4:"test2_value"}
        
        ret = await contractSend("setPair", [p1, p2]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
    
        var filter = {
            topic1: p1, 
            topic2: p2,
        }
        
        eventInfo = await getEventInfo(contract, 'uintPair', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 3
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call callSet, call uintSet event", async function () {
        this.timeout(waitTime);
 
        let s1 = new Set();
        let s2 = new Set();
        let s3 = new Set();
    
        for( i = 0; i < 50; ++i ){
            s1.add(i);
            s2.add(i);
            s3.add(i);
        }
        
        ret = await contractSend("callSet", [s1, s2, s3]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
    
        var filter = {
            topic1: s1, 
            topic2: s2,
            topic3: s3,
        }
        
        eventInfo = await getEventInfo(contract, 'uintSet', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 4
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setFixHash, call fixHash event", async function () {
        this.timeout(waitTime);
 
        hashStr = web3.utils.sha3("test")
    
        let f1 = hashStr.substring(0, 10)
        let f2 = contract.options.address
        let f3 = hashStr.substring(0, 30)
        
        ret = await contractSend("setFixHash", [f1, f2, f3]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
    
        var filter = {
            topic1: f1, 
            topic2: f2,
            topic3: f3,
        }
        
        eventInfo = await getEventInfo(contract, 'fixHash', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 4
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });

    it("wasm call setStruct, call structEvent event", async function () {
        this.timeout(waitTime);
        var member = {name:"test"}
    
        ret = await contractSend("setStruct", [member]);
        // console.log("ret.logs[0].topics:\n", ret.logs[0].topics);
    
        var filter = {
            topic1: member
        }
        
        eventInfo = await getEventInfo(contract, 'structEvent', filter, ret.blockNumber)
        // console.log("events info:\n", eventInfo); 
        var nTopics = 2
        for(var i=0; i < nTopics; ++i){
            assert.strictEqual(ret.logs[0].topics[i], eventInfo[0].topics[i]);
        }
    });
})


