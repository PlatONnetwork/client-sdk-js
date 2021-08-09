var chai = require("chai");
var assert = chai.assert;
var Web3 = require("../packages/web3");
var web3 = undefined;
var utils = require("../packages/web3-utils/src");
var Accounts = require("../packages/web3-eth-accounts/src");
// 默认为undefined的不要管，程序会自动获取。
var cfg = {
    provider: "ws://127.0.0.1:5789", // 请更新成自己的 ws 节点
    chainId: 201030, // 请更新成自己的节点id
    privateKey: "0x983759fe9aac227c535b21d78792d79c2f399b1d43db46ae6d50a33875301557", // 请更新成自己的私钥(必须有十六进制前缀0x)
    address: undefined, // 请更新成上面私钥对应的地址
    gas: undefined,
    gasPrice: undefined,
    // 合约信息，用来测试的合约文件在与此文件同级目录文件名为 MyToken.sol
    myToken: {
        bin: "0x60806040526002805460ff19168117905534801561001c57600080fd5b506040516107083803806107088339810160409081528151602080840151928401516060850151928501805190959490940193909291610061916000918701906100d3565b5082516100759060019060208601906100d3565b50600280543361010090810261010060a860020a031960ff90961660ff199093168317959095169490941791829055600a0a919091026004819055919004600160a060020a03166000908152600360205260409020555061016e9050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061011457805160ff1916838001178555610141565b82800160010185558215610141579182015b82811115610141578251825591602001919060010190610126565b5061014d929150610151565b5090565b61016b91905b8082111561014d5760008155600101610157565b90565b61058b8061017d6000396000f3006080604052600436106100985763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde03811461009d578063095ea7b31461012757806318160ddd1461015f57806323b872dd14610186578063313ce567146101b057806370a08231146101db57806395d89b41146101fc578063a9059cbb14610211578063dd62ed3e14610235575b600080fd5b3480156100a957600080fd5b506100b261025c565b6040805160208082528351818301528351919283929083019185019080838360005b838110156100ec5781810151838201526020016100d4565b50505050905090810190601f1680156101195780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561013357600080fd5b5061014b600160a060020a03600435166024356102ea565b604080519115158252519081900360200190f35b34801561016b57600080fd5b50610174610350565b60408051918252519081900360200190f35b34801561019257600080fd5b5061014b600160a060020a0360043581169060243516604435610356565b3480156101bc57600080fd5b506101c561042f565b6040805160ff9092168252519081900360200190f35b3480156101e757600080fd5b50610174600160a060020a0360043516610438565b34801561020857600080fd5b506100b2610453565b34801561021d57600080fd5b5061014b600160a060020a03600435166024356104ad565b34801561024157600080fd5b50610174600160a060020a0360043581169060243516610534565b6000805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156102e25780601f106102b7576101008083540402835291602001916102e2565b820191906000526020600020905b8154815290600101906020018083116102c557829003601f168201915b505050505081565b336000818152600560209081526040808320600160a060020a038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60045490565b600160a060020a03831660009081526003602052604081205482111561037857fe5b600160a060020a03841660009081526005602090815260408083203384529091529020548211156103a557fe5b600160a060020a0380851660008181526005602090815260408083203384528252808320805488900390558383526003825280832080548890039055938716808352918490208054870190558351868152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a35060019392505050565b60025460ff1681565b600160a060020a031660009081526003602052604090205490565b60018054604080516020600284861615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156102e25780601f106102b7576101008083540402835291602001916102e2565b336000908152600360205260408120548211156104c657fe5b33600081815260036020908152604080832080548790039055600160a060020a03871680845292819020805487019055805186815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350600192915050565b600160a060020a039182166000908152600560209081526040808320939094168252919091522054905600a165627a7a72305820d0e39c8cc82af8e4cce2d5e9c112b63a51ce76993d173ebd6a238a21732e01a30029",
        abiStr: `[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"guy","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"n","type":"string"},{"name":"s","type":"string"},{"name":"d","type":"uint8"},{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]`,
        name: "RMB",
        symbol: "Y",
        decimals: "0",
        supply: "100000000000000000000000000000000000000000000",
        rawTransaction: undefined,
        txReceipt: undefined
    },
    ptSub: undefined,
};

