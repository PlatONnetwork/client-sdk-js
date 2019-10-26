var path = require('path');
var EU = require('ethereumjs-util');
var PPOS = require('../lib/ppos/index');
var ppos = new PPOS({})

// 质押的节点
const nodeId = '80f1fcee54de74dbf7587450f31c31c0e057bedd4faaa2a10c179d52c900ca01f0fb255a630c49d83b39f970d175c42b12a341a37504be248d76ecf592d32bc0';
const privateKey = 'acc73b693b79bbb56f89f63ccc3a0c00bf1b8380111965bfe8ab22e32045600c';
const address = EU.bufferToHex(EU.privateToAddress('0x' + privateKey));
const privateKeyDelegate = '053f34a1962467d2ff589b970883e9827f9b8a0fe5d2113d71c638db4d0b5616';
const addressDelegate = EU.bufferToHex(EU.privateToAddress('0x' + privateKeyDelegate));
const benefitAddress = '0xe6F2ce1aaF9EBf2fE3fbA8763bABaDf25e3fb5FA';
const amount = '10000000000000000000000000000';
const pIDID = new Date().getTime();

module.exports = {
    // 实例化一个 ppos 对象需要的配置
    pposSetting: {
        provider: 'http://192.168.120.164:6789', // rpc 链接地址
        chainId: 100, // 使用rpc admin_nodeInfo 可以查到，签名要用
        privateKey: privateKey,
    },
    // 字符串节点
    nodeId: nodeId,
    amount: amount,
    pIDID: String(pIDID),
    // 质押跟委托不能用同一个地址啊
    privateKeyStaking: privateKey,
    addressStaking: address,
    privateKeyDelegate: privateKeyDelegate,
    addressDelegate: addressDelegate,

    // 发起质押
    createStaking: {
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
        blsPubKey: ppos.hexStrBuf('d2459db974f49ca9cbf944d4d04c2d17888aef90858b62d6aec166341a6e886e8c0c0cfae9e469c2f618f5d9b7a249130d10047899da6154288c9cde07b576acacd75fef07ba0cfeb4eaa7510704e77a9007eff5f1a5f8d099e6ea664129780c'),
        blsProof: undefined, // rpc 获取
    },
    //修改质押信息
    editCandidate: {
        funcType: 1001,
        benefitAddress: ppos.hexStrBuf(benefitAddress),
        nodeId: ppos.hexStrBuf(nodeId),
        externalId: "127.0.0.1",
        nodeName: "Platon nodeName ppos",
        website: "www.xxx.com",
        details: "I love this world",
    },
    // 增持质押
    increaseStaking: {
        funcType: 1002,
        nodeId: ppos.hexStrBuf(nodeId),
        typ: 0,
        amount: ppos.bigNumBuf(amount),
    },
    // 撤销质押(一次性发起全部撤销，多次到账)
    withdrewStaking: {
        funcType: 1003,
        nodeId: ppos.hexStrBuf(nodeId),
    },
    // 发起委托
    delegate: {
        funcType: 1004,
        typ: 0,
        nodeId: ppos.hexStrBuf(nodeId),
        amount: ppos.bigNumBuf(amount),
    },
    // 减持/撤销委托(全部减持就是撤销)
    withdrewDelegate: {
        funcType: 1005,
        stakingBlockNum: undefined, // 发起质押之后返回的区块号
        nodeId: ppos.hexStrBuf(nodeId),
        amount: ppos.bigNumBuf(amount),
    },
    // 查询当前结算周期的验证人队列
    getVerifierList: {
        funcType: 1100,
    },
    // 查询当前共识周期的验证人列表
    getValidatorList: {
        funcType: 1101,
    },
    // 查询所有实时的候选人列表
    getCandidateList: {
        funcType: 1102,
    },
    // 查询当前账户地址所委托的节点的NodeID和质押Id
    getRelatedListByDelAddr: {
        funcType: 1103,
        addr: ppos.hexStrBuf(addressDelegate),
    },
    // 查询当前单个委托信息
    getDelegateInfo: {
        funcType: 1104,
        stakingBlockNum: undefined,  // 发起质押之后返回的区块号
        delAddr: ppos.hexStrBuf(addressDelegate),
        nodeId: ppos.hexStrBuf(nodeId),
    },
    // 查询当前节点的质押信息
    getCandidateInfo: {
        funcType: 1105,
        nodeId: ppos.hexStrBuf(nodeId),
    },

    // 提交文本提案
    submitText: {
        funcType: 2000,
        verifier: ppos.hexStrBuf(nodeId),
        pIDID: String(pIDID),
    },
    // 提交升级提案
    submitVersion: {
        funcType: 2001,
        verifier: ppos.hexStrBuf(nodeId),
        pIDID: String(pIDID + 1),
        newVersion: 1 << 16, // 1.0.0
        endVotingRounds: 1000,
    },
    // 提交取消提案
    submitCancel: {
        funcType: 2005,
        verifier: ppos.hexStrBuf(nodeId),
        pIDID: String(pIDID),
        endVotingRounds: 1000,
        tobeCanceledProposalID: undefined, // 由当时提交投案的交易hash
    },
    // 给提案投票
    vote: {
        funcType: 2003,
        verifier: ppos.hexStrBuf(nodeId),
        proposalID: undefined, // 由当时提交投案的交易hash
        pIDID: String(pIDID), // 由当时提交的获取
        option: 1,
        programVersion: undefined, // rpc 获取
        versionSign: undefined, // rpc 获取
    },
    // 版本声明
    declareVersion: {
        funcType: 2004,
        verifier: ppos.hexStrBuf(nodeId),
        programVersion: undefined, // rpc 获取
        versionSign: undefined, // rpc 获取
    },
    //  查询提案
    getProposal: {
        funcType: 2100,
        proposalID: undefined, // 由当时提交投案的交易hash
    },
    //  查询提案结果
    getTallyResult: {
        funcType: 2101,
        proposalID: undefined, // 由当时提交投案的交易hash
    },
    //  查询提案列表
    listProposal: {
        funcType: 2102
    },
    //  查询节点的链生效版本
    getActiveVersion: {
        funcType: 2103
    },
    //  查询提案的累积可投票人数
    getAccuVerifiersCount: {
        funcType: 2105,
        proposalID: undefined, // 由当时提交投案的交易hash
        blockHash: undefined, // 就用最新区块的hash吧
    },
    //  查询提案的累积可投票人数
    ReportDuplicateSign: {
        funcType: 3000,
        typ: 1,
        data: `{"prepare_a":{"epoch":1,"view_number":1,"block_hash":"0x86c86e7ddb977fbd2f1d0b5cb92510c230775deef02b60d161c3912244473b54","block_number":1,"block_index":1,"validate_node":{"index":0,"address":"0x076c72c53c569df9998448832a61371ac76d0d05","NodeID":"b68b23496b820f4133e42b747f1d4f17b7fd1cb6b065c613254a5717d856f7a56dabdb0e30657f18fb9074c7cb60eb62a6b35ad61898da407dae2cb8efe68511","blsPubKey":"6021741b867202a3e60b91452d80e98f148aefadbb5ff1860f1fec5a8af14be20ca81fd73c231d6f67d4c9d2d516ac1297c8126ed7c441e476c0623c157638ea3b5b2189f3a20a78b2fd5fb32e5d7de055e4d2a0c181d05892be59cf01f8ab88"},"signature":"0x8c77b2178239fd525b774845cc7437ecdf5e6175ab4cc49dcb93eae6df288fd978e5290f59420f93bba22effd768f38900000000000000000000000000000000"},"prepare_b":{"epoch":1,"view_number":1,"block_hash":"0xeccd7a0b7793a74615721e883ab5223de30c5cf4d2ced9ab9dfc782e8604d416","block_number":1,"block_index":1,"validate_node":{"index":0,"address":"0x076c72c53c569df9998448832a61371ac76d0d05","NodeID":"b68b23496b820f4133e42b747f1d4f17b7fd1cb6b065c613254a5717d856f7a56dabdb0e30657f18fb9074c7cb60eb62a6b35ad61898da407dae2cb8efe68511","blsPubKey":"6021741b867202a3e60b91452d80e98f148aefadbb5ff1860f1fec5a8af14be20ca81fd73c231d6f67d4c9d2d516ac1297c8126ed7c441e476c0623c157638ea3b5b2189f3a20a78b2fd5fb32e5d7de055e4d2a0c181d05892be59cf01f8ab88"},"signature":"0x5213b4122f8f86874f537fa9eda702bba2e47a7b8ecc0ff997101d675a174ee5884ec85e8ea5155c5a6ad6b55326670d00000000000000000000000000000000"}}`,
    },
    //  查询提案的累积可投票人数
    CheckDuplicateSign: {
        funcType: 3001,
        typ: 1,
        addr: ppos.hexStrBuf(address),
        blockNumber: 1
    },
    //  创建锁仓计划
    CreateRestrictingPlan: {
        funcType: 4000,
        account: ppos.hexStrBuf(benefitAddress),
        plan: [[1, ppos.bigNumBuf('1000000000000000000')], [3, ppos.bigNumBuf('1000000000000000000')], [8, ppos.bigNumBuf('1000000000000000000')]],
    },
    //  获取锁仓信息
    GetRestrictingInfo: {
        funcType: 4100,
        account: ppos.hexStrBuf(benefitAddress),
    }
};
