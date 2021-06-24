var Web3 = require("../packages/web3/src");
var utils = require("../packages/web3-utils")
var web3 = new Web3('http://127.0.0.1:6789');

var cfg = {
    privateKey: "0xf51ca759562e1daf9e5302d121f933a8152915d34fcbc27e542baf256b5e4b74", // 请更新成自己的私钥(必须有十六进制前缀0x)
    address: undefined, // 请更新成上面私钥对应的地址
    gas: undefined,
    gasPrice: undefined,
    ptSub: undefined,
};


const get_chainid = async function () {
    let chainid = web3.utils.toDecimal(await web3.ppos.rpc("platon_chainId",[]));
    console.log("chainid:", chainid);
}


let SubmitTextProposalGasPrice = 15000 * 1000000000 // Min gas price for submit a text proposal in Von
let SubmitVersionProposalGasPrice = 21000 * 1000000000 // Min gas price for submit a version proposal in Von
let SubmitCancelProposalGasPrice  = 30000 * 1000000000 // Min gas price for submit a cancel proposal in Von
let SubmitParamProposalGasPrice   = 20000 * 1000000000 // Min gas price for submit a cancel proposal in Von


// 文本提案
const test_2000 = async function () {
    let gasPrice = web3.utils.numberToHex(SubmitTextProposalGasPrice);
    let gas = web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit));
    let verifier = "3058ac78b0a05637218a417e562daaca2d640afb3d142ada765650cc0bed892d91d6e8128df0a59397ea051a2d91af5b532866f411811f4fd46de068ad0e168d"
    let pIDID = "pid"

    let params = [2000, web3.ppos.hexStrBuf(verifier), pIDID];
    cfg.gasPrice = gasPrice;
    cfg.gas = gas;
    var hrp = await web3.platon.getAddressHrp()
    let chainid = web3.utils.toDecimal(await web3.ppos.rpc("platon_chainId",[]));
    web3.ppos.updateSetting({
        privateKey: cfg.privateKey,
        chainId: chainid,
        gas: gas,
        gasPrice: gasPrice,
        hrp: hrp
    })

    let ret = await web3.ppos.send(params);
    console.log(ret);
}

// 升级提案
const test_2001 = async function () {
    let gasPrice = web3.utils.numberToHex(SubmitVersionProposalGasPrice);
    let gas = web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit));
    let verifier = "3058ac78b0a05637218a417e562daaca2d640afb3d142ada765650cc0bed892d91d6e8128df0a59397ea051a2d91af5b532866f411811f4fd46de068ad0e168d"
    let pIDID = "pid"
    let newVersion = 4096
    let endVotingRounds = 10

    let params = [2001, web3.ppos.hexStrBuf(verifier), 
        pIDID, web3.ppos.hexStrBuf(newVersion), endVotingRounds];
    cfg.gasPrice = gasPrice;
    cfg.gas = gas;
    var hrp = await web3.platon.getAddressHrp()
    let chainid = web3.utils.toDecimal(await web3.ppos.rpc("platon_chainId",[]));
    web3.ppos.updateSetting({
        privateKey: cfg.privateKey,
        chainId: chainid,
        gas: gas,
        gasPrice: gasPrice,
        hrp: hrp
    })

    let ret = await web3.ppos.send(params);
    console.log(ret);
}

// 参数提案
const test_2002 = async function () {
    let gasPrice = web3.utils.numberToHex(SubmitParamProposalGasPrice);
    let gas = web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit));
    let verifier = "3058ac78b0a05637218a417e562daaca2d640afb3d142ada765650cc0bed892d91d6e8128df0a59397ea051a2d91af5b532866f411811f4fd46de068ad0e168d"
    let pIDID = "pid"
    let module = "staking"
    let name = "stakeThreshold"
    let value = "20000"

    let params = [2002, web3.ppos.hexStrBuf(verifier), pIDID, module, name, value];
    cfg.gasPrice = gasPrice;
    cfg.gas = gas;
    var hrp = await web3.platon.getAddressHrp()
    let chainid = web3.utils.toDecimal(await web3.ppos.rpc("platon_chainId",[]));
    web3.ppos.updateSetting({
        privateKey: cfg.privateKey,
        chainId: chainid,
        gas: gas,
        gasPrice: gasPrice,
        hrp: hrp
    })

    let ret = await web3.ppos.send(params);
    console.log(ret);
}

// 取消提案
const test_2005 = async function () {
    let gasPrice = web3.utils.numberToHex(SubmitParamProposalGasPrice);
    let gas = web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit));
    let verifier = "3058ac78b0a05637218a417e562daaca2d640afb3d142ada765650cc0bed892d91d6e8128df0a59397ea051a2d91af5b532866f411811f4fd46de068ad0e168d"
    let pIDID = "pid"
    let endVotingRounds = 10
    let CanceledPID = "0x6b7c6437defbc2c6ebe796ce0af64c766fc927f7e748bc09d6e97eaed6ea6d21"

    let params = [2005, web3.ppos.hexStrBuf(verifier), pIDID, endVotingRounds, 
        web3.ppos.hexStrBuf(CanceledPID)];

    cfg.gasPrice = gasPrice;
    cfg.gas = gas;
    var hrp = await web3.platon.getAddressHrp()
    let chainid = web3.utils.toDecimal(await web3.ppos.rpc("platon_chainId",[]));
    web3.ppos.updateSetting({
        privateKey: cfg.privateKey,
        chainId: chainid,
        gas: gas,
        gasPrice: gasPrice,
        hrp: hrp
    })

    let ret = await web3.ppos.send(params);
    console.log(ret);
}


get_chainid()
test_2000()
//test_2001()
//test_2002()
//test_2005()
