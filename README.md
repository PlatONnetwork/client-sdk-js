## Web3.js 调用接口 

通过 web3.js 提供的web3对象与底层链进行交互。底层实现上，它通过 RPC 调用与本地节点通信。web3.js可以与任何暴露了RPC接口的PlatON节点连接。

### 准备工作

首先请确保本地成功安装了nodeJS环境，由于该项目使用了[lerna](https://github.com/lerna/lerna)管理工具来优化托管在git\npm上的多package代码库的工作流，所以你在安装之前确保已经全局安装了lerna包。**如果没有，执行命令`npm i lerna -g`进行全局安装。**

然后你就可以通过 npm 包管理工具或者 yarn 包管理工具将client-sdk-js引入到项目工程中，通过如下步骤：

- npm: `npm i PlatONnetwork/client-sdk-js`
- yarn: `yarn add PlatONnetwork/client-sdk-js`

然后需要创建web3的实例，设置一个provider。可参考如下代码：

```js
// in node.js
var Web3 = require('web3');

var web3 = new Web3('http://127.0.0.1:6789');
console.log(web3);
> {
    platon: ... ,
    utils: ...,
    ppos: ...,
    ...
}
```

成功引入后，现在可以使用web3的相关API了。


### 详细使用
#### web3.version

`web3.version`属性记录了web3容器对象的版本。

调用方法：

```js
Web3.version
web3.version
```

返回值：

`String`: 当前版本字符串

示例代码：

```js
web3.version;
> "0.8.0"
```

***

#### web3.modules

`web3.modules`属性返回一个包含所有子模块类的对象，可以用来
手工实例化这些子模块类。

调用方法：

```js
Web3.modules
web3.modules
```

返回值：

`Object`: 子模块列表:

*  `Platon` - Function: Platon模块类，用来与以太坊网络进行交互。参见web3.platon。
*  `Net` - Function: Net模块类，用来与网络属性进行交互。参见web3.platon.net。
*  `Personal` - Function: Personal模块类，用来与以太坊账户进行交互。参见web3.platon.personal。

示例代码：

```js
web3.modules
> {
    Platon: Platon function(provider),
    Net: Net function(provider),
    Personal: Personal function(provider)
}
```

***

#### web3.setProvider

`web3.setProvider()`方法用来修改指定模块的底层通讯服务提供器。

调用：

```
web3.setProvider(myProvider)
web3.platon.setProvider(myProvider)
...
```

注意：当在web3上直接调用`setProvider()`方法时，将为所有其他子模块设置服务提供器，例如web3.platon不受影响，因为该子模块始终使用独立的服务提供器。

参数：

`Object` - myProvider: 有效的服务提供器对象。

返回值：

`Boolean`

示例代码：

```js
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');
// 或者
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// 改变服务提供器
web3.setProvider('ws://localhost:8546');
// 或者
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
```

***

#### web3.providers

返回当前有效的通信服务提供器。

调用：

```
web3.providers
web3.platon.providers
...
```

返回值：

`Object`， 参见以下服务提供器对象:

*  Object - HttpProvider: HTTP服务提供器已经被弃用，因为它不支持订阅。
*  Object - WebsocketProvider:  Websocket服务提供器是用于传统的浏览器中的标准方法。

示例代码：

```js
var Web3 = require('web3');
// 使用指定的服务提供器（例如在Mist中）或实例化一个新的websocket提供器
var web3 = new Web3(Web3.givenProvider || 'ws://remotenode.com:8546');
// 或者
var web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://remotenode.com:8546'));
```

***

#### web3.givenProvider

在以太坊兼容的浏览器中使用web3.js时，`web3.givenProvider`属性将返回浏览器设置的原生
服务提供器，否则返回`null`。

调用：

```
web3.givenProvider
web3.platon.givenProvider
...
```

返回值：

`Object`: 浏览器设置好的提供器，或者null;

***

#### web3.currentProvider

`web3.currentProvider`属性返回当前在用的通信服务提供器，如果没有的话则返回`null`。

调用：

```
web3.currentProvider
web3.platon.currentProvider
...
```

返回值：

`Object`： 当前在用的服务提供器，或者null。

***

#### web3.BatchRequest

`web3.BatchRequest`类用来创建并执行批请求。

调用：

```
new web3.BatchRequest()
new web3.platon.BatchRequest()
```

参数：

无

返回值：

一个对象，具有如下方法：

*  `add(request)`: 将请求对象添加到批调用中
*  `execute()`: 执行批请求

示例代码：

```js
var contract = new web3.platon.Contract(abi, address);

var batch = new web3.BatchRequest();
batch.add(web3.platon.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
batch.add(contract.methods.balance(address).call.request({from: '0x0000000000000000000000000000000000000000'}, callback2));
batch.execute();
```

***

#### web3.platon.defaultAccount

`web3.platon.defaultAccount`属性记录了默认地址，在以下方法中如果没有指定`from`属性，
将使用该属性的值作为默认的`from`属性值。

*  web3.platon.sendTransaction()
*  web3.platon.call()
*  new web3.platon.Contract() -> myContract.methods.myMethod().call()
*  new web3.platon.Contract() -> myContract.methods.myMethod().send()

调用：

```
web3.platon.defaultAccount
```

属性：

`String` - 20 Bytes: 以太坊地址，你应当在节点或keystore中存有该地址的私钥。默认值为`undefined`

示例代码：

```js
web3.platon.defaultAccount;
> undefined

// set the default account
web3.platon.defaultAccount = '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe';
```

***

#### web3.platon.defaultBlock

`web3.platon.defaultBlock`属性记录默认块，默认值为`latest`。该属性值用于以下方法调用：

*  web3.platon.getBalance()
*  web3.platon.getCode()
*  web3.platon.getTransactionCount()
*  web3.platon.getStorageAt()
*  web3.platon.call()
*  new web3.platon.Contract() -> myContract.methods.myMethod().call()

在以上方法中，可以传入`defaultBlock`参数来覆盖该属性值。

调用：

```
web3.platon.defaultBlock
```

属性：

默认块参数的值为以下列表中之一：

*  Number: 一个具体的块编号
*  "genesis" - String: 创世块
*  "latest" - String: 最后一个块，即当前的链头块
*  "pending" - String: 当前挖掘中的块，其中包含挂起的交易

默认值为"latest"

示例代码：

```js
web3.platon.defaultBlock;
> "latest"

// 设置默认块属性
web3.platon.defaultBlock = 231;
```

***

#### web3.platon.getProtocolVersion

返回节点旳以太坊协议版本。

调用：

```
web3.platon.getProtocolVersion([callback])
```

返回值：

一个Promise对象，其解析值为协议版本字符串。

示例代码：

```js
web3.platon.getProtocolVersion().then(console.log);
> "63"
```

***

#### web3.platon.isSyncing

`web3.platon.isSyncing()`方法用来检查节点当前是否已经与网络同步。

调用：

```
web3.platon.isSyncing([callback])
```

返回值：

一个Promise对象，其解析值为`Object`或`Boolean`。如果节点尚未与网络同步，
则返回false，否则返回一个同步对象，具有以下属性：

*  startingBlock - Number: 同步起始块编号
*  currentBlock - Number: 当前已同步块编号
*  highestBlock - Number: 预估的目标同步块编号
*  knownStates - Number: 预估的要下载的状态
*  pulledStates - Number: 已经下载的状态

示例代码：

```js
web3.platon.isSyncing().then(console.log);
> {
    startingBlock: 100,
    currentBlock: 312,
    highestBlock: 512,
    knownStates: 234566,
    pulledStates: 123455
}
```

***

#### web3.platon.getGasPrice

`web3.platon.getGasPrice()`方法用来获取当前gas价格，该价格由最近的若干块
的gas价格中值决定。

调用：

```
web3.platon.getGasPrice([callback])
```

返回值：

一个Promise对象，其解析值为表示当前gas价格的字符串，单位为wei。

示例代码：

```js
web3.platon.getGasPrice().then(console.log);
> "20000000000"
```

***

#### web3.platon.getAccounts

`web3.platon.getAccounts()`方法返回当前节点控制的账户列表。

调用：

```
web3.platon.getAccounts([callback])
```

返回值

一个Promise对象，其解析值为账户地址数组。

示例代码：

```js
web3.platon.getAccounts().then(console.log);
> ["0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "0xDCc6960376d6C6dEa93647383FfB245CfCed97Cf"]
```

***

#### web3.platon.getBlockNumber

`web3.platon.getBlockNumber()`方法返回当前块编号。

调用：

```
web3.platon.getBlockNumber([callback])
```

返回值：

一个Promise对象，其解析值为最近一个块的编号，Number类型。

示例代码：

```js
web3.platon.getBlockNumber().then(console.log);
> 2744
```

***

#### web3.platon.getBalance

`web3.platon.getBalance()`方法用来获取指定块中特定账户地址的余额。

调用：

```
web3.platon.getBalance(address [, defaultBlock] [, callback])
```

参数：

*  `address`：String - 要检查余额的账户地址
*  `defaultBlock`：Number|String - 可选，使用该参数覆盖web3.platon.defaultBlock属性值
*  `callback`：Function - 可选的回调函数，该回调的第一个参数为error对象，第二个参数为结果值

返回值：

一个Promise对象，其解析值为指定账户地址的余额字符串，以wei为单位。

示例代码：

```js
web3.platon.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
.then(console.log);
> "1000000000000"
```

***

#### web3.platon.getStorageAt

`web3.platon.getStorageAt()`方法返回一个以太坊地址的指定位置存储内容。

调用：

```
web3.platon.getStorageAt(address, position [, defaultBlock] [, callback])
```

参数：

*  `address`：String - 要读取的地址
*  `position`：Number - 存储中的索引编号
*  `defaultBlock`：Number|String - 可选，使用该参数覆盖web3.platon.defaultBlock属性值
*  `callback`：Function - 可选的回调函数, 其第一个参数为错误对象，第二个参数为结果。

返回值：

一个Promise对象，其解析值为存储中指定位置的内容。

示例代码：

```js
web3.platon.getStorageAt("0x407d73d8a49eeb85d32cf465507dd71d507100c1", 0)
.then(console.log);
> "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"
```

***

#### web3.platon.getCode

`web3.platon.getCode()`方法返回指定以太坊地址处的代码。

调用：

```
web3.platon.getCode(address [, defaultBlock] [, callback])
```

参数：

*  `address`：String - 要读取代码的地址
*  `defaultBlock`：Number|String - 可选，使用该参数覆盖web3.platon.defaultBlock属性值
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

一个Promise对象，其解析值为指定地址处的代码字符串。

示例代码：

```js
web3.platon.getCode("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8")
.then(console.log);
> "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
```

***

#### web3.platon.getBlock

`web3.platon.getBlock()`方法返回指定块编号或块哈希对应的块。

调用：

```
web3.platon.getBlock(blockHashOrBlockNumber [, returnTransactionObjects] [, callback])
```

参数：

*  `blockHashOrBlockNumber`：String|Number - 块编号或块哈希值，或者使用以下字符串："genesis"、"latest" 或 "pending" 。
*  `returnTransactionObjects`：Boolean -  可选，默认值为false。当设置为true时,返回块中将包括所有交易详情，否则仅返回交易哈希。
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果。

返回值：

一个Promise对象，其解析值为满足搜索条件的块对象，具有以下字段：

*  number - Number: 块编号，处于pending状态的块为null
*  hash 32 Bytes - String: 块哈希，处于pending状态的块为null
*  parentHash 32 Bytes - String: 父块哈希
*  nonce 8 Bytes - String: 生成的proof-of-work的哈希，处于pending状态的块为null
*  sha3Uncles 32 Bytes - String: 块中叔伯数据的SHA3值
*  logsBloom 256 Bytes - String: 块中日志的bloom filter，处于pending状态的块为null
*  transactionsRoot 32 Bytes - String: 块中的交易树根节点
*  stateRoot 32 Bytes - String: 块中的最终状态树根节点
*  miner - String: 接收奖励的矿工地址
*  difficulty - String: 该块的难度值
*  totalDifficulty - String: 截至该块的全链总难度值
*  extraData - String: 块 “extra data” 字段
*  size - Number: 字节为单位的块大小
*  gasLimit - Number: 该块允许的最大gas值
*  gasUsed - Number: 该块中所有交易使用的gas总量
*  timestamp - Number: 出块的unix时间戳
*  transactions - Array: 交易对象数组，或者32字节长的交易哈希值，取决于returnTransactionObjects的设置
*  uncles - Array: 叔伯块哈希值数组

示例代码：

```js
web3.platon.getBlock(3150)
.then(console.log);

> {
    "number": 3,
    "hash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
    "parentHash": "0x2302e1c0b972d00932deb5dab9eb2982f570597d9d42504c05d9c2147eaf9c88",
    "nonce": "0xfb6e1a62d119228b",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "transactionsRoot": "0x3a1b03875115b79539e5bd33fb00d8f7b7cd61929d5a3c574f507b8acf415bee",
    "stateRoot": "0xf1133199d44695dfa8fd1bcfe424d82854b5cebef75bddd7e40ea94cda515bcb",
    "miner": "0x8888f1f195afa192cfee860698584c030f4c9db1",
    "difficulty": '21345678965432',
    "totalDifficulty": '324567845321',
    "size": 616,
    "extraData": "0x",
    "gasLimit": 3141592,
    "gasUsed": 21662,
    "timestamp": 1429287689,
    "transactions": [
        "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b"
    ],
    "uncles": []
}
```

***

#### web3.platon.getBlockTransactionCount

`web3.platon.getBlockTransactionCount()`方法返回指定块中的交易数量。

调用：

```
web3.platon.getBlockTransactionCount(blockHashOrBlockNumber [, callback])
```

参数：

*  `blockHashOrBlockNumber`：String|Number - 块编号或块的哈希值，或者使用以下字符串："genesis"、"latest" 或 "pending" 来指定块
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为执行结果。

返回值：

一个Promise对象，其解析值为指定块中的交易数量，Number类型。

示例代码：

```js
web3.platon.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
.then(console.log);
> 1
```

***

#### web3.platon.getTransaction

`web3.platon.getTransaction()`方法返回具有指定哈希值的交易对象。

调用：

```
web3.platon.getTransaction(transactionHash [, callback])
```

参数：

*  `transactionHash`：String - 交易的哈希值
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为返回结果。

返回值：

一个Promise对象，其解析值为具有给定哈希值的交易对象，该对象具有如下字段：

*  hash 32 Bytes - String: 交易的哈希值
*  nonce - Number: 交易发送方在此交易之前产生的交易数量
*  blockHash 32 Bytes - String: 交易所在块的哈希值。如果交易处于pending状态，则该值为null
*  blockNumber - Number: 交易所在块的编号，如果交易处于pending状态，则该值为null
*  transactionIndex - Number: 交易在块中的索引位置，如果交易处于pending状态，则该值为null
*  from - String: 交易发送方的地址
*  to - String: 交易接收方的地址。对于创建合约的交易，该值为null
*  value - String: 以wei为单位的转账金额
*  gasPrice - String: 发送方承诺的gas价格，以wei为单位
*  gas - Number: 发送方提供的gas用量
*  input - String: 随交易发送的数据

示例代码：

```js
web3.platon.getTransaction('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b§234')
.then(console.log);
> {
    "hash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
    "nonce": 2,
    "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
    "blockNumber": 3,
    "transactionIndex": 0,
    "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
    "to": "0x6295ee1b4f6dd65047762f924ecd367c17eabf8f",
    "value": '123450000000000000',
    "gas": 314159,
    "gasPrice": '2000000000000',
    "input": "0x57cb2fc4"
}
```

***

#### web3.platon.getTransactionFromBlock

`web3.platon.getTransactionFromBlock()`方法返回指定块中特定索引号的交易对象。

调用：

```
getTransactionFromBlock(hashStringOrNumber, indexNumber [, callback])
```

参数：

*  `hashStringOrNumber`：String - 块编号或块的哈希值，或者使用以下字符串："genesis、"latest" 或 "pending" 来指定块
*  `indexNumber`：Number - 交易索引位置
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果交易对象

返回值：

一个Promise对象，其解析值为交易对象，该对象具体内容描述参见web3.platon.getTransaction()

示例代码：

```js
var transaction = web3.platon.getTransactionFromBlock('0x4534534534', 2)
.then(console.log);
> // see web3.platon.getTransaction
```

***

#### web3.platon.getTransactionReceipt

`web3.platon.getTransactionReceipt()`方法返回指定交易的收据对象。
如果交易处于pending状态，则返回null。

调用：

```
web3.platon.getTransactionReceipt(hash [, callback])
```

参数：

*  `hash`：String - 交易的哈希值
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

一个Promise对象，其解析值为交易的收据对象或者null。收据对象具有如下字段：

*  `status` - Boolean: 成功的交易返回true，如果EVM回滚了该交易则返回false
*  `blockHash` 32 Bytes - String: 交易所在块的哈希值
*  `blockNumber` - Number: 交易所在块的编号
*  `transactionHash` 32 Bytes - String: 交易的哈希值
*  `transactionIndex` - Number: 交易在块中的索引位置
*  `from` - String: 交易发送方的地址
*  `to` - String: 交易接收方的地址，对于创建合约的交易，该值为null
*  `contractAddress` - String: 对于创建合约的交易，该值为创建的合约地址，否则为null
*  `cumulativeGasUsed` - Number: 该交易执行时所在块的gas累计总用量
*  `gasUsed`- Number: 该交易的gas总量
*  `logs` - Array: 该交易产生的日志对象数组

示例代码：

```js
var receipt = web3.platon.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b')
.then(console.log);
> {
  "status": true,
  "transactionHash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "transactionIndex": 0,
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "blockNumber": 3,
  "contractAddress": "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
  "cumulativeGasUsed": 314159,
  "gasUsed": 30234,
  "logs": [{
         // logs as returned by getPastLogs, etc.
     }, ...]
}
```

***

#### web3.platon.getTransactionCount

`web3.platon.getTransactionCount()`方法返回指定地址发出的交易数量。

调用：

```
web3.platon.getTransactionCount(address [, defaultBlock] [, callback])
```

参数：

*  `address`：String - 要查询的账户地址
*  `defaultBlock`：Number|String - 可选，设置该参数来覆盖web3.platon.defaultBlock属性值
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

一个Promise对象，其解析值为指定地址发出的交易数量。

示例代码：

```js
web3.platon.getTransactionCount("0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe")
.then(console.log);
> 1
```

***

#### web3.platon.sendTransaction

`web3.platon.sendTransaction()`方法向以太坊网络提交一个交易。

调用：

```
web3.platon.sendTransaction(transactionObject [, callback])
```

参数：

*  `transactionObject`：Object - 要发送的交易对象，包含以下字段：
   *  from - String|Number: 交易发送方账户地址，不设置该字段的话，则使用web3.platon.defaultAccount属性值。可设置为一个地址或本地钱包web3.platon.accounts.wallet中的索引序号
   *  to - String: 可选，消息的目标地址，对于合约创建交易该字段为null
   *  value - Number|String|BN|BigNumber: (optional) The value transferred for the transaction in wei, also the endowment if it’s a contract-creation transaction.
   *  gas - Number: 可选，默认值：待定，用于交易的gas总量，未用完的gas会退还
   *  gasPrice - Number|String|BN|BigNumber: 可选，该交易的gas价格，单位为wei，默认值为web3.platon.gasPrice属性值
   *  data - String: 可选，可以是包含合约方法数据的ABI字符串，或者是合约创建交易中的初始化代码
   *  nonce - Number: 可选，使用该字段覆盖使用相同nonce值的挂起交易
*  callback - Function: 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

`web3.platon.sendTransaction()`方法的返回值是32字节长的交易哈希值。

PromiEvent: 一个整合事件发生器的Promise对象，将在收到交易收据后得到解析。

*  "transactionHash" 返回String: 在交易发出并得到有效的交易哈希值后立刻触发
*  "receipt" 返回Object: 当交易收据有效后立刻触发
*  "confirmation" 返回Number, Object: 在每次确认后立刻触发，最多12次确认。确认编号为第一个参数，收据为第二个参数。从0号确认开始触发
*  "error" 返回Error对象: 在发送交易的过程中如果出现错误则立刻触发。如果是out of gas错误，则传入第二个参数为交易收据

示例代码：

```js
// compiled solidity source code using https://remix.ethereum.org
var code = "603d80600c6000396000f3007c01000000000000000000000000000000000000000000000000000000006000350463c6888fa18114602d57005b6007600435028060005260206000f3";

// 使用回调函数
web3.platon.sendTransaction({
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    data: code // deploying a contracrt
}, function(error, hash){
    ...
});

// 使用promise
web3.platon.sendTransaction({
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
    value: '1000000000000000'
})
.then(function(receipt){
    ...
});


// 使用事件发生器
web3.platon.sendTransaction({
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
    value: '1000000000000000'
})
.on('transactionHash', function(hash){
    ...
})
.on('receipt', function(receipt){
    ...
})
.on('confirmation', function(confirmationNumber, receipt){ ... })
.on('error', console.error); // If a out of gas error, the second parameter is the receipt.
```

***

#### web3.platon.sendSignedTransaction

`web3.platon.sendSignedTransaction()`方法用来发送已经签名的交易，例如，可以使用`web3.platon.accounts.signTransaction()`
方法进行签名。

调用：

```
web3.platon.sendSignedTransaction(signedTransactionData [, callback])
```

参数：

*  `signedTransactionData`：String - 16进制格式的签名交易数据
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

PromiEvent: 一个整合了事件发生器的Promise对象。当交易收据生效后得到解析。

示例代码：

```js
var Tx = require('ethereumjs-tx');
var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')

var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}

var tx = new Tx(rawTx);
tx.sign(privateKey);

var serializedTx = tx.serialize();

// console.log(serializedTx.toString('hex'));
// 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

web3.platon.sendSignedTransaction('0x' + serializedTx.toString('hex'))
.on('receipt', console.log);

> // see platon.getTransactionReceipt() for details
```

***

#### web3.platon.sign

`web3.platon.sign()`方法使用指定的账户对数据进行签名，该账户必须先解锁。

调用：

```
web3.platon.sign(dataToSign, address [, callback])
```

参数：

*  `dataToSign`：String - 待签名的数据。对于字符串将首先使用`web3.utils.utf8ToHex()`方法将其转换为16进制
*  `address`：String|Number - 用来签名的账户地址。或者本地钱包web3.platon.accounts.wallet中的地址或其序号
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

一个Promise对象，其解析值为签名结果字符串。

示例代码：

```js
web3.platon.sign("Hello world", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe")
.then(console.log);
> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"

// the below is the same
web3.platon.sign(web3.utils.utf8ToHex("Hello world"), "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe")
.then(console.log);
> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
```

***

#### web3.platon.signTransaction

使用`web3.platon.signTransaction()`方法对交易进行签名，用来签名的账户地址需要首先解锁。

调用：

```
web3.platon.signTransaction(transactionObject, address [, callback])
```

参数：

*  `transactionObject`：Object - 要签名的交易数据
*  `address`：String - 用于签名的账户地址
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

一个Promise对象，其解析值为RLP编码的交易对象。该对象的raw属性可以用来通过`web3.platon.sendSignedTransaction()`
方法来发送交易。

示例代码：

```js
web3.platon.signTransaction({
    from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0",
    gasPrice: "20000000000",
    gas: "21000",
    to: '0x3535353535353535353535353535353535353535',
    value: "1000000000000000000",
    data: ""
}).then(console.log);
> {
    raw: '0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88da07e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
    tx: {
        nonce: '0x0',
        gasPrice: '0x4a817c800',
        gas: '0x5208',
        to: '0x3535353535353535353535353535353535353535',
        value: '0xde0b6b3a7640000',
        input: '0x',
        v: '0x25',
        r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
        s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
        hash: '0xda3be87732110de6c1354c83770aae630ede9ac308d9f7b399ecfba23d923384'
    }
}
```

***

#### web3.platon.estimateGas

`web3.platon.estimateGas()`方法通过执行一个消息调用来估算交易的gas用量。

调用：

```
web3.platon.estimateGas(callObject [, callback])
```

参数：

*  `callObject`：Object - 交易对象，其from属性可选
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

一个Promise对象，其解析值为模拟调用的gas用量。

示例代码：

```js
web3.platon.estimateGas({
    to: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
})
.then(console.log);
> "0x0000000000000000000000000000000000000000000000000000000000000015"
```

***

#### web3.platon.getPastLogs

`web3.platon.getPastLogs()`方法根据指定的选项返回历史日志。

调用：

```
web3.platon.getPastLogs(options [, callback])
```

参数：

*  `options`：Object - 过滤器对象，包含如下字段：
   *  fromBlock - Number|String: The number of the earliest block ("latest" may be given to mean the most recent and "pending" currently mining, block). By default "latest".
   *  toBlock - Number|String: The number of the latest block ("latest" may be given to mean the most recent and "pending" currently mining, block). By default "latest".
   *  address - String|Array: An address or a list of addresses to only get logs from particular account(s).
   *  topics - Array: An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x12...']. You can also pass an array for each topic with options for that topic e.g. [null, ['option1', 'option2']]

返回值：

一个Promise对象，其解析值为日志对象数组。

数组中的事件对象结构如下：

*  address - String: 事件发生源地址
*  data - String: 包含未索引的日志参数
*  topics - Array: 包含最多4个32字节主题的数组，主题1-3包含日志的索引参数
*  logIndex - Number: 事件在块中的索引位置
*  transactionIndex - Number: 包含事件的交易的索引位置
*  transactionHash 32 Bytes - String: 包含事件的交易的哈希值
*  blockHash 32 Bytes - String: 包含事件的块的哈希值，如果处于pending状态，则为null
*  blockNumber - Number: 包含事件的块编号，处于pending状态时该字段为null

示例代码：

```js
web3.platon.getPastLogs({
    address: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
    topics: ["0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"]
})
.then(console.log);

> [{
    data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
    logIndex: 0,
    transactionIndex: 0,
    transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
    blockNumber: 1234,
    address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
},{...}]
```

***

#### web3.platon.subscribe

使用`web3.platon.subscribe()`方法来订阅区块链上的指定事件。

调用：

```
web3.platon.subscribe(type [, options] [, callback]);
```

参数：

*  `type`：String - 订阅类型
*  `options`：Mixed - 可选的额外参数，依赖于订阅类型
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

EventEmitter - 订阅实例对象，具有以下字段：

*  subscription.id: 订阅id编号，用于标识一个订阅以及进行后续的取消订阅操作
*  subscription.subscribe([callback]): 可用于使用相同的参数进行再次订阅
*  subscription.unsubscribe([callback]): 取消订阅，如果成功取消的话，在回调函数中返回true
*  subscription.arguments: 订阅参数，当重新订阅时使用
*  on("data") 返回 Object: 每次有新的日志时都触发该事件，参数为日志对象
*  on("changed") 返回 Object: 每次有日志从区块链上移除时触发该事件，被移除的日志对象将添加额外的属性："removed: true"
*  on("error") 返回 Object: 当订阅中发生错误时，触发此事件

通知返回值：

Mixed - 取决于具体的订阅类型

示例代码：

```js
var subscription = web3.platon.subscribe('logs', {
    address: '0x123456..',
    topics: ['0x12345...']
}, function(error, result){
    if (!error)
        console.log(log);
});

// unsubscribes the subscription
subscription.unsubscribe(function(error, success){
    if(success)
        console.log('Successfully unsubscribed!');
});
```

***

#### web3.platon.clearSubscriptions

`web3.platon.clearSubscriptions()`方法用来复位订阅状态。注意该方法不能
复位其他包的订阅，例如web3-shh，因为这些包有自己的请求管理器。

调用：

```
web3.platon.clearSubscriptions(flag)
```

参数:

*  `flag`：Boolean -  值为true则表示保持同步订阅

返回值：

`Boolean`：复位成功返回true，否则返回false

示例代码：

```js
web3.platon.subscribe('logs', {} ,function(){ ... });

...

web3.platon.clearSubscriptions();
```

***

#### web3.platon.subscribe("pendingTransactions")

参数`pendingTransactions`表示订阅处于pending状态的交易。

调用：

```
web3.platon.subscribe('pendingTransactions' [, callback]);
```

参数：

*  `type`：String - "pendingTransactions"，订阅类型
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

`EventEmitter`: 订阅实例对象，是一个事件发生器，定义有以下事件：

*  "data" 返回 Object: 当接收到pending状态的交易时触发
*  "error" 返回 Object: 当订阅中发生错误时触发

返回对象的结构，参见web3.platon.getTransaction()的返回值。

通知返回值：

*  Object|Null - 第一个参数是一个错误对象，如果订阅成功则为null
*  Object - 块头对象

示例代码：

```js
var subscription = web3.platon.subscribe('pendingTransactions', function(error, result){
    if (!error)
        console.log(result);
})
.on("data", function(transaction){
    console.log(transaction);
});

// unsubscribes the subscription
subscription.unsubscribe(function(error, success){
    if(success)
        console.log('Successfully unsubscribed!');
});
```

***

#### web3.platon.subscribe('newBlockHeaders')

使用`newBlockHeaders`参数订阅新的区块头生成事件。可用做检查区块链上变化的计时器。

调用：

```
web3.platon.subscribe('newBlockHeaders' [, callback]);
```

参数：

*  `type`：String - "newBlockHeaders", 订阅类型
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

EventEmitter: 订阅对象实例，是一个事件发生器，定义有如下事件：

*  "data" 返回 Object: 当收到新的区块头时触发
*  "error" 返回 Object: 当订阅中出现错误时触发

返回的区块头对象结构如下：

*  number - Number: 区块编号，对于pending的块该值为null
*  hash 32 Bytes - String: 块的哈希值，挂起的块该值为null
*  parentHash 32 Bytes - String: 父区块的哈希值
*  nonce 8 Bytes - String: 生成的proof-of-work的哈希值。挂起块该值为null、
*  sha3Uncles 32 Bytes - String: 块中叔伯数据的SHA3值
*  logsBloom 256 Bytes - String: 块日志的bloom filter，块处于挂起状态时该值为null
*  transactionsRoot 32 Bytes - String: 块交易树的根节点
*  stateRoot 32 Bytes - String: 块状态树的根节点
*  receiptRoot 32 Bytes - String: 收据根节点
*  miner - String: 接收挖矿奖励的矿工地址
*  extraData - String: 区块的额外数据字段
*  gasLimit - Number: 该块允许的最大gas用量
*  gasUsed - Number: 该块中所有交易使用的gas总用量
*  timestamp - Number: 出块的unix时间戳

通知返回值：

*  Object|Null - 如果订阅失败，则该参数为错误对象，否则为null
*  Object - 区块头对象

示例代码：

```js
var subscription = web3.platon.subscribe('newBlockHeaders', function(error, result){
    if (error)
        console.log(error);
})
.on("data", function(blockHeader){
});

// unsubscribes the subscription
subscription.unsubscribe(function(error, success){
    if(success)
        console.log('Successfully unsubscribed!');
});
```

***

#### web3.platon.subscribe('syncing')

使用`syncing`参数订阅同步事件。当节点同步时将返回一个同步对象，否则返回false。

调用：

```
web3.platon.subscribe('syncing' [, callback]);
```

参数：

*  `type`：String - "syncing", 订阅类型
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

EventEmitter: 订阅对象实例，是一个事件发生器，定义有如下事件：

*  "data" 返回 Object: 收到同步对象时触发
*  "changed" 返回 Object: 当节点从同步状态转换为非同步状态时触发
*  "error" 返回 Object: 当订阅中出现错误时触发

要了解返回的事件对象的结构，可以查看`web3.platon.isSyncing()`方法的返回值。

通知返回值：

*  Object|Null - 当订阅失败时，该值为错误对象，否则为null
*  Object|Boolean - 同步对象

示例代码：

```js
var subscription = web3.platon.subscribe('syncing', function(error, sync){
    if (!error)
        console.log(sync);
})
.on("data", function(sync){
    // show some syncing stats
})
.on("changed", function(isSyncing){
    if(isSyncing) {
        // stop app operation
    } else {
        // regain app operation
    }
});

// unsubscribes the subscription
subscription.unsubscribe(function(error, success){
    if(success)
        console.log('Successfully unsubscribed!');
});
```

***

#### web3.platon.subscribe('logs')

使用`logs`参数订阅日志，并且可以指定条件进行过滤。

调用：

```
web3.platon.subscribe('logs', options [, callback]);
```

参数：

*  `"logs"` ：String, 订阅类型
*  `options`：Object - 订阅选项，该对象包含如下字段：
   *  fromBlock - Number: 最早块的编号，默认值为null
   *  address - String|Array: 地址或地址列表，仅订阅来自这些账户地址的日志
   *  topics - Array: 主题数组，仅订阅日志中包含这些主题的日志。
*  `callback` - Function: 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

EventEmitter: 订阅实例对象，是一个事件发生器，定义有如下事件：

*  "data" 返回 Object: 接收到新日志时触发，参数为日志对象
*  "changed" 返回 Object: 日志从链上移除时触发，该日志同时添加属性 "removed: true"
*  "error" 返回 Object: 当订阅中出现错误时触发

要了解返回的事件对象的结果，可查阅`web3.platon.getPastEvents()`方法的返回值。

通知返回值：

*  Object|Null - 订阅失败时该值为错误对象，否则为null
*  Object - 日志对象，类似于`web3.platon.getPastEvents()`方法的返回值

示例代码：

```js
var subscription = web3.platon.subscribe('logs', {
    address: '0x123456..',
    topics: ['0x12345...']
}, function(error, result){
    if (!error)
        console.log(result);
})
.on("data", function(log){
    console.log(log);
})
.on("changed", function(log){
});

// unsubscribes the subscription
subscription.unsubscribe(function(error, success){
    if(success)
        console.log('Successfully unsubscribed!');
});
```

***

#### web3.platon.Contract

`web3.platon.Contract`类简化了与以太坊区块链上智能合约的交互。创建合约对象时，
只需指定相应智能合约的json接口，web3就可以自动地将所有的调用转换为底层
基于RPC的ABI调用。

通过web3的封装，与智能合约的交互就像与JavaScript对象一样简单。

实例化一个新的合约对象：

```
new web3.platon.Contract(jsonInterface[, address][, options])
```

参数：

*  jsonInterface - Object: 要实例化的合约的json接口
*  address - String: 可选，要调用的合约的地址，也可以在之后使用 myContract.options.address = '0x1234..' 来指定该地址
*  options - Object : 可选，合约的配置对象，其中某些字段用作调用和交易的回调：
   *  from - String: 交易发送方地址
   *  gasPrice - String: 用于交易的gas价格，单位：wei
   *  gas - Number: 交易可用的最大gas量，即gas limit
   *  data - String: 合约的字节码，部署合约时需要

返回值：

`Object`: The contract instance with all its methods and events.

示例代码：

```js
var myContract = new web3.platon.Contract([...], '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', {
    from: '0x1234567890123456789012345678901234567891', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
```

***

#### options合约实例的选项

合约实例的可选配置对象。当发送交易时，其from、gas和gasPrice被用作回调值。

调用：

```
myContract.options
```

`options`属性对象具有以下字段：

*  address - String: 合约的部署地址
*  jsonInterface - Array: 合约的json接口
*  data - String: 合约的字节码，合约部署时会用到
*  from - String: 合约发送方账户地址
*  gasPrice - String: 用于交易的gas价格，单位：wei
*  gas - Number: 交易的gas用量上限，即gas limit

示例代码：

```js
myContract.options;
> {
    address: '0x1234567890123456789012345678901234567891',
    jsonInterface: [...],
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    gasPrice: '10000000000000',
    gas: 1000000
}

myContract.options.from = '0x1234567890123456789012345678901234567891'; // default from address
myContract.options.gasPrice = '20000000000000'; // default gas price in wei
myContract.options.gas = 5000000; // provide as fallback always 5M gas
```

***

#### options.address - 合约地址

用于合约实例的地址，保存。web3.js从这个合约生成的所有交易，其to字段的值都是该地址。
当设置该选项时，web3.js将以小写形式保存。

调用：

```
myContract.options.address
```

属性：

`address` - String|null: 合约实例对象的地址，如果未设置的话则为null

示例代码：

```js
myContract.options.address;
> '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'

// 设置一个新地址
myContract.options.address = '0x1234FFDD...';
```

***

#### options.jsonInterface - 合约JSON接口

`jsonInterface`配置项基于合约的ABI信息生成。

调用：

```
myContract.options.jsonInterface
```

属性：

`jsonInterface` - Array: 合约的json接口。重新设置该属性将重新生成合约实例的方法和事件。

示例代码：

```js
myContract.options.jsonInterface;
> [{
    "type":"function",
    "name":"foo",
    "inputs": [{"name":"a","type":"uint256"}],
    "outputs": [{"name":"b","type":"address"}]
},{
    "type":"event",
    "name":"Event"
    "inputs": [{"name":"a","type":"uint256","indexed":true},{"name":"b","type":"bytes32","indexed":false}],
}]

// 设置一个新的接口
myContract.options.jsonInterface = [...];
```

***

#### deploy - 部署合约

调用合约的`deploy()`方法将其部署到区块链上。其返回的Promise对象
将在成功部署后解析为新的合约实例。

调用：

```
myContract.deploy(options)
```

参数：

`options` - Object: 用于部署的配置选项，包含以下字段：

*  data - String: 合约的字节码
*  arguments - Array : 可选，在部署时将传入合约的构造函数

返回值：

`Object`: 交易对象，包含以下字段：

*  `arguments`: Array - 之前传入方法的参数，可修改
*  `send`: Function - 用来部署合约，其返回的promise对象将解析为新的合约实例，而非交易收据！
*  `estimateGas`: Function -  用来估算用于部署的gas用量
*  `encodeABI`: Function - 用来编码部署的ABI数据，即合约数据 + 构造函数参数

示例代码：

```js
myContract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
})
.send({
    from: '0x1234567890123456789012345678901234567891',
    gas: 1500000,
    gasPrice: '30000000000000'
}, function(error, transactionHash){ ... })
.on('error', function(error){ ... })
.on('transactionHash', function(transactionHash){ ... })
.on('receipt', function(receipt){
   console.log(receipt.contractAddress) // 收据中包含了新的合约地址
})
.on('confirmation', function(confirmationNumber, receipt){ ... })
.then(function(newContractInstance){
    console.log(newContractInstance.options.address) // 新地址的合约实例
});


// data是合约自身的一个可选配置项
myContract.options.data = '0x12345...';

myContract.deploy({
    arguments: [123, 'My String']
})
.send({
    from: '0x1234567890123456789012345678901234567891',
    gas: 1500000,
    gasPrice: '30000000000000'
})
.then(function(newContractInstance){
    console.log(newContractInstance.options.address) // instance with the new contract address
});


// 编码
myContract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
})
.encodeABI();
> '0x12345...0000012345678765432'


// 估算gas
myContract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
})
.estimateGas(function(err, gas){
    console.log(gas);
});
```

***

#### methods - 为合约方法创建交易

为指定的合约方法创建一个交易对象，以便使用该交易对象进行调用、发送或估算gas。

调用：

```
myContract.methods.myMethod([param1[, param2[, ...]]])
```

可以使用以下语法获得指定方法的交易对象：

*  名称: myContract.methods.myMethod(123)
*  带参名称: myContract.methods['myMethod(uint256)'](123)
*  签名: myContract.methods['0x58cf5f10'](123)

这样就可以支持从javascript合约对象调用同名但参数不同的合约方法。

参数：

参数取决于在JSON接口中定义的合约方法

返回值：

Object: 交易对象，包含以下字段：

*  `arguments`: Array - 之前传入方法的参数，可修改
*  `call`: Function -  用来调用只读的合约方法，在EVM直接执行而不必发出交易，因此不会改变合约的状态
*  `send`: Function -  用来向合约发送交易并执行方法，因此可以改变合约的状态
*  `estimateGas`: Function - 用来估算方法在链上执行时的gas用量
*  `encodeABI`: Function -  用来为合约方法进行ABI编码。

示例代码：

```js
// 调用合约方法
myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'}, function(error, result){
    ...
});

// 发送交易，使用Promise对象获取返回结果
myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
.then(function(receipt){
    // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
});

// 发送交易，使用事件获取返回结果
myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
.on('transactionHash', function(hash){
    ...
})
.on('receipt', function(receipt){
    ...
})
.on('confirmation', function(confirmationNumber, receipt){
    ...
})
.on('error', console.error);
```

***

#### call - 调用合约方法

调用合约的只读方法，并在EVM中直接执行方法，不需要发送任何交易。因此不会改变合约的状态。

调用：

```
myContract.methods.myMethod([param1[, param2[, ...]]]).call(options[, callback])
```

参数：

*  `options` - Object : 选项，包含如下字段：
   *  `from` - String (optional): The address the call “transaction” should be made from.
   *  gasPrice - String (optional): The gas price in wei to use for this call “transaction”.
   *  gas - Number (optional): The maximum gas provided for this call “transaction” (gas limit).
*  `callback` - Function : 可选的回调函数，其第二个参数为合约方法的执行结果，第一个参数为错误对象

返回值：

一个Promise对象，其解析值为合约方法的返回值，Mixed类型。如果合约方法返回多个值，则解析值为一个
对象。

示例代码：

```js
// 使用回调函数接收合约方法执行结果
myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'}, function(error, result){
    ...
});

// 使用Promise接收合约方法执行结果
myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
.then(function(result){
    ...
});
```

下面合约中的方法返回多个值：

```
// Solidity
contract MyContract {
    function myFunction() returns(uint256 myNumber, string myString) {
        return (23456, "Hello!%");
    }
}
```

那么在web3.js中，`call`方法的返回值将是一个对象，即使用返回变量名作为键，
也使用索引作为键：

```
// web3.js
var MyContract = new web3.platon.contract(abi, address);
MyContract.methods.myFunction().call()
.then(console.log);
> Result {
    myNumber: '23456',
    myString: 'Hello!%',
    0: '23456', // these are here as fallbacks if the name is not know or given
    1: 'Hello!%'
}
```

下面合约中的方法返回单个值：

```
// Solidity
contract MyContract {
    function myFunction() returns(string myString) {
        return "Hello!%";
    }
}
```

那么在web3.js中，`call`方法也将返回单个值：

```
// web3.js
var MyContract = new web3.platon.contract(abi, address);
MyContract.methods.myFunction().call()
.then(console.log);
> "Hello!%"
```

***

#### send - 发送合约方法交易

向合约发送交易来执行指定方法，将改变合约的状态。

调用：

```
myContract.methods.myMethod([param1[, param2[, ...]]]).send(options[, callback])
```

参数：

*  options - Object: 选项，包含如下字段：
   *  from - String: 交易发送方地址
   *  gasPrice - String : 可选，用于本次交易的gas价格，单位：wei
   *  gas - Number : 可选，本次交易的gas用量上限，即gas limit
   *  value - Number|String|BN|BigNumber: 可选，交易转账金额，单位：wei
*  callback - Function: 可选的回调参数，其参数为交易哈希值和错误对象

返回值：

回调函数中将返回32字节长的交易哈希值。

PromiEvent: 一个Promise对象，当交易收据有效时或者发送交易时解析为新的合约实例。
它同时也是一个事件发生器，声明有以下事件：

*  "transactionHash" 返回 String: 交易发送后得到有效交易哈希值时触发
*  "receipt" 返回 Object: 交易收据有效时触发。
*  "confirmation" 返回 Number, Object: 收到确认时触发
*  "error" 返回 Error: 交易发送过程中如果出现错误则触发此事件。对于out of gas错误，其第二个参数为交易收据

示例代码：

```js
// using the callback
myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'}, function(error, transactionHash){
    ...
});

// using the promise
myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
.then(function(receipt){
    // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
});


// using the event emitter
myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
.on('transactionHash', function(hash){
    ...
})
.on('confirmation', function(confirmationNumber, receipt){
    ...
})
.on('receipt', function(receipt){
    // receipt example
    console.log(receipt);
    > {
        "transactionHash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
        "transactionIndex": 0,
        "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
        "blockNumber": 3,
        "contractAddress": "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
        "cumulativeGasUsed": 314159,
        "gasUsed": 30234,
        "events": {
            "MyEvent": {
                returnValues: {
                    myIndexedParam: 20,
                    myOtherIndexedParam: '0x123456789...',
                    myNonIndexParam: 'My String'
                },
                raw: {
                    data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
                    topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
                },
                event: 'MyEvent',
                signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
                logIndex: 0,
                transactionIndex: 0,
                transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
                blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
                blockNumber: 1234,
                address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
            },
            "MyOtherEvent": {
                ...
            },
            "MyMultipleEvent":[{...}, {...}] // If there are multiple of the same event, they will be in an array
        }
    }
})
.on('error', console.error); // If there's an out of gas error the second parameter is the receipt.
```

***

#### estimateGas - 估算合约方法gas用量

通过在EVM中执行方法来估算链上执行是需要的gas用量。得到的估算值可能与之后实际发送
交易的gas用量有差异，因为合约的状态可能在两个时刻存在差异。

调用：

```
myContract.methods.myMethod([param1[, param2[, ...]]]).estimateGas(options[, callback])
```

参数：

*  `options` - Object : 选项，包括以下字段：
   *  from - String : 可选，交易发送方地址
   *  gas - Number : 可选，本次交易gas用量上限
   *  value - Number|String|BN|BigNumber:  可选，交易转账金额，单位：wei
   *  callback - Function : 可选的回调函数，触发时其第二个参数为gas估算量，第一个参数为错误对象。

返回值：

一个Promise对象，其解析值为估算的gas用量。

示例代码：

```js
// 使用回调函数
myContract.methods.myMethod(123).estimateGas({gas: 5000000}, function(error, gasAmount){
    if(gasAmount == 5000000)
        console.log('Method ran out of gas');
});

// 使用promise
myContract.methods.myMethod(123).estimateGas({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
.then(function(gasAmount){
    ...
})
.catch(function(error){
    ...
});
```

***

#### encodeABI - ABI编码合约方法

为指定的合约方法进行ABI编码，可用于发送交易、调用方法或向另一个合约方法传递参数。

调用：

```
myContract.methods.myMethod([param1[, param2[, ...]]]).encodeABI()
```

参数：

无

返回值：

`String`: 编码后的ABI字节码，可用于交易发送或方法调用

示例代码：

```js
myContract.methods.myMethod(123).encodeABI();
> '0x58cf5f1000000000000000000000000000000000000000000000000000000000000007B'
```

***

#### events - 订阅合约事件

订阅指定的合约事件。

调用：

```
myContract.events.MyEvent([options][, callback])
```

参数：

*  options - Object: 可选，用于部署的选项，包含以下字段：
   *  filter - Object : 可选，按索引参数过滤事件。例如 {filter: {myNumber: [12,13]}} 表示 “myNumber” 为12或13的所有事件
   *  fromBlock - Number: 可选，仅监听该选项指定编号的块中发生的事件
   *  topics - Array : 可选，用来手动为事件过滤器设定主题。如果设置过filter属性和事件签名，那么(topic[0])将不会自动设置
*  callback - Function: 可选，该回调函数触发时，其第二给参数为事件对象，第一个参数为错误对象

返回值：

EventEmitter: 事件发生器，声明有以下事件:

*  "data" 返回 Object: 接收到新的事件时触发，参数为事件对象
*  "changed" 返回 Object: 当事件从区块链上移除时触发，该事件对象将被添加额外的属性"removed: true"
*  "error" 返回 Object: 当发生错误时触发

返回的事件对象结构如下：

*  event - String: 事件名称
*  signature - String|Null: 事件签名，如果是匿名事件，则为null
*  address - String: 事件源地址
*  returnValues - Object: 事件返回值，例如 {myVar: 1, myVar2: '0x234...'}.
*  logIndex - Number: 事件在块中的索引位置
*  transactionIndex - Number: 事件在交易中的索引位置
*  transactionHash 32 Bytes - String: 事件所在交易的哈希值
*  blockHash 32 Bytes - String: 事件所在块的哈希值，pending的块该值为 null
*  blockNumber - Number: 事件所在块的编号，pending的块该值为null
*  raw.data - String: 该字段包含未索引的日志参数
*  raw.topics - Array: 最多可保存4个32字节长的主题字符串数组。主题1-3 包含事件的索引参数

示例代码：

```js
myContract.events.MyEvent({
    filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0
}, function(error, event){ console.log(event); })
.on('data', function(event){
    console.log(event); // same results as the optional callback above
})
.on('changed', function(event){
    // remove event from local database
})
.on('error', console.error);

// event output example
> {
    returnValues: {
        myIndexedParam: 20,
        myOtherIndexedParam: '0x123456789...',
        myNonIndexParam: 'My String'
    },
    raw: {
        data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
        topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
    },
    event: 'MyEvent',
    signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
    logIndex: 0,
    transactionIndex: 0,
    transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
    blockNumber: 1234,
    address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
}
```

***

#### events.allEvents - 订阅合约全部事件

调用：

```
myContract.events.allEvents([options][, callback])
```

与`events`相同，只是可以接收合约的全部事件。可以使用options.filter属性进行过滤。

***

#### getPastEvents - 读取合约历史事件

读取合约的历史事件。

调用:

```
myContract.getPastEvents(event[, options][, callback])
```

参数：

*  event - String: 事件名，或者使用 "allEvents" 来读取所有的事件
*  options - Object: 用于部署的选项，包含以下字段：
   *  filter - Object : 可选，按索引参数过滤事件，例如 {filter: {myNumber: [12,13]}} 表示所有“myNumber” 为12 或 13的事件
   *  fromBlock - Number : 可选，仅读取从该编号开始的块中的历史事件。
   *  toBlock - Number : 可选，仅读取截止到该编号的块中的历史事件，默认值为"latest"
   *  topics - Array : 可选，用来手动设置事件过滤器的主题。如果设置了filter属性和事件签名，那么(topic[0])将不会自动设置
*  callback - Function : 可选的回调参数，触发时其第一个参数为错误对象，第二个参数为历史事件数组

返回值：

一个Promise对象，其解析值为历史事件对象数组

示例代码：

```js
myContract.getPastEvents('MyEvent', {
    filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0,
    toBlock: 'latest'
}, function(error, events){ console.log(events); })
.then(function(events){
    console.log(events) // same results as the optional callback above
});

> [{
    returnValues: {
        myIndexedParam: 20,
        myOtherIndexedParam: '0x123456789...',
        myNonIndexParam: 'My String'
    },
    raw: {
        data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
        topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
    },
    event: 'MyEvent',
    signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
    logIndex: 0,
    transactionIndex: 0,
    transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
    blockNumber: 1234,
    address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
},{
    ...
}]
```

***


#### web3.platon.personal

使用web3-eth-personal包和以太坊节点账户进行交互。

注意，这个包中的许多函数包含敏感信息，例如密码，因此不要在未加密的
websocket或http服务提供器上调用这些函数，因为你的密码是明文发送的！

使用方法：

```
var Personal = require('web3.platon-personal');

// 在以太坊兼容浏览器中，"Personal.providers.givenProvider"将自动被设置
var personal = new Personal(Personal.givenProvider || 'ws://some.local-or-remote.node:8546');


// 也可以使用web3包

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

// -> web3.platon.personal
```

***

#### web3.platon.personal.newAccount

创建一个新账户。注意，不要在未加密的websocket或http提供器上调用该函数，
否则你的密码将泄漏！

调用：

```
web3.platon.personal.newAccount(password, [callback])
```

参数：

password - String: 用来加密账户的密码

返回值：

一个Promise对象，其解析值为新创建的账户。

示例代码：

```js
web3.platon.personal.newAccount('!@superpassword')
.then(console.log);
> '0x1234567891011121314151617181920212223456'
```

***

#### web3.platon.personal.sign

使用指定账户对数据进行签名。

注意，在未加密的HTTP连接上发送账户密码极其不安全！

调用：

```
web3.platon.personal.sign(dataToSign, address, password [, callback])
```

参数：

*  `dataToSign`：String - 要签名的数据。会先使用web3.utils.utf8ToHex()将字符串转化为16进制
*  `address`：String - 用来签名的账户地址
*  `password`：String - 用来签名的账户密码
*  `callback`：Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果签名

返回值：

一个Promise对象，其解析值为签名结果字符串。

示例代码：

```js
web3.platon.personal.sign("Hello world", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!")
.then(console.log);
> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"

// 下面代码实现同样功能
web3.platon.personal.sign(web3.utils.utf8ToHex("Hello world"), "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!")
.then(console.log);
> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
```

***

#### web3.platon.personal.ecRecover

从签名的数据中提取进行签名的账户地址。

调用：

```
web3.platon.personal.ecRecover(dataThatWasSigned, signature [, callback])
```

参数：

*  `dataThatWasSigned`：String - 带有签名的数据，首先使用web3.utils.utf8ToHex()转化为16进制字符串
*  `signature`：String - 签名
*  Function - 可选的回调函数，其第一个参数为错误对象，第二个参数为结果

返回值：

一个Promise对象，其解析值为账户地址字符串

示例代码：

```js
web3.platon.personal.ecRecover("Hello world", "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400").then(console.log);
> "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe"
```

***

#### web3.platon.personal.signTransaction

对交易进行签名，账户必须先解锁。

注意：在未加密的HTTP连接上发送账户密码有巨大的风险！

调用：

```
web3.platon.personal.signTransaction(transaction, password [, callback])
```

参数：

*  `transaction`：Object - The transaction data to sign web3.platon.sendTransaction() for more.
*  `password`：String - The password of the from account, to sign the transaction with.
*  `callback`：Function - (optional) Optional callback, returns an error object as first parameter and the result as second.

返回值：

一个Promise对象，其解析值为RLP编码的交易对象，其raw属性可以使用web3.platon.sendSignedTransaction()发送交易。

示例代码：

```js
web3.platon.signTransaction({
    from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0",
    gasPrice: "20000000000",
    gas: "21000",
    to: '0x3535353535353535353535353535353535353535',
    value: "1000000000000000000",
    data: ""
}, 'MyPassword!').then(console.log);
> {
    raw: '0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88da07e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
    tx: {
        nonce: '0x0',
        gasPrice: '0x4a817c800',
        gas: '0x5208',
        to: '0x3535353535353535353535353535353535353535',
        value: '0xde0b6b3a7640000',
        input: '0x',
        v: '0x25',
        r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
        s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
        hash: '0xda3be87732110de6c1354c83770aae630ede9ac308d9f7b399ecfba23d923384'
    }
}
```

***

#### web3.platon.abi

web3.platon.abi系列函数用来将参数编码为ABI (Application Binary Interface)，或者从ABI解码回来。
以便在以太坊虚拟机EVM上执行函数函数调用。

函数列表：

*  web3.platon.abi.encodeFunctionSignature
*  web3.platon.abi.encodeEventSignature
*  web3.platon.abi.encodeParameter
*  web3.platon.abi.encodeParameters
*  web3.platon.abi.encodeFunctionCall
*  web3.platon.abi.decodeParameter
*  web3.platon.abi.decodeParameters
*  web3.platon.abi.decodeLog

***

#### web3.platon.abi.encodeFunctionSignature

将函数名编码为ABI签名，方法是取函数名及参数类型的sha3哈希值的头4个字节。

调用：

```
web3.platon.abi.encodeFunctionSignature(functionName);
```

参数：

`functionName` - String|Object: 要编码的函数名字符串，或者函数的JSON接口对象。当
采用字符串时，必须采用`function(type,type,...)`的格式，例如: `myFunction(uint256,uint32[],bytes10,bytes)`。

返回值：

`String` - 函数的ABI签名

示例代码：

```js
// 传入JSON接口对象
web3.platon.abi.encodeFunctionSignature({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    },{
        type: 'string',
        name: 'myString'
    }]
})
> 0x24ee0097

// 传入字符串
web3.platon.abi.encodeFunctionSignature('myMethod(uint256,string)')
> '0x24ee0097'
```

***

#### web3.platon.abi.encodeEventSignature

将事件名编码为ABI签名，方法是取事件名及其参数类型的sha3哈希值。

调用：

```
web3.platon.abi.encodeEventSignature(eventName);
```

参数：

`eventName` - String|Object: 要编码的事件名字符串，或者事件的JSON接口对象。如果采用
字符串参数，则需要符合格式`event(type,type,...)` ，例如`myEvent(uint256,uint32[],bytes10,bytes)`。

返回值：

`String` - 事件的ABI签名

示例代码：

```js
// 使用字符串参数
web3.platon.abi.encodeEventSignature('myEvent(uint256,bytes32)')
> 0xf2eeb729e636a8cb783be044acf6b7b1e2c5863735b60d6daae84c366ee87d97

// 使用json接口对象
web3.platon.abi.encodeEventSignature({
    name: 'myEvent',
    type: 'event',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    },{
        type: 'bytes32',
        name: 'myBytes'
    }]
})
> 0xf2eeb729e636a8cb783be044acf6b7b1e2c5863735b60d6daae84c366ee87d97
```

***

#### web3.platon.abi.encodeFunctionCall

将函数调用根据其JSON接口对象和给定的参数进行ABI编码。

调用：

```
web3.platon.abi.encodeFunctionCall(jsonInterface, parameters);
```

参数：

*  `jsonInterface` - Object: 函数的JSON接口对象
*  `parameters` - Array: 参数值数组

返回值：

*  `String` - ABI编码结果，包含函数签名和参数

示例代码：

```js
web3.platon.abi.encodeFunctionCall({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    },{
        type: 'string',
        name: 'myString'
    }]
}, ['2345675643', 'Hello!%']);
> "0x24ee0097000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000"
```

***

#### web3.platon.abi.decodeParameter

将ABI编码过的参数解码为其JavaScript形式。

调用：

```
web3.platon.abi.decodeParameter(type, hexString);
```

参数：

*  `type` - String: 参数类型
*  `hexString` - String: 要解码的ABI字节码

返回值：

Mixed - 解码结果

示例代码：

```js
web3.platon.abi.decodeParameter('uint256', '0x0000000000000000000000000000000000000000000000000000000000000010');
> "16"

web3.platon.abi.decodeParameter('string', '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000');
> "Hello!%!"
```

***

#### web3.platon.abi.decodeParameters

将ABI编码的参数解码为其JavaScript形式。

调用：

```
web3.platon.abi.decodeParameters(typesArray, hexString);
```

参数：

*  typesArray - Array|Object: 参数类型数组，或JSON接口输出数组
*  hexString - String: 要解码的ABI字节码

返回值：

Object - 包含解码后参数值的对象

示例代码：

```js
web3.platon.abi.decodeParameters(['string', 'uint256'], '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000');
> Result { '0': 'Hello!%!', '1': '234' }

web3.platon.abi.decodeParameters([{
    type: 'string',
    name: 'myString'
},{
    type: 'uint256',
    name: 'myNumber'
}], '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000');
> Result {
    '0': 'Hello!%!',
    '1': '234',
    myString: 'Hello!%!',
    myNumber: '234'
}
```

***

#### web3.platon.abi.decodeLog

对ABI编码后的日志数据和索引的主题数据进行解码。

调用：

```
web3.platon.abi.decodeLog(inputs, hexString, topics);
```

参数：

*  inputs - Object: A JSON interface inputs array. See the solidity documentation for a list of types.
*  hexString - String: The ABI byte code in the data field of a log.
*  topics - Array: An array with the index parameter topics of the log, without the topic[0] if its a non-anonymous event, otherwise with topic[0].

返回值：

`Object` - 包含解码后参数的对象

示例代码：

```js
web3.platon.abi.decodeLog([{
    type: 'string',
    name: 'myString'
},{
    type: 'uint256',
    name: 'myNumber',
    indexed: true
},{
    type: 'uint8',
    name: 'mySmallNumber',
    indexed: true
}],
'0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']);
> Result {
    '0': 'Hello%!',
    '1': '62224',
    '2': '16',
    myString: 'Hello%!',
    myNumber: '62224',
    mySmallNumber: '16'
}
```

***

#### web3.utils

`web3.utils`属性包含一组辅助函数集。

调用方法：

```js
Web3.utils
web3.utils
```

***

#### web3.utils.randomHex

生成指定长度的密码学强伪随机16进制字符串。

调用：

```
web3.utils.randomHex(size)
```

参数：

*  `size` - Number: 生成长度，例如32表示要生成32字节长的16进制字符串，即64个字符以及前缀“0x”

返回值：

`String`: 生成的随机16进制字符串

示例代码：

```js
web3.utils.randomHex(32)
> "0xa5b9d60f32436310afebcfda832817a68921beb782fabf7915cc0460b443116a"

web3.utils.randomHex(4)
> "0x6892ffc6"

web3.utils.randomHex(2)
> "0x99d6"

web3.utils.randomHex(1)
> "0x9a"

web3.utils.randomHex(0)
> "0x"
```

***

#### web3.utils._

`web3.utils._`提供了访问underscore库的接口。`underscore`是一个
非常流行的javascript工具库，提供了很多方便的js函数。

请参考underscore的API文档查询更多细节信息。

调用：

```
web3.utils._
```

示例代码：

```js
var _ = web3.utils._;

_.union([1,2],[3]);
> [1,2,3]

_.each({my: 'object'}, function(value, key){ ... })
```

***

#### web3.utils.BN

`web3.utils.BN`提供了BN.js库的访问接口。`BN.js`库用来处理大数的计算。
请参考BN.js的文档获取更详细的信息。

注意，为了安全地进行类型转换，请使用utils.toBN。

调用：

```
web3.utils.BN(mixed)
```

参数：

*  `mixed` - String|Number: 数值字符串或16进制字符串

返回值：

Object: BN.js实例对象

实例：

```
var BN = web3.utils.BN;

new BN(1234).toString();
> "1234"

new BN('1234').add(new BN('1')).toString();
> "1235"

new BN('0xea').toString();
> "234"
```

***

#### web3.utils.isBN

`web3.utils.isBN()`方法用来检查给定的参数是否是一个BN.js实例对象。

调用：

```
web3.utils.isBN(bn)
```

参数：

`bn` - Object: 要检查的对象

返回值

`Boolean`：如果参数为BN对象则返回true，否则返回false

实例代码：

```
var number = new BN(10);

web3.utils.isBN(number);
> true
```

***

#### web3.utils.isBigNumber

使用`web3.utils.isBigNumber()`方法检查给定的参数是否是一个
BigNumber.js对象表示的大数。

调用：

```
web3.utils.isBigNumber(bignumber)
```

参数：

`bignumber` - Object: 要检查的对象

返回值：

`Boolean`：如果参数是BigNumber.js对象则返回true，否则返回false

实例代码：

```
var number = new BigNumber(10);

web3.utils.isBigNumber(number);
> true
```

***

#### web3.utils.sha3

使用`web3.utils.sha3()`方法计算给定字符串的sha3哈希值。

注意，如果要模拟solidity中的sha3，请使用soliditySha3函数。

调用：

```
web3.utils.sha3(string)
web3.utils.keccak256(string) // ALIAS
```

参数：

`string` - String: 要计算sha3哈希值的字符串

返回值：

`String`: 计算结果哈希值

实例代码：

```
web3.utils.sha3('234'); // 字符串参数
> "0xc1912fee45d61c87cc5ea59dae311904cd86b84fee17cc96966216f811ce6a79"

web3.utils.sha3(new BN('234')); // BN对象参数
> "0xbc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a"

web3.utils.sha3(234); 
> null // 不能计算数值类型的哈希值

web3.utils.sha3(0xea); // 同上，也不能计算16进制表示的数值
> null

web3.utils.sha3('0xea'); // 首先转化为字节数组，然后再计算哈希值
> "0x2f20677459120677484f7104c76deb6846a2c071f9b3152c103bb12cd54d1a4a"
```

***

#### web3.utils.soliditySha3

采用和solidity同样的方式计算给定参数的sha3哈希值，也就是说，
在计算哈希之前，需要首先对参数进行ABI编码，并进行字节紧凑化处理。

调用：

```
web3.utils.soliditySha3(param1 [, param2, ...])
```

参数：

`paramX` - Mixed: 任意类型，或是一个具有如下结构的对象：{type: 'uint', value: '123456'} 或 {t: 'bytes', v: '0xfff456'}。
可以自动识别基本数据类型并解析为对应的solidity类型：

*  String 非数值的UTF-8字符串将解释为string
*  String|Number|BN|HEX 正数将解释为uint256
*  String|Number|BN 负数将解释为int256
*  Boolean 解释为bool.
*  String HEX 具有前缀0x的字符串将解释为bytes
*  HEX 16进制表示的数值将解释为uint256.

返回值：

`String`: 结果哈希值

示例代码：

```js
web3.utils.soliditySha3('234564535', '0xfff23243', true, -10);
// 自动检测:        uint256,      bytes,     bool,   int256
> "0x3e27a893dc40ef8a7f0841d96639de2f58a132be5ae466d40087a2cfa83b7179"


web3.utils.soliditySha3('Hello!%'); // 自动检测: string
> "0x661136a4267dba9ccdf6bfddb7c00e714de936674c4bdb065a531cf1cb15c7fc"


web3.utils.soliditySha3('234'); // 自动检测: uint256
> "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

web3.utils.soliditySha3(0xea); // 同上
> "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

web3.utils.soliditySha3(new BN('234')); // 同上
> "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

web3.utils.soliditySha3({type: 'uint256', value: '234'})); // 同上
> "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

web3.utils.soliditySha3({t: 'uint', v: new BN('234')})); // 同上
> "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"


web3.utils.soliditySha3('0x407D73d8a49eeb85D32Cf465507dd71d507100c1');
> "0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b"

web3.utils.soliditySha3({t: 'bytes', v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1'});
> "0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b" // 结果同上


web3.utils.soliditySha3({t: 'address', v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1'});
> "0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b" // 同上，但首先会检查校验和


web3.utils.soliditySha3({t: 'bytes32', v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1'});
> "0x3c69a194aaf415ba5d6afca734660d0a3d45acdc05d54cd1ca89a8988e7625b4" // 不同的类型得到不同的哈希值


web3.utils.soliditySha3({t: 'string', v: 'Hello!%'}, {t: 'int8', v:-23}, {t: 'address', v: '0x85F43D8a49eeB85d32Cf465507DD71d507100C1d'});
> "0xa13b31627c1ed7aaded5aecec71baf02fe123797fffd45e662eac8e06fbe4955"
```

***

#### web3.utils.isHex

检查指定的参数字符串是否是16进制字符串。

调用：

```
web3.utils.isHex(hex)
```

参数：

`hex` - String|HEX: 要检查的字符串

返回值：

`Boolean`：如果参数为16进制字符串则返回true，否则返回false

示例代码：

```js
web3.utils.isHex('0xc1912');
> true

web3.utils.isHex(0xc1912);
> true

web3.utils.isHex('c1912');
> true

web3.utils.isHex(345);
> true // 345即可以是16进制表示，也可以是10进制表示，因此在没有前缀0x的情况下要小心！

web3.utils.isHex('0xZ1912');
> false

web3.utils.isHex('Hello');
> false
```

***

#### web3.utils.isHexStrict

检查给定的字符串是否为16进制字符串。和`web3.utils.isHex()`的区别在于，`web3.utils.isHexStrict()`
方法要求合法的16进制字符串必须具有0x前缀。

调用：

```
web3.utils.isHexStrict(hex)
```

参数：

`hex` - String|HEX: 要检查的字符串

返回值：

`Boolean`：参数为16进制字符串则返回true，否则返回false

示例代码：

```js
web3.utils.isHexStrict('0xc1912');
> true

web3.utils.isHexStrict(0xc1912);
> false

web3.utils.isHexStrict('c1912');
> false

web3.utils.isHexStrict(345);
> false 

web3.utils.isHexStrict('0xZ1912');
> false

web3.utils.isHex('Hello');
> false
```

***

#### web3.utils.isAddress

检查指定的字符串是否是有效的以太坊地址。如果地址同时使用了大小写字符，
`web3.utils.isAddress()`方法也会检查校验和。

调用：

```
web3.utils.isAddress(address)
```

参数：

`address` - String: 要检查的地址字符串

返回值：

`Boolean`：有效地址则返回true，否则返回false

示例代码：

```js
web3.utils.isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d');
> true

web3.utils.isAddress('c1912fee45d61c87cc5ea59dae31190fffff232d');
> true

web3.utils.isAddress('0XC1912FEE45D61C87CC5EA59DAE31190FFFFF232D');
> true // 由于都是大写字母，因此不检查校验和

web3.utils.isAddress('0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
> true

web3.utils.isAddress('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
> false // 对于大小写混合的字符串，同时也检查校验和
```

***

#### web3.utils.toChecksumAddress

将给定的大写或小写以太坊地址转换为校验和地址。

调用：

```
web3.utils.toChecksumAddress(address)
```

参数：

`address` - String: 地址字符串

返回值：

`String`: The checksum address.

示例代码：

```js
web3.utils.toChecksumAddress('0xc1912fee45d61c87cc5ea59dae31190fffff2323');
> "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d"

web3.utils.toChecksumAddress('0XC1912FEE45D61C87CC5EA59DAE31190FFFFF232D');
> "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d" // 同上
```

***

#### web3.utils.checkAddressChecksum

检查指定地址的校验和，对于非检验和地址将返回false。

调用：

```
web3.utils.checkAddressChecksum(address)
```

参数：

`address` - String: 地址字符串

返回值：

`Boolean`: 如果地址的校验和有效则返回true，如果不是一个校验和地址、或者校验和无效，则返回false。

示例代码：

```js
web3.utils.checkAddressChecksum('0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
> true
```

***

#### web3.utils.toHex

将任意给定值转换为16进制字符串。数值字符串将解释为数值，文本字符串将解释为utf-8字符串。

调用：

```
web3.utils.toHex(mixed)
```

参数：

`mixed` - String|Number|BN|BigNumber: 要进行转换的输入

返回值：

String: 结果16进制字符串

示例代码：

```js
web3.utils.toHex('234');
> "0xea"

web3.utils.toHex(234);
> "0xea"

web3.utils.toHex(new BN('234'));
> "0xea"

web3.utils.toHex(new BigNumber('234'));
> "0xea"

web3.utils.toHex('I have 100€');
> "0x49206861766520313030e282ac"
```

***

#### web3.utils.hexToNumberString

将给定的16进制字符串转化为数值字符串。

调用：

```
web3.utils.hexToNumberString(hex)
```

参数：

`hexString` - String|HEX: 16进制字符串

返回值：

`String`: 数值字符串

示例代码：

```js
web3.utils.hexToNumberString('0xea');
> "234"
```

***

#### web3.utils.hexToNumber

返回给定16进制字符串的数值表示。

注意，该函数对大数无效，使用`utils.toBN`来处理大数。

调用：

```
web3.utils.hexToNumber(hex)
web3.utils.toDecimal(hex) // ALIAS, deprecated
```

参数：

`hexString` - String|HEX: 16进制字符串

返回值：

`Number`：10进制数值

示例代码：

```js
web3.utils.hexToNumber('0xea');
> 234
```

***

#### web3.utils.numberToHex

返回指定数值的16进制表示。

调用：

```
web3.utils.numberToHex(number)
web3.utils.fromDecimal(number) // 别名，已弃用
```

参数：

`number` - String|Number|BN|BigNumber: 数值

返回值：

`String`: 给定数值的16进制字符串表示

示例代码：

```js
web3.utils.numberToHex('234');
> '0xea'
```

***

#### web3.utils.hexToUtf8

返回指定16进制值的UTF-8字符串表示。

调用：

```
web3.utils.hexToUtf8(hex)
web3.utils.hexToString(hex) // 别名
web3.utils.toUtf8(hex) // 别名，已弃用
```

参数：

`hex` - String: 16进制字符串

返回值：

`String`: UTF-8字符串

示例代码：

```js
web3.utils.hexToUtf8('0x49206861766520313030e282ac');
> "I have 100€"
```

***

#### web3.utils.hexToAscii

返回指定16进制值的ASCII字符串表示。

调用：

```
web3.utils.hexToAscii(hex)
web3.utils.toAscii(hex) // 别名，已弃用
```

参数：

`hex` - String: 16进制字符串

返回值：

String: ASCII字符串

示例代码：

```js
web3.utils.hexToAscii('0x4920686176652031303021');
> "I have 100!"
```

***

#### web3.utils.utf8ToHex

返回指定UTF-8字符串的16进制表示。

调用：

```
web3.utils.utf8ToHex(string)
web3.utils.stringToHex(string) // 别名
web3.utils.fromUtf8(string) // 别名，已弃用
```

参数：

`string` - String: ·UTF-8字符串

返回值：

`String`: 16进制字符串

示例代码：

```js
web3.utils.utf8ToHex('I have 100€');
> "0x49206861766520313030e282ac"
```

***

#### web3.utils.asciiToHex

返回指定ASCII字符串的16进制表示。

调用：

```
web3.utils.asciiToHex(string)
web3.utils.fromAscii(string) // 别名，已弃用
```

参数：

`string` - String: ASCII字符串

返回值

`String`: 16进制字符串

示例代码：

```js
web3.utils.asciiToHex('I have 100!');
> "0x4920686176652031303021"
```

***

#### web3.utils.hexToBytes

返回指定16进制字符串的字节数组表示。

调用：

```
web3.utils.hexToBytes(hex)
```

参数：

`hex` - String|HEX: 16进制字符串

返回值：

`Array`: 字节数组

示例代码：

```js
web3.utils.hexToBytes('0x000000ea');
> [ 0, 0, 0, 234 ]

web3.utils.hexToBytes(0x000000ea);
> [ 234 ]
```

***

#### web3.utils.toVon

按对应货币转为以von为单位。可选择的单位如下：

* von
* kvon
* mvon
* gvon
* microlat
* millilat
* lat
* klat
* mlat
* glat
* tlat

```
'von':          '1',
'kvon':         '1000',
'mvon':         '1000000',
'gvon':         '1000000000',
'microlat':     '1000000000000',
'millilat':     '1000000000000000',
'lat':          '1000000000000000000',
'klat':         '1000000000000000000000',
'mlat':         '1000000000000000000000000',
'glat':         '1000000000000000000000000000',
'tlat':         '1000000000000000000000000000000'
```

调用：

```
web3.utils.toVon(number [, unit])
```

参数：

*  `number` - String|Number|BN: 金额 
*  `unit` - String，可选，默认值为`ether`
 

返回值：

`String|BN`: 如果输入参数是数值或字符串，则返回字符串，否则返回BN.js对象

示例代码：

```js
web3.utils.toVon('1', 'lat');
> "1000000000000000000"
```

***

#### web3.utils.fromVon

将给定的以von为单位的值转换为其他单位的数值。

调用：

```
web3.utils.fromVon(number [, unit])
```

Converts any von value into a lat value.

参数：

`number` - String|Number|BN: wei为单位的数值
`unit` - String，可选，默认值为`lat`，可选的单位有：

* von
* kvon
* mvon
* gvon
* microlat
* millilat
* lat
* klat
* mlat
* glat
* tlat

返回值：

`String|BN`: 如果输入参数是数值或字符串，则返回字符串，否则返回BN.js对象

示例代码：

```js
web3.utils.fromVon('1', 'lat');
> "0.000000000000000001"
```

***

#### web3.utils.padLeft

将指定字符串使用0左补齐到指定长度。

调用：

```
web3.utils.padLeft(string, characterAmount [, sign])
web3.utils.leftPad(string, characterAmount [, sign]) // 别名
```

参数：

*  `string` - String: 要进行左补齐的字符串
*  `characterAmount` - Number: 补齐后的总长度
*  `sign` - String，可选，补齐字符，默认为"0"

返回值：

`String`: 左补齐到指定长度的字符串

示例代码：

```js
web3.utils.padLeft('0x3456ff', 20);
> "0x000000000000003456ff"

web3.utils.padLeft(0x3456ff, 20);
> "0x000000000000003456ff"

web3.utils.padLeft('Hello', 20, 'x');
> "xxxxxxxxxxxxxxxHello"
```

***

## 内置合约调用指南

### 概述
通过对调用对象 ppos（经济模型相关内置合约） 的 call 或者 send 函数将传进来的参数转换为 rpc 接口 platon_call 或者 platon_sendRawTransaction 调用所需要的参数，然后将交易发送至链上。以及完成 call 与 send 调用入参需要的一些辅助函数。

### 简要使用
在调用`const web3 = new Web3('http://127.0.0.1:6789');`实例化一个web3的时候，系统会自动在 web3 后面附加一个 ppos 对象。也就是说你可以直接使用web3.ppos 调用 ppos 有的一些方法。但是如果要使用ppos对象发送上链的交易，那么除了在实例化`web3`的时候传进去的 provider，还至少需要发送交易签名需要的私钥以及链id，其中的链id可通过rpc接口`admin_nodeInfo`返回的`'chainId': xxx`获取。

当然，为了满足在能任意实例多个ppos(比如我要实例3个ppos给不同的链上同时发送交易调用)，我还会在web3对象上附上一个PPOS对象(注意全部是大写)。你可以调用`new PPOS(setting)`实例化一个ppos对象。一个调用示例如下：

```JavaScript
(async () => {
    const Web3 = require('web3');
    const web3 = new Web3('http://192.168.120.164:6789');
    const ppos = web3.ppos; // 后面例子我都以 ppos 为对象。就不写成 web3.ppos 了。

    // 更新 ppos 的配置，发送上链交易必须要做这一步
    // 由于在实例化web3的时候已传入了 provider, 可以不传入provider了。
    ppos.updateSetting({
        privateKey: 'acc73b693b79bbb56f89f63ccc3a0c00bf1b8380111965bfe8ab22e32045600c',
        chainId: 100,
    })

    let data, reply;

    // 传参以对象形式发送交易： 1000. createStaking() : 发起质押
    const benefitAddress = '0xe6F2ce1aaF9EBf2fE3fbA8763bABaDf25e3fb5FA';
    const nodeId = '80f1fcee54de74dbf7587450f31c31c0e057bedd4faaa2a10c179d52c900ca01f0fb255a630c49d83b39f970d175c42b12a341a37504be248d76ecf592d32bc0';
    const amount = '10000000000000000000000000000';
    const blsPubKey = 'd2459db974f49ca9cbf944d4d04c2d17888aef90858b62d6aec166341a6e886e8c0c0cfae9e469c2f618f5d9b7a249130d10047899da6154288c9cde07b576acacd75fef07ba0cfeb4eaa7510704e77a9007eff5f1a5f8d099e6ea664129780c';
    data = {
        funcType: 1000,
        typ: 0,
        benefitAddress: ppos.hexStrBuf(benefitAddress),
        nodeId: ppos.hexStrBuf(nodeId),
        externalId: 'externalId',
        nodeName: 'Me',
        website: 'www.platon.network',
        details: 'staking',
        amount: ppos.bigNumBuf(amount),
        programVersion: undefined, // rpc 获取
        programVersionSign: undefined, // rpc 获取
        blsPubKey: ppos.hexStrBuf(blsPubKey),
        blsProof: undefined, // rpc 获取
    }
    let pv = await ppos.rpc('admin_getProgramVersion');
    let blsProof = await ppos.rpc('admin_getSchnorrNIZKProve');
    data.programVersion = pv.Version;
    data.programVersionSign = pv.Sign;
    data.blsProof = ppos.hexStrBuf(blsProof);
    reply = await ppos.send(data);
    console.log('createStaking params object reply: ', JSON.stringify(reply, null, 2));

    // 传参以数组形式发送交易： 1000. createStaking() : 发起质押
    data = [
        1000,
        0,
        ppos.hexStrBuf(benefitAddress),
        ppos.hexStrBuf(nodeId),
        'externalId',
        'Me',
        'www.platon.network',
        'staking',
        ppos.bigNumBuf(amount),
        pv.Version,
        pv.Sign,
        ppos.hexStrBuf(blsPubKey),
        ppos.hexStrBuf(blsProof)
    ];
    // 由于上面已调用过，交易会上链，但是业务会失败
    reply = await ppos.send(data);
    console.log('createStaking params array reply: ', reply);

    // 传参以对象形式调用： 1102. getCandidateList() : 查询所有实时的候选人列表
    data = {
        funcType: 1102,
    }
    reply = await ppos.call(data);
    console.log('getCandidateList params object reply: ', reply);

    // 传参以数组形式调用： 1102. getCandidateList() : 查询所有实时的候选人列表
    data = [1102];
    reply = await ppos.call(data);
    console.log('getCandidateList params array reply: ', reply);

    // 重新实例化一个ppos1对象出来调用
    const ppos1 = new web3.PPOS({
        provider: 'http://127.0.0.1:6789',
        privateKey: '9f9b18c72f8e5154a9c59af2a35f73d1bdad37b049387fc6cea2bac89804293b',
        chainId: 100,
    })
    reply = await ppos1.call(data);
})()
```

日志信息输出如下。为了节省篇幅，有删减

```
createStaking params object reply:  {
  "blockHash": "0xdddd6b12919b69169b63d17fece52e8632fe3d8b48166c8b4ef8fdee39a1f35c",
  "blockNumber": "0xb",
  "contractAddress": null,
  "cumulativeGasUsed": "0x14f34",
  "from": "0x714de266a0effa39fcaca1442b927e5f1053eaa3",
  "gasUsed": "0x14f34",
  "logs": [
    {
      "address": "0x1000000000000000000000000000000000000002",
      "topics": [
        "0xd63087bea9f1800eed943829fc1d61e7869764805baa3259078c1caf3d4f5a48"
      ],
      "data": "0xe3a27b22436f6465223a302c2244617461223a22222c224572724d7367223a226f6b227d",
      "blockNumber": "0xb",
      "transactionHash": "0x4bee71e351076a81482e2576e469a8dfaa76da9b6cc848265c10968d6de67364",
      "transactionIndex": "0x0",
      "blockHash": "0xdddd6b12919b69169b63d17fece52e8632fe3d8b48166c8b4ef8fdee39a1f35c",
      "logIndex": "0x0",
      "removed": false,
      "dataStr": {
        "Code": 0,
        "Data": "",
        "ErrMsg": "ok"
      }
    }
  ],
  "logsBloom": "",
  "root": "0x3b7a41cea97f90196039586a3068f6a64c09aa7597898440c3c241a095e37984",
  "to": "0x1000000000000000000000000000000000000002",
  "transactionHash": "0x4bee71e351076a81482e2576e469a8dfaa76da9b6cc848265c10968d6de67364",
  "transactionIndex": "0x0"
}

createStaking params array reply:  { blockHash:
   '0x43351e4a9f1b7173552094bacfd5b6f84f18a6c7c0c02d8a10506e3a61041117',
  blockNumber: '0x10',
  contractAddress: null,
  cumulativeGasUsed: '0x14f34',
  from: '0x714de266a0effa39fcaca1442b927e5f1053eaa3',
  gasUsed: '0x14f34',
  logs:
   [ { address: '0x1000000000000000000000000000000000000002',
       topics: [Array],
       data:
        '0xf846b8447b22436f6465223a3330313130312c2244617461223a22222c224572724d7367223a22546869732063616e64696461746520697320616c7265616479206578697374227d',
       blockNumber: '0x10',
       transactionHash:
        '0xe5cbc728d6e284464c30ce6f0bbee5fb2b30351a591424f3a0edd37cc1bbdc05',
       transactionIndex: '0x0',
       blockHash:
        '0x43351e4a9f1b7173552094bacfd5b6f84f18a6c7c0c02d8a10506e3a61041117',
       logIndex: '0x0',
       removed: false,
       dataStr: [Object] } ],
  logsBloom:'',
  root:
   '0x45ffeda340b68a0d54c5556a51f925b0787307eab1fb120ed141fd8ba81183d4',
  to: '0x1000000000000000000000000000000000000002',
  transactionHash:
   '0xe5cbc728d6e284464c30ce6f0bbee5fb2b30351a591424f3a0edd37cc1bbdc05',
  transactionIndex: '0x0' }

getCandidateList params object reply:  { 
  Code: 0,
  Data:
   [ { candidate1 info... },
     { candidate2 info... },
     { candidate3 info... },
     { candidate4 info... } 
   ],
  ErrMsg: 'ok' }

getCandidateList params array reply:  { 
  Code: 0,
  Data:
   [ { candidate1 info... },
     { candidate2 info... },
     { candidate3 info... },
     { candidate4 info... } 
   ],
  ErrMsg: 'ok' }
```

### API 调用详细说明

#### `updateSetting(setting)`
更新 ppos 对象的配置参数。如果你只需要发送call调用，那么只需要传入 provider 即可。如果你在实例化 web3 的时候已经传入了 provider。那么会ppos的provider默认就是你实例化web3传进来的provider。当然你也可以随时更新provider。

如果你要发送send交易，那么除了provider，还必须要传入发送交易所需要的私钥以及链id。当然，发送交易需要设置的gas, gasPrice, retry, interval这四个参数详细请见`async send(params, [other])`说明。

对传入的参数，你可以选择部分更新，比如你对一个ppos对象，发送某个交易时想使用私钥A，那么你在调用`send(params, [other])`之前执行 `ppos.updateSetting({privateKey: youPrivateKeyA})`更新私钥即可。一旦更新之后，将会覆盖当前配置，后面调用发送交易接口，将默认以最后一次更新的配置。

入参说明：
* setting Object
  * provider String 链接
  * privateKey String 私钥
  * chainId String 链id
  * gas String 燃料最大消耗，请输入十六进制字符串，比如 '0x76c0000'
  * gasPrice String 燃料价格，请输入十六进制字符串，比如 '0x9184e72a000000'
  * retry Number 查询交易收据对象次数。
  * interval Number 查询交易收据对象的间隔，单位为ms。

无出参。

调用示例
```JavaScript
// 同时更新 privateKey，chainId
ppos.updateSetting({
    privateKey: 'acc73b693b79bbb56f89f63ccc3a0c00bf1b8380111965bfe8ab22e32045600c',
    chainId: 100,
})

// 只更新 privateKey
ppos.updateSetting({
    privateKey: '9f9b18c72f8e5154a9c59af2a35f73d1bdad37b049387fc6cea2bac89804293b'
})
```

***

#### `getSetting()`
查询你配置的参数

无入参

出参
* setting Object
  * provider String 链接
  * privateKey String 私钥
  * chainId String 链id
  * gas String 燃料最大消耗
  * gasPrice String 燃料价格
  * retry Number 查询交易收据对象次数。
  * interval Number 查询交易收据对象的间隔，单位为ms。

调用示例
```JavaScript
let setting = ppos.getSetting();
```

***

#### `async rpc(method, [params])`
发起 rpc 请求。一个辅助函数，因为在调用ppos发送交易的过程中，有些参数需要通过rpc来获取，所以特意封装了一个rpc供调用。注意此接口为async函数，需要加await返回调用结果，否则返回一个Promise对象。

入参说明：
* method String 方法名
* params Array 调用rpc接口需要的参数，如果调用此rpc端口不需要参数，则此参数可以省略。
  
出参
* reply rpc调用返回的结果

调用示例
```JavaScript
// 获取程序版本
let reply = await ppos.rpc('admin_getProgramVersion'); 

// 获取所有账号
let reply = await ppos.rpc('platon_accounts')

// 获取一个账号的金额
let reply = await ppos.rpc('platon_getBalance', ["0x714de266a0effa39fcaca1442b927e5f1053eaa3","latest"])
```

***

#### `bigNumBuf(intStr)`
将一个字符串的十进制大整数转为一个RLP编码能接受的buffer对象。一个辅助函数。因为JavaScript的正数范围只能最大表示为2^53，为了RLP能对大整数进行编码，需要将字符串的十进制大整数转换为相应的Buffer。注意，此接口暂时只能对十进制的大整数转为Buffer，如果是十六进制的字符串，您需要先将他转为十进制的字符串。

入参说明：
* intStr String 字符串十进制大整数。
  
出参
* buffer Buffer 一个缓存区。

调用示例
```JavaScript
let buffer = ppos.bigNumBuf('1000000000000000000000000000000000000000000'); 
```

***

#### `hexStrBuf(hexStr)`
将一个十六进制的字符串转为一个RLP编码能接受的buffer对象。一个辅助函数。在ppos发送交易的过程中，我们很多参数需要作为bytes传送而不是string，比如 `nodeId 64bytes 被质押的节点Id(也叫候选人的节点Id)`。而写代码时候的nodeId只能以字符串的形式表现。需要将他转为一个 64 bytes 的 Buffer。

注意：如果你传进去的字符串以 0x 或者 0X 开头，系统会默认为你是表示一个十六进制字符串不对开头的这两个字母进行编码。如果你确实要对 0x 或者 0X 编码，那你必须在字符串前面再加前缀 0x。比如，你要对全字符串 0x31c0e0 (4 bytes) 进行编码，那么必须传入 0x0x31c0e0 。

入参说明：
* hexStr String 一个十六进制的字符串。
  
出参
* buffer Buffer 一个缓存区。

调用示例
```JavaScript
const nodeId = '80f1fcee54de74dbf7587450f31c31c0e057bedd4faaa2a10c179d52c900ca01f0fb255a630c49d83b39f970d175c42b12a341a37504be248d76ecf592d32bc0';
let buffer = ppos.hexStrBuf(nodeId); 
```

***

#### `async call(params)`
发送一个 ppos 的call查询调用。不上链。所以你需要自行区分是否是查询或者是发送交易。入参可以选择对象或者数组。如果你选择传入对象，那么你需要使用规定的字符串key，但是对key要求不做顺序。你可以这样写`{a: 1, b: 'hello'}` 或者 `{b: 'hello', a: 1}`都没问题。

如果你选择以数组作为入参，那么你**必须严格按照入参的顺序依次将参数放到数组里面**。注意，对一些字符串大整数以及需要传入的bytes，请选择上面提供的接口`bigNumBuf(intStr)`跟`hexStrBuf(hexStr)`自行进行转换再传入。

注意此接口为async函数，需要加await返回调用结果，否则返回一个Promise对象。

入参说明：
* params Object | Array 调用参数。
  
出参
* reply Object call调用的返回的结果。注意，我已将将返回的结果转为了Object对象。
  * Code Number 调用返回码，0表示调用结果正常。
  * Data Array | Object | String | Number... 根据调用结果返回相应类型
  * ErrMsg String 调用提示信息。

以调用 `查询当前账户地址所委托的节点的NodeID和质押Id`这个接口，入参顺序从上到下，入参如下所示：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1103)|
|addr|common.address(20bytes)|委托人的账户地址|

