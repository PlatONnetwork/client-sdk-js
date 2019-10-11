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
### 其他
你可以根据test的目录下面config.default.js文件为模板配置好设置保存在同级目录的config.js文件。然后执行`npm run ppos`执行单元测试。更多调用示例请参考test目录下面写的单元测试ppos.js文件