describe("web3.platon by websocket(you must update cfg variable before run this test)", function () {
    before(async function () {
        web3 = new Web3(cfg.provider);
        let gasPrice = web3.utils.numberToHex(await web3.platon.getGasPrice());
        let gas = web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit / 10));
        cfg.gasPrice = gasPrice;
        cfg.gas = gas;

        var hrp = await web3.platon.getAddressHrp()
        var ethAccounts = new Accounts(web3, hrp);
        cfg.address = ethAccounts.privateKeyToAccount(cfg.privateKey).address;

        web3.platon.subscribe('pendingTransactions', function () { }).on("data", function () {
            console.log("subscribe pendingTransactions come");
        });
        web3.platon.subscribe('newBlockHeaders', function () { }).on("data", function () {
            console.log("subscribe newBlockHeaders come");
        });
        web3.platon.subscribe('syncing', function () { }).on("data", function () {
            console.log("subscribe syncing come");
        });
        web3.platon.subscribe('logs', {}, function () { }).on("data", function () {
            console.log("subscribe logs come");
        });
    });

    it("web3.platon.getProtocolVersion", async function () {
        let ret = await web3.platon.getProtocolVersion();
        assert.isString(ret);
    });

    it("web3.platon.isSyncing", async function () {
        let ret = await web3.platon.isSyncing();
        assert.isBoolean(ret);
    });

    it("web3.platon.getGasPrice", async function () {
        let ret = await web3.platon.getGasPrice();
        assert.isString(ret);
    });

    it("web3.platon.getAccounts", async function () {
        let ret = await web3.platon.getAccounts();
        assert.isArray(ret);
    });

    it("web3.platon.getBlockNumber", async function () {
        let ret = await web3.platon.getBlockNumber();
        assert.isNumber(ret);
        assert.isAtLeast(ret, 0);
    });

    it("web3.platon.getBalance", async function () {
        let ret = await web3.platon.getBalance(cfg.address);
        assert.isString(ret);
    });

    it("web3.platon.Contract", async function () {
        let from = cfg.address;
        let contract = new web3.platon.Contract(JSON.parse(cfg.myToken.abiStr));
        console.log("contract.options.vmType", contract.options.vmType);
        let gasPrice = cfg.gasPrice;
        let gas = cfg.gas;
        let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
        let chainId = cfg.chainId;
        let data = contract.deploy({
            data: cfg.myToken.bin,
            arguments: [
                cfg.myToken.name,
                cfg.myToken.symbol,
                cfg.myToken.decimals,
                cfg.myToken.supply
            ]
        }).encodeABI();

        let tx = { gasPrice, gas, nonce, chainId, data };
        let signTx = await web3.platon.accounts.signTransaction(tx, cfg.privateKey);
        cfg.myToken.rawTransaction = signTx.rawTransaction;
    });

    it("web3.platon.sendSignedTransaction(deploy contract)", async function () {
        this.timeout(10000);

        let ret = await web3.platon.sendSignedTransaction(cfg.myToken.rawTransaction);
        cfg.myToken.txReceipt = ret;
        assert.isObject(ret);
        assert.isNotNull(ret.contractAddress);
    });

    it("contract call four method name(), symbol(), decimals(), totalSupply())", async function () {
        this.timeout(10000);

        let contract = new web3.platon.Contract(
            JSON.parse(cfg.myToken.abiStr),
            cfg.myToken.txReceipt.contractAddress,
            null
        );
        let from = cfg.address;
        // 查看代币名称
        let nameMethod = contract.methods["name"].apply(contract.methods, []);
        let name = await nameMethod.call({ from });
        assert.deepEqual(name, cfg.myToken.name);

        // 查看代币符号
        let symbolMethod = contract.methods["symbol"].apply(contract.methods, []);
        let symbol = await symbolMethod.call({ from });
        assert.deepEqual(symbol, cfg.myToken.symbol);

        // 查看小数点位
        let decimalsMethod = contract.methods["decimals"].apply(contract.methods, []);
        let decimals = await decimalsMethod.call({ from });
        assert.deepEqual(decimals, cfg.myToken.decimals);

        // 查看总供应量
        let totalSupplyMethod = contract.methods["totalSupply"].apply(contract.methods, []);
        let supply = await totalSupplyMethod.call({ from });
        assert.deepEqual(supply, cfg.myToken.supply);
    });

    it("contract send method transfertransfer( address to, uint value)", async function () {
        this.timeout(10000);

        let contract = new web3.platon.Contract(JSON.parse(cfg.myToken.abiStr), cfg.myToken.txReceipt.contractAddress, null);
        let from = cfg.address;
        let to = cfg.myToken.txReceipt.contractAddress;
        let toAccount = "0x714dE266a0eFFA39fCaCa1442B927E5f1053Eaa3";
        var hrp = await web3.platon.getAddressHrp()
        toAccount = utils.toBech32Address(hrp, toAccount);
        let transferBalance = "1000";
    
        let data = contract.methods["transfer"].apply(contract.methods, [toAccount, transferBalance]).encodeABI();
        console.log('data=', data);
        let gasPrice = web3.utils.numberToHex(await web3.platon.getGasPrice());
        let gas = web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit / 10));
        let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
        let chainId = cfg.chainId;
        let tx = { gasPrice, gas, nonce, chainId, data, to };
        console.log("tx=",tx);
        let signTx = await web3.platon.accounts.signTransaction(tx, cfg.privateKey);
        let ret = await web3.platon.sendSignedTransaction(signTx.rawTransaction);

        let balanceOfMethod = contract.methods["balanceOf"].apply(contract.methods, [toAccount]);
        let balance = await balanceOfMethod.call({ "from": toAccount });
        assert.deepEqual(balance, transferBalance);
    });

    it("web3.platon.getStorageAt", async function () {
        let ret = await web3.platon.getStorageAt(cfg.myToken.txReceipt.contractAddress, 0);
        assert.isString(ret);
    });

    it("web3.platon.getCode", async function () {
        let ret = await web3.platon.getCode(cfg.myToken.txReceipt.contractAddress);
        assert.isString(ret);
    });

    it("web3.platon.getBlockTransactionCount", async function () {
        let ret = await web3.platon.getBlockTransactionCount(cfg.myToken.txReceipt.blockNumber);
        assert.isNumber(ret);
        assert.isAtLeast(ret, 1);
    });

    it("web3.platon.getBlock", async function () {
        let ret = await web3.platon.getBlock("latest");
        assert.isObject(ret);
    });

    it("web3.platon.getBlockTransactionCount", async function () {
        let ret = await web3.platon.getBlockTransactionCount(cfg.myToken.txReceipt.blockNumber);
        assert.isNumber(ret);
        assert.isAtLeast(ret, 1);
    });

    it("web3.platon.getTransaction", async function () {
        let ret = await web3.platon.getTransaction(cfg.myToken.txReceipt.transactionHash);
        assert.isObject(ret);
    });

    it("web3.platon.getTransactionFromBlock", async function () {
        let ret = await web3.platon.getTransactionFromBlock(cfg.myToken.txReceipt.blockNumber, 0);
        assert.isObject(ret);
    });

    it("web3.platon.getTransactionReceipt", async function () {
        let ret = await web3.platon.getTransactionReceipt(cfg.myToken.txReceipt.transactionHash);
        assert.isObject(ret);
    });

    it("web3.platon.getTransactionCount", async function () {
        let ret = await web3.platon.getTransactionCount(cfg.address);
        assert.isNumber(ret);
        assert.isAtLeast(ret, 2);
    });

    it("web3.platon.getPastLogs", async function () {
        let ret = await web3.platon.getPastLogs({ fromBlock: cfg.myToken.txReceipt.blockNumber, toBlock: "latest" });
        assert.isArray(ret);
        assert.isAtLeast(ret.length, 1);
        web3.currentProvider.disconnect();
    });
});