调用示例
```JavaScript
let params, reply;

// 以传进入对象进行调用(对于key不要求顺序)
params = {
    funcType: 1103,
    addr: ppos.hexStrBuf("0xe6F2ce1aaF9EBf2fE3fbA8763bABaDf25e3fb5FA")
}
reply = await ppos.call(params);

// 以传入数组对象进行调用
params = [1103, ppos.hexStrBuf("0xe6F2ce1aaF9EBf2fE3fbA8763bABaDf25e3fb5FA")];
reply = await ppos.call(params);
```

***

#### `async send(params, [other])`
发送一个 ppos 的send发送交易调用。上链。所以你需要自行区分是否是查询或者是发送交易。入参可以选择对象或者数组。传入规则请看上述`async call(params)`调用。

由于是一个交易，将会涉及到调用交易需要的一些参数，比如gas，gasPrice。当交易发送出去之后，为了确认交易是否上链，需要不断的通过交易哈希去轮询链上的结果。这就有个轮询次数 retry 与每次轮询之间的间隔 interval。

对于上面提到的 gas, gasPrice, retry, interval 这四个参数，如果other入参有指定，则使用other指定的。如果other入参未指定，则使用调用函数时候`updateSetting(setting)`指定的参数，否则使用默认的数值。

注意此接口为async函数，需要加await返回调用结果，否则返回一个Promise对象。

