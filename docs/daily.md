# 详细开发计划

注：实际开发计划会有所动态调整。

## 2月11日 - 2月11日 (1 day)
项目沟通以及资源协调

## 2月12日 - 2月14日 (3 day)
调通如下合约(伪代码)的部署以及合约调用，并提供truffle开发人员前期调试使用。
```cpp
class SimpleStorage
{
private:
	int storedData;
public:
    // 请提供两份，一份有此构造函数，一份无此构造函数
	SimpleStorage(int x) { storedData = x; } 
	void set(int x) { storedData = x; }
	int get() { return storedData; }
};
```

## 2月15日 - 2月19日 (5 day)
调通关于结构体RLP编解码方面的开发内容

## 2月20日 - 2月23日 (4 day)
调通基础类型(无符号整型,布尔类型,有符号整数,字符串,float,double)，复合类型(子类,序列容器,关联容器) RLP方面的编解码开发内容

## 2月24日 - 2月25日 (2 day)
合约事件开发

## 2月26日 - 2月28日 (3 day)
文档撰写，开发交接以及扫尾工作。

******

# 2月11日日志

## 总体进度
5%

## 工作内容
* 跟文俊讨论client-sdk-js社区开发相关事项。
* 查看合约构造函数，确定在options里面传type来区分是一个solidity合约还是wasm合约，兼容以前写的solidity合约。
* 尝试根据wasm文件以及入参对数据进行RLP编码，暂未成功，与龙辉编码出来的不一致

## 其他
**李维成**提供了编译后的两个测试合约

**邓龙辉**给我解答了合约部署数据相关RLP编码规则

******

# 2月12日日志

## 总体进度
8%

## 工作内容
* 部署成功一个wasm合约，并使用签名与非签名的方式send, call调用成功。初步掌握wasm调用规则。

## 其他
**张军**协助我在我本地机器部署了一个节点并解答了相关问题

**邓龙辉**给我解答了合约部署数据相关RLP编码规则


******

# 2月13日日志

## 总体进度
10%

## 工作内容
* 将wasm abi 转化为 solidity abi。
* 使用web3.platon.Contract合约对象调通下面的合约。

```cpp
#include <platon/platon.hpp>

using namespace platon;

CONTRACT SimpleStorageInit : public Contract {
 public:
    ACTION void init(int i) {
        n_.self() = i;
    }

    ACTION void set(int i) {
        n_.self() = i;
    }

    CONST int get() {
        return n_.get();
    }

 private:
    //Int<"test"_n> n_;
    StorageType<"test"_n, int> n_;
};

PLATON_DISPATCH(SimpleStorageInit, (init)(set)(get));
```

用来测试的 wasm.js文件(在项目 client-sdk-js 根目录创建一个wasm.js文件，复制如下内容，使用node wasm.js即可执行脚本)：

```javascript
var Web3 = require("./packages/web3/src");
var RLP = require("rlp");
var fs = require("fs-extra");

(async () => {
    const binFilePath = './test/wasm/simple_storage_init.wasm';
    const abiFilePath = './test/wasm/simple_storage_init.abi.json';

    let bin = (await fs.readFile(binFilePath)).toString("hex");
    let abiStr = (await fs.readFile(abiFilePath)).toString();

    // 默认为undefined的不要管，程序会自动获取。
    var cfg = {
        provider: "http://192.168.0.105:6789", // 请更新成自己的 http 节点
        chainId: 100, // 请更新成自己的节点id
        privateKey: "0xa11859ce23effc663a9460e332ca09bd812acc390497f8dc7542b6938e13f8d7", // 请更新成自己的私钥(必须有十六进制前缀0x)
        address: "0x714de266a0effa39fcaca1442b927e5f1053eaa3", // 请更新成上面私钥对应的地址
        contractAddress: "0xa48558E299918d3bc9598D6ff44E6112fD7E7Cc7", // 合约地址
        gas: undefined,
        gasPrice: undefined,
        // 合约源文件 ./test/wasm/simple_storage_init.cpp
        simpleStorageInit: {
            bin: bin,
            abiStr: abiStr,
            txReceipt: undefined
        },
    };

    let web3 = new Web3(cfg.provider);
    let gasPrice = web3.utils.numberToHex(await web3.platon.getGasPrice());
    let gas = web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit - 1));

    let from = web3.platon.accounts.privateKeyToAccount(cfg.privateKey).address;
    let contract = new web3.platon.Contract(JSON.parse(cfg.simpleStorageInit.abiStr), { type: 1 }); // wasm type: 1入参
    let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
    let chainId = cfg.chainId;
    let num = parseInt(Math.random() * 100);
    let data = contract.deploy({
        data: cfg.simpleStorageInit.bin,
        arguments: [num]
    }).encodeABI();

    // 合约部署
    let tx = { gasPrice, gas, nonce, chainId, data };
    let signTx = await web3.platon.accounts.signTransaction(tx, cfg.privateKey);
    let ret = await web3.platon.sendSignedTransaction(signTx.rawTransaction);
    cfg.simpleStorageInit.txReceipt = ret;
    contract.options.address = ret.contractAddress; // 设置好合约地址

    // 测试一下构造函数入参有没有生效
    let getMethod = contract.methods["get"].apply(contract.methods, []);
    console.log("init num = ", num, ", get num = ", await getMethod.call({}));

    // 发送 set 交易(使用签名)
    num = parseInt(Math.random() * 100);
    data = contract.methods["set"].apply(contract.methods, [num]).encodeABI();
    nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(from));
    tx = { gasPrice, gas, nonce, chainId, data, to: contract.options.address };
    signTx = await web3.platon.accounts.signTransaction(tx, cfg.privateKey);
    ret = await web3.platon.sendSignedTransaction(signTx.rawTransaction);

    // 测试一下set没有生效
    console.log("set num = ", num, ", get num = ", await getMethod.call({}));

    // 发送 set 交易(使用解锁账号)
    num = parseInt(Math.random() * 100);
    data = contract.methods["set"].apply(contract.methods, [num]).encodeABI();
    await web3.platon.sendTransaction({
        from: cfg.address,
        to: contract.options.address,
        data
    });
    // 测试一下set没有生效
    console.log("set num = ", num, ", get num = ", await getMethod.call({}));
})()


```

## 其他

