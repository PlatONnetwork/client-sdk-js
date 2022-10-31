<div align=center><img style="width:120px" src="https://www.platon.network/_nuxt/img/1.logo2.a347578.svg"></div>

&nbsp;
&nbsp;
&nbsp;
&nbsp;

> A web3.js interface for platon. 

- Links：
    - [Jssdk Document](https://devdocs.platon.network/docs/en/JS_SDK)

Interact with nodes through web3 objects provided by web3.js. On the underlying implementation, it communicates with the local node through RPC calls. web3.js can connect to any PlatON node that exposes the RPC interface.

### Usage

First, make sure the nodeJS environment is successfully installed locally. `WEB3.JS` uses the [lerna](https://github.com/lerna/lerna) management tool to optimize the workflow of the multi-package code base hosted on `git/npm`, so you should make sure the lerna package has been installed globally before installing. If not, execute the command `npm i lerna -g` for global installation. 

Then you can integrate client-sdk-js into the project through package management tools such as npm or yarn, the steps are as follows:

- npm: `npm i PlatONnetwork/client-sdk-js#master`
- yarn: `yarn add PlatONnetwork/client-sdk-js#master`

> If the installation speed is too slow, please consider the following ways to install the sdk
- npm: `npm i @platonnetwork/web3`
- yarn: `yarn add @platonnetwork/web3`

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

