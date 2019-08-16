
const FUNCTYPE = {
    staking:1000,
    updateStakingInfo:1001,
    unStaking:1003,
    GetStakingInfo:1105,
    addStaking:1002,
    GetVerifierList:1100,
    GetValidatorList:1101,
    GetCandidateList:1102,

    delegate: 1004,
    undelegate: 1005,
    getRelatedListByDelAddr: 1103,
    getDelegateInfo: 1104,
    getCandidateInfo: 1105,

    submitText: 2000,
    submitVersion: 2001,
    submitParam: 2002,
    vote: 2003,
    declareVersion: 2004,
    getProposal: 2100,
    getTallyResult:2101,
    listProposal: 2102,
    getActiveVersion: 2103,
    getProgramVersion: 2104,
    listParam: 2105,
    reportDoubleSign: 3000,
    checDoubleSign: 3001,
    createRestrictingPlan: 4000,
    getRestrictingInfo: 4100,

}
const GAS = {
    gas:"0x333330",
    gasPrice:"0x333330"
}
const CONTRACT_ADDRESS = {
    restrictingPlanContract:'0x1000000000000000000000000000000000000001',
    stakingContract:'0x1000000000000000000000000000000000000002',
    delegateContract:'0x1000000000000000000000000000000000000002',
    nodeContract:'0x1000000000000000000000000000000000000002',
    slashContract:'0x1000000000000000000000000000000000000004',
    ProposalContract:'0x1000000000000000000000000000000000000005',
}

module.exports = {
    FUNCTYPE:FUNCTYPE,
    CONTRACT_ADDRESS:CONTRACT_ADDRESS,
    GAS:GAS
}
