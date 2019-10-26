var mocha = require('mocha');
var chai = require('chai');
var PPOS = require('../lib/ppos/index');
var BN = require('bn.js');
var fs = require('fs');
var path = require('path');

require('mocha-steps');
var expect = chai.expect;
var skip = it.skip;
var only = it.only;

var config = {};
try {
    config = require('./config');
} catch (error) {
    config = require('./config.default');
}

var logs = {}

var ppos = new PPOS(config.pposSetting);

// 下面开始跑经济模型用例
describe('begin ppos test...', function () {
    before(async function () {
        console.log('before ppos test...');
    });

    step('1000. createStaking() : 发起质押', async function () {
        let data, reply;

        let pv = await ppos.rpc('admin_getProgramVersion');
        let blsProof = await ppos.rpc('admin_getSchnorrNIZKProve');

        data = config.createStaking;
        data.programVersion = pv.Version;
        data.programVersionSign = pv.Sign;
        data.blsProof = ppos.hexStrBuf(blsProof);
        reply = await ppos.send(data);
        logs.createStaking = reply;

        config.withdrewDelegate.stakingBlockNum = ppos.bigNumBuf(parseInt(reply.blockNumber));
        config.getDelegateInfo.stakingBlockNum = ppos.bigNumBuf(parseInt(reply.blockNumber));

        data = config.getCandidateInfo;
        reply = await ppos.call(data);
        expect(reply.Code).to.be.equal(0);
        expect(reply.Data).to.deep.include({ NodeId: config.nodeId });
    });

    step('1001. editCandidate() : 修改质押信息', async function () {
        let data, reply;

        data = config.editCandidate;
        await ppos.send(data);

        data = config.getCandidateInfo;
        reply = await ppos.call(data);
        logs.editCandidate = reply;

        expect(reply.Code).to.be.equal(0);
        expect(reply.Data).to.deep.include({ ExternalId: config.editCandidate.externalId });
        expect(reply.Data).to.deep.include({ NodeName: config.editCandidate.nodeName });
        expect(reply.Data).to.deep.include({ Website: config.editCandidate.website });
        expect(reply.Data).to.deep.include({ Details: config.editCandidate.details });
    });

    step('1002. increaseStaking() : 增持质押', async function () {
        let data, reply;

        data = config.increaseStaking;
        await ppos.send(data);

        data = config.getCandidateInfo;
        reply = await ppos.call(data);
        logs.increaseStaking = reply;

        expect(reply.Code).to.be.equal(0);

        let originAmount = new BN(config.amount, 10);
        let increasedAmount = new BN(config.amount, 10);
        let sumAmount = originAmount.add(increasedAmount);
        expect(reply.Data.Shares).to.equal('0x' + sumAmount.toString(16));
    });

    step('1004. delegate() : 发起委托', async function () {
        ppos.updateSetting({ privateKey: config.privateKeyDelegate })
        let data = config.delegate;
        let reply = await ppos.send(data);
        logs.delegate = reply;

        ppos.updateSetting({ privateKey: config.privateKeyStaking })
    });

    step('1100. getVerifierList() : 查询当前结算周期的验证人队列', async function () {
        let reply = await ppos.call(config.getVerifierList);
        logs.getVerifierList = reply;
        expect(reply.Code).to.be.equal(0);
    });

    step('1101. getValidatorList() : 查询当前共识周期的验证人列表', async function () {
        let reply = await ppos.call(config.getValidatorList);
        logs.getValidatorList = reply;
        expect(reply.Code).to.be.equal(0);
    });

    step('1102. getCandidateList() : 查询所有实时的候选人列表', async function () {
        let reply = await ppos.call(config.getCandidateList);
        logs.getCandidateList = reply;
        expect(reply.Code).to.be.equal(0);
    });

    step('1103. getRelatedListByDelAddr() : 查询当前账户地址所委托的节点的NodeID和质押Id', async function () {
        let data = config.getValidatorList;
        let reply = await ppos.call(data);
        logs.getRelatedListByDelAddr = reply;
        expect(reply.Code).to.be.equal(0);
    });

    step('1104. getDelegateInfo() : 查询当前单个委托信息', async function () {
        let data = config.getDelegateInfo;
        let reply = await ppos.call(data);
        logs.getDelegateInfo = reply;
        expect(reply.Code).to.be.equal(0);
    });

    step('1105. getCandidateInfo() : 查询当前节点的质押信息', async function () {
        let data = config.getCandidateInfo;
        let reply = await ppos.call(data);
        logs.getCandidateInfo = reply;
        expect(reply.Code).to.be.equal(0);
    });

    step('2000. submitText() : 提交文本提案', async function () {
        let data = config.submitText;
        let reply = await ppos.send(data);
        logs.submitText = reply;

        // 后面很多药这个交易哈希的，就在这里赋值给他们了
        config.submitText.proposalID = ppos.hexStrBuf(reply.transactionHash);
        config.submitCancel.tobeCanceledProposalID = ppos.hexStrBuf(reply.transactionHash);
        config.vote.proposalID = ppos.hexStrBuf(reply.transactionHash);
        config.getProposal.proposalID = ppos.hexStrBuf(reply.transactionHash);
        config.getTallyResult.proposalID = ppos.hexStrBuf(reply.transactionHash);
        config.getAccuVerifiersCount.proposalID = ppos.hexStrBuf(reply.transactionHash);
    });

    step('2001. submitVersion() : 提交升级提案', async function () {
        let data = config.submitVersion;
        let reply = await ppos.send(data);
        logs.submitVersion = reply;
    });

    step('2003. vote() : 给提案投票', async function () {
        let pv = await ppos.rpc('admin_getProgramVersion');

        let data = config.vote;
        data.programVersion = pv.Version;
        data.versionSign = pv.Sign;
        let reply = await ppos.send(data);
        logs.vote = reply;
    });

    step('2100. getProposal() : 查询提案', async function () {
        let data = config.getProposal;
        let reply = await ppos.call(data);
        logs.getProposal = reply;
    });

    step('2101. getTallyResult() : 查询提案结果', async function () {
        let data = config.getTallyResult;
        let reply = await ppos.call(data);
        logs.getTallyResult = reply;
    });

    step('2102. listProposal() : 查询提案列表', async function () {
        let data = config.listProposal;
        let reply = await ppos.call(data);
        logs.listProposal = reply;
    });

    step('2103. getActiveVersion() : 查询节点的链生效版本', async function () {
        let data = config.getActiveVersion;
        let reply = await ppos.call(data);
        logs.getActiveVersion = reply;
    });

    step('2105. getAccuVerifiersCount() : 查询提案的累积可投票人数', async function () {
        let data = config.getAccuVerifiersCount;
        let reply = await ppos.call(data);
        logs.getAccuVerifiersCount = reply;
    });

    step('2004. declareVersion() : 版本声明', async function () {
        let pv = await ppos.rpc('admin_getProgramVersion');
        let data = config.declareVersion;
        data.programVersion = pv.Version;
        data.versionSign = pv.Sign;
        let reply = await ppos.send(data);
        logs.declareVersion = reply;
    });

    step('2005. submitCancel() : 提交取消提案', async function () {
        let data = config.submitCancel;
        let reply = await ppos.send(data);
        logs.submitCancel = reply;
    });

    step('3000. ReportDuplicateSign() : 举报双签', async function () {
        let data = config.ReportDuplicateSign;
        let reply = await ppos.send(data);
        logs.ReportDuplicateSign = reply;
    });

    step('3001. CheckDuplicateSign() : 查询节点是否已被举报过多签', async function () {
        let data = config.CheckDuplicateSign;
        let reply = await ppos.call(data);
        logs.CheckDuplicateSign = reply;
    });

    step('4000. CreateRestrictingPlan() : 创建锁仓计划', async function () {
        let data = config.CreateRestrictingPlan;
        let reply = await ppos.send(data);
        logs.CreateRestrictingPlan = reply;
    });

    step('4100. GetRestrictingInfo() : 获取锁仓信息', async function () {
        let data = config.GetRestrictingInfo;
        let reply = await ppos.call(data);
        logs.GetRestrictingInfo = reply;
    });

    step('1003. withdrewStaking() : 撤销质押(一次性发起全部撤销，多次到账)', async function () {
        let data, reply;

        data = config.withdrewStaking;
        reply = await ppos.send(data);
        logs.withdrewStakingSend = reply;

        data = config.getCandidateInfo;
        reply = await ppos.call(data);
        logs.withdrewStakingGetCandidateInfo = reply;
        expect(reply.Code).to.be.equal(301204); // 撤销成功之后候选人就不存在了
        expect(reply.Data).to.equal("");
        expect(reply.ErrMsg).to.equal("Query candidate info failed:Candidate info is not found");
    });

    step('1005. withdrewDelegate() : 减持/撤销委托(全部减持就是撤销)', async function () {
        ppos.updateSetting({ privateKey: config.privateKeyDelegate })
        let data = config.withdrewDelegate;
        let reply = await ppos.send(data);
        logs.withdrewDelegate = reply;
        ppos.updateSetting({ privateKey: config.privateKeyStaking })
    });

    after(async function () {
        fs.writeFileSync(path.join(__dirname, 'logs.json'), JSON.stringify(logs));
        console.log('after ppos test...');
    });
});
