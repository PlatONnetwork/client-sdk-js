# 目录

- [概览](#概览)
- [快速入门](#快速入门)
  - [安装或引入](#安装或引入)
  - [初始化代码](#初始化代码)
- [合约](#合约)
  - [合约初始化及接口调用](#合约初始化及接口调用)
  - [合约API](#合约API)
    - [StakingContract](#StakingContract)
      - [staking](#staking-发起质押)
      - [updateStakingInfo](#updateStakingInfo-修改质押信息)
      - [unStaking](#unStaking-撤销质押)
      - [addStaking](#addStaking-增持质押)
      - [GetStakingInfo](#GetStakingInfo-获取质押信息)
    - [NodeContract](#NodeContract)
      - [GetVerifierList](#GetVerifierList-查询当前结算周期的验证人队列)
      - [getValidatorList](#getValidatorList-查询当前共识周期的验证人列表)
      - [getCandidateList](#getCandidateList-查询所有实时的候选人列表)
    - [DelegateContract](#DelegateContract)
      - [delegate](#delegate-发起委托)
      - [withdrewDelegate](#withdrewDelegate-撤销委托)
      - [GetRelatedListByDelAddr](#GetRelatedListByDelAddr-查询当前账户地址所委托的节点的NodeID和质押Id)
      - [GetDelegateInfo](#GetDelegateInfo-查询当前单个委托信息)
    - [ProposalContract](#ProposalContract)
      - [submitText](#submitText-提交文本提案)
      - [submitParam](#submitParam-提交参数提案)
      - [submitVersion](#submitVersion-提交升级提案)
      - [vote](#vote-给提案投票)
      - [declareVersion](#declareVersion-版本声明)
      - [getProposal](#getProposal-查询提案)
      - [listProposal](#listProposal-查询提案列表)
      - [getTallyResult](#getTallyResult-查询提案结果)
      - [getActiveVersion](#getActiveVersion-查询节点的链生效版本)
      - [getProgramVersion](#getProgramVersion-查询节点代码版本)
    - [RestrictingPlanContract](#RestrictingPlanContract)
      - [createRestrictingPlan](#createRestrictingPlan-创建锁仓计划)
      - [getRestrictingInfo](#getRestrictingInfo-获取锁仓信息)
    - [SlashContract](#SlashContract)
      - [reportDoubleSign](#reportDoubleSign-举报多签)
      - [checkDuplicateSign](#checkDuplicateSign-查询接口是否已经被举报多签)
- [web3](#web3)
  - [web3 eth相关 (标准JSON RPC )](#web3-eth相关-标准json-rpc)

## 概览
> Javascript SDK是PlatON面向js开发者，提供的PlatON公链的js开发工具包

## 快速入门

### 安装或引入

通过node.js引入：

`cnpm i https://github.com/PlatONnetwork/client-sdk-js`

### 初始化代码

然后你需要创建一个web3的实例，设置一个provider。为了保证你不会覆盖一个已有的provider，比如使用Mist时有内置，需要先检查是否web3实例已存在。

```js
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:6789'));
}
```
## 合约
> PlatON对外提供的与链交互的API

### 合约初始化及接口调用

```
const cid = web3.version.network;
web3.[ContractName].init(web3,cid);

web3.[ContractName].[funcName]();
```
#### 示例

```
const cid = web3.version.network;
web3.StakingContract.init(web3,cid);

let stakeParams = {
  from:'0x493301712671Ada506ba6Ca7891F436D29185821',
  privateKey:'a11859ce23effc663a9460e332ca09bd812acc390497f8dc7542b6938e13f8d7',
  value:0,
  typ:1,
  benifitAddress:'0x12c171900f010b17e969702efa044d077e868082',
  nodeId:'f71e1bc638456363a66c4769284290ef3ccff03aba4a22fb60ffaed60b77f614bfd173532c3575abe254c366df6f4d6248b929cb9398aaac00cbcc959f7b2b7c',
  externalId:'111111',
  nodeName:'platon',
  website:'https://www.test.network',
  details:'supper node',
  amount:1000000000000000000000000,
  processVersion:1792,
}

web3.stakingContract.staking(stakingParams).then(res=>{
    console.log(res); // {result:true,data:'0x03aba4a22fb60ffaed60b77f614bfd173532c357'}
}).catch(err=>{
    console.log(err);
});
```
<a name="合约API"></a>

### 合约API

#### 接口说明

以下合约接口未列出返回参数的即为交易接口，其它为查询接口
交易接口统一返回参数形式如下：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|hash |String |必选| 交易hash|


#### StakingContract

<a name="staking-发起质押"></a>

##### staking-发起质押

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|typ|Number  |必选|表示使用账户自由金额还是账户的锁仓金额做质押，0: 自由金额； 1: 锁仓金额|
|benefitAddress|String  |必选|用于接受出块奖励和质押奖励的收益账户|
|nodeId|String  |必选|被质押的节点Id|
|externalId|String  |必选|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|nodeName|String  |必选|被质押节点的名称(有长度限制，表示该节点的名称)|
|website|String  |必选|节点的第三方主页(有长度限制，表示该节点的主页)|
|details|String  |必选|节点的描述(有长度限制，表示该节点的描述)|
|amount|Number  |必选|质押的von|
|programVersion|Number  |必选|程序的真实版本，治理rpc获取|

<a name="updateStakingInfo-修改质押信息"></a>

##### updateStakingInfo-修改质押信息

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|typ|Number  |必选|表示使用账户自由金额还是账户的锁仓金额，0: 自由金额； 1: 锁仓金额|
|benefitAddress|String  |必选|用于接受出块奖励和质押奖励的收益账户|
|nodeId|String  |必选|被质押的节点Id|
|externalId|String  |必选|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|nodeName|String  |必选|被质押节点的名称(有长度限制，表示该节点的名称)|
|website|String  |必选|节点的第三方主页(有长度限制，表示该节点的主页)|
|details|String  |必选|节点的描述(有长度限制，表示该节点的描述)|

<a name="unStaking-撤销质押"></a>

##### unStaking-撤销质押

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|nodeId|String  |必选|被质押的节点Id|

<a name="addStaking-增持质押"></a>

##### addStaking-增持质押

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|nodeId|String  |必选|被质押的节点Id|
|typ|Number  |必选|表示使用账户自由金额还是账户的锁仓金额，0: 自由金额； 1: 锁仓金额|
|amount|Number  |必选|质押的von|

<a name="GetStakingInfo-获取质押信息"></a>

##### GetStakingInfo-获取质押信息

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|nodeId|String  |必选|被质押的节点Id|

返参： 列表

|名称|类型|说明|
|---|---|---|
|NodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|StakingAddress|20bytes|发起质押时使用的账户(后续操作质押信息只能用这个账户，撤销质押时，von会被退回该账户或者该账户的锁仓信息中)|
|BenefitAddress|20bytes|用于接受出块奖励和质押奖励的收益账户|
|StakingTxIndex|uint32(4bytes)|发起质押时的交易索引|
|ProgramVersion|uint32(4bytes)|被质押节点的PlatON进程的真实版本号(获取版本号的接口由治理提供)|
|Status|uint32(4bytes)|候选人的状态(状态是根据uint32的32bit来放置的，可同时存在多个状态，值为多个同时存在的状态值相加0: 节点可用 (32个bit全为0)； 1: 节点不可用 (只有最后一bit为1)； 2： 节点出块率低(只有倒数第二bit为1)； 4： 节点的von不足最低质押门槛(只有倒数第三bit为1)； 8：节点被举报双签(只有倒数第四bit为1))|
|StakingEpoch|uint32(4bytes)|当前变更质押金额时的结算周期|
|StakingBlockNum|uint64(8bytes)|发起质押时的区块高度|
|Shares|*big.Int(bytes)|当前候选人总共质押加被委托的von数目|
|Released|*big.Int(bytes)|发起质押账户的自由金额的锁定期质押的von|
|ReleasedHes|*big.Int(bytes)|发起质押账户的自由金额的犹豫期质押的von|
|RestrictingPlan|*big.Int(bytes)|发起质押账户的锁仓金额的锁定期质押的von|
|RestrictingPlanHes|*big.Int(bytes)|发起质押账户的锁仓金额的犹豫期质押的von|
|ExternalId|string|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|NodeName|string|被质押节点的名称(有长度限制，表示该节点的名称)|
|Website|string|节点的第三方主页(有长度限制，表示该节点的主页)|
|Details|string|节点的描述(有长度限制，表示该节点的描述)|



#### NodeContract

<a name="GetVerifierList-查询当前结算周期的验证人队列"></a>

##### GetVerifierList-查询当前结算周期的验证人队列

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
无

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

<a name="getValidatorList-查询当前共识周期的验证人列表"></a>

##### getValidatorList-查询当前共识周期的验证人列表

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
无

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

<a name="getCandidateList-查询所有实时的候选人列表"></a>

##### getCandidateList-查询所有实时的候选人列表

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
无

返参： 列表

|名称|类型|说明|
|---|---|---|
|NodeId|64bytes|被质押的节点Id(也叫候选人的节点Id)|
|StakingAddress|20bytes|发起质押时使用的账户(后续操作质押信息只能用这个账户，撤销质押时，von会被退回该账户或者该账户的锁仓信息中)|
|BenefitAddress|20bytes|用于接受出块奖励和质押奖励的收益账户|
|StakingTxIndex|uint32(4bytes)|发起质押时的交易索引|
|ProgramVersion|uint32(4bytes)|被质押节点的PlatON进程的真实版本号(获取版本号的接口由治理提供)|
|Status|uint32(4bytes)|候选人的状态(状态是根据uint32的32bit来放置的，可同时存在多个状态，值为多个同时存在的状态值相加0: 节点可用 (32个bit全为0)； 1: 节点不可用 (只有最后一bit为1)； 2： 节点出块率低(只有倒数第二bit为1)； 4： 节点的von不足最低质押门槛(只有倒数第三bit为1)； 8：节点被举报双签(只有倒数第四bit为1))|
|StakingEpoch|uint32(4bytes)|当前变更质押金额时的结算周期|
|StakingBlockNum|uint64(8bytes)|发起质押时的区块高度|
|Shares|*big.Int(bytes)|当前候选人总共质押加被委托的von数目|
|Released|*big.Int(bytes)|发起质押账户的自由金额的锁定期质押的von|
|ReleasedHes|*big.Int(bytes)|发起质押账户的自由金额的犹豫期质押的von|
|RestrictingPlan|*big.Int(bytes)|发起质押账户的锁仓金额的锁定期质押的von|
|RestrictingPlanHes|*big.Int(bytes)|发起质押账户的锁仓金额的犹豫期质押的von|
|ExternalId|string|外部Id(有长度限制，给第三方拉取节点描述的Id)|
|NodeName|string|被质押节点的名称(有长度限制，表示该节点的名称)|
|Website|string|节点的第三方主页(有长度限制，表示该节点的主页)|
|Details|string|节点的描述(有长度限制，表示该节点的描述)|



#### DelegateContract

<a name="delegate-发起委托"></a>

##### delegate-发起委托

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|typ|Number  |必选|表示使用账户自由金额还是账户的锁仓金额，0: 自由金额； 1: 锁仓金额|
|nodeId|String  |必选|委托的节点Id|
|amount|Number  |必选|委托的金额|

<a name="withdrewDelegate-撤销委托"></a>

##### withdrewDelegate-撤销委托

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|stakingBlockNum|Number  |必选|质押唯一标识|
|nodeId|String  |必选|委托的节点Id|
|amount|Number  |必选|减持委托的金额|

<a name="GetRelatedListByDelAddr-查询当前账户地址所委托的节点的NodeID和质押Id"></a>

##### GetRelatedListByDelAddr-查询当前账户地址所委托的节点的NodeID和质押Id

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|addr|String  |必选|委托人的账户地址|

返参： 列表

|名称|类型|说明|
|---|---|---|
|Addr|20bytes|验证人节点的地址|
|NodeId|64bytes|验证人的节点Id|
|StakingBlockNum|uint64(8bytes)|发起质押时的区块高度|

<a name="GetDelegateInfo-查询当前单个委托信息"></a>

##### GetDelegateInfo-查询当前单个委托信息

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|stakingBlockNum|Number  |必选|发起质押时的区块高度|
|delAddr|String  |必选|委托人的账户地址|
|nodeId|String  |必选|验证人的节点Id|

返参： 列表

|名称|类型|说明|
|---|---|---|
|Addr|20bytes|委托人的账户地址|
|NodeId|64bytes|验证人的节点Id|
|StakingBlockNum|uint64(8bytes)|发起质押时的区块高度|
|DelegateEpoch|uint32(4bytes)|最近一次对该候选人发起的委托时的结算周期|
|Released|*big.Int(bytes)|发起委托账户的自由金额的锁定期委托的von|
|ReleasedHes|*big.Int(bytes)|发起委托账户的自由金额的犹豫期委托的von|
|RestrictingPlan|*big.Int(bytes)|发起委托账户的锁仓金额的锁定期委托的von|
|RestrictingPlanHes|*big.Int(bytes)|发起委托账户的锁仓金额的犹豫期委托的von|
|Reduction|*big.Int(bytes)|处于撤销计划中的von|


#### ProposalContract

<a name="submitText-提交文本提案"></a>

##### submitText-提交文本提案

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|verifier|String  |必选|提交提案的验证人|
|githubID|String  |必选|提案在github上的ID|
|topic|String  |必选|提案主题|
|desc|String  |必选|提案描述|
|url|String  |必选|提案URL|
|endVotingBlock|Number  |必选|提案投票截止块高|

<a name="submitParam-提交参数提案"></a>

##### submitParam-提交参数提案

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|verifier|String  |必选|提交提案的验证人|
|githubID|String  |必选|提案在github上的ID|
|topic|String  |必选|提案主题|
|desc|String  |必选|提案描述|
|url|String  |必选|提案URL|
|endVotingBlock|Number  |必选|提案投票截止块高|
|paramName|String  |必选|参数名称|
|currentValue|String  |必选|当前值|
|newValue|Number  |必选|新的值|

<a name="submitVersion-提交升级提案"></a>

##### submitVersion-提交升级提案

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|verifier|String  |必选|提交提案的验证人|
|githubID|String  |必选|提案在github上的ID|
|topic|String  |必选|提案主题|
|desc|String  |必选|提案描述|
|url|String  |必选|提案URL|
|newVersion|String  |必选|升级版本|
|endVotingBlock|Number  |必选|提案投票截止块高|
|activeBlock|String  |必选|生效块高|

<a name="vote-给提案投票"></a>

##### vote-给提案投票

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|verifier|String  |必选|提交提案的验证人|
|proposalID|String  |必选|提案ID|
|option|String  |必选|投票选项|
|programVersion|Number  |必选|节点代码版本|

<a name="declareVersion-版本声明"></a>

##### declareVersion-版本声明

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|activeNode|String  |必选|声明的节点，只能是验证人/候选人|
|version|String  |必选|声明的版本|

<a name="getProposal-查询提案"></a>

##### getProposal-查询提案

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|proposalID |String |必选| 提案ID|

返参： 列表

|名称|类型|说明|
|---|---|---|
|无|String|json字符串|

<a name="listProposal-查询提案列表"></a>

##### listProposal-查询提案列表

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
无

返参： 列表

|名称|类型|说明|
|---|---|---|
|无|String|json字符串|

<a name="getTallyResult-查询提案结果"></a>

##### getTallyResult-查询提案结果

入参：

| 参数名 |类型|属性|参数说明|
|proposalID |String |必选| 提案ID|

返参： 列表

|名称|类型|说明|
|---|---|---|
|无|String|json字符串|

<a name="getActiveVersion-查询节点的链生效版本"></a>

##### getActiveVersion-查询节点的链生效版本

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
无

返参： 列表

|名称|类型|说明|
|---|---|---|
|无|String|json字符串|

<a name="getProgramVersion-查询节点代码版本"></a>

##### getProgramVersion-查询节点代码版本

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
无

返参： 列表

|名称|类型|说明|
|---|---|---|
|无|String|json字符串|

<a name="listParam-查询可治理参数列表"></a>

##### listParam-查询可治理参数列表

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
无

返参： 列表

|名称|类型|说明|
|---|---|---|
|无|String|json字符串|


#### RestrictingPlanContract

<a name="createRestrictingPlan-创建锁仓计划"></a>

##### createRestrictingPlan-创建锁仓计划

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|account|String  |必选|锁仓释放到账账户|
|Plan|Array  |必选|[{Epoch:Number,Amount:Number}],(Epoch：表示结算周期的倍数。Amount：表示目标区块上待释放的金额|

<a name="getRestrictingInfo-获取锁仓信息"></a>

##### getRestrictingInfo-获取锁仓信息

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|account|String  |必选|锁仓释放到账账户|

返参：

| 名称    | 类型            | 说明                                                         |
| ------- | --------------- | ------------------------------------------------------------ |
| balance | *big.Int(bytes) | 锁仓余额                                                     |
| debt    | *big.Int(bytes) | symbol为 true，debt 表示欠释放的款项，为 false，debt 表示可抵扣释放的金额 |
| symbol  | bool            | debt 的符号                                                  |
| info    | bytes           | 锁仓分录信息，json数组：[{"blockNumber":"","amount":""},...,{"blockNumber":"","amount":""}]。其中：<br/>blockNumber：\*big.Int，释放区块高度<br/>amount：\*big.Int，释放金额 |


#### SlashContract

<a name="reportDoubleSign-举报多签"></a>

##### reportDoubleSign-举报多签

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|from |String |必选| 发送交易的账户地址|
|privateKey|String  |必选|发送交易的账户私钥|
|value|Number  |必选|发送交易的金额|
|data|String  |必选|证据的json值|

<a name="checkDuplicateSign-查询接口是否已经被举报多签"></a>

##### checkDuplicateSign-查询接口是否已经被举报多签

入参：

| 参数名 |类型|属性|参数说明|
| :------: |:------: |:------: | :------: |
|typ|String  |必选|代表双签类型, 1：prepare，2：viewChange|
|addr|String  |必选|举报的节点地址|
|blockNumber|Number  |必选|多签的块高|

返参：

| 类型   | 描述           |
| ------ | -------------- |
| 16进制 | 举报的交易Hash |

### web3

<a name="web3-eth相关-标准json-rpc"></a>

#### web3 eth相关 (标准JSON RPC )
- api的使用请参考[web3j github](https://github.com/ethereum/wiki/wiki/JavaScript-API)