入参说明：
* params Object|Array 调用参数。
* other Object 其他参数
  * gas String 燃油限制，默认 '0x76c0000'。
  * gasPrice String 燃油价格，默认 '0x9184e72a000000'。
  * retry Number 查询交易收据对象次数，默认 600 次。
  * interval Number 查询交易收据对象的间隔，单位为ms。默认 100 ms。

出参
* reply Object 调用成功！send调用方法返回指定交易的收据对象
  * status - Boolean: 成功的交易返回true，如果EVM回滚了该交易则返回false
  * blockHash 32 Bytes - String: 交易所在块的哈希值
  * blockNumber - Number: 交易所在块的编号
  * transactionHash 32 Bytes - String: 交易的哈希值
  * transactionIndex - Number: 交易在块中的索引位置
  * from - String: 交易发送方的地址
  * to - String: 交易接收方的地址，对于创建合约的交易，该值为null
  * contractAddress - String: 对于创建合约的交易，该值为创建的合约地址，否则为null
  * cumulativeGasUsed - Number: 该交易执行时所在块的gas累计总用量
  * gasUsed- Number: 该交易的gas总量
  * logs - Array: 该交易产生的日志对象数组

* errMsg String 调用失败！如果发送交易返回之后没有回执，则返回错误信息`no hash`。如果发送交易之后有回执，但是在规定的时间内没有查到收据对象，则返回 `getTransactionReceipt txHash ${hash} interval ${interval}ms by ${retry} retry failed`

