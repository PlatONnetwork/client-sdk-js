var Web3 = require("../packages/web3/src");
var abi = require("../packages/web3-eth-abi/src");
var web3 = new Web3('http://10.1.1.6:8806');
var RLP = require("rlp");

const chainId = 100; // 请更新成自己的节点id
const privateKey = "0x983759fe9aac227c535b21d78792d79c2f399b1d43db46ae6d50a33875301557"; // 请更新成自己的私钥(必须有十六进制前缀0x)
const from = "0xe03887881e1e0CD6CdBFc82BC3292b8AD9A683f2";

let gas = undefined;
let gasPrice = undefined;

const contractSend = async (contractAddress, data) => {
    let to = contractAddress;
    let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
    let tx = { gasPrice, gas, nonce, chainId, data, to };
    let signTx = await web3.platon.accounts.signTransaction(tx, privateKey);
    let cret = await web3.platon.sendSignedTransaction(signTx.rawTransaction);
    return cret;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

(async () =>{
    gasPrice = await web3.utils.numberToHex(await web3.platon.getGasPrice());
    gas = await web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit - 1));
    console.log("gas=", gas);
    while (true) {
        randomlen = parseInt(Math.random() * 77 * 1024);
        console.log("randomlen=", randomlen);
        randomdata = web3.utils.randomHex(randomlen);
        //console.log("randomdata=", randomdata);
        data = "0x0061736d" + randomdata.slice(2);
        //console.log("data=", data);
        let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
        let tx = { gasPrice, gas, nonce, chainId, data };
        try {
            let signTx = await web3.platon.accounts.signTransaction(tx, privateKey);
            ret = await web3.platon.sendSignedTransaction(signTx.rawTransaction);
            console.log("--------------------deploy success ", ret.contractAddress);
        } catch(err) {
            console.log("deploy error: ", err.message)
        }

        try {
            callret = await contractSend("0x24d8d845E62031fC90f34ee73e35559DaAb600ee", randomdata);
            console.log("--------------------call success", callret);
        } catch(err) {
            console.log("call error: ", err.message)
        }
        await sleep(2000);
    }

    /*paramsABI = [];
    paramsABI.unshift(abi.fnvOne64Hash("init"));
    data = "0x" + RLP.encode(paramsABI).toString("hex");
    callret = await contractSend("0x24d8d845E62031fC90f34ee73e35559DaAb600ee", data);
    console.log("--------------------call success", callret);*/
})()