
const Web3 = require('../lib/web3'),
    fs = require('fs'),
    path = require('path'),
    rlp = require('rlp'),
    Int64 = require('node-int64')
    ;

const wallet = require('./l666.json'),
    abi = require('./demo.cpp.abi.json'),
    demoJson = require('./demo.json'),
    sunAddress = '0x60ceca9c1290ee56b98d4e160ef0453f7c40d219';//张军



console.log('wallet:', wallet, 'abi:', abi)

const dealData = (str) => {
    const code = parseInt(str.substr(2, 64), 16),
        start = parseInt(str.substr(66, 64), 16),
        dataLength = parseInt(str.substr(130, 64), 16) * 2,
        data = str.substr(194, dataLength);
    if (dataLength % 2 == 0) { //当输入够偶数位；
        var StrHex = "";
        for (var i = 0; i < dataLength; i = i + 2) {
            var str = data.substr(i, 2); //16进制；

            var n = parseInt(str, 16); //10进制；
            StrHex = StrHex + String.fromCharCode(n);
        }
    }
    console.log('code==', code, 'data==', data);
    return {
        code: code,
        data: StrHex,
    }
}

// const provider = 'http://10.10.8.20:8545'
const provider = 'http://192.168.9.180:6789'
const web3 = new Web3(new Web3.providers.HttpProvider(provider));
console.log(web3);

const balance = web3.eth.getBalance(wallet.address).toNumber(),
    balanceSun = web3.eth.getBalance(sunAddress).toNumber();
console.log('balance:', balance, `sun balance:`, balanceSun)
web3.personal.unlockAccount(web3.eth.accounts[0], '88888888', 9999999)

const calcContract = web3.eth.contract(abi);

function deploy() {
    console.log(`--deploy start--`)
    const
        type = new Int64(1),
        source = fs.readFileSync(path.join(__dirname, './demo.wasm')),
        // bin = source.toString("hex"),
        buf1 = type.toBuffer(),
        buf2 = Buffer.from(source),
        buf3 = Buffer.from(JSON.stringify(abi)),
        arr = [buf1, buf2, buf3],
        encode = rlp.encode(arr),
        data = encode.toString('hex')
        ;

    const params = {
        "gas": "0x506709",
        "gasPrice": "0x8250de00",
        data: '0x' + data,
        from: web3.eth.accounts[0]
    }
    // const params = {
    //     gasPrice: 27000000000, //27000000000
    //     gas: 7999999,
    //     data: demoJson.code,
    //     from: web3.eth.accounts[0]
    // }

    let myContractReturned = calcContract.new(params, function (err, myContract) {
        if (!err) {
            if (!myContract.address) {
                console.log("contract deploy transaction hash: " + myContract.transactionHash) //部署合约的交易哈希值
            } else {
                // 合约发布成功
                console.log("contract deploy transaction address: " + myContract.address) //部署合约的地址
                const receipt = web3.eth.getTransactionReceipt(myContract.transactionHash);
                console.log(`contract deploy receipt:`, receipt);
                testTransfer(myContract.address)
                call(myContract)
            }
        } else {
            console.log(`contract deploy error:`, err)
        }
    });
}

function platONDeploy() {
    console.log(`--deploy start--`)
    const
        source = fs.readFileSync(path.join(__dirname, './demo.wasm'))
        ;

    const platONData = calcContract.new.getPlatONData(source)
    console.log('platONData:', platONData)
    const params = {
        "gas": "0x506709",
        "gasPrice": "0x8250de00",
        data: platONData,
        from: web3.eth.accounts[0]
    }

    let myContractReturned = calcContract.new(params, function (err, myContract) {
        if (!err) {
            if (!myContract.address) {
                console.log("contract deploy transaction hash: " + myContract.transactionHash) //部署合约的交易哈希值
            } else {
                // 合约发布成功
                console.log("contract deploy transaction address: " + myContract.address) //部署合约的地址
                const receipt = web3.eth.getTransactionReceipt(myContract.transactionHash);
                console.log(`contract deploy receipt:`, receipt);
                platONSendTransaction(myContract.address)
                platONCall(myContract)
            }
        } else {
            console.log(`contract deploy error:`, err)
        }
    });
}
//0x0af6f8114bef65caa0a995fd9071a2f82e9d6b42
function call(contract) {
    console.log('--call start--', contract)
    if (!contract) throw new Error(`contract 不能为空`)

    const type = 2,
        functionName = 'getBalance',
        // params = wallet.address,
        params = '0x60ceca9c1290ee56b98d4e160ef0453f7c40d219',
        buf1 = new Int64(type).toBuffer(),
        buf2 = Buffer.from(functionName),
        buf3 = Buffer.from(params),
        arr = [buf1, buf2, buf3],
        encode = rlp.encode(arr),
        data = '0x' + encode.toString('hex')
        ;

    const result = web3.eth.getPlatONData({
        from: sunAddress,
        to: contract.address,
        data: data
    });

    console.log('call result:', result);
    console.log(`--call end--`)
}

function platONCall(contract) {
    console.log('--platONCall start--', contract)
    if (!contract) throw new Error(`contract 不能为空`)

    const params = '0x60ceca9c1290ee56b98d4e160ef0453f7c40d219',
        data = contract.getBalance.getData(params)
        ;

    const result = web3.eth.call({
        from: sunAddress,
        to: contract.address,
        data: data
    });

    console.log('platONCall result:', result);
}