以调用 `发起委托`这个接口，入参顺序从上到下，入参如下所示：

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1004)|
|typ|uint16(2bytes)|表示使用账户自由金额还是账户的锁仓金额做委托，0: 自由金额； 1: 锁仓金额|
|nodeId|64bytes|被质押的节点的NodeId|
|amount|big.Int(bytes)|委托的金额(按照最小单位算，1LAT = 10^18 von)|


调用示例
```JavaScript
const nodeId = "f71e1bc638456363a66c4769284290ef3ccff03aba4a22fb60ffaed60b77f614bfd173532c3575abe254c366df6f4d6248b929cb9398aaac00cbcc959f7b2b7c";
let params, others, reply;

// 以传进入对象进行调用(对于key不要求顺序)
params = {
    funcType: 1004,
    typ: 0,
    nodeId: ppos.hexStrBuf(nodeId),
    amount: ppos.bigNumBuf("10000000000000000000000")
}
reply = await ppos.send(params);

// 以传入数组对象进行调用
params = [1004, 0, ppos.hexStrBuf(nodeId), ppos.bigNumBuf("10000000000000000000000")];
reply = await ppos.send(params);

// 我不想默认的轮询
other = {
    retry: 300, // 只轮询300次
    interval: 200 // 每次轮询间隔200ms
}
params = [1004, 0, ppos.hexStrBuf(nodeId), ppos.bigNumBuf("10000000000000000000000")];
reply = await ppos.send(params, other);
```

