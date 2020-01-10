## Web3.js 调用接口 

通过 web3.js 提供的web3对象与底层链进行交互。底层实现上，它通过 RPC 调用与本地节点通信。web3.js可以与任何暴露了RPC接口的PlatON节点连接。

### 准备工作

首先请确保本地成功安装了nodeJS环境，由于该项目使用了[lerna](https://github.com/lerna/lerna)管理工具来优化托管在git\npm上的多package代码库的工作流，所以你在安装之前确保已经全局安装了lerna包。如果没有，执行命令`npm i lerna -g`进行全局安装。

然后你就可以通过npm包管理工具将web3引入到项目工程中，通过如下步骤：

- npm: `npm i PlatONnetwork/client-sdk-js`

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
