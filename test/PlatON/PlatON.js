
const Web3 = require('../../lib/web3'),
    fs = require('fs'),
    path = require('path')
    ;

const wallet = require('../l666.json'),
    abi = require('./multisig.cpp.abi.json');

const provider = 'http://192.168.9.180:6789'
// const provider = 'http://10.10.8.220:6789';
const web3 = new Web3(new Web3.providers.HttpProvider(provider));

console.log(web3);

const balance = web3.eth.getBalance(wallet.address).toNumber(),
    calcContract = web3.eth.contract(abi);

console.log('balance:', balance)

web3.personal.unlockAccount(web3.eth.accounts[0], '88888888', 9999999)



function platONNew() {
    console.log(`--deploy start--`)
    const
        source = fs.readFileSync(path.join(__dirname, './multisig.wasm'))
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
                // platONSendTransaction(myContract.address)
                platONCall(myContract)
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
        nonce: '0x' + web3.nonce().toString('hex'),
        "gas": "0x506709",
        "gasPrice": "0x8250de00",
        data: platONData,
        from: web3.eth.accounts[0]
    }

    let myContractReturned = calcContract.deploy(params, function (err, myContract) {
        if (!err) {
            if (!myContract.address) {
                console.log("contract deploy transaction hash: " + myContract.transactionHash) //部署合约的交易哈希值
            } else {
                // 合约发布成功
                console.log("contract deploy transaction address: " + myContract.address) //部署合约的地址
                const receipt = web3.eth.getTransactionReceipt(myContract.transactionHash);
                console.log(`contract deploy receipt:`, receipt);
                // platONSendTransaction(myContract.address)
                platONCall(myContract)
            }
        } else {
            console.log(`contract deploy error:`, err)
        }
    });
}

function platONCall(contract) {
    console.log('--platONCall start--', contract)
    if (!contract) throw new Error(`contract 不能为空`)

    const data = contract.getOwners.getPlatONData()
        ;

    const result = web3.eth.call({
        from: web3.eth.accounts[0],
        to: contract.address,
        data: data
    });
    const data1 = contract.getConfirmations.getPlatONData(5);
    const result1 = web3.eth.call ({
        from: web3.eth.accounts[0],
        to: contract.address,
        data: data1,
    });

    console.log('platONCall result:', result);
    contract.decodePlatONCall (
  `0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000007a323631633766383137353063373535386233343738656262646165633237303666636466333462393a333662643761353235356338366631323236333362633839333639613031393236396266633632373a65656236616534313465636663326334333464326466363363623761386261313831336333653862000000000000`
);

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

    const platOnData = myContractInstance.transfer02.getPlatONData(param_from, param_to, param_assert)

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
        const result = myContractInstance.decodePlatONLog(data.logs[0])
        console.log('result==', result)
    })
}

function testPlatONEvent(hash, contractAddress) {
    getTransactionReceipt(hash, (code, data) => {
        const MyContract = web3.eth.contract(abi);
        const myContractInstance = MyContract.at(contractAddress);
        //"{"address":"0x2a362921230909faa5442d2e67daad0cec0e644a","topics":["0x8cd284134f0437457b5542cb3a7da283d0c38208c497c5b4b005df47719f98a1"],"data":"0xd2917472616e7366657220737563636573732e","blockNumber":257818,"transactionHash":"0xb1335d4db521ddc0b390448f919e5b5af1258b29e7ab4e0d68b0ef315af0cf5f","transactionIndex":0,"blockHash":"0x7b8383b6b30833e437d0a5479e853b1ea1ef3f5e12bd305bafb0a52b708d33e1","logIndex":0,"removed":false}"
        const result = myContractInstance.decodePlatONLog(data.logs[0])
        console.log('result==', result)
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

platONNew()
// platONDeploy()

// 180合约地址 0x130eb1947fef4d257cacf48d6a32bc9a39650912
// platONSendTransaction('0x130eb1947fef4d257cacf48d6a32bc9a39650912')

// 180 transfer hash  0x24192907542ca62dfd22528431c1303b2f98b0dff0f72c1d5e44deef8f32f267
// 180 transfer02 hash  0xb1335d4db521ddc0b390448f919e5b5af1258b29e7ab4e0d68b0ef315af0cf5f
// testPlatONEvent('0xb1335d4db521ddc0b390448f919e5b5af1258b29e7ab4e0d68b0ef315af0cf5f', '0x2a362921230909faa5442d2e67daad0cec0e644a')

console.log('--------')