### 内置合约入参详细说明

#### 质押

* 发起质押，send 发送交易。


|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1000)|
|typ|uint16(2bytes)|表示使用账户自由金额还是账户的锁仓金额做质押，0: 自由金额； 1: 锁仓金额|
|benefitAddress|20bytes|用于接受出块奖励和质押奖励的收益账户|
|nodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|externalId|string|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|nodeName|string|被质押节点的名称(有长度限制，表示该节点的名称)|
|website|string|节点的第三方主页(有长度限制，表示该节点的主页)|
|details|string|节点的描述(有长度限制，表示该节点的描述)|
|amount|*big.Int(bytes)|质押的von|
|programVersion|uint32|程序的真实版本，治理rpc获取|
|programVersionSign|65bytes|程序的真实版本签名，治理rpc获取|
|blsPubKey|96bytes|bls的公钥|
|blsProof|64bytes|bls的证明,通过拉取证明接口获取|

* 修改质押信息，send 发送交易。

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1001)|
|benefitAddress|20bytes|用于接受出块奖励和质押奖励的收益账户|
|nodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|externalId|string|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|nodeName|string|被质押节点的名称(有长度限制，表示该节点的名称)|
|website|string|节点的第三方主页(有长度限制，表示该节点的主页)|
|details|string|节点的描述(有长度限制，表示该节点的描述)|


