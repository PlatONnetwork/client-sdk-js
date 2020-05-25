## Web3.js Interface 

Interact with nodes through web3 objects provided by web3.js. On the underlying implementation, it communicates with the local node through RPC calls. web3.js can connect to any PlatON node that exposes the RPC interface.

### Usage

First, make sure the nodeJS environment is successfully installed locally. `WEB3.JS` uses the [lerna](https://github.com/lerna/lerna) management tool to optimize the workflow of the multi-package code base hosted on `git/npm`, so you make sure before installing The lerna package has been installed globally. If not, execute the command `npm i lerna -g` for global installation. 

Then you can integrate client-sdk-js into the project project through package management tools such as npm or yarn, the steps are as follows:

- npm: `npm i PlatONnetwork/client-sdk-js`
- yarn: `yarn add PlatONnetwork/client-sdk-js`

Create a web3 instance and set up a provider. You can refer to the following code:

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

After successful introduction, you can use the relevant API of web3.


### API Reference

#### web3.version

`web3.version`: Contains the current package version of the web3.js library.

Method:

```js
Web3.version
web3.version
```

Returns:

`String`: Current version number.

Example:

```js
web3.version;
> "0.11.0"
```

***

#### web3.modules

`web3.modules` Will return an object with the classes of all major sub modules, to be able to instantiate them manually.

Method:

```js
Web3.modules
web3.modules
```

Returns:

`Object`: A list of module constructors:

*  `Platon` - Function: The PlatON module for interacting with the PlatON network see web3.platon for more.
*  `Net` - Function: The Net module for interacting with network properties see web3.platon.net for more.
*  `Personal` - Function: The Personal module for interacting with the PlatON accounts see web3.platon.personal for more.

Example:

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

`web3.setProvider()` Will change the provider for its module.

Method:

```
web3.setProvider(myProvider)
web3.platon.setProvider(myProvider)
...
```

Notes: When called on the umbrella package web3 it will also set the provider for all sub modules web3.platon, web3.shh, etc EXCEPT web3.bzz which needs a separate provider at all times.

Parameter:

`Object` - `myProvider`: a valid provider.

Returns:

`Boolean`

Example:

```js
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');
// or
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
```

***

#### web3.providers

Contains the current available providers.

Method:

```
web3.providers
web3.platon.providers
...
```

Returns:

`Object`， with the following providers:

* `Object` - `HttpProvider`: The HTTP provider is deprecated, as it won’t work for subscriptions.
* `Object` - `WebsocketProvider`: The Websocket provider is the standard for usage in legacy browsers.

Example:

```js
var Web3 = require('web3');
// // use the given Provider, e.g in Mist, or instantiate a new websocket provider.
var web3 = new Web3(Web3.givenProvider || 'ws://remotenode.com:8546');
// or
var web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://remotenode.com:8546'));
```

***

#### web3.givenProvider

When using web3.js in an Ethereum compatible browser, it will set with the current native provider by that browser. Will return the given provider by the (browser) environment, otherwise null.

Method:

```
web3.givenProvider
web3.platon.givenProvider
...
```

Returns:

`Object`:  The given provider set or null;

***

#### web3.currentProvider

`web3.currentProvider` Will return the current provider, otherwise null.

Method:

```
web3.currentProvider
web3.platon.currentProvider
...
```

Returns:

`Object`： The current provider set or null;

***

#### web3.BatchRequest

`web3.BatchRequest` Class to create and execute batch requests.

Method:

```
new web3.BatchRequest()
new web3.platon.BatchRequest()
```

Parameter:

none


Returns:

`Object`: With the following methods:

*  `add(request)`: To add a request object to the batch call.
*  `execute()`: Will execute the batch request.

Example:

```js
var contract = new web3.platon.Contract(abi, address);

var batch = new web3.BatchRequest();
batch.add(web3.platon.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
batch.add(contract.methods.balance(address).call.request({from: '0x0000000000000000000000000000000000000000'}, callback2));
batch.execute();
```

***

#### web3.platon.defaultAccount

`web3.platon.defaultAccount` This default address is used as the default "from" property, if no "from" property is specified in for the following methods:

*  web3.platon.sendTransaction()
*  web3.platon.call()
*  new web3.platon.Contract() -> myContract.methods.myMethod().call()
*  new web3.platon.Contract() -> myContract.methods.myMethod().send()

Method:

```
web3.platon.defaultAccount
```

Property：

`String` - 20 Bytes: 20 Bytes: Any PlatON address. You should have the private key for that address in your node or keystore. (Default is undefined)

Example:

```js
web3.platon.defaultAccount;
> undefined

// set the default account
web3.platon.defaultAccount = '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe';
```

***

#### web3.platon.defaultBlock

`web3.platon.defaultBlock` The default block is used for certain methods. 

*  web3.platon.getBalance()
*  web3.platon.getCode()
*  web3.platon.getTransactionCount()
*  web3.platon.getStorageAt()
*  web3.platon.call()
*  new web3.platon.Contract() -> myContract.methods.myMethod().call()

You can override it by passing in the defaultBlock as last parameter. 

Method:

```
web3.platon.defaultBlock
```

Property:

Default block parameters can be one of the following:

*  `Number`: A block number
*  `"genesis"` - `String`: The genesis block
*  `"latest"` - `String`: The latest block (current head of the blockchain)
*  `"pending"` - `String`: The currently mined block (including pending transactions)

Default is "latest"

Example:

```js
web3.platon.defaultBlock;
> "latest"

// set the default block
web3.platon.defaultBlock = 231;
```

***

#### web3.platon.getProtocolVersion

Returns the ethereum protocol version of the node.

Method:

```
web3.platon.getProtocolVersion([callback])
```

Returns:

`Promise` returns `String`: the protocol version.

Example:

```js
web3.platon.getProtocolVersion().then(console.log);
> "63"
```

***

#### web3.platon.isSyncing

`web3.platon.isSyncing()` Checks if the node is currently syncing and returns either a syncing object, or false.

Method:

```
web3.platon.isSyncing([callback])
```

Returns:

`Promise` returns `Object|Boolean` - A sync object when the node is currently syncing or false:

* `startingBlock` - `Number`: The block number where the sync started.
* `currentBlock` - `Number`: The block number where at which block the node currently synced to already.
* `highestBlock` - `Number`: The estimated block number to sync to.
* `knownStates` - `Number`: The estimated states to download.
* `pulledStates` - `Number`: The already downloaded states.

Example:

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

`web3.platon.getGasPrice()` Returns the current gas price oracle. The gas price is determined by the last few blocks median gas price.

Method:

```
web3.platon.getGasPrice([callback])
```

Returns:

`Promise` returns `String` - Number string of the current gas price in von.

Example:

```js
web3.platon.getGasPrice().then(console.log);
> "20000000000"
```

***

#### web3.platon.getAccounts

`web3.platon.getAccounts()` Returns a list of accounts the node controls.

Method:

```
web3.platon.getAccounts([callback])
```

Returns:

`Promise` returns `Array` - An array of addresses controlled by node.

Example:

```js
web3.platon.getAccounts().then(console.log);
> ["0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "0xDCc6960376d6C6dEa93647383FfB245CfCed97Cf"]
```

***

#### web3.platon.getBlockNumber

`web3.platon.getBlockNumber()` Returns the current block number.

Method:

```
web3.platon.getBlockNumber([callback])
```

Returns:

`Promise` returns `Number` - The number of the most recent block.

Example:

```js
web3.platon.getBlockNumber().then(console.log);
> 2744
```

***

#### web3.platon.getBalance

`web3.platon.getBalance()` Get the balance of an address at a given block.

Method:

```
web3.platon.getBalance(address [, defaultBlock] [, callback])
```

Parameter:

*  `address`：String - The address to get the balance of.
*  `defaultBlock`：Number|String -  (optional) If you pass this parameter it will not use the default block set with web3.platon.defaultBlock. Pre-defined block numbers as "latest", "earliest", "pending", and "genesis" can also be used.
*  `callback`：Function - (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `String` - The current balance for the given address in von.

Example:

```js
web3.platon.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
.then(console.log);
> "1000000000000"
```

***

#### web3.platon.getStorageAt

`web3.platon.getStorageAt()` Get the storage at a specific position of an address.

Method:

```
web3.platon.getStorageAt(address, position [, defaultBlock] [, callback])
```

Parameter:

*  `address` - `String`: The address to get the storage from.
*  `position` - `Number`: The index position of the storage.
*  `defaultBlock` -`Number|String` (optional) If you pass this parameter it will not use the default block set with web3.platon.defaultBlock. Pre-defined block numbers as "latest", "earliest", "pending", and "genesis" can also be used.
*  `callback` -`Function`: (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `String` - The value in storage at the given position.

Example:

```js
web3.platon.getStorageAt("0x407d73d8a49eeb85d32cf465507dd71d507100c1", 0)
.then(console.log);
> "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"
```

***

#### web3.platon.getCode

`web3.platon.getCode()` Get the code at a specific address.

Method:

```
web3.platon.getCode(address [, defaultBlock] [, callback])
```

Parameter:

*  `address` - `String`: The address to get the code from.
*  `defaultBlock` - `Number|String`: (optional) If you pass this parameter it will not use the default block set with web3.platon.defaultBlock. Pre-defined block numbers as "latest", "earliest", "pending", and "genesis" can also be used.
*  `callback` - `Function`: (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `String` - The data at given address address.

Example:

```js
web3.platon.getCode("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8")
.then(console.log);
> "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
```

***

#### web3.platon.getBlock

`web3.platon.getBlock()` Returns a block matching the block number or block hash.

Method:

```
web3.platon.getBlock(blockHashOrBlockNumber [, returnTransactionObjects] [, callback])
```

Parameter:

*  `blockHashOrBlockNumber` - `String|Number`: The block number or block hash. Or the string "genesis", "latest", "earliest", or "pending" as in the default block parameter.
*  `returnTransactionObjects` - `Boolean`: (optional, default false) If specified true, the returned block will contain all transactions as objects. By default it is false so, there is no need to explictly specify false. And, if false it will only contains the transaction hashes.
*  `callback` - `Function`: (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

Promise returns Object - The block object:

* `number` - `Number`: The block number. null when its pending block.
* `hash` 32 Bytes - `String`: Hash of the block. null when its pending block.
* `parentHash` 32 Bytes - `String`: Hash of the parent block.
* `nonce` 8 Bytes - `String`: Hash of the generated proof-of-work. null when its pending block.
* `sha3Uncles` 32 Bytes - `String`: SHA3 of the uncles data in the block.
* `logsBloom` 256 Bytes - `String`: The bloom filter for the logs of the block. null when its pending block.
* `transactionsRoot` 32 Bytes - `String`: The root of the transaction trie of the block
* `stateRoot` 32 Bytes - `String`: The root of the final state trie of the block.
* `miner` - `String`: The address of the beneficiary to whom the mining rewards were given.
* `difficulty` - `String`: Integer of the difficulty for this block.
* `totalDifficulty` - `String`: Integer of the total difficulty of the chain until this block.
* `extraData` - `String`: The “extra data” field of this block.
* `size` - `Number`: Integer the size of this block in bytes.
* `gasLimit` - `Number`: The maximum gas allowed in this block.
* `gasUsed` - `Number`: The total used gas by all transactions in this block.
* `timestamp` - `Number`: The unix timestamp for when the block was collated.
* `transactions` - `Array`: Array of transaction objects, or 32 Bytes transaction hashes depending on the returnTransactionObjects parameter.
* `uncles` - `Array`: Array of uncle hashes.

Example:

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

`web3.platon.getBlockTransactionCount()` Returns the number of transaction in a given block.

Method:

```
web3.platon.getBlockTransactionCount(blockHashOrBlockNumber [, callback])
```

Parameter:

*  `blockHashOrBlockNumber` - `String|Number`: The block number or hash. Or the string "genesis", "latest", "earliest", or "pending" as in the default block parameter.
*  `callback` - `Function`: (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `Number` - The number of transactions in the given block.

Example:

```js
web3.platon.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
.then(console.log);
> 1
```

***

#### web3.platon.getTransaction

`web3.platon.getTransaction()` Returns a transaction matching the given transaction hash.

Method:

```
web3.platon.getTransaction(transactionHash [, callback])
```

Parameter:

*  `transactionHash` - `String`: The transaction hash.
*  `callback` - `Function`:  (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `Object` - A transaction object its hash `transactionHash`:

* `hash` 32 Bytes - `String:` Hash of the transaction.
* `nonce` - `Number`: The number of transactions made by the sender prior to this one.
* `blockHash` 32 Bytes - `String`: Hash of the block where this transaction was in. null when its pending.
* `blockNumber` - `Number`: Block number where this transaction was in. null when its pending.
* `transactionIndex` - `Number`: Integer of the transactions index position in the block. null when its pending.
* `from` - `String`: Address of the sender.
* `to` - `String`: Address of the receiver. null when its a contract creation transaction.
* `value` - `String`: Value transferred in von.
* `gasPrice` - `String`: Gas price provided by the sender in von.
* `gas` - `Number`: Gas provided by the sender.
* `input` - `String`: The data sent along with the transaction.

Example:

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

`web3.platon.getTransactionFromBlock()` Returns a transaction based on a block hash or number and the transactions index position.

Method:

```
getTransactionFromBlock(hashStringOrNumber, indexNumber [, callback])
```

Parameter:

*  `hashStringOrNumber`：String - A block number or hash. Or the string "genesis", "latest", "earliest", or "pending" as in the default block parameter.
*  `indexNumber`：Number - The transactions index position.
*  `callback`：Function - (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `Object` - A transaction object, see web3.eth.getTransaction:

Example:

```js
var transaction = web3.platon.getTransactionFromBlock('0x4534534534', 2)
.then(console.log);
> // see web3.platon.getTransaction
```

***

#### web3.platon.getTransactionReceipt

`web3.platon.getTransactionReceipt()` Returns the receipt of a transaction by transaction hash.

Notes: The receipt is not available for pending transactions and returns null.

Method:

```
web3.platon.getTransactionReceipt(hash [, callback])
```

Parameter:

*  `hash`：String - The transaction hash.
*  `callback`：Function - (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `Object` - A transaction receipt object, or null when no receipt was found:

* `status` - `Boolean`: TRUE if the transaction was successful, FALSE, if the EVM reverted the transaction.
* `blockHash` 32 Bytes - `String`: Hash of the block where this transaction was in.
* `blockNumber` - `Number`: Block number where this transaction was in.
* `transactionHash` 32 Bytes - `String`: Hash of the transaction.
* `transactionIndex`- `Number`: Integer of the transactions index position in the block.
* `from` - `String`: Address of the sender.
* `to` - `String`: Address of the receiver. null when its a contract creation transaction.
* `contractAddress` - `String`: The contract address created, if the transaction was a contract creation, otherwise null.
* `cumulativeGasUsed` - `Number`: The total amount of gas used when this transaction was executed in the block.
* `gasUsed` - `Number`: The amount of gas used by this specific transaction alone.
* `logs` - `Array`: Array of log objects, which this transaction generated.


Example:

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

`web3.platon.getTransactionCount()` Get the numbers of transactions sent from this address.

Method:

```
web3.platon.getTransactionCount(address [, defaultBlock] [, callback])
```

Parameter:

*  `address`：String - The address to get the numbers of transactions from.
*  `defaultBlock`：Number|String -  (optional) If you pass this parameter it will not use the default block set with web3.platon.defaultBlock. Pre-defined block numbers as "latest", "earliest", "pending", and "genesis" can also be used.
*  `callback`：Function -  (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `Number` - The number of transactions sent from the given address.

Example:

```js
web3.platon.getTransactionCount("0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe")
.then(console.log);
> 1
```

***

#### web3.platon.sendTransaction

`web3.platon.sendTransaction()` Sends a transaction to the network.

Method:

```
web3.platon.sendTransaction(transactionObject [, callback])
```

Parameter:

*  `transactionObject`：`Object` - The transaction object to send:
	* `from` - `String|Number`: The address for the sending account. Uses the web3.platon.defaultAccount property, if not specified. Or an address or index of a local wallet in web3.platon.accounts.wallet.
	* `to` - `String`: (optional) The destination address of the message, left undefined for a contract-creation transaction.
	* `value` - `Number|String|BN|BigNumber`: (optional) The value transferred for the transaction in wei, also the endowment if it’s a contract-creation transaction.
	* `gas` - `Number`: (optional, default: To-Be-Determined) The amount of gas to use for the transaction (unused gas is refunded).
	* `gasPrice` - `Number|String|BN|BigNumber`: (optional) The price of gas for this transaction in wei, defaults to web3.platon.gasPrice.
	* `data` - `String`: (optional) Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
	* `nonce` - `Number`: (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
*  callback - Function: (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`web3.platon.sendTransaction()` The callback will return the 32 bytes transaction hash.

PromiEvent:  A promise combined event emitter. Will be resolved when the transaction receipt is available. Additionally the following events are available:

*  "transactionHash" returns String: Is fired right after the transaction is sent and a transaction hash is available.
*  "receipt"  returns `Object`: Is fired when the transaction receipt is available.
*  "confirmation" returns Number, Object: Is fired for every confirmation up to the 12th confirmation. Receives the confirmation number as the first and the receipt as the second argument. Fired from confirmation 0 on, which is the block where its minded.
*  "error" returns Error and Object|undefined: Is fired if an error occurs during sending. If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.

Example:

```js
// compiled solidity source code using https://remix.ethereum.org
var code = "603d80600c6000396000f3007c01000000000000000000000000000000000000000000000000000000006000350463c6888fa18114602d57005b6007600435028060005260206000f3";

// using the callback
web3.platon.sendTransaction({
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    data: code // deploying a contracrt
}, function(error, hash){
    ...
});

// using the promise
web3.platon.sendTransaction({
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
    value: '1000000000000000'
})
.then(function(receipt){
    ...
});


// using the event emitter
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

`web3.platon.sendSignedTransaction()` Sends an already signed transaction, generated for example using web3.platon.accounts.signTransaction.

Method:

```
web3.platon.sendSignedTransaction(signedTransactionData [, callback])
```

Parameter:

*  `signedTransactionData`：String - Signed transaction data in HEX format.
*  `callback`：Function -  (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

PromiEvent:  A promise combined event emitter. Will be resolved when the transaction receipt is available.

Please see the return values for web3.platon.sendTransaction for details.

Example:

```js
var Tx = require('ethereumjs-tx');
var Common = require('ethereumjs-common');
var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')

var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}

const customCommon = Common.default.forCustomChain(
  'mainnet',
  {
    name: 'platon',
    networkId: 1,
    chainId: 101,
  },
  'petersburg'
);
var tx = new Tx.Transaction(rawTx, { common: customCommon }	);
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

`web3.platon.sign()` Signs data using a specific account. This account needs to be unlocked.

Method:

```
web3.platon.sign(dataToSign, address [, callback])
```

Parameter:

*  `dataToSign`：String - Data to sign. If String it will be converted using web3.utils.utf8ToHex.
*  `address`：String|Number - Address to sign data with. Or an address or index of a local wallet in web3.platon.accounts.wallet.
*  `callback`：Function - (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `String` - The signature.

Example:

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

`web3.platon.signTransaction()` Signs a transaction. This account needs to be unlocked.

Method:

```
web3.platon.signTransaction(transactionObject, address [, callback])
```

Parameter:

*  `transactionObject`：`Object` - The transaction data to sign web3.eth.sendTransaction() for more.
*  `address`：`String` - Address to sign transaction with.
*  `callback`：`Function` - (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

Promise returns Object - The RLP encoded transaction. The raw property can be used to send the transaction using web3.platon.sendSignedTransaction.

Example:

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

`web3.platon.estimateGas()` Executes a message call or transaction and returns the amount of the gas used.

Method:

```
web3.platon.estimateGas(callObject [, callback])
```

Parameter:

*  `callObject`：Object - A transaction object see web3.platon.sendTransaction, with the difference that for calls the from property is optional as well.
*  `callback`：Function - (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `Number` - the used gas for the simulated call/transaction.

Example:

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

`web3.platon.getPastLogs()` Gets past logs, matching the given options.

Method:

```
web3.platon.getPastLogs(options [, callback])
```

Parameter:

*  `options`：Object - The filter options as follows:
   *  fromBlock - Number|String: The number of the earliest block ("latest" may be given to mean the most recent and "pending" currently mining, block). By default "latest".
   *  toBlock - Number|String: The number of the latest block ("latest" may be given to mean the most recent and "pending" currently mining, block). By default "latest".
   *  address - String|Array: An address or a list of addresses to only get logs from particular account(s).
   *  topics - Array: An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x12...']. You can also pass an array for each topic with options for that topic e.g. [null, ['option1', 'option2']]

Returns:

`Promise` returns `Array` - Array of log objects.

The structure of the returned event `Object` in the `Array` looks as follows:

* `address` - `String`: From which this event originated from.
* `data` - `String`: The data containing non-indexed log parameter.
* `topics` - `Array`: An array with max 4 32 Byte topics, topic 1-3 contains indexed parameters of the log.
* `logIndex` - `Number`: Integer of the event index position in the block.
* `transactionIndex` - `Number`: Integer of the transaction’s index position, the event was created in.
* `transactionHash` 32 Bytes - `String`: Hash of the transaction this event was created in.
* `blockHash` 32 Bytes - `String`: Hash of the block where this event was created in. null when its still pending.
* `blockNumber` - `Number`: The block number where this log was created in. null when still pending.

Example:

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

The web3.platon.subscribe function lets you subscribe to specific events in the blockchain.

Method:

```
web3.platon.subscribe(type [, options] [, callback]);
```

Parameter:

*  `type`：String - The subscription, you want to subscribe to.
*  `options`：Mixed - (optional) Optional additional parameters, depending on the subscription type.
*  `callback`：Function - (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription, and the subscription itself as 3 parameter.

Returns:

EventEmitter -  A Subscription instance:

* `subscription.id`: The subscription id, used to identify and unsubscribing the subscription.
* `subscription.subscribe([callback])`: Can be used to re-subscribe with the same parameters.
* `subscription.unsubscribe([callback])`: Unsubscribes the subscription and returns TRUE in the callback if successfull.
* `subscription.arguments`: The subscription arguments, used when re-subscribing.
	 `on("data")` returns Object: 	Fires on each incoming log with the log object as argument.
* `on("changed")` returns Object: Fires on each log which was removed from the blockchain. The log will have the additional property `"removed: true"`.
* `on("error")` returns Object: Fires when an error in the subscription occurs.
* `on("connected")` returns String: Fires once after the subscription successfully connected. Returns the subscription id.

Notification returns:

Mixed -  depends on the subscription, see the different subscriptions for more.

Example:

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

`web3.platon.clearSubscriptions()` Resets subscriptions. This will not reset subscriptions from other packages like web3-shh, as they use their own requestManager.

Method:

```
web3.platon.clearSubscriptions(flag)
```

Parameters:

*  `flag`：Boolean -  值为true则表示保持同步订阅

Returns:

`Boolean`： If true it keeps the "syncing" subscription.

Example:

```js
web3.platon.subscribe('logs', {} ,function(){ ... });

...

web3.platon.clearSubscriptions();
```

***

#### web3.platon.subscribe("pendingTransactions")

`pendingTransactions` Subscribes to incoming pending transactions.

Method:

```
web3.platon.subscribe('pendingTransactions' [, callback]);
```

Parameter:

*  `type`：String - "pendingTransactions"，the type of the subscription.
*  `callback`：Function - (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription.

Returns:

`EventEmitter`: An subscription instance as an event emitter with the following events:

*  "data" returns `String`: Fires on each incoming pending transaction and returns the transaction hash.
*  "error" returns `Object`: Fires when an error in the subscription occurs.

Notification returns:

*  Object|Null -  First parameter is an error object if the subscription failed.
*  Object - Second parameter is the transaction hash.

Example:

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

`newBlockHeaders` Subscribes to incoming block headers. This can be used as timer to check for changes on the blockchain.

Method:

```
web3.platon.subscribe('newBlockHeaders' [, callback]);
```

Parameter:

*  `type`：`String` - `"newBlockHeaders"`, the type of the subscription.
*  `callback`：`Function` -  (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription.

Returns:

`EventEmitter`: An subscription instance as an event emitter with the following events:

*  `"data"`  returns `Object`: Fires on each incoming block header.
*  `"error"` returns `Object`: Fires when an error in the subscription occurs.

The structure of a returned block header is as follows:

* `number` - `Number`: The block number. null when its pending block.
* `hash` 32 Bytes - `String`: Hash of the block. null when its pending block.
* `parentHash` 32 Bytes - `String`: Hash of the parent block.
* `nonce` 8 Bytes - `String`: Hash of the generated proof-of-work. null when its pending block.
* `sha3Uncles` 32 Bytes - `String`: SHA3 of the uncles data in the block.
* `logsBloom` 256 Bytes - `String`: The bloom filter for the logs of the block. null when its pending block.
* `transactionsRoot` 32 Bytes - `String`: The root of the transaction trie of the block
* `stateRoot` 32 Bytes - `String`: The root of the final state trie of the block.
* `receiptsRoot` 32 Bytes - `String`: The root of the receipts.
* `miner` - `String`: The address of the beneficiary to whom the mining rewards were given.
* `extraData` - `String`: The “extra data” field of this block.
* `gasLimit` - `Number`: The maximum gas allowed in this block.
* `gasUsed` - `Number`: The total used gas by all transactions in this block.
* `timestamp` - `Number`: The unix timestamp for when the block was collated.


Notification returns:

* `Object|Null` - First parameter is an error object if the subscription failed.
* `Object` - The block header object like above.

Example:

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

`syncing` Subscribe to syncing events. This will return an object when the node is syncing and when its finished syncing will return FALSE.

Method:

```
web3.platon.subscribe('syncing' [, callback]);
```

Parameter:

*  `type`：String - `"syncing"`, the type of the subscription.
*  `callback`：`Function` -  (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription.

Returns:

`EventEmitter`: An subscription instance as an event emitter with the following events:

* `"data"`  returns `Object`: Fires on each incoming sync object as argument.
* `"changed"` returns `Object`: Fires when the synchronisation is started with true and when finished with false.
* `"error"` returns `Object`: Fires when an error in the subscription occurs.

For the structure of a returned event Object see `web3.platon.isSyncing` return values.

Notification returns:

* `Object|Null` - First parameter is an error object if the subscription failed.
* `Object|Boolean` - The syncing object, when started it will return true once or when finished it will return false once.

Example:

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

Subscribes to incoming logs, filtered by the given options. If a valid numerical fromBlock options property is set, Web3 will retrieve logs beginning from this point, backfilling the response as necessary.

Method:

```
web3.platon.subscribe('logs', options [, callback]);
```

Parameter:

*  `"logs"` ：`String`, the type of the subscription.
*  `options`：`Object` - The subscription options:
   * `fromBlock` - `Number`: The number of the earliest block. By default null.
   * `address` - `String|Array`: An address or a list of addresses to only get logs from particular account(s).
   * `topics` - `Array`:  An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x00...']. You can also pass another array for each topic with options for that topic e.g. [null, ['option1', 'option2']]
*  `callback` - Function:  An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x00...']. You can also pass another array for each topic with options for that topic e.g. [null, ['option1', 'option2']].

Returns:

EventEmitter: An subscription instance as an event emitter with the following events:

* `"data"` returns `Object`: Fires on each incoming log with the log object as argument.
* `"changed"` returns `Object`: returns Object: Fires on each log which was removed from the blockchain. The log will have the additional property "removed: true".
* `"error"`  returns `Object`: Fires when an error in the subscription occurs.

For the structure of a returned event Object see web3.platon.getPastEvents return values.

Notification returns:

* `Object|Null` - First parameter is an error object if the subscription failed.
* `Object` - The log object like in web3.platon.getPastEvents return values.

Example:

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

The `web3.platon.Contract` object makes it easy to interact with smart contracts on the PlatON blockchain. When you create a new contract object you give it the json interface of the respective smart contract and web3 will auto convert all calls into low level ABI calls over RPC for you.

This allows you to interact with smart contracts as if they were JavaScript objects.

To use it standalone:

```
new web3.platon.Contract(jsonInterface[, address][, options])
```

Parameter:

* `jsonInterface` - `Object`: The json interface for the contract to instantiate
* `address` - `String`: (optional): The address of the smart contract to call.
* `options` - `Object` : (optional): The options of the contract. Some are used as fallbacks for calls and transactions:
   * `from` - `String`: The address transactions should be made from.
   * `gasPrice` - `String`: The gas price in von to use for transactions.
   * `gas` - `Number`: The maximum gas provided for a transaction (gas limit).
   * `data` - `String`: The byte code of the contract. Used when the contract gets deployed.
   * `vmType` - `Number`: The contract type。0 means solidity contract, 1 means wasm contract. The default is the solidity contract. (New field)

Returns:

`Object`: The contract instance with all its methods and events.

Example:

```js
var myContract = new web3.platon.Contract([...], '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', {
    from: '0x1234567890123456789012345678901234567891', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
```

***

#### options

The options object for the contract instance. from, gas and gasPrice are used as fallback values when sending transactions.

Method:

```
myContract.options
```

`options` options:

* `address` - `String`: The address where the contract is deployed. 
* `jsonInterface` - `Array`: The json interface of the contract.
* `data` - `String`: The byte code of the contract.
* `from` - `String`: The address transactions should be made from.
* `gasPrice` - `String`: The gas price in von to use for transactions.
* `gas` - `Number`: The maximum gas provided for a transaction (gas limit).

Example:

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

#### options.address - contract address

The address used for this contract instance. All transactions generated by web3.js from this contract will contain this address as the “to”. The address will be stored in lowercase.

Method:

```
myContract.options.address
```

Property:

`address` - `String|null`:  The address for this contract, or null if it’s not yet set.

Example:

```js
myContract.options.address;
> '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'

// set a new address
myContract.options.address = '0x1234FFDD...';
```

***

#### options.jsonInterface

`jsonInterface` The json interface object derived from the ABI of this contract.

Method:

```
myContract.options.jsonInterface
```

Property:

`jsonInterface` - `Array`: The json interface for this contract. Re-setting this will regenerate the methods and events of the contract instance.

Example:

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

// set a new interface
myContract.options.jsonInterface = [...];
```

***

#### deploy

Call this function to deploy the contract to the blockchain. After successful deployment the promise will resolve with a new contract instance.

Method:

```
myContract.deploy(options)
```

Parameter:

`options` - Object: The options used for deployment.

* `data` - `String`: The byte code of the contract.
* `arguments` - `Array`: (optional): The arguments which get passed to the constructor on deployment. If you deploy a wasm contract, you can refer to [wasm contract parameter passing reference](https://github.com/PlatONnetwork/client-sdk-js/blob/feature/wasm/test/1_platon_wasm.js)。

Returns:

`Object`: The transaction object:

*  `arguments`: `Array` - The arguments passed to the method before. They can be changed.
*  `send`: `Function` - Will deploy the contract. The promise will resolve with the new contract instance, instead of the receipt!
*  `estimateGas`: `Function` - Will estimate the gas used for deploying.
*  `encodeABI`: `Function` - Encodes the ABI of the deployment, which is contract data + constructor parameters

Example:

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
   console.log(receipt.contractAddress) // contains the new contract address
})
.on('confirmation', function(confirmationNumber, receipt){ ... })
.then(function(newContractInstance){
    console.log(newContractInstance.options.address) // instance with the new contract address
});


// When the data is already set as an option to the contract itself
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


// Simply encoding
myContract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
})
.encodeABI();
> '0x12345...0000012345678765432'


// Gas estimation
myContract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
})
.estimateGas(function(err, gas){
    console.log(gas);
});
```

***

#### methods

Creates a transaction object for that method, which then can be called, send, estimated.

If it is a wasm contract, you can refer to [wasm contract parameter passing reference](https://github.com/PlatONnetwork/client-sdk-js/blob/feature/wasm/test/1_platon_wasm.js)。

Method:

```
myContract.methods.myMethod([param1[, param2[, ...]]])
```

The methods of this smart contract are available through:

* The name: myContract.methods.myMethod(123)
* The name with parameters: myContract.methods\['myMethod(uint256)'\](123)
* The signature: myContract.methods\['0x58cf5f10'\](123)

This allows calling functions with same name but different parameters from the JavaScript contract object.

Parameter:

Parameters of any method depend on the smart contracts methods, defined in the JSON interface.

Returns:

Object: The transaction object:

*  `arguments`: Array - The arguments passed to the method before. They can be changed.
*  `call`: Function -  Will call the “constant” method and execute its smart contract method in the EVM without sending a transaction (Can’t alter the smart contract state).
*  `send`: Function - Will send a transaction to the smart contract and execute its method (Can alter the smart contract state).
*  `estimateGas`: Function - Will estimate the gas used when the method would be executed on chain.
*  `encodeABI`: Function -  Encodes the ABI for this method. This can be send using a transaction, call the method or passing into another smart contracts method as argument.

Example:

```js
// calling a method
myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'}, function(error, result){
    ...
});

// or sending and using a promise
myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
.then(function(receipt){
    // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
});

// or sending and using the events
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

#### methods.myMethod.call

Will call a “constant” method and execute its smart contract method in the EVM without sending any transaction. Note calling can not alter the smart contract state.

Method:

```
myContract.methods.myMethod([param1[, param2[, ...]]]).call(options[, callback])
```

Parameter:

*  `options` - Object :  (optional): The options used for calling.
   *  `from` - String (optional): The address the call “transaction” should be made from.
   *  gasPrice - String (optional): The gas price in wei to use for this call “transaction”.
   *  gas - Number (optional): The maximum gas provided for this call “transaction” (gas limit).
*  `callback` - Function : (optional): This callback will be fired with the result of the smart contract method execution as the second argument, or with an error object as the first argument.

Returns:

Promise returns Mixed: The return value(s) of the smart contract method. If it returns a single value, it’s returned as is. If it has multiple return values they are returned as an object with properties and indices:
Example:

```js
// using the callback
myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'}, function(error, result){
    ...
});

// using the promise
myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
.then(function(result){
    ...
});
```

MULTI-ARGUMENT RETURN:

```
// Solidity
contract MyContract {
    function myFunction() returns(uint256 myNumber, string myString) {
        return (23456, "Hello!%");
    }
}
```


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

SINGLE-ARGUMENT RETURN:

```
// Solidity
contract MyContract {
    function myFunction() returns(string myString) {
        return "Hello!%";
    }
}
```

Then in web3.js, the `call` method will also return a single value:

```
// web3.js
var MyContract = new web3.platon.contract(abi, address);
MyContract.methods.myFunction().call()
.then(console.log);
> "Hello!%"
```

***

#### send - methods.myMethod.send

Will send a transaction to the smart contract and execute its method. Note this can alter the smart contract state.

Method:

```
myContract.methods.myMethod([param1[, param2[, ...]]]).send(options[, callback])
```

Parameter:

* `options` - `Object`: The options used for sending.
   * `from` - `String`: The address the transaction should be sent from.
   * `gasPrice` - `String`:  (optional): The gas price in von to use for this transaction.
   * `gas` - `Number`: (optional): The maximum gas provided for this transaction (gas limit).
   * `value` - `Number|String|BN|BigNumber`: (optional): The value transferred for the transaction in von.
* `callback` - `Function`: (optional): This callback will be fired first with the “transactionHash”, or with an error object as the first argument.

Returns:

The callback will return the 32 bytes transaction hash.

PromiEvent: A promise combined event emitter. Will be resolved when the transaction receipt is available, OR if this send() is called from a someContract.deploy(), then the promise will resolve with the new contract instance. Additionally the following events are available:

*  "transactionHash" returns `String`: is fired right after the transaction is sent and a transaction hash is available.
*  "receipt" returns `Object`: is fired when the transaction receipt is available. Receipts from contracts will have no logs property, but instead an events property with event names as keys and events as properties. See getPastEvents return values for details about the returned event object.
*  "confirmation" returns `Number`, Object: is fired for every confirmation up to the 24th confirmation. Receives the confirmation number as the first and the receipt as the second argument. Fired from confirmation 1 on, which is the block where it’s minded.
*  "error" returns `Error and Object|undefined`: Is fired if an error occurs during sending. If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.

Example:

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

#### estimateGas - methods.myMethod.estimateGas

Will call estimate the gas a method execution will take when executed in the EVM without. The estimation can differ from the actual gas used when later sending a transaction, as the state of the smart contract can be different at that time.

Method:

```
myContract.methods.myMethod([param1[, param2[, ...]]]).estimateGas(options[, callback])
```

Parameter:

*  `options` - `Object`: (optional): The options used for calling.
   - `from` - `String`: (optional): The address the call “transaction” should be made from.
   - `gas` - `Number` : (optional): The maximum gas provided for this call “transaction” (gas limit). Setting a specific value helps to detect out of gas errors. If all gas is used it will return the same number.
   - `value` - `Number|String|BN|BigNumber`:  (optional): The value transferred for the call “transaction” in von.
   
* `callback` - `Function` : (optional): This callback will be fired with the result of the gas estimation as the second argument, or with an error object as the first argument.

Returns:

Promise returns Number: The gas amount estimated.

Example:

```js
// using the callback
myContract.methods.myMethod(123).estimateGas({gas: 5000000}, function(error, gasAmount){
    if(gasAmount == 5000000)
        console.log('Method ran out of gas');
});

// using the promise
myContract.methods.myMethod(123).estimateGas({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
.then(function(gasAmount){
    ...
})
.catch(function(error){
    ...
});
```

***

#### encodeABI - methods.myMethod.encodeABI

Encodes the ABI for this method. This can be used to send a transaction, call a method, or pass it into another smart contracts method as arguments.

Method:

```
myContract.methods.myMethod([param1[, param2[, ...]]]).encodeABI()
```

Parameter:

none

Returns:

`String`: The encoded ABI byte code to send via a transaction or call.

Example:

```js
myContract.methods.myMethod(123).encodeABI();
> '0x58cf5f1000000000000000000000000000000000000000000000000000000000000007B'
```

***

#### events

Subscribe to an event.

Method:

```
myContract.events.MyEvent([options][, callback])
```

Parameter:

* `options` - `Object` (optional): The options used for deployment：
   - `filter` - `Object` (optional): Let you filter events by indexed parameters, e.g. {filter: {myNumber: [12,13]}} means all events where “myNumber” is 12 or 13.
   - `fromBlock` - `Number` (optional): The block number (greater than or equal to) from which to get events on. Pre-defined block numbers as "latest", "earlist", "pending", and "genesis" can also be used.
   - `topics` - `Array` (optional): This allows to manually set the topics for the event filter. If given the filter property and event signature, (topic[0]) will not be set automatically.

* `callback` - `Function` (optional): This callback will be fired for each event as the second argument, or an error as the first argument.

Returns:

EventEmitter: The event emitter has the following events:

* `"data"` returns `Object`: Fires on each incoming event with the event object as argument.
* `"changed"` returns `Object`: Fires on each event which was removed from the blockchain. The event will have the additional property "removed: true".
* `"error"` returns `Object`: Fires when an error in the subscription occours.

The structure of the returned event `Object` looks as follows:

* `event` - `String`: The event name.
* `signature` - `String|Null`: The event signature, null if it’s an anonymous event.
* `address` - `String`: Address this event originated from.
* `returnValues` - `Object`: The return values coming from the event, e.g. {myVar: 1, myVar2: '0x234...'}.
* `logIndex` - `Number`: Integer of the event index position in the block.
* `transactionIndex` - `Number`: Integer of the transaction’s index position the event was created in.
* `transactionHash` 32 Bytes - `String` Hash of the transaction this event was created in.
* `blockHash` 32 Bytes - `String`: Hash of the block this event was created in. null when it’s still pending.
* `blockNumber` - `Number`: The block number this log was created in. null when still pending.
* `raw.data` - `String`: The data containing non-indexed log parameter.
* `raw.topics` - `Array`: An array with max 4 32 Byte topics, topic 1-3 contains indexed parameters of the event.

Example:

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

#### events.allEvents

Method:

```
myContract.events.allEvents([options][, callback])
```

Same as `events` but receives all events from this smart contract. Optionally the filter property can filter those events.

***

#### getPastEvents

Gets past events for this contract.

Method:

```
myContract.getPastEvents(event[, options][, callback])
```

Parameter:

* `event` - `String`: The name of the event in the contract, or "allEvents" to get all events.
* `options` - `Object` (optional): The options used for deployment.
	- `filter` - `Object` (optional): Lets you filter events by indexed parameters, e.g. {filter: {myNumber: [12,13]}} means all events where “myNumber” is 12 or 13.
	- `fromBlock` - `Number|String|BN|BigNumber` (optional): The block number (greater than or equal to) from which to get events on. Pre-defined block numbers as "latest", "earlist", "pending", and "genesis" can also be used.
	- `toBlock` - `Number|String|BN|BigNumber` (optional): The block number (less than or equal to) to get events up to (Defaults to "latest"). Pre-defined block numbers as "latest", "earlist", "pending", and "genesis" can also be used.
	- `topics` - `Array` (optional): This allows manually setting the topics for the event filter. If given the filter property and event signature, (topic[0]) will not be set automatically.
* `callback` - `Function` (optional): This callback will be fired with an array of event logs as the second argument, or an error as the first argument.

Returns:

Promise returns Array: An array with the past event Objects, matching the given event name and filter.

Example:

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

The web3-platon-personal package allows you to interact with the PlatON node’s accounts.

Notes: Many of these functions send sensitive information, like password. Never call these functions over a unsecured Websocket or HTTP provider, as your password will be sent in plain text!

Usage: 

```
var Personal = require('web3.platon-personal');

// "Personal.providers.givenProvider" will be set if in an PlatON supported browser.
var personal = new Personal(Personal.givenProvider || 'ws://some.local-or-remote.node:8546');


// or using the web3 umbrella package

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

// -> web3.platon.personal
```

***

#### web3.platon.personal.newAccount

Creates a new account.

Notes: Never call this function over a unsecured Websocket or HTTP provider, as your password will be send in plain text!

Method:

```
web3.platon.personal.newAccount(password, [callback])
```

Parameter:

password - String: The password to encrypt this account with.

Returns:

`Promise` returns `String`: The address of the newly created account.

Example:

```js
web3.platon.personal.newAccount('!@superpassword')
.then(console.log);
> '0x1234567891011121314151617181920212223456'
```

***

#### web3.platon.personal.sign

The sign method calculates an Ethereum specific signature with:

Notes: Sending your account password over an unsecured HTTP RPC connection is highly unsecure.

Method:

```
web3.platon.personal.sign(dataToSign, address, password [, callback])
```

Parameter:

*  `dataToSign`：String - Data to sign. If String it will be converted using web3.utils.utf8ToHex.
*  `address`：String - Address to sign data with.
*  `password`：String - The password of the account to sign data with.
*  `callback`：Function -  (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `String` - The signature.

Example:

```js
web3.platon.personal.sign("Hello world", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!")
.then(console.log);
> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"

// the below is the same
web3.platon.personal.sign(web3.utils.utf8ToHex("Hello world"), "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!")
.then(console.log);
> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
```

***

#### web3.platon.personal.ecRecover

Recovers the account that signed the data.

Method:

```
web3.platon.personal.ecRecover(dataThatWasSigned, signature [, callback])
```

Parameter:

* `dataThatWasSigned`：`String` -  Data that was signed. If String it will be converted using web3.utils.utf8ToHex.
* `signature`：`String` - The signature.
* `Function` - (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

`Promise` returns `String` - The account.

Example:

```js
web3.platon.personal.ecRecover("Hello world", "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400").then(console.log);
> "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe"
```

***

#### web3.platon.personal.signTransaction

Signs a transaction. This account needs to be unlocked.

Notes: Sending your account password over an unsecured HTTP RPC connection is highly unsecure.

Method:

```
web3.platon.personal.signTransaction(transaction, password [, callback])
```

Parameter:

*  `transaction`：Object - The transaction data to sign web3.platon.sendTransaction() for more.
*  `password`：String - The password of the from account, to sign the transaction with.
*  `callback`：Function - (optional) Optional callback, returns an error object as first parameter and the result as second.

Returns:

Promise returns Object - The RLP encoded transaction. The raw property can be used to send the transaction using web3.platon.sendSignedTransaction.

Example:

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

The web3.platon.abi functions let you de- and encode parameters to ABI (Application Binary Interface) for function calls to the EVM (Ethereum Virtual Machine).

Function List:

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

Encodes the function name to its ABI signature, which are the first 4 bytes of the sha3 hash of the function name including types.

Method:

```
web3.platon.abi.encodeFunctionSignature(functionName);
```

Parameter:

`functionName` - `String|Object`: The function name to encode. or the JSON interface object of the function. If string it has to be in the form function(type,type,...), e.g: myFunction(uint256,uint32[],bytes10,bytes)

Returns:

`String` - The ABI signature of the function.

Example:

```js
// From a JSON interface object
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

// Or string
web3.platon.abi.encodeFunctionSignature('myMethod(uint256,string)')
> '0x24ee0097'
```

***

#### web3.platon.abi.encodeEventSignature

Encodes the event name to its ABI signature, which are the sha3 hash of the event name including input types.

Method:

```
web3.platon.abi.encodeEventSignature(eventName);
```

Parameter:

`eventName` - `String|Object`: The event name to encode. or the JSON interface object of the event. If string it has to be in the form event(type,type,...), e.g: myEvent(uint256,uint32[],bytes10,bytes)

Returns:

`String` - The ABI signature of the event.

Example:

```js
// use params of string.
web3.platon.abi.encodeEventSignature('myEvent(uint256,bytes32)')
> 0xf2eeb729e636a8cb783be044acf6b7b1e2c5863735b60d6daae84c366ee87d97

// or from a json interface object
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

Encodes a function call using its JSON interface object and given paramaters.

Method:

```
web3.platon.abi.encodeFunctionCall(jsonInterface, parameters);
```

Parameter:

* `jsonInterface` - Object: The JSON interface object of a function.
* `parameters` - Array: The parameters to encode.

Returns:

*  `String` - The ABI encoded function call. Means function signature + parameters.

Example:

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

Decodes an ABI encoded parameter to its JavaScript type.

Method:

```
web3.platon.abi.decodeParameter(type, hexString);
```

Parameter:

*  `type` - `String`: The type of the parameter, see the solidity documentation for a list of types.
*  `hexString` - `String`: The ABI byte code to decode.

Returns:

`Mixed` - The decoded parameter.

Example:

```js
web3.platon.abi.decodeParameter('uint256', '0x0000000000000000000000000000000000000000000000000000000000000010');
> "16"

web3.platon.abi.decodeParameter('string', '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000');
> "Hello!%!"
```

***

#### web3.platon.abi.decodeParameters

Decodes ABI encoded parameters to its JavaScript types.

Method:

```
web3.platon.abi.decodeParameters(typesArray, hexString);
```

Parameter:

* `typesArray` - `Array|Object`: An array with types or a JSON interface outputs array. 
* `hexString` - `String`: The ABI byte code to decode.

Returns:

`Object` - The result object containing the decoded parameters.

Example:

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

Decodes ABI encoded log data and indexed topic data.

Method:

```
web3.platon.abi.decodeLog(inputs, hexString, topics);
```

Parameter:

*  inputs - Object: A JSON interface inputs array. See the solidity documentation for a list of types.
*  hexString - String: The ABI byte code in the data field of a log.
*  topics - Array: An array with the index parameter topics of the log, without the topic[0] if its a non-anonymous event, otherwise with topic[0].

Returns:

`Object` - The result object containing the decoded parameters.

Example:

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

This package provides utility functions for PlatON dapps and other web3.js packages

Method:

```js
Web3.utils
web3.utils
```

***

#### web3.utils.randomHex

The randomHex library to generate cryptographically strong pseudo-random HEX strings from a given byte size.

Method:

```
web3.utils.randomHex(size)
```

Parameter:

* `size` - `Number`: The byte size for the HEX string, e.g. 32 will result in a 32 bytes HEX string with 64 characters preficed with “0x”.

Returns:

`String`: The generated random HEX string.

Example:

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

The underscore library for many convenience JavaScript functions.

See the [underscore API](http://underscorejs.org/) reference for details.

Method:

```
web3.utils._
```

Example:

```js
var _ = web3.utils._;

_.union([1,2],[3]);
> [1,2,3]

_.each({my: 'object'}, function(value, key){ ... })
```

***

#### web3.utils.BN

The [BN.js](https://github.com/indutny/bn.js/) library for calculating with big numbers in JavaScript. See the [BN.js](https://github.com/indutny/bn.js/) documentation for details.

Notes: For safe conversion of many types, incl [BigNumber.js](http://mikemcl.github.io/bignumber.js/) use [utils.toBN](https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#utils-tobn)

Method:

```
web3.utils.BN(mixed)
```

Parameter:

*  `mixed` - `String|Number`: A number, number string or HEX string to convert to a BN object.

Returns:

`Object`: The [BN.js](https://github.com/indutny/bn.js/) instance.

Example:

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

`web3.utils.isBN()` Checks if a given value is a [BN.js](https://github.com/indutny/bn.js/) instance.

Method:

```
web3.utils.isBN(bn)
```

Parameter:

`bn` - `Object`: An [BN.js](https://github.com/indutny/bn.js/) instance.

Returns:

`Boolean`

Example:

```
var number = new BN(10);

web3.utils.isBN(number);
> true
```

***

#### web3.utils.isBigNumber

Checks if a given value is a [BigNumber.js](http://mikemcl.github.io/bignumber.js/) instance.

Method:

```
web3.utils.isBigNumber(bignumber)
```

Parameter:

`bignumber` - `Object`: A [BigNumber.js](http://mikemcl.github.io/bignumber.js/) instance.

Returns:

`Boolean`

Example:

```
var number = new BigNumber(10);

web3.utils.isBigNumber(number);
> true
```

***

#### web3.utils.sha3

Will calculate the sha3 of the input.

Notes: To mimic the sha3 behaviour of solidity use [soliditySha3](https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#utils-soliditysha3).

Method:

```
web3.utils.sha3(string)
web3.utils.keccak256(string) // ALIAS
```

Parameter:

`string` - String: A string to hash.

Returns:

`String`:  the result hash.

Example:

```
web3.utils.sha3('234'); // taken as string
> "0xc1912fee45d61c87cc5ea59dae311904cd86b84fee17cc96966216f811ce6a79"

web3.utils.sha3(new BN('234')); 
> "0xbc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a"

web3.utils.sha3(234); 
> null // can't calculate the has of a number

web3.utils.sha3(0xea); // same as above, just the HEX representation of the number
> null

web3.utils.sha3('0xea'); // will be converted to a byte array first, and then hashed
> "0x2f20677459120677484f7104c76deb6846a2c071f9b3152c103bb12cd54d1a4a"
```

***

#### web3.utils.soliditySha3

Will calculate the sha3 of given input parameters in the same way solidity would. This means arguments will be ABI converted and tightly packed before being hashed.

Method:

```
web3.utils.soliditySha3(param1 [, param2, ...])
```

Parameter:

`paramX` - `Mixed`: Any type, or an object with `{type: 'uint', value: '123456'}` or `{t: 'bytes', v: '0xfff456'}`. Basic types are autodetected as follows:

* `String` non numerical UTF-8 string is interpreted as `string`.
* `String|Number|BN|HEX` positive number is interpreted as `uint256`.
* `String|Number|BN` negative number is interpreted as `int256`.
* `Boolean` as `bool`.
* `String` HEX string with leading 0x is interpreted as `bytes`.
* `HEX` HEX number representation is interpreted as `uint256`.

Returns:

`String`: the result hash.

Example:

```js
web3.utils.soliditySha3('234564535', '0xfff23243', true, -10);
// auto detects:        uint256,      bytes,     bool,   int256
> "0x3e27a893dc40ef8a7f0841d96639de2f58a132be5ae466d40087a2cfa83b7179"


web3.utils.soliditySha3('Hello!%'); // auto detects: string
> "0x661136a4267dba9ccdf6bfddb7c00e714de936674c4bdb065a531cf1cb15c7fc"


web3.utils.soliditySha3('234'); // auto detects: uint256
> "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

web3.utils.soliditySha3(0xea); // same as above
> "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

web3.utils.soliditySha3(new BN('234')); // same as above
> "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

web3.utils.soliditySha3({type: 'uint256', value: '234'})); // same as above
> "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

web3.utils.soliditySha3({t: 'uint', v: new BN('234')})); // same as above
> "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"


web3.utils.soliditySha3('0x407D73d8a49eeb85D32Cf465507dd71d507100c1');
> "0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b"

web3.utils.soliditySha3({t: 'bytes', v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1'});
> "0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b" // same result as above


web3.utils.soliditySha3({t: 'address', v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1'});
> "0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b" //same as above, but will do a checksum check, if its multi case


web3.utils.soliditySha3({t: 'bytes32', v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1'});
> "0x3c69a194aaf415ba5d6afca734660d0a3d45acdc05d54cd1ca89a8988e7625b4" // different result as above


web3.utils.soliditySha3({t: 'string', v: 'Hello!%'}, {t: 'int8', v:-23}, {t: 'address', v: '0x85F43D8a49eeB85d32Cf465507DD71d507100C1d'});
> "0xa13b31627c1ed7aaded5aecec71baf02fe123797fffd45e662eac8e06fbe4955"
```

***

#### web3.utils.isHex

Checks if a given string is a HEX string.

Method:

```
web3.utils.isHex(hex)
```

Parameter:

`hex` - `String|HEX`: The given HEX string.

Returns:

`Boolean`：Returns true if the argument is a hexadecimal string, otherwise returns false.

Example:

```js
web3.utils.isHex('0xc1912');
> true

web3.utils.isHex(0xc1912);
> true

web3.utils.isHex('c1912');
> true

web3.utils.isHex(345);
> true  // this is tricky, as 345 can be a a HEX representation or a number, be careful when not having a 0x in front!

web3.utils.isHex('0xZ1912');
> false

web3.utils.isHex('Hello');
> false
```

***

#### web3.utils.isHexStrict

Checks if a given string is a HEX string. Difference to `web3.utils.isHex()` is that it expects HEX to be prefixed with `0x`.

Method:

```
web3.utils.isHexStrict(hex)
```

Parameter:

`hex` - `String|HEX`: The given HEX string.

Returns:

`Boolean`

Example:

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

Checks if a given string is a valid PlatON address. It will also check the checksum, if the address has upper and lowercase letters.

Method:

```
web3.utils.isAddress(address)
```

Parameter:

`address` - `String`: An address string.

Returns:

`Boolean`

Example:

```js
web3.utils.isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d');
> true

web3.utils.isAddress('c1912fee45d61c87cc5ea59dae31190fffff232d');
> true

web3.utils.isAddress('0XC1912FEE45D61C87CC5EA59DAE31190FFFFF232D');
> true // as all is uppercase, no checksum will be checked

web3.utils.isAddress('0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
> true

web3.utils.isAddress('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
> false // wrong checksum
```

***

#### web3.utils.toChecksumAddress

Will convert an upper or lowercase Ethereum address to a checksum address.

Method:

```
web3.utils.toChecksumAddress(address)
```

Parameter:

`address` - `String`: An address string.

Returns:

`String`: The checksum address.

Example:

```js
web3.utils.toChecksumAddress('0xc1912fee45d61c87cc5ea59dae31190fffff2323');
> "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d"

web3.utils.toChecksumAddress('0XC1912FEE45D61C87CC5EA59DAE31190FFFFF232D');
> "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d" // same as above
```

***

#### web3.utils.checkAddressChecksum

Checks the checksum of a given address. Will also return false on non-checksum addresses.

Method:

```
web3.utils.checkAddressChecksum(address)
```

Parameter:

`address` - `String`: An address string.

Returns:

`Boolean`: `true` when the checksum of the address is valid, `false` if its not a checksum address, or the checksum is invalid.

Example:

```js
web3.utils.checkAddressChecksum('0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
> true
```

***

#### web3.utils.toHex

Will auto convert any given value to HEX. Number strings will interpreted as numbers. Text strings will be interpreted as UTF-8 strings.

Method:

```
web3.utils.toHex(mixed)
```

Parameter:

`mixed` - `String|Number|BN|BigNumber`: The input to convert to HEX.

Returns:

String: The resulting HEX string.

Example:

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

Returns the number representation of a given HEX value as a string.

Method:

```
web3.utils.hexToNumberString(hex)
```

Parameter:

`hexString` - `String|HEX`: A string to hash.

Returns:

`String`: The number as a string.

Example:

```js
web3.utils.hexToNumberString('0xea');
> "234"
```

***

#### web3.utils.hexToNumber

Returns the number representation of a given HEX value.

This is not useful for big numbers, rather use [utils.toBN](https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#utils-tobn) instead.

Method:

```
web3.utils.hexToNumber(hex)
web3.utils.toDecimal(hex) // ALIAS, deprecated
```

Parameter:

`hexString` - `String|HEX`: A string to hash.

Returns:

`Number`

Example:

```js
web3.utils.hexToNumber('0xea');
> 234
```

***

#### web3.utils.numberToHex

Returns the HEX representation of a given number value.

Method:

```
web3.utils.numberToHex(number)
web3.utils.fromDecimal(number) // ALIAS, deprecated
```

Parameter:

`number` - `String|Number|BN|BigNumber`: A number as string or number.

Returns:

`String`: The HEX value of the given number.

Example:

```js
web3.utils.numberToHex('234');
> '0xea'
```

***

#### web3.utils.hexToUtf8

Returns the UTF-8 string representation of a given HEX value.

Method:

```
web3.utils.hexToUtf8(hex)
web3.utils.hexToString(hex) // ALIAS
web3.utils.toUtf8(hex) // ALIAS, deprecated
```

Parameter:

`hex` - `String`: A HEX string to convert to a UTF-8 string.

Returns:

`String`: The UTF-8 string.

Example:

```js
web3.utils.hexToUtf8('0x49206861766520313030e282ac');
> "I have 100€"
```

***

#### web3.utils.hexToAscii

Returns the ASCII string representation of a given HEX value.

Method:

```
web3.utils.hexToAscii(hex)
web3.utils.toAscii(hex) // ALIAS, deprecated
```

Parameter:

`hex` - `String`:  A HEX string to convert to a ASCII string.

Returns:

`String`: The ASCII string.

Example:

```js
web3.utils.hexToAscii('0x4920686176652031303021');
> "I have 100!"
```

***

#### web3.utils.utf8ToHex

Returns the HEX representation of a given UTF-8 string.

Method:

```
web3.utils.utf8ToHex(string)
web3.utils.stringToHex(string) // ALIAS
web3.utils.fromUtf8(string) // ALIAS, deprecated
```

Parameter:

`string` - `String`: A UTF-8 string to convert to a HEX string.

Returns:

`String`: The HEX string.

Example:

```js
web3.utils.utf8ToHex('I have 100€');
> "0x49206861766520313030e282ac"
```

***

#### web3.utils.asciiToHex

Returns the HEX representation of a given ASCII string.

Method:

```
web3.utils.asciiToHex(string)
web3.utils.fromAscii(string) // ALIAS, deprecated
```

Parameter:

`string` - `String`: A ASCII string to convert to a HEX string.

Returns: 

`String`: The HEX string.

Example:

```js
web3.utils.asciiToHex('I have 100!');
> "0x4920686176652031303021"
```

***

#### web3.utils.hexToBytes

Returns a byte array from the given HEX string.

Method:

```
web3.utils.hexToBytes(hex)
```

Parameter:

`hex` - `String|HEX`: A HEX to convert.

Returns:

`Array`: The byte array.

Example:

```js
web3.utils.hexToBytes('0x000000ea');
> [ 0, 0, 0, 234 ]

web3.utils.hexToBytes(0x000000ea);
> [ 234 ]
```

***

#### web3.utils.toVon

Converts any lat value value into von.

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

Method:

```
web3.utils.toVon(number [, unit])
```

Parameter:

*  `number` - `String|Number|BN`: The value. 
*  `unit` - String，(optional, defaults to "lat"): The ether to convert from. 


Returns:

`String|BN`: If a string is given it returns a number string, otherwise a [BN.js](https://github.com/indutny/bn.js/) instance.

Example:

```js
web3.utils.toVon('1', 'lat');
> "1000000000000000000"
```

***

#### web3.utils.fromVon

Converts any von value into a lat value.

Method:

```
web3.utils.fromVon(number [, unit])
```

Converts any von value into a lat value.

Parameter:

`number` - `String|Number|BN`: The value in von.
`unit` - `String`，(optional, defaults to "lat"): The ether to convert to. Possible units are:

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

Returns:

`String|BN`: It always returns a string number.

Example:

```js
web3.utils.fromVon('1', 'lat');
> "0.000000000000000001"
```

***

#### web3.utils.padLeft

Adds a padding on the left of a string, Useful for adding paddings to HEX strings.

Method:

```
web3.utils.padLeft(string, characterAmount [, sign])
web3.utils.leftPad(string, characterAmount [, sign]) // ALIAS
```

Parameter:

*  `string` - `String`: The string to add padding on the left.
*  `characterAmount` - `Number`: The number of characters the total string should have.
*  `sign` - `String`(optional): The character sign to use, defaults to `"0"`.

Returns:

`String`:  The padded string.

Example:

```js
web3.utils.padLeft('0x3456ff', 20);
> "0x000000000000003456ff"

web3.utils.padLeft(0x3456ff, 20);
> "0x000000000000003456ff"

web3.utils.padLeft('Hello', 20, 'x');
> "xxxxxxxxxxxxxxxHello"
```

***

## Built-in Contract Call

### Overview

The `call` or `send` function of ppos (the built-in contract related to the economic model) is used to convert the parameters passed into the parameters required by the rpc interface `platon_call` or `platon_sendRawTransaction` call, and then send the transaction to the node. And some helper functions needed to complete the call and send parameters.

### Usage

When you call `const web3 = new Web3('http://127.0.0.1:6789');` to instantiate a web3, the system will automatically append a ppos object after `web3`. In other words, you can use `web3.ppos` to call some methods of` ppos`. But if you want to use the ppos object to send transactions on the chain, in addition to the `provider` passed in when instantiating` web3`, you need to send at least the private key and chain id required for transaction signing, where the chain id can be passed through rpc Get `chainId 'returned by interface` admin_nodeInfo`: xxx`

Of course, in order to satisfy multiple ppos that can be instantiated arbitrarily (for example, I want to instantiate 3 ppos to different chains to send transaction calls at the same time), I will also attach a PPOS object to the web3 object (note all capitalization). You can call `new PPOS (setting)` to instantiate a ppos object. An example call is as follows:

```JavaScript
(async () => {
    const Web3 = require('web3');
    const web3 = new Web3('http://192.168.120.164:6789');
    const ppos = web3.ppos; 

    // Update the configuration of ppos, this step must be done to send on-chain transactions.
    // Since the provider has been passed in when instantiating web3, it is not necessary to pass in the provider.
    ppos.updateSetting({
        privateKey: 'acc73b693b79bbb56f89f63ccc3a0c00bf1b8380111965bfe8ab22e32045600c',
        chainId: 101,
    })

    let data, reply;

    // Passing parameters to send transactions in the form of objects: 1000. createStaking (): initiate a pledge.
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
        rewardPer: 500, //传500就是5%的奖励作为委托奖励
        programVersion: undefined, // rpc get
        programVersionSign: undefined, // rpc get 
        blsPubKey: ppos.hexStrBuf(blsPubKey),
        blsProof: undefined, // rpc get 
    }
    let pv = await ppos.rpc('admin_getProgramVersion');
    let blsProof = await ppos.rpc('admin_getSchnorrNIZKProve');
    data.programVersion = pv.Version;
    data.programVersionSign = pv.Sign;
    data.blsProof = ppos.hexStrBuf(blsProof);
    reply = await ppos.send(data);
    console.log('createStaking params object reply: ', JSON.stringify(reply, null, 2));

    // Sending transactions as an array： 1000. createStaking() : Initiate a pledge.
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
        500,
        pv.Version,
        pv.Sign,
        ppos.hexStrBuf(blsPubKey),
        ppos.hexStrBuf(blsProof)
    ];
    //Since it has been called above, the trade fair is on the chain, but the business will fail.
    reply = await ppos.send(data);
    console.log('createStaking params array reply: ', reply);

    // Passing parameters as objects： 1102. getCandidateList() : Query all real-time candidate lists.
    data = {
        funcType: 1102,
    }
    reply = await ppos.call(data);
    console.log('getCandidateList params object reply: ', reply);

    //Passing parameters as an array： 1102. getCandidateList() : Query all real-time candidate lists.
    data = [1102];
    reply = await ppos.call(data);
    console.log('getCandidateList params array reply: ', reply);

    // Re-instantiate a ppos1 object and call it.
    const ppos1 = new web3.PPOS({
        provider: 'http://127.0.0.1:6789',
        privateKey: '9f9b18c72f8e5154a9c59af2a35f73d1bdad37b049387fc6cea2bac89804293b',
        chainId: 101,
    })
    reply = await ppos1.call(data);
})()
```

The log information is output as follows. In order to save space, there are cuts:

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

### API Usage

#### updateSetting(setting)

Update the configuration parameters of the `ppos` object. If you only need to send a call, you only need to pass in the parameter `provider`. If you passed in the provider when instantiating web3. Then the `provider` of` ppos` is the provider that you instantiate from web3 by default. Of course you can also update the provider at any time.

If you want to send a transaction via send, you need to pass in the parameters `provider`, the private key, and the chain id. Of course, sending transactions requires setting four parameters: `gas`,` gasPrice`, `retry`, and` interval`. See the `async send (params, [other])` description for details.

For the parameters passed in, you can choose partial update. For example, if you want to use the private key A when sending a transaction to a ppos object, then you execute `ppos.updateSetting before calling` send (params, [other]) `({privateKey: youPrivateKeyA})` to update the private key. Once updated, the current configuration will be overwritten, and the send transaction interface will be called later, with the last updated configuration as the default.

Parameters:

* `setting` - `Object`:
  * `provider` - `String`: network link.
  * `privateKey` - `String`: pairvate key.
  * `chainId` - `String`: id of chain.
  * `gas` - `String`: Maximum gas consumption value, please enter a hexadecimal string, such as '0xf4240'.
  * `gasPrice` - `String`: Fuel price, please enter a hexadecimal string, such as '0x746a528800'.
  * `retry` - `Number`: The number of times to query the receipt.
  * `interval` - `Number`: Time interval to query the transaction receipt, the unit is `ms`.

Returns:

none 

Example:

```JavaScript
ppos.updateSetting({
    privateKey: 'acc73b693b79bbb56f89f63ccc3a0c00bf1b8380111965bfe8ab22e32045600c',
    chainId: 101,
})

ppos.updateSetting({
    privateKey: '9f9b18c72f8e5154a9c59af2a35f73d1bdad37b049387fc6cea2bac89804293b'
})
```

***

#### getSetting()

Querying configured parameters.

Parameters:

none

Returns:

* `setting` - `Object`
  * `provider` - `String`: Network RPC link.
  * `privateKey` - `String`: private key.
  * `chainId` - `String`: id of chain.
  * `gas` - `String`: Maximum limit of gas.
  * `gasPrice` - `String`: Unit price of Gas.
  * `retry` - `Number`: Number of retries for query receipt.
  * `interval` - `Number`: Query the interval of the transaction receipt object, the unit is ms.

Example:

```JavaScript
let setting = ppos.getSetting();
```

***

#### async rpc(method, [params])

Helper function to initiate rpc requests. Because some parameters need to be obtained through rpc during the process of calling ppos to send a transaction, an rpc is intentionally encapsulated for invocation. Note that this interface is an async function, you need to add await to return the result of the call, otherwise it returns a Promise object.

Parameters:

* `method` - `String`: method name.
* `params` - `Array`: Parameter required for calling the rpc interface. If the rpc interface does not require parameters, this parameter can be omitted.
  

Returns:

* `reply`: Results returned by rpc call.

Example:

```JavaScript
// Get program version
let reply = await ppos.rpc('admin_getProgramVersion'); 

// Get all accounts
let reply = await ppos.rpc('platon_accounts')

// Get the amount of the specified account.
let reply = await ppos.rpc('platon_getBalance', ["0x714de266a0effa39fcaca1442b927e5f1053eaa3","latest"])
```

***

#### bigNumBuf(intStr)

Converts a large decimal integer into a buffer object that can be accepted by RLP encoding. A helper function. Because JavaScript's positive number range can only be expressed as a maximum of `2^53`, in order for RLP to encode large integers, you need to convert the decimal large integer of the string into the corresponding Buffer. Note that this interface can only convert large decimal integers to Buffer temporarily. If it is a hexadecimal string, you need to convert it to a decimal string first.

Parameters:

* `intStr` - `String`: String decimal large integer.
  

Returns:

* `buffer` - `Buffer`: A cache area.

Example:

```JavaScript
let buffer = ppos.bigNumBuf('1000000000000000000000000000000000000000000'); 
```

***

#### hexStrBuf(hexStr)

Converts a hexadecimal string into a buffer object that can be accepted by RLP encoding, a helper function. In the process of sending transactions by ppos, many parameters need to be transmitted as `bytes` instead of` string`, such as `nodeId 64bytes` pledged node Id (also called candidate node Id)`. The nodeId when writing code can only be expressed as a string. It needs to be converted into a 64 bytes Buffer.

Note: If the string you pass in starts with `0x` or` 0X`, the system will assume that you are a hexadecimal string that does not encode the first two letters. If you really want to encode `0x` or` 0X`, you must prefix the string with `0x`. For example, if you want to encode the full string `0x31c0e0 (4 bytes)`, you must pass in 0x0x31c0e0.

Parameters:

* `hexStr` - `String`: A hex string.
  

Returns:

* `buffer` - `Buffer`: A cache area.

Example:

```JavaScript
const nodeId = '80f1fcee54de74dbf7587450f31c31c0e057bedd4faaa2a10c179d52c900ca01f0fb255a630c49d83b39f970d175c42b12a341a37504be248d76ecf592d32bc0';
let buffer = ppos.hexStrBuf(nodeId); 
```

***

#### async call(params)

Send a `call` query call to` PPOS` without changing the state. So you need to distinguish between querying and sending transactions. The input parameters can select objects or arrays. If you choose to pass in an object, then you need to use the specified string `key`, but the order of the` key` is not required. You can write `{a: 1, b: 'hello'}` or `{b: 'hello', a: 1}` without any problem.

If you choose to use an array as the input parameter, you must put the parameters into the array in the order of the input parameters. Note that for some string large integers and `bytes' that need to be passed in, please choose the interfaces` bigNumBuf (intStr) `and` hexStrBuf (hexStr) `provided above to convert them by themselves.

Note that this interface is an async function, you need to add await to return the result of the call, otherwise it returns a Promise object.

Parameters:

* `params` - `Object|Array`: Call parameters.
  

Returns:

1. `reply` - `Object`: The result of the call. Note that I have turned the returned results into Object objects.
  * `Code` - `Number`: Return code, 0 means the result of the call is normal.
  * `Data` - `Array|Object|String|Number`: Return the corresponding type according to the result of the call.
  * `ErrMsg` - `String`: Error message.

`Query the NodeID and Pledged Id of the node entrusted by the current account address` The input parameters of this interface are from top to bottom. The input parameters are as follows:

| name | Type | Desc |
|---|---|---|
|funcType|uint16(2bytes)| Method type code(1103) |
|addr|common.address(20bytes)| Client's account address |

Example:

```JavaScript
let params, reply;

// Called by passing in an object (the order is not required for the key)
params = {
    funcType: 1103,
    addr: ppos.hexStrBuf("0xe6F2ce1aaF9EBf2fE3fbA8763bABaDf25e3fb5FA")
}
reply = await ppos.call(params);

// Calling as an array object.
params = [1103, ppos.hexStrBuf("0xe6F2ce1aaF9EBf2fE3fbA8763bABaDf25e3fb5FA")];
reply = await ppos.call(params);
```

***

#### async send(params, [other])

Send a transaction to `ppos`.

Trading will involve some parameters, such as `gas`,` gasPrice`. After the transaction is sent, in order to confirm whether the transaction is on the chain, you need to continuously poll the result on the chain through the transaction hash. There is an interval between the number of polls `retry` and each poll.

For the four parameters mentioned above, `gas`,` gasPrice`, `retry`,` interval`, if the `other` input parameter is specified, the` other` parameter is used. If the other parameter is not specified, the parameter specified by updateSetting (setting) is used when calling the function, otherwise the default value is used.

Note: This interface is an async function, you need to add await to return the result of the call, otherwise it returns a Promise object.

Parameters:

* `params` - `Object|Array`: Transaction parameters.
* `other` - `Object`(Optional): 
  * `gas` - `String`: Gas limit, default '0xf4240'.
  * `gasPrice` - `String`: Gas price, default '0x746a528800'.
  * `retry` - `Number`: Query the number of transaction receipt objects. The default is 600 times.
  * `interval` - `Number`: Query the interval of the transaction receipt object, the unit is ms. The default is 100 ms.

Returns:

1. `reply` - `Object`: Receipt object for the specified transaction hash.
	* `status` - `Boolean`: Successful transaction returns true, false if EVM rolls back the transaction.
	* `blockHash` 32 Bytes - `String`: The hash of the block
	* `blockNumber` - `Number`: The number of the block
	* `transactionHash` 32 Bytes - `String`: The hash of transaction.
	* `transactionIndex` - `Number`: Index position of the transaction in the block.
	* `from` - `String`: Address of the sender of the transaction.
	* `to` - `String`: The address of the transaction receiver. For the transaction that created the contract, the value is null.
	* `contractAddress` - `String`: For transactions that create a contract, the value is the contract address created, otherwise null.
	* `cumulativeGasUsed` - `Number`: Cumulative total gas usage of the block where the transaction is executed.
	* `gasUsed` - `Number`: Total gas consumed by this transaction.
	* `logs` - `Array`: Array of log objects generated by this transaction.

2. `errMsg` - `String`: If the call fails and there is no receipt after the sending transaction returns, the error message `no hash` is returned. If there is a receipt after sending the transaction, but no receipt object is found within the specified time, then `getTransactionReceipt txHash ${hash} interval ${interval} ms by ${retry} retry failed`.

Call the interface that initiates the delegation. The input parameters are: 

| Parameter | Type | Desc |
|---|---|---|
| funcType | uint16(2bytes) | type code of method. (1004)|
| typ| uint16(2bytes) | Indicates whether to use the free amount of the account or the locked amount of the account as the commission, 0: free amount; 1: locked amount |
| nodeId| 64bytes | NodeId of the pledged node |
| amount| big.Int(bytes) | Amount entrusted (Calculated in the smallest unit，1LAT = 10^18 von)|

Example:

```JavaScript
const nodeId = "f71e1bc638456363a66c4769284290ef3ccff03aba4a22fb60ffaed60b77f614bfd173532c3575abe254c366df6f4d6248b929cb9398aaac00cbcc959f7b2b7c";
let params, others, reply;

// Objects as parameters (the order is not required for keys)
params = {
    funcType: 1004,
    typ: 0,
    nodeId: ppos.hexStrBuf(nodeId),
    amount: ppos.bigNumBuf("10000000000000000000000")
}
reply = await ppos.send(params);

// Array as parameter.
params = [1004, 0, ppos.hexStrBuf(nodeId), ppos.bigNumBuf("10000000000000000000000")];
reply = await ppos.send(params);

// Default configuration
other = {
    retry: 300, 
    interval: 200 
}
params = [1004, 0, ppos.hexStrBuf(nodeId), ppos.bigNumBuf("10000000000000000000000")];
reply = await ppos.send(params, other);
```

### Pledge Module

#### Initiate Pledge

Pledge by sending transactions via send.

| Parameter | Type | Desc |
|---|---|---|
|funcType|uint16(2bytes)|Type code of method(1000)|
|typ|uint16(2bytes)|Indicates whether to use the account free amount or the account's locked amount as a pledge, 0: free amount; 1: locked amount|
|benefitAddress|20bytes|Revenue account for receiving block rewards and pledged rewards|
|nodeId|64bytes|The node ID of the pledged (also called the node ID of the candidate)|
|externalId|string|External Id (with a length limit, the Id described by the third-party pull node)|
|nodeName|string|The name of the node being pledged (there is a length limitation, indicating the name of the node)|
|website|string|The third-party home page of the node (the length is limited, indicating the home page of the node)|
|details|string|The description of the node (the length is limited, indicating the description of the node)|
|amount|*big.Int(bytes)|Pledged von|
|rewardPer|uint16(2bytes)|The percentage of rewards obtained from delegation is BasePoint 1BP = 0.01%|
|programVersion|uint32|Real version of the program, governance rpc acquisition|
|programVersionSign|65bytes|The true version signature of the program and the rpc interface of the governance module|
|blsPubKey|96bytes|bls public key|
|blsProof|64bytes|Proof of bls, obtained by pulling the proof interface|

#### Update Pledge Information

Modify the pledge information by sending the transaction.

| Parameter | Type | Desc |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(1001)|
|benefitAddress|20bytes|Revenue account for receiving block rewards and pledged rewards|
|nodeId|64bytes|The node ID of the pledged (also called the node ID of the candidate)|
|rewardPer|uint16(2bytes)|The percentage of rewards obtained from delegation is BasePoint 1BP = 0.01%|
|externalId|string| External Id (with a length limit, the Id described by the third-party pull node) |
|nodeName|string| The name of the node being pledged (there is a length limitation, indicating the name of the node) |
|website|string| The third-party home page of the node (the length is limited, indicating the home page of the node) |
|details|string| The description of the node (the length is limited, indicating the description of the node) |


#### Increase Pledge

Increase pledge by sending transactions.

Parameters:

| Parameter | Type | Desc |
|---|---|---|
|funcType|uint16(2bytes)| Method type code(1002) |
|nodeId|64bytes| The node ID of the pledged (also called the node ID of the candidate) |
|typ|uint16(2bytes)| Indicates whether to use the account free amount or the account's locked amount as a pledge, 0: free amount; 1: locked amount |
|amount|*big.Int(bytes)| Increased von |


#### Cancellation Of Pledge

Send the transaction to cancel the pledge.

Notes: All cancellations are initiated at once, and the amount is divided into multiple returns to the account.

| Parameter | Type | Desc |
|---|---|---|
|funcType|uint16(2bytes)| Method type code(1003) |
|nodeId|64bytes| NodeId of the pledged node |

#### Initiate Delegation

Initiate delegation by sending a transaction.

| Parameter | Type | Desc |
|---|---|---|
|funcType|uint16(2bytes)| Method type code(1004) |
|typ|uint16(2bytes)| Indicates whether to use the free amount of the account or the locked amount of the account as the commission, 0: free amount; 1: locked amount |
|nodeId|64bytes| NodeId of the pledged node |
|amount|*big.Int(bytes)| Amount entrusted (based on the smallest unit, 1LAT = 10 ** 18 von) |

#### Reduction/Revocation Delegation

Completed by sending a transaction(All reductions are cancelled).

| Parameter | Type | Desc |
|---|---|---|
|funcType|uint16(2bytes)| Method type code(1005) |
|stakingBlockNum|uint64(8bytes)| A unique identifier representing a pledge of a node |
|nodeId|64bytes| NodeId of the pledged node |
|amount|*big.Int(bytes) | Amount of reduction entrustment (calculated by the smallest unit, `1LAT = 10 ** 18 von`) |


#### Query Validators

Query the validator of the current settlement cycle by calling.

Parameters:

| Parameter | Type | Desc |
|---|---|---|
|funcType|uint16(2bytes)| Method type code(1100) |

**Unified query result format**

| Field | Type | Desc |
|---|---|---|
|Code|uint32| Indicates the error code returned by the ppos built-in contract |
|Data|string| Query result of json string |
|ErrMsg|string| Error message |

> Note: The following query interfaces (the interfaces called by `platon_call`) are returned in the above format unless otherwise specified

Returns: List

| Field | Type | Desc |
|---|---|---|
|NodeId|64bytes| The node ID of the pledged (also called the node ID of the candidate) |
|StakingAddress|20bytes| The account used when initiating the pledge (this account can only be used for subsequent pledge information. When the pledge is cancelled, `von` will be returned to the account or the account lock information) |
|BenefitAddress|20bytes| Revenue account for receiving block rewards and pledged rewards |
|StakingTxIndex|uint32(4bytes)| Index of transactions when pledge is initiated |
|ProgramVersion|uint32| The real version number of the PlatON process of the pledged node (the interface for obtaining the version number is provided by the governance) |
|StakingBlockNum|uint64(8bytes)| Block height when pledge is initiated |
|Shares|*big.Int(bytes)| The current candidate's total pledge plus the number of `von` entrusted |
|ExternalId|string| External Id (with a length limit, the Id described by the third-party pull node) |
|NodeName|string| The name of the node being pledged (there is a length limitation, indicating the name of the node) |
|Website|string| The third-party home page of the node (the length is limited, indicating the home page of the node) |
|Details|string| The description of the node (the length is limited, indicating the description of the node) |
|ValidatorTerm|uint32(4bytes)| Validator's term (it will always be 0 in the 101 validator snapshots of the settlement cycle, and will only be valued when the validator of the consensus round, it is also 0 when it is just selected, and +1 when it stays in office) |


#### Query Validator list

Query the list of validators by call.

Parameters:

| Field | Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)| Method type code(1101) |

Returns: List

| Field | Type | Remark |
|---|---|---|
|NodeId|64bytes| The node ID of the pledged (also called the node ID of the candidate). |
|StakingAddress|20bytes| The account used when initiating the pledge (the pledge information can only be used for this operation in subsequent operations. When the pledge is cancelled, von will be returned to the account or the account lock information) |
|BenefitAddress|20bytes| Revenue account for receiving block rewards and pledged rewards |
|StakingTxIndex|uint32(4bytes)| Index of transactions when pledge is initiated |
|ProgramVersion|uint32(4bytes)| The real version number of the PlatON process of the pledged node (the interface for obtaining the version number is provided by the governance)  |
|StakingBlockNum|uint64(8bytes)| Block height when pledge is initiated |
|Shares|*big.Int(bytes)| The current candidate's total pledge plus the number of entrusted von |
|ExternalId|string| External Id (with a length limit, the Id described by the third-party pull node) |
|NodeName|string| The name of the node being pledged (there is a length limitation, indicating the name of the node) |
|Website|string| The third-party home page of the node (the length is limited, indicating the home page of the node) |
|Details|string| The description of the node (the length is limited, indicating the description of the node) |
|ValidatorTerm|uint32(4bytes)| Validator's term (it will always be 0 in the 101 validator snapshots of the settlement cycle, and will only be valued when the validator of the consensus round, it is also 0 when it is just selected, and +1 when it stays in office) |

#### Query Real-time Candidate List

Query real-time candidate list by call.

Parameters:

| Field | Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(1102)|

Returns:List

| Field | Type | Remark |
|---|---|---|
|NodeId|64bytes| The node ID of the pledged (also called the node ID of the candidate). |
|StakingAddress|20bytes| The account used when initiating the pledge (the pledge information can only be used for this operation in subsequent operations. When the pledge is cancelled, von will be returned to the account or the account lock information) |
|BenefitAddress|20bytes| Revenue account for receiving block rewards and pledged rewards |
|StakingTxIndex|uint32(4bytes)| Index of transactions when pledge is initiated |
|ProgramVersion|uint32(4bytes)| The real version number of the PlatON process of the pledged node (the interface for obtaining the version number is provided by the governance)  |
|Status|uint32(4bytes)|The status of the candidate (the status is placed according to the 32bit of uint32, there can be multiple states at the same time, and the value is the sum of multiple simultaneous state values [0: node available (32 bits are all 0); 1: node Not available (only the last bit is 1); 2: The node has a low block generation rate but does not meet the removal condition (only the penultimate bit is 1); 4: The node's von is not enough to meet the minimum pledge threshold (only the penultimate bit 1); 8: The node is reported with a double sign (only the penultimate bit is 1)); 16: the node's block generation rate is low and the removal condition is met (the penultimate bit is 1); 32: the node actively initiates the cancellation (Only the penultimate bit is 1)]|
|StakingEpoch|uint32(4bytes)| Settlement cycle when current pledge amount is changed |
|StakingBlockNum|uint64(8bytes)| Block height when pledge is initiated |
|Shares|string| The current candidate's total pledge plus the number of entrusted von |
|Released|string|Initiating a free amount locked period pledge of a pledged account `von`|
|ReleasedHes|string| Freedom to initiate a pledge account with a hesitation period of von von |
|RestrictingPlan|string| Initiating the lock-up period of the pledged account's lock-up amount `von` |
|RestrictingPlanHes|string| Initiating the hedging period of the pledged account's hedging amount `von` |
|ExternalId|string| External Id (with a length limit, the Id described by the third-party pull node) |
|NodeName|string| The name of the node being pledged (there is a length limitation, indicating the name of the node) |
|Website|string| The third-party home page of the node (the length is limited, indicating the home page of the node) |
|Details|string| The description of the node (the length is limited, indicating the description of the node) |

#### Query The NodeID And Pledged Id of The Delegated Node

Query the NodeID and Pledged Id of the node entrusted by the current account address.

Parameters:

| Field | Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(1103)|
|addr|common.address(20bytes)| Client's account address |

Returns: List

| Field | Type | Remark |
|---|---|---|
|Addr|20bytes| Client's account address |
|NodeId|64bytes| Node ID of the validator |
|StakingBlockNum|uint64(8bytes)| Block height when pledge is initiated |


#### Query Delegated Informations

Query the current single delegate information, using the call method.

Parameters:

| Field | Type | Remark |
|---|---|---|
|funcType|uint16|Method type code(1104)|
|stakingBlockNum|uint64(8bytes)| Block height when pledge is initiated |
|delAddr|20bytes|Client's account address|
|nodeId|64bytes| Node ID of the validator |

Returns: List

| Field | Type | Remark |
|---|---|---|
|Addr|20bytes| Client's account address |
|NodeId|64bytes| Node ID of the validator |
|StakingBlockNum|uint64(8bytes)| Block height when pledge is initiated |
|DelegateEpoch|uint32(4bytes)| Settlement cycle at the time of the most recent commission for this candidate |
|Released|string|The free amount of the account that initiated the commission, the `von` that was commissioned during the lock-up period. |
|ReleasedHes|string|Number of von commissioned during the hesitation period of the free amount of the commission account |
|RestrictingPlan|string|Number of von commissioned during the lock period that initiated the lockup amount of the commissioned account|
|RestrictingPlanHes|string|Number of von commissioned during the hesitation period of the hedging amount of the commissioned account |
|Reduction|string|`von` in revocation plan|

#### Query Pledge Information

Query the pledge information of the current node.

Parameters:

| Field | Type | Remark |
|---|---|---|
|funcType|uint16|Method type code(1105)|
|nodeId|64bytes| Node ID of the validator |

Returns: List

| Field | Type | Remark |
|---|---|---|
|NodeId|64bytes| The node ID of the pledged (also called the node ID of the candidate). |
|StakingAddress|20bytes| The account used when initiating the pledge (the pledge information can only be used for this operation in subsequent operations. When the pledge is cancelled, von will be returned to the account or the account lock information) |
|BenefitAddress|20bytes| Revenue account for receiving block rewards and pledged rewards |
|StakingTxIndex|uint32(4bytes)| Index of transactions when pledge is initiated |
|ProgramVersion|uint32(4bytes)| The real version number of the PlatON process of the pledged node (the interface for obtaining the version number is provided by the governance)  |
|Status|uint32(4bytes)|The status of the candidate (the status is placed according to the `32bit` of` uint32`, multiple states can exist at the same time, and the value of multiple simultaneous state values is added [`0`: the node is available (32 bits are all 0); `1`: The node is unavailable (only the last bit is 1);` 2`: The node has a low block rate but does not meet the removal condition (only the penultimate bit is 1); `4`: The node Von is lower than the minimum pledge threshold (only the penultimate bit is 1); `8`: the node is reported as a double sign (only the penultimate bit is 1);` 16`: the node block rate is low and the removal condition is met (The penultimate bit is 1); `32`: the node actively initiates the revocation (only the penultimate bit is 1)]|
|StakingEpoch|uint32(4bytes)| Settlement cycle when current pledge amount is changed |
|StakingBlockNum|uint64(8bytes)| Block height when pledge is initiated |
|Shares|string| The current candidate's total pledge plus the number of entrusted von |
|Released|string|Initiating a free amount locked period pledge of a pledged account `von`|
|ReleasedHes|string| Freedom to initiate a pledge account with a hesitation period of von von |
|RestrictingPlan|string| Initiating the lock-up period of the pledged account's lock-up amount `von` |
|RestrictingPlanHes|string| Initiating the hedging period of the pledged account's hedging amount `von` |
|ExternalId|string| External Id (with a length limit, the Id described by the third-party pull node) |
|NodeName|string| The name of the node being pledged (there is a length limitation, indicating the name of the node) |
|Website|string| The third-party home page of the node (the length is limited, indicating the home page of the node) |
|Details|string| The description of the node (the length is limited, indicating the description of the node) |



### Governance Module

#### Submit Text Proposal

Submit a text proposal by send a transaction.

Parameters:

| Field| Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(2000)|
|verifier|discover.NodeID(64bytes)|Submit a validator|
|pIDID|string(uint64)|PIPID|


#### Submit Upgrade Proposal

Submit an upgrade proposal by sending a transaction.

Parameters:

| Field| Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(2001)|
|verifier|discover.NodeID(64bytes)| Validator of proposal |
|pIDID|string(uint64)|PIPID|
|newVersion|uint32(4bytes)| updated version |
|endVotingRounds|uint64|Number of voting consensus rounds. Note: Assume that the number of the consensus round when the transaction that submitted the proposal is packaged into the block is `round1`. The` blockNumber` of the proposal voting deadline is `round1 + endVotingRounds`. The consensus round produced block 250, ppos was announced 20 blocks ahead of time, `250`, and` 20` are all configurable), of which `0 <endVotingRounds <= 4840` (about 2 weeks, the actual discussion can be calculated according to the configuration), And is an integer)|


#### Submit Cancellation Proposal

Submit cancellation proposal by sending transaction.

Parameters:

| Field| Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(2005)|
|verifier|discover.NodeID(64bytes)| Validator of proposal |
|pIDID|string(uint64)|PIPID|
|endVotingRounds|uint64| Number of voting consensus rounds. Refer to the description of submitting an upgrade proposal. At the same time, the value of this parameter in this interface cannot be greater than the value in the corresponding upgrade proposal.|
|tobeCanceledProposalID|common.hash(32bytes)| Upgrade proposal ID to be canceled |


#### Vote On Proposal

Vote on a proposal by sending a transaction.

Parameters:

| Field| Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(2003)|
|verifier|discover.NodeID(64bytes)|Vote validator|
|proposalID|common.Hash(32bytes)| Proposal ID |
|option|uint8(1byte)| Voting options |
|programVersion|uint32(4bytes)|The code version of the node, obtained by the `getProgramVersion` interface of rpc|
|versionSign|common.VesionSign(65bytes)| Code version signature, obtained by rpc's getProgramVersion interface |


#### Version Declaration

Declaring the version by sending a transaction.

Parameters:

| Field| Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(2004)|
|verifier|discover.NodeID(64bytes)|The declared node can only be a validator/candidate|
|programVersion|uint32(4bytes)|Declared version, obtained by rpc's getProgramVersion interface|
|versionSign|common.VesionSign(65bytes)|Declared version signature, obtained by rpc's getProgramVersion interface|

#### Query Proposal

Query proposal by call.

Parameters:

| Field | Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|2100)|
|proposalID|common.Hash(32bytes)| Proposal ID |

Returns:

JSON string of object implementing interface Proposal.


#### Query Proposal Results

Query proposal results through call operation.

Parameters:

| Field | Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(2101)|
|proposalID|common.Hash(32bytes)| Proposal ID |

Returns:

`TallyResult`: Json string of TallyResult object.


#### Query Proposal List

Query proposal list through call operation.

Parameters:

| Field | Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(2102)|

Returns: 

`Proposal`: A json string of an object that implements the interface Proposal.


#### Query Version In Effect

Query the version in effect through call operation.

Parameters:

| Field | Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(2103)|

Returns:

`String`: The json string of the version number, such as `{65536}`, indicates that the version is: `1.0.0`.
When parsing, ver needs to be converted into 4 bytes. Major version: second byte; minor version: third byte, patch version, fourth byte.


#### Query The Cumulative Voteable Number Of Proposals

Query the cumulative voteable number of proposals through call operation.

Parameters:

| Field | Type | Remark |
|---|---|---|
|funcType|uint16(2bytes)|Method type code(2105)|
|proposalID|common.Hash(32bytes)| Proposal ID |
|blockHash|common.Hash(32bytes)|块hash|

Returns:

`Array` - `[]uint16`: An array.

| Field | Type | Remark |
|---|---|---|
||uint16|Number of cumulative votes |
||uint16|Number of in favour votes |
||uint16|Number of negative votes |
||uint16|Number of Abstained votes |


### Definition

#### ProposalType

| Type | Definition | Description |
|---|---|---|
|TextProposal|0x01|Text proposal|
|VersionProposal|0x02|Upgrade proposal|
|CancelProposal|0x04|Cancel proposal|

#### ProposalStatus

For text proposals, there are three states: `0x01`, `0x02`, `0x03`;
For the upgrade proposal, there are four states: `0x01`, `0x03`, `0x04`, `0x05`, `0x06`.
For cancellation proposals, there are three states: `0x01`, `0x02`, `0x03`;

| Type | Definition | Description |
|---|---|---|
|Voting|0x01|Voting|
|Pass|0x02|Voted successfully|
|Failed|0x03|Vote failed|
|PreActive|0x04|(Upgrade Proposal) Pre-Effective|
|Active|0x05|(Upgrade Proposal) Effective|
|Canceled|0x06|(Upgrade proposal) cancelled|

#### VoteOption

| Type | Definition | Description |
|---|---|---|
|Yeas|0x01|agree|
|Nays|0x02|Against|
|Abstentions|0x03|Abstain|


#### Proposal(TextProposal)

| Field | Type | Remark |
|---|---|---|
|ProposalID|common.Hash(32bytes)| Proposal ID |
|Proposer|common.NodeID(64bytes)|Proposal Node ID|
|ProposalType|byte|Proposal type, `0x01`: text proposal; `0x02`: upgrade proposal; `0x03` parameter proposal; `0x04` cancel proposal.|
|PIPID|string|Proposal PIPID|
|SubmitBlock|8bytes|Submitted blockNumber|
|EndVotingBlock|8bytes|BlockNumber of proposal voting ended, according to SubmitBlock|


#### Proposal(VersionProposal)

| Field | Type | Remark |
|---|---|---|
|ProposalID|common.Hash(32bytes)| Proposal ID |
|Proposer|common.NodeID(64bytes)|Proposal Node ID|
|ProposalType|byte|Proposal type, `0x01`: text proposal; `0x02`: upgrade proposal; `0x03` parameter proposal; `0x04` cancel proposal.|
|PIPID|string|Proposal PIPID|
|SubmitBlock|8bytes|Submitted blockNumber|
|EndVotingRounds|8bytes|Number of voting consensus cycles|
|EndVotingBlock|8bytes|The block height at the end of proposal voting is calculated by the system according to SubmitBlock, EndVotingRounds|
|ActiveBlock|8bytes|Proposal effective block height, calculated by the system based on EndVotingBlock|
|NewVersion|uint| updated version |


#### Proposal CancelProposal

| Field | Type | Remark |
|---|---|---|
|ProposalID|common.Hash(32bytes)| Proposal ID |
|Proposer|common.NodeID(64bytes)|Proposal Node ID|
|ProposalType|byte|Proposal type, `0x01`: text proposal; `0x02`: upgrade proposal; `0x03` parameter proposal; `0x04` cancel proposal.|
|PIPID|string|Proposal PIPID|
|SubmitBlock|8bytes|Submitted blockNumber|
|EndVotingRounds|8bytes|Number of voting consensus cycles|
|EndVotingBlock|8bytes|The block height at the end of proposal voting is calculated by the system according to SubmitBlock, EndVotingRounds|
|TobeCanceled|common.Hash(32bytes)|ID of the promotion proposal to cancel|

#### Vote

| Field | Type | Remark |
|---|---|---|
|voter|64bytes|Vote validator|
|proposalID|common.Hash(32bytes)| Proposal ID |
|option|VoteOption| Voting options |


#### TallyResult

| Field | Type | Remark |
|---|---|---|
|proposalID|common.Hash(32bytes)| Proposal ID |
|yeas|uint16(2bytes)|Approve|
|nays|uint16(2bytes)|Against|
|abstentions|uint16(2bytes)|Abstention|
|accuVerifiers|uint16(2bytes)|Total number of validators who have qualified to vote during the entire voting period|
|status|byte|status|
|canceledBy|common.Hash(32bytes)|When status = 0x06, the ProposalID of the record that initiated the cancellation|


### Exposure/Punishment Module

#### Report Double Sign

Report a double sign by sending a transaction.

Parameters:

| Field     | Type   | Remark                                    |
| -------- | ------ | --------------------------------------- |
| funcType | uint16(2bytes) | Method type code(3000)                    |
| typ      | uint8         | Stands for double sign type<br />1：prepareBlock，2：prepareVote，3：viewChange |
| data     | string | The json value of a single evidence. The format is [RPC interface Evidences] [evidences_interface] |

#### Query Whether Node Has Been Reported As Oversigned

Query whether a node has been reported as oversigned by sending a transaction.

Parameters:

| Field        | Type           | Remark                                                         |
| ----------- | -------------- | ------------------------------------------------------------ |
| funcType    | uint16(2bytes) | Method type code(3001)                                         |
| typ         | uint32         | Stands for double sign type,<br />1：prepareBlock，2：prepareVote，3：viewChange |
| addr        | 20bytes        | Reporting node address                                               |
| blockNumber | uint64         | Multi-Signed BlockNumber                                                   |

Returns:

| Type   | Remark           |
| ------ | -------------- |
| String | Reported Transaction Hash |



### Lockout Module

#### Create Hedging Plan

Create hedging plan by sending a transaction.

Parameters:

| Field    | Type           | Remark                                                         |
| ------- | -------------- | ------------------------------------------------------------ |
| account | 20bytes | `Lock release to account`                                           |
| plan    | []RestrictingPlan | plan is a list (array) of type RestrictingPlan. RestrictingPlan is defined as follows: <br> type RestrictingPlan struct {<br /> Epoch uint64 <br/> Amount: \ * big.Int <br/>} <br/> Among them, Epoch : Represents a multiple of the settlement cycle. The product of the number of blocks per settlement cycle indicates the release of locked funds at the height of the target block. Epoch \ * The number of blocks per cycle must be at least greater than the highest irreversible block height. <br> Amount: indicates the amount to be released on the target block. |


#### Get Lock Information

Get lock information by call.

Note: This interface supports the acquisition of historical data. The block height can be attached to the request. By default, the latest block data is queried.

Parameters:

| Field    | Type    | Remark               |
| ------- | ------- | ------------------ |
| account | 20bytes | `The account that was posted after the lockout was released` |

Returns:

Returns a json format string with the following fields:

| Field    | Type            | Remark                                                         |
| ------- | --------------- | ------------------------------------------------------------ |
| balance | string(Hex) | Amount of remaining locked positions                                                   |
| pledge    | string(Hex) | Pledge / mortgage amount|
| debt  | string(Hex) | Amount due for release |
| plans    | bytes           | Locked entry information, json array：[{"blockNumber":"","amount":""},...,{"blockNumber":"","amount":""}]. among:<br/>blockNumber：\*big.Int，Release blockNumber <br/>amount：\string(Hex string), Release amount |

### Reward Interface

#### Withdraw Delegate Reward

Withdraw all currently available delegate rewards from the account and send the transaction.

Parameters：

| Field    | Type           | Remark                 |
| -------- | -------------- | ---------------------- |
| funcType | uint16(2bytes) | Method type code(5000) |

Returns:

Note: The transaction results are stored in the logs.data of the transaction receipt. If the transaction is successful, rlp.Encode (byte {[] byte (status code 0), rlp.Encode (`node income list`)}). If the transaction is unsuccessful, it is consistent with the previous method.

The returned `node income list` is an array

| Field      | Type                     | Remark                  |
| ---------- | ------------------------ | ----------------------- |
| NodeID     | discover.NodeID(64bytes) | Node ID                 |
| StakingNum | uint64                   | Node stake block Number |
| Reward     | *big.Int                 | Received reward         |

#### Query Delegate Reward

The query account did not withdraw the delegate reward at each node, and call query.

Parameters：

| Field    | Type              | Remark                                                       |
| -------- | ----------------- | ------------------------------------------------------------ |
| funcType | uint16(2bytes)    | Method type code(5100)                                       |
| address  | 20bytes           | The address of the account to be queried                     |
| nodeIDs  | []discover.NodeID | The node to be queried, if it is empty, all nodes entrusted by the account are queried |

Returns：

Is a []Reward array

| Field      | Type                     | Remark                               |
| ---------- | ------------------------ | ------------------------------------ |
| nodeID     | discover.NodeID(64bytes) | Node ID                              |
| stakingNum | uint64                   | Node stake block Number              |
| reward     | string(0x hex string)    | Did not withdraw the delegate reward |

### Error Code Description

| ErrorCode    | Remark            |
| ------- | --------------- |
| 301000  | Wrong bls public key|
| 301001  | Wrong bls public key proof|
| 301002  | The Description length is wrong|
| 301003  | The program version sign is wrong|
| 301004  | The program version of the relates node's is too low|
| 301005  | DeclareVersion is failed on create staking|
| 301006  | The address must be the same as initiated staking|
| 301100  | Staking deposit too low|
| 301101  | This candidate is already exist|
| 301102  | This candidate is not exist|
| 301103  | This candidate status was invalided|
| 301104  | IncreaseStake von is too low|
| 301105  | Delegate deposit too low|
| 301106  | The account is not allowed to be used for delegating|
| 301107  | The candidate does not accept the delegation|
| 301108  | Withdrew delegation von is too low|
| 301109  | This delegation is not exist|
| 301110  | The von operation type is wrong|
| 301111  | The von of account is not enough|
| 301112  | The blockNumber is disordered|
| 301113  | The von of delegation is not enough|
| 301114  | Withdrew delegation von calculation is wrong|
| 301115  | The validator is not exist|
| 301116  | The fn params is wrong|
| 301117  | The slashing type is wrong|
| 301118  | Slashing amount is overflow|
| 301119  | Slashing candidate von calculate is wrong|
| 301200  | Getting verifierList is failed|
| 301201  | Getting validatorList is failed|
| 301202  | Getting candidateList is failed|
| 301203  | Getting related of delegate is failed|
| 301204  | Query candidate info failed|
| 301205  | Query delegate info failed|

