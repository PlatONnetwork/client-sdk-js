# Web3 JavaScript app API for 0.1.0
## Getting Started
 * [Adding web3](#adding-web3)
* [Using Callbacks](#using-callbacks)
* [Batch requests](#batch-requests)
* [A note on big numbers in web3.js](#a-note-on-big-numbers-in-web3js)

### Adding web3
First you need to get web3.js into your project. This can be done using the following methods:
- npm: `npm i https://github.com/PlatONnetwork/client-sdk-js`

Then you need to create a web3 instance, setting a provider.
To make sure you don't overwrite the already set provider when in mist, check first if the web3 is available:

```js
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:6789"));
}
```

 After that you can use the [API](web3js-api-reference) of the `web3` object.

### Using callbacks

As this API is designed to work with a local RPC node, all its functions use synchronous HTTP requests by default.

If you want to make an asynchronous request, you can pass an optional callback as the last parameter to most functions.

All callbacks are using an [error first callback](http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/) style:

```js
web3.platon.getBlock(48, function(error, result){
    if(!error)
        console.log(JSON.stringify(result));
    else
        console.error(error);
})
```

### Batch requests
Batch requests allow queuing up requests and processing them at once.

**Note** Batch requests are not faster! In fact making many requests at once will in some cases be faster, as requests are processed asynchronously.

Batch requests are mainly useful to ensure the serial processing of requests.

```js
var batch = web3.createBatch();
batch.add(web3.platon.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
batch.add(web3.platon.contract(abi).at(address).balance.request(address, callback2));
batch.execute();
```

### A note on big numbers in web3.js
You will always get a BigNumber object for number values as JavaScript is not able to handle big numbers correctly.
Look at the following examples:

```js
"101010100324325345346456456456456456456"
// "101010100324325345346456456456456456456"
101010100324325345346456456456456456456
// 1.0101010032432535e+38
```

web3.js depends on the [BigNumber Library](https://github.com/MikeMcl/bignumber.js/) and adds it automatically.

```js
var balance = new BigNumber('131242344353464564564574574567456');
// or var balance = web3.platon.getBalance(someAddress);
balance.plus(21).toString(10); // toString(10) converts it to a number string
// "131242344353464564564574574567477"
```

The next example wouldn't work as we have more than 20 floating points, therefore it is recommended to always keep your balance in *wei* and only transform it to other units when presenting to the user:

```js
var balance = new BigNumber('13124.234435346456466666457455567456');
balance.plus(21).toString(10); // toString(10) converts it to a number string, but can only show upto 20 digits
// "13124.23443534645646666646" // your number will be truncated after the 20th digit
```

### Usage
#### web3
The `web3` object provides all methods.
##### Example

```js
var Web3 = require('web3');
// create an instance of web3 using the HTTP provider.
// NOTE in mist web3 is already available, so check first if it's available before instantiating
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
```

###### Example using HTTP Basic Authentication

```js
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545", 0, BasicAuthUsername, BasicAuthPassword));
//Note: HttpProvider takes 4 arguments (host, timeout, user, password)
```

***
#### web3.version.api
```js
web3.version.api
```
##### Returns
 `String` - The platon js api version.

##### Example
```js
var version = web3.version.api;
console.log(version); // "0.2.0"
```

***
#### web3.version.node

web3.version.node

// or async

web3.version.getNode(callback(error, result){ ... })

##### Returns
 `String` - The client/node version.

##### Example
```js
var version = web3.version.node;
console.log(version); // "Mist/v0.9.3/darwin/go1.4.1"
```

***
#### web3.version.network
web3.version.network

// or async

web3.version.getNetwork(callback(error, result){ ... })

##### Returns
 `String` - The network protocol version.

##### Example
```js
var version = web3.version.network;
console.log(version); // 54
```

***
#### web3.version.platon
web3.version.platon

// or async

web3.version.getPlaton(callback(error, result){ ... })

##### Returns
 `String` - The platon protocol version.

##### Example
```js
var version = web3.version.platon;
console.log(version); // 60
```

***
#### web3.isConnected
web3.isConnected() 

Should be called to check if a connection to a node exists

##### Parameters
none

##### Returns
 `Boolean`

##### Example
```js
if(!web3.isConnected()) {
  
   // show some dialog to ask the user to start a node
 } else {
 
   // start web3 filters, calls, etc
}
```

***
#### web3.setProvider
web3.setProvider(provider)

Should be called to set provider.

##### Parameters
none

##### Returns
 `undefined`

##### Example
```js
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545')); // 8080 for cpp/AZ, 8545 for go/mist
```

***
#### web3.currentProvider
web3.currentProvider

Will contain the current provider, if one is set. This can be used to check if mist etc. has set already a provider.
##### Returns
 `Object` - The provider set or `null`;

##### Example
```js
// Check if mist etc. already set a provider
if(!web3.currentProvider)
    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
```

***
#### web3.reset
web3.reset(keepIsSyncing)

Should be called to reset state of web3. Resets everything except manager. Uninstalls all filters. Stops polling.

##### Parameters
 1. `Boolean` - If `true` it will uninstall all filters, but will keep the [web3.platon.isSyncing()](#web3ethissyncing) polls

##### Returns
 `undefined`

##### Example
```js
web3.reset();
```

***
#### web3.sha3
web3.sha3(string [, options])

##### Parameters
1. `String` - The string to hash using the Keccak-256 SHA3 algorithm
2. `Object` - (optional) Set `encoding` to `hex` if the string to hash is encoded in hex. A leading `0x` will be automatically ignored.

##### Returns
 `String` - The Keccak-256 SHA3 of the given data.

##### Example
```js
var hash = web3.sha3("Some string to be hashed");
console.log(hash); // "0xed973b234cf2238052c9ac87072c71bcf33abc1bbd721018e0cca448ef79b379"
var hashOfHash = web3.sha3(hash, {encoding: 'hex'});
console.log(hashOfHash); // "0x85dd39c91a64167ba20732b228251e67caed1462d4bcf036af88dc6856d0fdcc"
```

***
#### web3.toHex
web3.toHex(mixed);

Converts any value into HEX.

##### Parameters
 1. `String|Number|Object|Array|BigNumber` - The value to parse to HEX. If its an object or array it will be `JSON.stringify` first. If its a BigNumber it will make it the HEX value of a number.

##### Returns
 `String` - The hex string of `mixed`.

##### Example
```js
var str = web3.toHex({test: 'test'});
console.log(str); // '0x7b2274657374223a2274657374227d'
```

***
#### web3.toAscii
web3.toAscii(hexString);

Converts a HEX string into a ASCII string.

##### Parameters
1. `String` - A HEX string to be converted to ascii.

##### Returns
 `String` - An ASCII string made from the given `hexString`.

##### Example
```js
var str = web3.toAscii("0x657468657265756d000000000000000000000000000000000000000000000000");
console.log(str); // "ethereum"
```

***
#### web3.fromAscii
web3.fromAscii(string);

Converts any ASCII string to a HEX string.

##### Parameters
1. `String` - An ASCII string to be converted to HEX.

##### Returns
 `String` - The converted HEX string.

##### Example
```js
var str = web3.fromAscii('ethereum');
console.log(str); // "0x657468657265756d"
```

***
#### web3.toDecimal
web3.toDecimal(hexString);

Converts a HEX string to its number representation.

##### Parameters
1. `String` - A HEX string to be converted to a number.

##### Returns
`Number` - The number representing the data `hexString`.

##### Example
```js
var number = web3.toDecimal('0x15');
console.log(number); // 21
```

***
#### web3.fromDecimal
web3.fromDecimal(number);
Converts a number or number string to its HEX representation.

##### Parameters
1. `Number|String` - A number to be converted to a HEX string.

##### Returns
 `String` - The HEX string representing of the given `number`.

##### Example
```js
var value = web3.fromDecimal('21');
console.log(value); // "0x15"
```

***
#### web3.fromVon
web3.fromVon(number, unit)

Converts a number of von into the following platon units:
- `von`
- `kvon`
- `mvon`
- `gvon`
- `microlat`
- `millilat`
- `lat`
- `klat`
- `mlat`
- `glat`
- `tlat`

##### Parameters
1. `Number|String|BigNumber` - A number or BigNumber instance.
2. `String` - One of the above ether units.

##### Returns
`String|BigNumber` - Either a number string, or a BigNumber instance, depending on the given `number` parameter.

##### Example
```js
var value = web3.fromVon('21000000000000', 'gvon');
console.log(value); // "21000"
```

***
#### web3.toVon
web3.toVon(number, unit)

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

Converts an platon unit into von. Possible units are:
- `von`
- `kvon`
- `mvon`
- `gvon`
- `microlat`
- `millilat`
- `lat`
- `klat`
- `mlat`
- `glat`
- `tlat`

##### Parameters
1. `Number|String|BigNumber` - A number or BigNumber instance.
2. `String` - One of the above lat units.

##### Returns
 `String|BigNumber` - Lat a number string, or a BigNumber instance, depending on the given `number` parameter.

##### Example
```js
var value = web3.toVon('1', 'lat');
console.log(value); // "1000000000000000000"
```

***
#### web3.toBigNumber
web3.toBigNumber(numberOrHexString); Converts a given number into a BigNumber instance. See the [note on BigNumber](#a-note-on-big-numbers-in-web3js).

##### Parameters
1. `Number|String` - A number, number string or HEX string of a number.

##### Returns
`BigNumber` - A BigNumber instance representing the given value.

##### Example
```js
var value = web3.toBigNumber('200000000000000000000001');
console.log(value); // instanceOf BigNumber
console.log(value.toNumber()); // 2.0000000000000002e+23
console.log(value.toString(10)); // '200000000000000000000001'
```

***
#### web3.isAddress
web3.isAddress(HexString); Checks if the given string is an address.

##### Parameters
 1. `String` - A HEX string.

##### Returns
 `Boolean` - `false` if it's not on a valid address format. Returns `true` if it's an all lowercase or all uppercase valid address. If it's a mixed case address, it checks using `web3.isChecksumAddress()`.

##### Example
```js
var isAddress = web3.isAddress("0x8888f1f195afa192cfee860698584c030f4c9db1");
console.log(isAddress); // true
```

***
### web3.net
#### web3.net.listening
web3.net.listening

// or async

web3.net.getListening(callback(error, result){ ... })

This property is read only and says whether the node is actively listening for network connections or not.
##### Returns
`Boolean` - `true` if the client is actively listening for network connections, otherwise `false`.

##### Example
```js
var listening = web3.net.listening;
console.log(listening); // true of false
```

***
#### web3.net.peerCount
web3.net.peerCount

// or async

web3.net.getPeerCount(callback(error, result){ ... })

This property is read only and returns the number of connected peers.

##### Returns
 `Number` - The number of peers currently connected to the client.

##### Example
```js
var peerCount = web3.net.peerCount;
console.log(peerCount); // 4
```

***
### web3.platon
 Contains the ethereum blockchain related methods.

##### Example
```js
var platon = web3.platon;
```

***
#### web3.platon.gasPrice
web3.platon.gasPrice

// or async
web3.platon.getGasPrice(callback(error, result){ ... })

This property is read only and returns the current gas price.

The gas price is determined by the x latest blocks median gas price.

##### Returns
`BigNumber` - A BigNumber instance of the current gas price in wei.
See the [note on BigNumber](#a-note-on-big-numbers-in-web3js).

##### Example
```js
var gasPrice = web3.platon.gasPrice;
console.log(gasPrice.toString(10)); // "10000000000000"
```

***
#### web3.platon.accounts
web3.platon.accounts

// or async

web3.platon.getAccounts(callback(error, result){ ... })

This property is read only and returns a list of accounts the node controls.

##### Returns
 `Array` - An array of addresses controlled by client.

##### Example
```js
var accounts = web3.platon.accounts;
console.log(accounts); // ["0x407d73d8a49eeb85d32cf465507dd71d507100c1"] 
```

***
#### web3.platon.blockNumber
web3.platon.blockNumber

// or async

web3.platon.getBlockNumber(callback(error, result){ ... })

This property is read only and returns the current block number.

##### Returns
`Number` - The number of the most recent block.

##### Example
```js
var number = web3.platon.blockNumber;
console.log(number); // 2744
```

***
#### web3.platon.getBalance
web3.platon.getBalance(addressHexString [, defaultBlock] [, callback])

Get the balance of an address at a given block.

##### Parameters
1. `String` - The address to get the balance of.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - A BigNumber instance of the current balance for the given address in wei.
 See the [note on BigNumber](#a-note-on-big-numbers-in-web3js).

##### Example
```js
var balance = web3.platon.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
console.log(balance); // instanceof BigNumber
console.log(balance.toString(10)); // '1000000000000'
console.log(balance.toNumber()); // 1000000000000
```

***
#### web3.platon.getStorageAt
web3.platon.getStorageAt(addressHexString, position [, defaultBlock] [, callback])

Get the storage at a specific position of an address.

##### Parameters
1. `String` - The address to get the storage from.
1. `Number` - The index position of the storage.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
`String` - The value in storage at the given position.

##### Example
```js
var state = web3.platon.getStorageAt("0x407d73d8a49eeb85d32cf465507dd71d507100c1", 0);
console.log(state); // "0x03"
```

***
#### web3.platon.getCode
web3.platon.getCode(addressHexString [, defaultBlock] [, callback])

Get the code at a specific address.

##### Parameters
1. `String` - The address to get the code from.
1. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - The data at given address `addressHexString`.

##### Example
```js
var code = web3.platon.getCode("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8");
console.log(code); // "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
```

***
#### web3.platon.getBlock
web3.platon.getBlock(blockHashOrBlockNumber [, returnTransactionObjects] [, callback])

Returns a block matching the block number or block hash.

##### Parameters
1. `String|Number` - The block number or hash. Or the string `"earliest"`, `"latest"` or `"pending"` as in the [default block parameter](#web3ethdefaultblock).
1. `Boolean` - (optional, default `false`) If `true`, the returned block will contain all transactions as objects, if `false` it will only contains the transaction hashes.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
##### Returns
- `Object` - The block object:
  - `number`: `Number` - the block number. `null` when its pending block.
  - `hash`: `String`, 32 Bytes - hash of the block. `null` when its pending block.
  - `parentHash`: `String`, 32 Bytes - hash of the parent block.
  - `nonce`: `String`, 8 Bytes - hash of the generated proof-of-work. `null` when its pending block.
  - `sha3Uncles`: `String`, 32 Bytes - SHA3 of the uncles data in the block.
  - `logsBloom`: `String`, 256 Bytes - the bloom filter for the logs of the block. `null` when its pending block.
  - `transactionsRoot`: `String`, 32 Bytes - the root of the transaction trie of the block
  - `stateRoot`: `String`, 32 Bytes - the root of the final state trie of the block.
  - `miner`: `String`, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.
  - `difficulty`: `BigNumber` - integer of the difficulty for this block.
  - `totalDifficulty`: `BigNumber` - integer of the total difficulty of the chain until this block.
  - `extraData`: `String` - the "extra data" field of this block.
  - `size`: `Number` - integer the size of this block in bytes.
  - `gasLimit`: `Number` - the maximum gas allowed in this block.
  - `gasUsed`: `Number` - the total used gas by all transactions in this block.
  - `timestamp`: `Number` - the unix timestamp for when the block was collated.
  - `transactions`: `Array` - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
  - `uncles`: `Array` - Array of uncle hashes.

##### Example
```js
var info = web3.platon.getBlock(3150);
console.log(info);
/*
{
  "number": 3,
  "hash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "parentHash": "0x2302e1c0b972d00932deb5dab9eb2982f570597d9d42504c05d9c2147eaf9c88",
  "nonce": "0xfb6e1a62d119228b",
  "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "transactionsRoot": "0x3a1b03875115b79539e5bd33fb00d8f7b7cd61929d5a3c574f507b8acf415bee",
  "stateRoot": "0xf1133199d44695dfa8fd1bcfe424d82854b5cebef75bddd7e40ea94cda515bcb",
  "miner": "0x8888f1f195afa192cfee860698584c030f4c9db1",
  "difficulty": BigNumber,
  "totalDifficulty": BigNumber,
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
*/
```

***
#### web3.platon.getBlockTransactionCount
web3.platon.getBlockTransactionCount(hashStringOrBlockNumber [, callback])

Returns the number of transaction in a given block.

##### Parameters
1. `String|Number` - The block number or hash. Or the string `"earliest"`, `"latest"` or `"pending"` as in the [default block parameter](#web3ethdefaultblock).
1. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `Number` - The number of transactions in the given block.

##### Example
```js
var number = web3.platon.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
console.log(number); // 1
```

***
##### web3.platon.getTransaction
web3.platon.getTransaction(transactionHash [, callback])

Returns a transaction matching the given transaction hash.

##### Parameters
1. `String` - The transaction hash.
1. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
- `Object` - A transaction object its hash `transactionHash`:
  - `hash`: `String`, 32 Bytes - hash of the transaction.
  - `nonce`: `Number` - the number of transactions made by the sender prior to this one.
  - `blockHash`: `String`, 32 Bytes - hash of the block where this transaction was in. `null` when its pending.
  - `blockNumber`: `Number` - block number where this transaction was in. `null` when its pending.
  - `transactionIndex`: `Number` - integer of the transactions index position in the block. `null` when its pending.
  - `from`: `String`, 20 Bytes - address of the sender.
  - `to`: `String`, 20 Bytes - address of the receiver. `null` when its a contract creation transaction.
  - `value`: `BigNumber` - value transferred in Wei.
  - `gasPrice`: `BigNumber` - gas price provided by the sender in Wei.
  - `gas`: `Number` - gas provided by the sender.
  - `input`: `String` - the data sent along with the transaction.

##### Example
```js
var transaction = web3.platon.getTransaction('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
console.log(transaction);
/*
{
  "hash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "nonce": 2,
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "blockNumber": 3,
  "transactionIndex": 0,
  "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
  "to": "0x6295ee1b4f6dd65047762f924ecd367c17eabf8f",
  "value": BigNumber,
  "gas": 314159,
  "gasPrice": BigNumber,
  "input": "0x57cb2fc4"
}
*/
```

***
#### web3.platon.getTransactionFromBlock
getTransactionFromBlock(hashStringOrNumber, indexNumber [, callback])

Returns a transaction based on a block hash or number and the transactions index position.

##### Parameters
1. `String` - A block number or hash. Or the string `"earliest"`, `"latest"` or `"pending"` as in the [default block parameter](#web3ethdefaultblock).
1. `Number` - The transactions index position.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `Object` - A transaction object, see [web3.platon.getTransaction](#web3ethgettransaction):

##### Example
```js
var transaction = web3.platon.getTransactionFromBlock('0x4534534534', 2);
console.log(transaction); // see web3.platon.getTransaction
```
***

#### web3.platon.getTransactionReceipt
web3.platon.getTransactionReceipt(hashString [, callback])

Returns the receipt of a transaction by transaction hash.
 
**Note** That the receipt is not available for pending transactions.

##### Parameters
1. `String` - The transaction hash.

1. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
- `Object` - A transaction receipt object, or `null` when no receipt was found:
  - `blockHash`: `String`, 32 Bytes - hash of the block where this transaction was in.
  - `blockNumber`: `Number` - block number where this transaction was in.
  - `transactionHash`: `String`, 32 Bytes - hash of the transaction.
  - `transactionIndex`: `Number` - integer of the transactions index position in the block.
  - `from`: `String`, 20 Bytes - address of the sender.
  - `to`: `String`, 20 Bytes - address of the receiver. `null` when its a contract creation transaction.
  - `cumulativeGasUsed `: `Number ` - The total amount of gas used when this transaction was executed in the block.
  - `gasUsed `: `Number ` -  The amount of gas used by this specific transaction alone.
  - `contractAddress `: `String` - 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise `null`.
  - `logs `:  `Array` - Array of log objects, which this transaction generated.
  - `status `:  `String` - '0x0' indicates transaction failure , '0x1' indicates transaction succeeded. 

##### Example
```js
var receipt = web3.platon.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
console.log(receipt);
{
  "transactionHash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "transactionIndex": 0,
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "blockNumber": 3,
  "contractAddress": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
  "cumulativeGasUsed": 314159,
  "gasUsed": 30234,
  "logs": [{
         // logs as returned by getFilterLogs, etc.
     }, ...],
  "status": "0x1"
}
```

***
#### web3.platon.getTransactionCount

web3.platon.getTransactionCount(addressHexString [, defaultBlock] [, callback])

Get the numbers of transactions sent from this address.

##### Parameters
1. `String` - The address to get the numbers of transactions from.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `Number` - The number of transactions sent from the given address.

##### Example
```js
var number = web3.platon.getTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
console.log(number); // 1
```

***
#### web3.platon.sendTransaction
web3.platon.sendTransaction(transactionObject [, callback])

Sends a transaction to the network.

##### Parameters
 1. `Object` - The transaction object to send:
  - `from`: `String` - The address for the sending account. Uses the [web3.platon.defaultAccount](#web3ethdefaultaccount) property, if not specified.
  - `to`: `String` - (optional) The destination address of the message, left undefined for a contract-creation transaction.
  - `value`: `Number|String|BigNumber` - (optional) The value transferred for the transaction in Wei, also the endowment if it's a contract-creation transaction.
  - `gas`: `Number|String|BigNumber` - (optional, default: To-Be-Determined) The amount of gas to use for the transaction (unused gas is refunded).
  - `gasPrice`: `Number|String|BigNumber` - (optional, default: To-Be-Determined) The price of gas for this transaction in wei, defaults to the mean network gas price.
  - `data`: `String` - (optional) Either a [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI) containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code.
  - `nonce`: `Number`  - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - The 32 Bytes transaction hash as HEX string.
 If the transaction was a contract creation use [web3.platon.getTransactionReceipt()](#web3ethgettransactionreceipt) to get the contract address, after the transaction was mined.

##### Example
```js
var code = "603d80600c6000396000f3007c01000000000000000000000000000000000000000000000000000000006000350463c6888fa18114602d57005b6007600435028060005260206000f3";
 web3.platon.sendTransaction({data: code}, function(err, transactionHash) {
  if (!err)
    console.log(transactionHash); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
});
```
***

#### web3.platon.sendRawTransaction

web3.platon.sendRawTransaction(signedTransactionData [, callback])

Sends an already signed transaction. For example can be signed using: https://github.com/SilentCicero/ethereumjs-accounts

##### Parameters
1. `String` - Signed transaction data in HEX format
1. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - The 32 Bytes transaction hash as HEX string.

 If the transaction was a contract creation use [web3.platon.getTransactionReceipt()](#web3ethgettransactionreceipt) to get the contract address, after the transaction was mined.

##### Example
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
 //console.log(serializedTx.toString('hex'));
//f889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
 web3.platon.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
});
```

***
#### web3.platon.sign
web3.platon.sign(address, dataToSign, [, callback])
Signs data from a specific account. This account needs to be unlocked.

##### Parameters
1. `String` - Address to sign with.
1. `String` - Data to sign.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - The signed data.
 After the hex prefix, characters correspond to ECDSA values like this:
```
r = signature[0:64]
s = signature[64:128]
v = signature[128:130]
```

Note that if you are using `ecrecover`, `v` will be either `"00"` or `"01"`. As a result, in order to use this value, you will have to parse it to an integer and then add `27`. This will result in either a `27` or a `28`.

##### Example
```js
var result = web3.platon.sign("0x135a7de83802408321b74c322f8558db1679ac20",
    "0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49"); // second argument is web3.sha3("xyz")
console.log(result); // "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
```

***
#### web3.platon.call

web3.platon.call(callObject [, defaultBlock] [, callback])
 
Executes a message call transaction, which is directly executed in the VM of the node, but never mined into the blockchain.

##### Parameters
1. `Object` - A transaction object see [web3.platon.sendTransaction](#web3ethsendtransaction), with the difference that for calls the `from` property is optional as well.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - The returned data of the call, e.g. a codes functions return value.

##### Example
```js
var result = web3.platon.call({
    to: "0xc4abd0339eb8d57087278718986382264244252f", 
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
});
console.log(result); // "0x0000000000000000000000000000000000000000000000000000000000000015"
```

***
#### web3.platon.estimateGas
web3.platon.estimateGas(callObject [, callback])

Executes a message call or transaction, which is directly executed in the VM of the node, but never mined into the blockchain and returns the amount of the gas used.

##### Parameters
 See [web3.platon.sendTransaction](#web3ethsendtransaction), except that all properties are optional.

##### Returns
 `Number` - the used gas for the simulated call/transaction.

##### Example
```js
var result = web3.platon.estimateGas({
    to: "0xc4abd0339eb8d57087278718986382264244252f", 
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
});
console.log(result); // "0x0000000000000000000000000000000000000000000000000000000000000015"
```

***
#### web3.platon.filter
```js
// can be 'latest' or 'pending'
var filter = web3.platon.filter(filterString);
// OR object are log filter options
var filter = web3.platon.filter(options);
 // watch for changes
filter.watch(function(error, result){
  if (!error)
    console.log(result);
});
 // Additionally you can start watching right away, by passing a callback:
web3.platon.filter(options, function(error, result){
  if (!error)
    console.log(result);
});
```

##### Parameters
 1. `String|Object` - The string `"latest"` or `"pending"` to watch for changes in the latest block or pending transactions respectively. Or a filter options object as follows:
  * `fromBlock`: `Number|String` - The number of the earliest block (`latest` may be given to mean the most recent and `pending` currently mining, block). By default `latest`.
  * `toBlock`: `Number|String` - The number of the latest block (`latest` may be given to mean the most recent and `pending` currently mining, block). By default `latest`.
  * `address`: `String` - An address ~or a list of addresses~ to only get logs from particular account(s).
  * `topics`: `Array of Strings` - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use `null`, e.g. `[null, '0x00...']`. You can also pass another array for each topic with options for that topic e.g. `[null, ['option1', 'option2']]`

##### Returns
 `Object` - A filter object with the following methods:
   * `filter.get(callback)`: Returns all of the log entries that fit the filter.
  * `filter.watch(callback)`: Watches for state changes that fit the filter and calls the callback. See [this note](#using-callbacks) for details.
  * `filter.stopWatching()`: Stops the watch and uninstalls the filter in the node. Should always be called once it is done.

##### Watch callback return value
- `String` - When using the `"latest"` parameter, it returns the block hash of the last incoming block.
- `String` - When using the `"pending"` parameter, it returns a transaction hash of the most recent pending transaction.
- `Object` - When using manual filter options, it returns a log object as follows:
    - `logIndex`: `Number` - integer of the log index position in the block. `null` when its pending log.
    - `transactionIndex`: `Number` - integer of the transactions index position log was created from. `null` when its pending log.
    - `transactionHash`: `String`, 32 Bytes - hash of the transactions this log was created from. `null` when its pending log.
    - `blockHash`: `String`, 32 Bytes - hash of the block where this log was in. `null` when its pending. `null` when its pending log.
    - `blockNumber`: `Number` - the block number where this log was in. `null` when its pending. `null` when its pending log.
    - `address`: `String`, 32 Bytes - address from which this log originated.
    - `data`: `String` - contains one or more 32 Bytes non-indexed arguments of the log.
    - `topics`: `Array of Strings` - Array of 0 to 4 32 Bytes `DATA` of indexed log arguments. (In *solidity*: The first topic is the *hash* of the signature of the event (e.g. `Deposit(address,bytes32,uint256)`), except if you declared the event with the `anonymous` specifier.)
    - `type`: `STRING` - `pending` when the log is pending. `mined` if log is already mined.
 **Note** For event filter return values see [Contract Events](#contract-events)

##### Example
```js
var filter = web3.platon.filter({toBlock:'pending'});
 filter.watch(function (error, log) {
  console.log(log); //  {"address":"0x0000000000000000000000000000000000000000", "data":"0x0000000000000000000000000000000000000000000000000000000000000000", ...}
});
 // get all past logs again.
var myResults = filter.get(function(error, logs){ ... });
 ...
 // stops and uninstalls the filter
filter.stopWatching();
```
***

#### web3.platon.contract

web3.platon.contract(abiArray)

Creates a contract object for a solidity contract, which can be used to initiate contracts on an address.

You can read more about events [here](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#example-javascript-usage).

##### Parameters
1. `Array` - ABI array with descriptions of functions and events of the contract.

##### Returns
 `Object` - A contract object, which can be initiated as follows:
```js
var MyContract = web3.platon.contract(abiArray);
 // instantiate by address
var contractInstance = MyContract.at(address);
 // deploy new contract
var contractInstance = MyContract.new([constructorParam1] [, constructorParam2], {data: '0x12345...', from: myAccount, gas: 1000000});
 // Get the data to deploy the contract manually
var contractData = MyContract.new.getData([constructorParam1] [, constructorParam2], {data: '0x12345...'});
// contractData = '0x12345643213456000000000023434234'
```
 And then you can either initiate an existing contract on an address,
or deploy the contract using the compiled byte code:
```js
// Instantiate from an existing address:
var myContractInstance = MyContract.at(myContractAddress);
 // Or deploy a new contract:
 // Deploy the contract asynchronous from Solidity file:
...
const fs = require("fs");
const solc = require('solc')
 let source = fs.readFileSync('nameContract.sol', 'utf8');
let compiledContract = solc.compile(source, 1);
let abi = compiledContract.contracts['nameContract'].interface;
let bytecode = compiledContract.contracts['nameContract'].bytecode;
let gasEstimate = web3.platon.estimateGas({data: bytecode});
let MyContract = web3.platon.contract(JSON.parse(abi));
 var myContractReturned = MyContract.new(param1, param2, {
   from:mySenderAddress,
   data:bytecode,
   gas:gasEstimate}, function(err, myContract){
    if(!err) {
       // NOTE: The callback will fire twice!
       // Once the contract has the transactionHash property set and once its deployed on an address.
        // e.g. check tx hash on the first call (transaction send)
       if(!myContract.address) {
           console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract
       
       // check address on the second call (contract deployed)
       } else {
           console.log(myContract.address) // the contract address
       }
        // Note that the returned "myContractReturned" === "myContract",
       // so the returned "myContractReturned" object will also get the address set.
    }
  });
 // Deploy contract syncronous: The address will be added as soon as the contract is mined.
// Additionally you can watch the transaction by using the "transactionHash" property
var myContractInstance = MyContract.new(param1, param2, {data: bytecode, gas: 300000, from: mySenderAddress});
myContractInstance.transactionHash // The hash of the transaction, which created the contract
myContractInstance.address // undefined at start, but will be auto-filled later
```

##### Example
```js
// contract abi
var abi = [{
     name: 'myConstantMethod',
     type: 'function',
     constant: true,
     inputs: [{ name: 'a', type: 'string' }],
     outputs: [{name: 'd', type: 'string' }]
}, {
     name: 'myStateChangingMethod',
     type: 'function',
     constant: false,
     inputs: [{ name: 'a', type: 'string' }, { name: 'b', type: 'int' }],
     outputs: []
}, {
     name: 'myEvent',
     type: 'event',
     inputs: [{name: 'a', type: 'int', indexed: true},{name: 'b', type: 'bool', indexed: false}]
}];
 // creation of contract object
var MyContract = web3.platon.contract(abi);
 // initiate contract for an address
var myContractInstance = MyContract.at('0xc4abd0339eb8d57087278718986382264244252f');
 // call constant function
var result = myContractInstance.myConstantMethod('myParam');
console.log(result) // '0x25434534534'
 // send a transaction to a function
myContractInstance.myStateChangingMethod('someParam1', 23, {value: 200, gas: 2000});
 // short hand style
web3.platon.contract(abi).at(address).myAwesomeMethod(...);
 // create filter
var filter = myContractInstance.myEvent({a: 5}, function (error, result) {
  if (!error)
    console.log(result);
    /*
    {
        address: '0x8718986382264244252fc4abd0339eb8d5708727',
        topics: "0x12345678901234567890123456789012", "0x0000000000000000000000000000000000000000000000000000000000000005",
        data: "0x0000000000000000000000000000000000000000000000000000000000000001",
        ...
    }
    */
});
```

***
#### Contract Methods
```js
// Automatically determines the use of call or sendTransaction based on the method type
myContractInstance.myMethod(param1 [, param2, ...] [, transactionObject] [, defaultBlock] [, callback]);
 // Explicitly calling this method
myContractInstance.myMethod.call(param1 [, param2, ...] [, transactionObject] [, defaultBlock] [, callback]);
 // Explicitly sending a transaction to this method
myContractInstance.myMethod.sendTransaction(param1 [, param2, ...] [, transactionObject] [, callback]);
 // Get the call data, so you can call the contract through some other means
// var myCallData = myContractInstance.myMethod.request(param1 [, param2, ...]);
var myCallData = myContractInstance.myMethod.getData(param1 [, param2, ...]);
// myCallData = '0x45ff3ff6000000000004545345345345..'
```

The contract object exposes the contract's methods, which can be called using parameters and a transaction object.

##### Parameters
 - `String|Number|BigNumber` - (optional) Zero or more parameters of the function. If passing in a string, it must be formatted as a hex number, e.g. "0xdeadbeef" If you have already created BigNumber object, then you can just pass it too.
- `Object` - (optional) The (previous) last parameter can be a transaction object, see [web3.platon.sendTransaction](#web3ethsendtransaction) parameter 1 for more. **Note**: `data` and `to` properties will not be taken into account.
- `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
- `Function` - (optional) If you pass a callback as the last parameter the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - If its a call the result data, if its a send transaction a created contract address, or the transaction hash, see [web3.platon.sendTransaction](#web3ethsendtransaction) for details.

##### Example
```js
// creation of contract object
var MyContract = web3.platon.contract(abi);
 // initiate contract for an address
var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');
 var result = myContractInstance.myConstantMethod('myParam');
console.log(result) // '0x25434534534'
 myContractInstance.myStateChangingMethod('someParam1', 23, {value: 200, gas: 2000}, function(err, result){ ... });
```
***
#### Contract Events
```js
var event = myContractInstance.myEvent({valueA: 23} [, additionalFilterObject])
 // watch for changes
event.watch(function(error, result){
  if (!error)
    console.log(result);
});
 // Or pass a callback to start watching immediately
var event = myContractInstance.myEvent([{valueA: 23}] [, additionalFilterObject] , function(error, result){
  if (!error)
    console.log(result);
});
```
 
 You can use events like [filters](#web3ethfilter) and they have the same methods, but you pass different objects to create the event filter.

##### Parameters
 1. `Object` - Indexed return values you want to filter the logs by, e.g. `{'valueA': 1, 'valueB': [myFirstAddress, mySecondAddress]}`. By default all filter values are set to `null`. It means, that they will match any event of given type sent from this contract.
2. `Object` - Additional filter options, see [filters](#web3ethfilter) parameter 1 for more. By default filterObject has field 'address' set to address of the contract. Also first topic is the signature of event.
3. `Function` - (optional) If you pass a callback as the last parameter it will immediately start watching and you don't need to call `myEvent.watch(function(){})`. See [this note](#using-callbacks) for details.

##### Callback return
 `Object` - An event object as follows:
 - `address`: `String`, 32 Bytes - address from which this log originated.
- `args`: `Object` - The arguments coming from the event.
- `blockHash`: `String`, 32 Bytes - hash of the block where this log was in. `null` when its pending.
- `blockNumber`: `Number` - the block number where this log was in. `null` when its pending.
- `logIndex`: `Number` - integer of the log index position in the block.
- `event`: `String` - The event name.
- `removed`: `bool` -  indicate if the transaction this event was created from was removed from the blockchain (due to orphaned block) or never get to it (due to rejected transaction).
- `transactionIndex`: `Number` - integer of the transactions index position log was created from.
- `transactionHash`: `String`, 32 Bytes - hash of the transactions this log was created from.

##### Example
```js
var MyContract = web3.platon.contract(abi);
var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');
 // watch for an event with {some: 'args'}
var myEvent = myContractInstance.myEvent({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
myEvent.watch(function(error, result){
   ...
});
 // would get all past logs again.
var myResults = myEvent.get(function(error, logs){ ... });
 ...
 // would stop and uninstall the filter
myEvent.stopWatching();
```
***
#### Contract allEvents
```js
var events = myContractInstance.allEvents([additionalFilterObject]);
 // watch for changes
events.watch(function(error, event){
  if (!error)
    console.log(event);
});
 // Or pass a callback to start watching immediately
var events = myContractInstance.allEvents([additionalFilterObject], function(error, log){
  if (!error)
    console.log(log);
});
```
 Will call the callback for all events which are created by this contract.

##### Parameters
 1. `Object` - Additional filter options, see [filters](#web3ethfilter) parameter 1 for more. By default filterObject has field 'address' set to address of the contract. This method sets the topic to the signature of event, and does not support additional topics.
2. `Function` - (optional) If you pass a callback as the last parameter it will immediately start watching and you don't need to call `myEvent.watch(function(){})`. See [this note](#using-callbacks) for details.

##### Callback return
 `Object` - See [Contract Events](#contract-events) for more.

##### Example
```js
var MyContract = web3.platon.contract(abi);
var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');
 // watch for an event with {some: 'args'}
var events = myContractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
events.watch(function(error, result){
   ...
});
 // would get all past logs again.
events.get(function(error, logs){ ... });
 ...
 // would stop and uninstall the filter
events.stopWatching();
```

## PPOS 调用指南

### 概述
通过对 ppos 传进来的参数封装成一个交易，执行交易的call调用或者send调用。以及完成call以及send需要的一些辅助函数。

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
更新 ppos 对象的的配置参数。如果你只需要发送call调用，那么只需要传入 provider 即可。如果你在实例化 web3 的时候已经传入了 provider。那么会ppos的provider默认就是你实例化web3传进来的provider。当然你也可以随时更新provider。

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

以调用 `1103. getRelatedListByDelAddr(): 查询当前账户地址所委托的节点的NodeID和质押Id`这个接口，入参顺序从上到下，入参如下所示：

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

以调用 `1004. delegate(): 发起委托`这个接口，入参顺序从上到下，入参如下所示：

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

### PPOS接口入参详细说明

#### staking接口

**以下staking相关接口的合约地址为:** 0x1000000000000000000000000000000000000002

<a name="staking_contract_1"></a>
<code style="color: purple;">1000. createStaking() </code>: 发起质押



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

<a name="staking_contract_2"></a>
<code style="color: purple;">1001. editCandidate() </code>: 修改质押信息



|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1001)|
|benefitAddress|20bytes|用于接受出块奖励和质押奖励的收益账户|
|nodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|externalId|string|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|nodeName|string|被质押节点的名称(有长度限制，表示该节点的名称)|
|website|string|节点的第三方主页(有长度限制，表示该节点的主页)|
|details|string|节点的描述(有长度限制，表示该节点的描述)|



<a name="staking_contract_3"></a>
<code style="color: purple;">1002. increaseStaking() </code>: 增持质押



入参：

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1002)|
|nodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|typ|uint16(2bytes)|表示使用账户自由金额还是账户的锁仓金额做质押，0: 自由金额； 1: 锁仓金额|
|amount|*big.Int(bytes)|增持的von|






<a name="staking_contract_4"></a>
<code style="color: purple;">1003. withdrewStaking() </code>: 撤销质押(一次性发起全部撤销，多次到账)



|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1003)|
|nodeId|64bytes|被质押的节点的NodeId|

<a name="staking_contract_5"></a>
<code style="color: purple;">1004. delegate() </code>: 发起委托



|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1004)|
|typ|uint16(2bytes)|表示使用账户自由金额还是账户的锁仓金额做委托，0: 自由金额； 1: 锁仓金额|
|nodeId|64bytes|被质押的节点的NodeId|
|amount|*big.Int(bytes)|委托的金额(按照最小单位算，1LAT = 10**18 von)|

<a name="staking_contract_6"></a>
<code style="color: purple;">1005. withdrewDelegate() </code>: 减持/撤销委托(全部减持就是撤销)



|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1005)|
|stakingBlockNum|uint64(8bytes)|代表着某个node的某次质押的唯一标示|
|nodeId|64bytes|被质押的节点的NodeId|
|amount|*big.Int(bytes)|减持委托的金额(按照最小单位算，1LAT = 10**18 von)|

<a name="staking_contract_7"></a>
<code style="color: purple;">1100. getVerifierList() </code>: 查询当前结算周期的验证人队列



入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(1100)|

<a name="query_result">查询结果统一格式</a>

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

<a name="staking_contract_8"></a>
<code style="color: purple;">1101. getValidatorList() </code>: 查询当前共识周期的验证人列表



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

<a name="staking_contract_9"></a>
<code style="color: purple;">1102. getCandidateList() </code>: 查询所有实时的候选人列表



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

<a name="staking_contract_10"></a>
<code style="color: purple;">1103. getRelatedListByDelAddr() </code>: 查询当前账户地址所委托的节点的NodeID和质押Id



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


<a name="staking_contract_11"></a>
<code style="color: purple;">1104. getDelegateInfo() </code>: 查询当前单个委托信息



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

<a name="staking_contract_12"></a>
<code style="color: purple;">1105. getCandidateInfo() </code>: 查询当前节点的质押信息



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



#### 治理接口

**以下 治理相关接口的合约地址为:** 0x1000000000000000000000000000000000000005

<a name="submitText"></a>
<code style="color: purple;">2000. submitText() </code>: 提交文本提案

|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2000)|
|verifier|discover.NodeID(64bytes)|提交提案的验证人|
|pIDID|string(uint64)|PIPID|

<a name="submitVersion"></a>
<code style="color: purple;">2001. submitVersion() </code>: 提交升级提案



|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2001)|
|verifier|discover.NodeID(64bytes)|提交提案的验证人|
|pIDID|string(uint64)|PIPID|
|newVersion|uint32(4bytes)|升级版本|
|endVotingRounds|uint64|投票共识轮数量。说明：假设提交提案的交易，被打包进块时的共识轮序号时round1，则提案投票截止块高，就是round1 + endVotingRounds这个共识轮的第230个块高（假设一个共识轮出块250，ppos揭榜提前20个块高，250，20都是可配置的 ），其中0 < endVotingRounds <= 4840（约为2周，实际论述根据配置可计算），且为整数）|


<a name="submitCancel"></a>
<code style="color: purple;">2005. submitCancel() </code>: 提交取消提案



|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2005)|
|verifier|discover.NodeID(64bytes)|提交提案的验证人|
|pIDID|string(uint64)|PIPID|
|endVotingRounds|uint64|投票共识轮数量。参考提交升级提案的说明，同时，此接口中此参数的值不能大于对应升级提案中的值|
|tobeCanceledProposalID|common.hash(32bytes)|待取消的升级提案ID|


<a name="vote"></a>
<code style="color: purple;">2003. vote() </code>: 给提案投票



|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2003)|
|verifier|discover.NodeID(64bytes)|投票验证人|
|proposalID|common.Hash(32bytes)|提案ID|
|option|uint8(1byte)|投票选项|
|programVersion|uint32(4bytes)|节点代码版本，有rpc的getProgramVersion接口获取|
|versionSign|common.VesionSign(65bytes)|代码版本签名，有rpc的getProgramVersion接口获取|

<a name="declareVersion"></a>
<code style="color: purple;">2004. declareVersion() </code>: 版本声明



|参数|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2004)|
|verifier|discover.NodeID(64bytes)|声明的节点，只能是验证人/候选人|
|programVersion|uint32(4bytes)|声明的版本，有rpc的getProgramVersion接口获取|
|versionSign|common.VesionSign(65bytes)|声明的版本签名，有rpc的getProgramVersion接口获取|



<a name="getProposal"></a>
<code style="color: purple;">2100. getProposal() </code>: 查询提案



入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|2100)|
|proposalID|common.Hash(32bytes)|提案ID|

返参：

Proposal接口实现对象的json字符串，参考： [Proposal接口 提案定义](#Proposal)

<a name="getTallyResult"></a>
<code style="color: purple;">2101. getTallyResult() </code>: 查询提案结果



入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2101)|
|proposalID|common.Hash(32bytes)|提案ID|

返参：
TallyResult对象的json字符串，参考：[TallyResult 投票结果定义](#TallyResult)

<a name="listProposal"></a>

<code style="color: purple;">2102. listProposal() </code>: 查询提案列表



入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2102)|

返参：

Proposal接口实现对象列表的json字符串，参考： [Proposal接口 提案定义](#Proposal)



<a name="getActiveVersion"></a>

<code style="color: purple;">2103. getActiveVersion() </code>: 查询节点的链生效版本



入参：

|名称|类型|说明|
|---|---|---|
|funcType|uint16(2bytes)|代表方法类型码(2103)|

返参：

版本号的json字符串，如{65536}，表示版本是：1.0.0。
解析时，需要把ver转成4个字节。主版本：第二个字节；小版本：第三个字节，patch版本，第四个字节。


<a name="getAccuVerifiersCount"></a>

<code style="color: purple;">2105. getAccuVerifiersCount() </code>: 查询提案的累积可投票人数



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


<a name="ProposalType"></a>

####  <span style="color: red;">**ProposalType 提案类型定义**</span>

|类型|定义|说明|
|---|---|---|
|TextProposal|0x01|文本提案|
|VersionProposal|0x02|升级提案|
|CancelProposal|0x04|取消提案|

<a name="ProposalType"></a>

####  <span style="color: red;">**ProposalStatus 提案状态定义**</span>

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

<a name="VoteOption"></a>

####  <span style="color: red;">**VoteOption 投票选项定义**</span>

|类型|定义|说明|
|---|---|---|
|Yeas|0x01|支持|
|Nays|0x02|反对|
|Abstentions|0x03|弃权|

<a name="Proposal"></a>

####  <span style="color: red;">**Proposal接口 提案定义**</span>

子类TextProposal：文本提案

- 字段说明：

|字段|类型|说明|
|---|---|---|
|ProposalID|common.Hash(32bytes)|提案ID|
|Proposer|common.NodeID(64bytes)|提案节点ID|
|ProposalType|byte|提案类型， 0x01：文本提案； 0x02：升级提案；0x03参数提案；0x04取消提案。|
|PIPID|string|提案PIPID|
|SubmitBlock|8bytes|提交提案的块高|
|EndVotingBlock|8bytes|提案投票结束的块高，系统根据SubmitBlock|


子类VersionProposal：升级提案

- 字段说明：

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

- 字段说明：

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


<a name="Vote"></a>

####  <span style="color: red;">**Vote 投票定义**</span>

|字段|类型|说明|
|---|---|---|
|voter|64bytes|投票验证人|
|proposalID|common.Hash(32bytes)|提案ID|
|option|VoteOption|投票选项|

<a name="TallyResult"></a>

####  <span style="color: red;">**TallyResult 投票结果定义**</span>

|字段|类型|说明|
|---|---|---|
|proposalID|common.Hash(32bytes)|提案ID|
|yeas|uint16(2bytes)|赞成票|
|nays|uint16(2bytes)|反对票|
|abstentions|uint16(2bytes)|弃权票|
|accuVerifiers|uint16(2bytes)|在整个投票期内有投票资格的验证人总数|
|status|byte|状态|
|canceledBy|common.Hash(32bytes)|当status=0x06时，记录发起取消的ProposalID|

#### 举报惩罚接口

**以下 slashing相关接口的合约地址为:** 0x1000000000000000000000000000000000000004

<a name="ReportDuplicateSign"></a>
<code style="color: purple;">3000. ReportDuplicateSign() </code>: 举报双签



| 参数     | 类型   | 描述                                    |
| -------- | ------ | --------------------------------------- |
| funcType | uint16(2bytes) | 代表方法类型码(3000)                    |
| typ      | uint8         | 代表双签类型，<br />1：prepareBlock，2：prepareVote，3：viewChange |
| data     | string | 单个证据的json值，格式参照[RPC接口Evidences][evidences_interface] |

<a name="CheckDuplicateSign"></a>
<code style="color: purple;">3001. CheckDuplicateSign() </code>: 查询节点是否已被举报过多签

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



#### 锁仓接口

**以下 锁仓相关接口的合约地址为:** 0x1000000000000000000000000000000000000001

<a name="CreateRestrictingPlan"></a>
<code style="color: purple;">4000. CreateRestrictingPlan() </code>: 创建锁仓计划



入参：

| 参数    | 类型           | 说明                                                         |
| ------- | -------------- | ------------------------------------------------------------ |
| account | 20bytes | `锁仓释放到账账户`                                           |
| plan    | []RestrictingPlan | plan 为 RestrictingPlan 类型的列表（数组），RestrictingPlan 定义如下：<br>type RestrictingPlan struct { <br/>    Epoch uint64<br/>    Amount：\*big.Int<br/>}<br/>其中，Epoch：表示结算周期的倍数。与每个结算周期出块数的乘积表示在目标区块高度上释放锁定的资金。Epoch \* 每周期的区块数至少要大于最高不可逆区块高度。<br>Amount：表示目标区块上待释放的金额。 |

<a name="GetRestrictingInfo"></a>
<code style="color: purple;">4100. GetRestrictingInfo() </code>: 获取锁仓信息。

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

### 其他
你可以根据test的目录下面config.default.js文件为模板配置好设置保存在同级目录的config.js文件。然后执行`npm run ppos`执行单元测试。更多调用示例请参考test目录下面写的单元测试ppos.js文件