* 增持质押，send 发送交易。

入参：

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1002)|
|nodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|typ|uint16(2bytes)|表示使用账户自由金额还是账户的锁仓金额做质押，0: 自由金额； 1: 锁仓金额|
|amount|*big.Int(bytes)|增持的von|


* 撤销质押(一次性发起全部撤销，多次到账)，send 发送交易。

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1003)|
|nodeId|64bytes|被质押的节点的NodeId|

* 发起委托，send 发送交易。

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1004)|
|typ|uint16(2bytes)|表示使用账户自由金额还是账户的锁仓金额做委托，0: 自由金额； 1: 锁仓金额|
|nodeId|64bytes|被质押的节点的NodeId|
|amount|*big.Int(bytes)|委托的金额(按照最小单位算，1LAT = 10**18 von)|

* 减持/撤销委托(全部减持就是撤销)，send 发送交易。

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1005)|
|stakingBlockNum|uint64(8bytes)|代表着某个node的某次质押的唯一标示|
|nodeId|64bytes|被质押的节点的NodeId|
|amount|*big.Int(bytes)|减持委托的金额(按照最小单位算，1LAT = 10**18 von)|

* 查询当前结算周期的验证人队列，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1100)|

**查询结果统一格式**

|名称|类型|说明|
|---|---|---|
|Code|uint32| 表示ppos内置合约返回的错误码|
|Data|string| json字符串的查询结果，具体格式参见以下查询相关接口返回值 |
|ErrMsg|string| 错误提示信息|