function platONSendTransaction(contractAddress = '0x32d660b7dc713470a2886ac6b234e88dde00b52d') {
    console.log(`--platONSendTransaction start--`)

    const MyContract = web3.eth.contract(abi);
    const myContractInstance = MyContract.at(contractAddress);

    const
        param_from = web3.eth.accounts[0],
        param_to = wallet.address,
        param_assert = 4
        ;

    const platOnData = myContractInstance.transfer.getPlatONData(param_from, param_to, param_assert)

    // const contractData = myContractInstance.transfer.getData(param_from, param_to, param_assert)
    //nonce：sendTransaction可以不传，sendRowTransaction必须传
    const params = {
        from: web3.eth.accounts[0],
        gasPrice: '0x8250de00',
        gas: '0x706709',
        to: myContractInstance.address,
        value: "0x0",
        data: platOnData,
    }
    console.log(`testTransfer params:\n`, JSON.stringify(params))
    const hash = web3.eth.sendTransaction(params)
    console.log(`platONSendTransaction hash:`, hash);
    getTransactionReceipt(hash, (code, data) => {
        console.log(code, data)
    })
}

function testTransfer(contractAddress = '0x056d8d0e649baaf6774bb25e3726aa8984c561fb') {
    console.log(`--testTransfer start--`)

    const MyContract = web3.eth.contract(abi);
    const myContractInstance = MyContract.at(contractAddress);

    const type = new Int64(2),
        functionName = 'transfer02',
        param_from = sunAddress,
        param_to = wallet.address,
        param_assert = 4,
        buf1 = Buffer.alloc(4);

    buf1.writeInt32BE(param_assert, 0)

    const arr = [type.toBuffer(), Buffer.from(functionName), Buffer.from(param_from), Buffer.from(param_to), buf1],
        encode = rlp.encode(arr),
        data = '0x' + encode.toString('hex')
        ;
    const platOnData = myContractInstance.transfer.getPlatONData(param_from, param_to, param_assert)

    // const contractData = myContractInstance.transfer.getData(param_from, param_to, param_assert)
    //nonce：sendTransaction可以不传，sendRowTransaction必须传
    const params = {
        from: sunAddress,
        // nonce: web3.nonce(),
        // nonce: 4646546464644654979,
        gasPrice: '0x8250de00',
        gas: '0x706709',
        to: myContractInstance.address,
        value: "0x0",
        data: data,
    }
    console.log(`testTransfer params:\n`, JSON.stringify(params))
    const hash = web3.eth.sendTransaction(params)
    console.log(`${functionName} hash:`, hash);
    getTransactionReceipt(hash, (code, data) => {
        console.log(code, data)
    })
}

function testEvent() {
    getTransactionReceipt('0x7a8cf7855a93d9d32fabdf41a7e0fc57535a2fb585cbe170e6d114816f38bd6d', (code, data) => {
        console.log(code, data)
        //对abi事件列表中的事件名称 sha3() 对比result.logs[0].topics
        dealLog(data.logs[0])
    })
}

let wrapCount = 60;

function getTransactionReceipt(hash, fn) {
    console.log('getTransactionReceipt hash==>', hash);
    let id = '',
        result = web3.eth.getTransactionReceipt(hash),
        data = {};
    console.log(`result:`, result)
    if (result && result.transactionHash && hash == result.transactionHash) {
        clearTimeout(id);
        if (result.logs.length != 0) {
            console.log('sendRawTrasaction result==>', data);
            fn(0, result);
            delete fn;
        } else {
            fn(1001, '合约异常，失败');
        }
    } else {
        if (wrapCount--) {
            id = setTimeout(() => {
                getTransactionReceipt(hash, fn);
            }, 1000);
        } else {
            fn(1000, '超时');
            console.warn('sendRawTrasaction超时');
            id = '';
            delete fn;
        }
    }
}

// deploy();
// platONDeploy()
// call({})

// sun合约地址 0x90b187980cb23eed8e2b367a9560b23074116e19
// 180合约地址 0x2a362921230909faa5442d2e67daad0cec0e644a
testTransfer('0x91b0ac240b62de2f0152cac322c6c5eafe730a84')
// platONSendTransaction('0x2a362921230909faa5442d2e67daad0cec0e644a')

// 180hash 0xb1335d4db521ddc0b390448f919e5b5af1258b29e7ab4e0d68b0ef315af0cf5f
getTransactionReceipt('0xb1335d4db521ddc0b390448f919e5b5af1258b29e7ab4e0d68b0ef315af0cf5f', (code, data) => {
    const MyContract = web3.eth.contract(abi);
    const myContractInstance = MyContract.at('0x2a362921230909faa5442d2e67daad0cec0e644a');
    //"{"address":"0x2a362921230909faa5442d2e67daad0cec0e644a","topics":["0x8cd284134f0437457b5542cb3a7da283d0c38208c497c5b4b005df47719f98a1"],"data":"0xd2917472616e7366657220737563636573732e","blockNumber":257818,"transactionHash":"0xb1335d4db521ddc0b390448f919e5b5af1258b29e7ab4e0d68b0ef315af0cf5f","transactionIndex":0,"blockHash":"0x7b8383b6b30833e437d0a5479e853b1ea1ef3f5e12bd305bafb0a52b708d33e1","logIndex":0,"removed":false}"
    const result = myContractInstance.decodePlatONLog(data.logs[0])
    console.log('result==', result)
})
// testEvent()

console.log('--------')