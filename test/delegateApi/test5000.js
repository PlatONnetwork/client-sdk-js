// @ts-ignore
const Web3 = require("../../packages/web3/src");

const provider = 'http://192.168.120.146:6789'
const chainId = '0x7885e92e'
const hrp = 'lat'

const walletAddress = '0x27B80eDBebB98b697907c204D4ec795aF50EFACb'
const privateKey = '3c55c540dbc426e13ddd02833af8e6e57861af89ac5f89f6fb5982de0e068b66'

const web3 = new Web3(provider);
const ppos = web3.ppos

ppos?.updateSetting({
    privateKey,
    chainId
})

const nodeId = '0x77fffc999d9f9403b65009f1eb27bae65774e2d8ea36f7b20a89f82642a5067557430e6edfe5320bb81c3666a19cf4a5172d6533117d7ebcd0f2c82055499050'
const params = { // 委托
    funcType: 5000,
};

ppos?.send(params).then((response) => {
    console.log('response', response);
}).catch((err) => {
    console.log('err', err);
})