> 注：以下查询接口（platon_call调用的接口）如无特殊声明，返回参数都按照上述格式返回

返参： 列表

|名称|类型|说明|
|---|---|---|
|NodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|StakingAddress|20bytes|发起质押时使用的账户(后续操作质押信息只能用这个账户，撤销质押时，von会被退回该账户或者该账户的锁仓信息中)|
|BenefitAddress|20bytes|用于接受出块奖励和质押奖励的收益账户|
|StakingTxIndex|uint32(4bytes)|发起质押时的交易索引|
|ProgramVersion|uint32|被质押节点的PlatON进程的真实版本号(获取版本号的接口由治理提供)|
|StakingBlockNum|uint64(8bytes)|发起质押时的区块高度|
|Shares|*big.Int(bytes)|当前候选人总共质押加被委托的von数目|
|ExternalId|string|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|NodeName|string|被质押节点的名称(有长度限制，表示该节点的名称)|
|Website|string|节点的第三方主页(有长度限制，表示该节点的主页)|
|Details|string|节点的描述(有长度限制，表示该节点的描述)|
|ValidatorTerm|uint32(4bytes)|验证人的任期(在结算周期的101个验证人快照中永远是0，只有在共识轮的验证人时才会被有值，刚被选出来时也是0，继续留任时则+1)|

* 查询当前共识周期的验证人列表，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1101)|

返参： 列表

|名称|类型|说明|
|---|---|---|
|NodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|StakingAddress|20bytes|发起质押时使用的账户(后续操作质押信息只能用这个账户，撤销质押时，von会被退回该账户或者该账户的锁仓信息中)|
|BenefitAddress|20bytes|用于接受出块奖励和质押奖励的收益账户|
|StakingTxIndex|uint32(4bytes)|发起质押时的交易索引|
|ProgramVersion|uint32(4bytes)|被质押节点的PlatON进程的真实版本号(获取版本号的接口由治理提供)|
|StakingBlockNum|uint64(8bytes)|发起质押时的区块高度|
|Shares|*big.Int(bytes)|当前候选人总共质押加被委托的von数目|
|ExternalId|string|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|NodeName|string|被质押节点的名称(有长度限制，表示该节点的名称)|
|Website|string|节点的第三方主页(有长度限制，表示该节点的主页)|
|Details|string|节点的描述(有长度限制，表示该节点的描述)|
|ValidatorTerm|uint32(4bytes)|验证人的任期(在结算周期的101个验证人快照中永远是0，只有在共识轮的验证人时才会被有值，刚被选出来时也是0，继续留任时则+1)|

* 查询所有实时的候选人列表，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1102)|

返参： 列表

|名称|类型|说明|
|---|---|---|
|NodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|StakingAddress|20bytes|发起质押时使用的账户(后续操作质押信息只能用这个账户，撤销质押时，von会被退回该账户或者该账户的锁仓信息中)|
|BenefitAddress|20bytes|用于接受出块奖励和质押奖励的收益账户|
|StakingTxIndex|uint32(4bytes)|发起质押时的交易索引|
|ProgramVersion|uint32(4bytes)|被质押节点的PlatON进程的真实版本号(获取版本号的接口由治理提供)|
|Status|uint32(4bytes)|候选人的状态(状态是根据uint32的32bit来放置的，可同时存在多个状态，值为多个同时存在的状态值相加【0: 节点可用 (32个bit全为0)； 1: 节点不可用 (只有最后一bit为1)； 2： 节点出块率低但没有达到移除条件的(只有倒数第二bit为1)； 4： 节点的von不足最低质押门槛(只有倒数第三bit为1)； 8：节点被举报双签(只有倒数第四bit为1)); 16: 节点出块率低且达到移除条件(倒数第五位bit为1); 32: 节点主动发起撤销(只有倒数第六位bit为1)】|
|StakingEpoch|uint32(4bytes)|当前变更质押金额时的结算周期|
|StakingBlockNum|uint64(8bytes)|发起质押时的区块高度|
|Shares|string(0x十六进制字符串)|当前候选人总共质押加被委托的von数目|
|Released|string(0x十六进制字符串)|发起质押账户的自由金额的锁定期质押的von|
|ReleasedHes|string(0x十六进制字符串)|发起质押账户的自由金额的犹豫期质押的von|
|RestrictingPlan|string(0x十六进制字符串)|发起质押账户的锁仓金额的锁定期质押的von|
|RestrictingPlanHes|string(0x十六进制字符串)|发起质押账户的锁仓金额的犹豫期质押的von|
|ExternalId|string|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|NodeName|string|被质押节点的名称(有长度限制，表示该节点的名称)|
|Website|string|节点的第三方主页(有长度限制，表示该节点的主页)|
|Details|string|节点的描述(有长度限制，表示该节点的描述)|

* 查询当前账户地址所委托的节点的NodeID和质押Id，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1103)|
|addr|common.address(20bytes)|委托人的账户地址|

返参： 列表

|名称|类型|说明|
|---|---|---|
|Addr|20bytes|委托人的账户地址|
|NodeId|64bytes|验证人的节点Id|
|StakingBlockNum|uint64(8bytes)|发起质押时的区块高度|


* 查询当前单个委托信息，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16|代表方法类型码(1104)|
|stakingBlockNum|uint64(8bytes)|发起质押时的区块高度|
|delAddr|20bytes|委托人账户地址|
|nodeId|64bytes|验证人的节点Id|

返参： 列表

|名称|类型|说明|
|---|---|---|
|Addr|20bytes|委托人的账户地址|
|NodeId|64bytes|验证人的节点Id|
|StakingBlockNum|uint64(8bytes)|发起质押时的区块高度|
|DelegateEpoch|uint32(4bytes)|最近一次对该候选人发起的委托时的结算周期|
|Released|string(0x十六进制字符串)|发起委托账户的自由金额的锁定期委托的von|
|ReleasedHes|string(0x十六进制字符串)|发起委托账户的自由金额的犹豫期委托的von|
|RestrictingPlan|string(0x十六进制字符串)|发起委托账户的锁仓金额的锁定期委托的von|
|RestrictingPlanHes|string(0x十六进制字符串)|发起委托账户的锁仓金额的犹豫期委托的von|
|Reduction|string(0x十六进制字符串)|处于撤销计划中的von|

* 查询当前节点的质押信息，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16|代表方法类型码(1105)|
|nodeId|64bytes|验证人的节点Id|

返参： 列表

|名称|类型|说明|
|---|---|---|
|NodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|StakingAddress|20bytes|发起质押时使用的账户(后续操作质押信息只能用这个账户，撤销质押时，von会被退回该账户或者该账户的锁仓信息中)|
|BenefitAddress|20bytes|用于接受出块奖励和质押奖励的收益账户|
|StakingTxIndex|uint32(4bytes)|发起质押时的交易索引|
|ProgramVersion|uint32(4bytes)|被质押节点的PlatON进程的真实版本号(获取版本号的接口由治理提供)|
|Status|uint32(4bytes)|候选人的状态(状态是根据uint32的32bit来放置的，可同时存在多个状态，值为多个同时存在的状态值相加【0: 节点可用 (32个bit全为0)； 1: 节点不可用 (只有最后一bit为1)； 2： 节点出块率低但没有达到移除条件的(只有倒数第二bit为1)； 4： 节点的von不足最低质押门槛(只有倒数第三bit为1)； 8：节点被举报双签(只有倒数第四bit为1)); 16: 节点出块率低且达到移除条件(倒数第五位bit为1); 32: 节点主动发起撤销(只有倒数第六位bit为1)】|
|StakingEpoch|uint32(4bytes)|当前变更质押金额时的结算周期|
|StakingBlockNum|uint64(8bytes)|发起质押时的区块高度|
|Shares|string(0x十六进制字符串)|当前候选人总共质押加被委托的von数目|
|Released|string(0x十六进制字符串)|发起质押账户的自由金额的锁定期质押的von|
|ReleasedHes|string(0x十六进制字符串)|发起质押账户的自由金额的犹豫期质押的von|
|RestrictingPlan|string(0x十六进制字符串)|发起质押账户的锁仓金额的锁定期质押的von|
|RestrictingPlanHes|string(0x十六进制字符串)|发起质押账户的锁仓金额的犹豫期质押的von|
|ExternalId|string|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|NodeName|string|被质押节点的名称(有长度限制，表示该节点的名称)|
|Website|string|节点的第三方主页(有长度限制，表示该节点的主页)|
|Details|string|节点的描述(有长度限制，表示该节点的描述)|



#### 治理

* 提交文本提案，send 发送交易。

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2000)|
|verifier|discover.NodeID(64bytes)|提交提案的验证人|
|pIDID|string(uint64)|PIPID|

* 提交升级提案，send 发送交易。

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2001)|
|verifier|discover.NodeID(64bytes)|提交提案的验证人|
|pIDID|string(uint64)|PIPID|
|newVersion|uint32(4bytes)|升级版本|
|endVotingRounds|uint64|投票共识轮数量。说明：假设提交提案的交易，被打包进块时的共识轮序号时round1，则提案投票截止块高，就是round1 + endVotingRounds这个共识轮的第230个块高（假设一个共识轮出块250，ppos揭榜提前20个块高，250，20都是可配置的 ），其中0 < endVotingRounds <= 4840（约为2周，实际论述根据配置可计算），且为整数）|


* 提交取消提案，send 发送交易。

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2005)|
|verifier|discover.NodeID(64bytes)|提交提案的验证人|
|pIDID|string(uint64)|PIPID|
|endVotingRounds|uint64|投票共识轮数量。参考提交升级提案的说明，同时，此接口中此参数的值不能大于对应升级提案中的值|
|tobeCanceledProposalID|common.hash(32bytes)|待取消的升级提案ID|


* 给提案投票，send 发送交易。

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2003)|
|verifier|discover.NodeID(64bytes)|投票验证人|
|proposalID|common.Hash(32bytes)|提案ID|
|option|uint8(1byte)|投票选项|
|programVersion|uint32(4bytes)|节点代码版本，有rpc的getProgramVersion接口获取|
|versionSign|common.VesionSign(65bytes)|代码版本签名，有rpc的getProgramVersion接口获取|

* 版本声明，send 发送交易。

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2004)|
|verifier|discover.NodeID(64bytes)|声明的节点，只能是验证人/候选人|
|programVersion|uint32(4bytes)|声明的版本，有rpc的getProgramVersion接口获取|
|versionSign|common.VesionSign(65bytes)|声明的版本签名，有rpc的getProgramVersion接口获取|

* 查询提案，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|2100)|
|proposalID|common.Hash(32bytes)|提案ID|

返参：Proposal接口实现对象的json字符串

* 查询提案结果，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2101)|
|proposalID|common.Hash(32bytes)|提案ID|

返参：TallyResult对象的json字符串

* 查询提案列表，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2102)|

返参：Proposal接口实现对象列表的json字符串。


* 查询节点的链生效版本，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2103)|

返参：版本号的json字符串，如{65536}，表示版本是：1.0.0。
解析时，需要把ver转成4个字节。主版本：第二个字节；小版本：第三个字节，patch版本，第四个字节。


* 查询提案的累积可投票人数，call 查询

入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2105)|
|proposalID|common.Hash(32bytes)|提案ID|
|blockHash|common.Hash(32bytes)|块hash|

返参：
是个[]uint16数组

|名称|类型|说明|
|---|---|---|
||uint16|累积可投票人数|
||uint16|赞成票数|
||uint16|反对票数|
||uint16|弃权票数|

**ProposalType 提案类型定义**

|类型|定义|说明|
|---|---|---|
|TextProposal|0x01|文本提案|
|VersionProposal|0x02|升级提案|
|CancelProposal|0x04|取消提案|

**ProposalStatus 提案状态定义**

对文本提案来说，有：0x01,0x02,0x03三种状态；
对升级提案来说，有：0x01,0x03,0x04,0x05,0x06四种状态。
对取消提案来说，有：0x01,0x02,0x03三种状态；

|类型|定义|说明|
|---|---|---|
|Voting|0x01|投票中|
|Pass|0x02|投票通过|
|Failed|0x03|投票失败|
|PreActive|0x04|（升级提案）预生效|
|Active|0x05|（升级提案）生效|
|Canceled|0x06|（升级提案）被取消|

**VoteOption 投票选项定义**

|类型|定义|说明|
|---|---|---|
|Yeas|0x01|支持|
|Nays|0x02|反对|
|Abstentions|0x03|弃权|

**Proposal接口 提案定义**

子类TextProposal：文本提案

字段说明：

|字段|类型|说明|
|---|---|---|
|ProposalID|common.Hash(32bytes)|提案ID|
|Proposer|common.NodeID(64bytes)|提案节点ID|
|ProposalType|byte|提案类型， 0x01：文本提案； 0x02：升级提案；0x03参数提案；0x04取消提案。|
|PIPID|string|提案PIPID|
|SubmitBlock|8bytes|提交提案的块高|
|EndVotingBlock|8bytes|提案投票结束的块高，系统根据SubmitBlock|


子类VersionProposal：升级提案

字段说明：

|字段|类型|说明|
|---|---|---|
|ProposalID|common.Hash(32bytes)|提案ID|
|Proposer|common.NodeID(64bytes)|提案节点ID|
|ProposalType|byte|提案类型， 0x01：文本提案； 0x02：升级提案；0x03参数提案；0x04取消提案。|
|PIPID|string|提案PIPID|
|SubmitBlock|8bytes|提交提案的块高|
|EndVotingRounds|8bytes|投票持续的共识周期数量|
|EndVotingBlock|8bytes|提案投票结束的块高，系统根据SubmitBlock，EndVotingRounds算出|
|ActiveBlock|8bytes|提案生效块高，系统根据EndVotingBlock算出|
|NewVersion|uint|升级版本|


子类CancelProposal：取消提案

字段说明：

|字段|类型|说明|
|---|---|---|
|ProposalID|common.Hash(32bytes)|提案ID|
|Proposer|common.NodeID(64bytes)|提案节点ID|
|ProposalType|byte|提案类型， 0x01：文本提案； 0x02：升级提案；0x03参数提案；0x04取消提案。|
|PIPID|string|提案PIPID|
|SubmitBlock|8bytes|提交提案的块高|
|EndVotingRounds|8bytes|投票持续的共识周期数量|
|EndVotingBlock|8bytes|提案投票结束的块高，系统根据SubmitBlock，EndVotingRounds算出|
|TobeCanceled|common.Hash(32bytes)|提案要取消的升级提案ID|


**Vote 投票定义**

|字段|类型|说明|
|---|---|---|
|voter|64bytes|投票验证人|
|proposalID|common.Hash(32bytes)|提案ID|
|option|VoteOption|投票选项|

**TallyResult 投票结果定义**

|字段|类型|说明|
|---|---|---|
|proposalID|common.Hash(32bytes)|提案ID|
|yeas|uint16(2bytes)|赞成票|
|nays|uint16(2bytes)|反对票|
|abstentions|uint16(2bytes)|弃权票|
|accuVerifiers|uint16(2bytes)|在整个投票期内有投票资格的验证人总数|
|status|byte|状态|
|canceledBy|common.Hash(32bytes)|当status=0x06时，记录发起取消的ProposalID|

#### 举报惩罚

* 举报双签，send 发送交易。


| 参数     | 类型   | 描述                                    |
| -------- | ------ | --------------------------------------- |
| funcType | uint16(2bytes) | 代表方法类型码(3000)                    |
| typ      | uint8         | 代表双签类型，<br />1：prepareBlock，2：prepareVote，3：viewChange |
| data     | string | 单个证据的json值，格式参照[RPC接口Evidences][evidences_interface] |

* 查询节点是否已被举报过多签，call 查询

入参：

| 参数        | 类型           | 描述                                                         |
| ----------- | -------------- | ------------------------------------------------------------ |
| funcType    | uint16(2bytes) | 代表方法类型码(3001)                                         |
| typ         | uint32         | 代表双签类型，<br />1：prepareBlock，2：prepareVote，3：viewChange |
| addr        | 20bytes        | 举报的节点地址                                               |
| blockNumber | uint64         | 多签的块高                                                   |

回参：

| 类型   | 描述           |
| ------ | -------------- |
| 16进制 | 举报的交易Hash |



#### 锁仓

* 创建锁仓计划，send 发送交易。

入参：

| 参数    | 类型           | 说明                                                         |
| ------- | -------------- | ------------------------------------------------------------ |
| account | 20bytes | `锁仓释放到账账户`                                           |
| plan    | []RestrictingPlan | plan 为 RestrictingPlan 类型的列表（数组），RestrictingPlan 定义如下：<br>type RestrictingPlan struct { <br/>    Epoch uint64<br/>    Amount：\*big.Int<br/>}<br/>其中，Epoch：表示结算周期的倍数。与每个结算周期出块数的乘积表示在目标区块高度上释放锁定的资金。Epoch \* 每周期的区块数至少要大于最高不可逆区块高度。<br>Amount：表示目标区块上待释放的金额。 |

* 获取锁仓信息，call 查询

注：本接口支持获取历史数据，请求时可附带块高，默认情况下查询最新块的数据。


入参：

| 参数    | 类型    | 说明               |
| ------- | ------- | ------------------ |
| account | 20bytes | `锁仓释放到账账户` |

返参：

返回参数为下面字段的 json 格式字符串

| 名称    | 类型            | 说明                                                         |
| ------- | --------------- | ------------------------------------------------------------ |
| balance | string(0x十六进制字符串) | 总锁仓余额-已释放金额                                                     |
| pledge    | string(0x十六进制字符串) |质押/抵押金额 |
| debt  | string(0x十六进制字符串)            | 欠释放金额                                                 |
| plans    | bytes           | 锁仓分录信息，json数组：[{"blockNumber":"","amount":""},...,{"blockNumber":"","amount":""}]。其中：<br/>blockNumber：\*big.Int，释放区块高度<br/>amount：\string(0x十六进制字符串)，释放金额 |

### 内置合约错误码说明
| 错误码    | 说明            |
| ------- | --------------- | 
|301000  | Wrong bls public key|
|301001  | Wrong bls public key proof|
|301002  | The Description length is wrong|
|301003  | The program version sign is wrong|
|301004  | The program version of the relates node's is too low|
|301005  | DeclareVersion is failed on create staking|
|301006  | The address must be the same as initiated staking|
|301100  | Staking deposit too low|
|301101  | This candidate is already exist|
|301102  | This candidate is not exist|
|301103  | This candidate status was invalided|
|301104  | IncreaseStake von is too low|
|301105  | Delegate deposit too low|
|301106  | The account is not allowed to be used for delegating|
|301107  | The candidate does not accept the delegation|
|301108  | Withdrew delegation von is too low|
|301109  | This delegation is not exist|
|301110  | The von operation type is wrong|
|301111  | The von of account is not enough|
|301112  | The blockNumber is disordered|
|301113  | The von of delegation is not enough|
|301114  | Withdrew delegation von calculation is wrong|
|301115  | The validator is not exist|
|301116  | The fn params is wrong|
|301117  | The slashing type is wrong|
|301118  | Slashing amount is overflow|
|301119  | Slashing candidate von calculate is wrong|
|301200  | Getting verifierList is failed|
|301201  | Getting validatorList is failed|
|301202  | Getting candidateList is failed|
|301203  | Getting related of delegate is failed|
|301204  | Query candidate info failed|
|301205  | Query delegate info failed|

