const FUNCTYPE = {
    staking: 1000,
    updateStakingInfo: 1001,
    unStaking: 1003,
    GetStakingInfo: 1105,
    addStaking: 1002,
    GetVerifierList: 1100,
    GetValidatorList: 1101,
    GetCandidateList: 1102,

    delegate: 1004,
    undelegate: 1005,
    getRelatedListByDelAddr: 1103,
    getDelegateInfo: 1104,

    submitText: 2000,
    submitVersion: 2001,
    submitParam: 2002,
    vote: 2003,
    declareVersion: 2004,
    submitCancel: 2005,
    getProposal: 2100,
    getTallyResult: 2101,
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
    constantGas: 21000,

    stakingContractGas: 6000,
    stakingGas: 32000,
    updateStakingInfoGas: 12000,
    addStakingGas: 20000,
    unStakingGas: 20000,
    delegateGas: 16000,
    undelegateGas: 8000,

    zhiliContractGas: 9000,
    submitTextGas: 320000,
    submitVersionGas: 450000,
    submitCancel:500000,
    submitParamGas: 500000,
    voteGas: 2000,
    declareVersionGas: 3000,

    jubaoContractGas: 21000,
    reportDoubleSignGas: 21000,

    restrictingContractGas: 18000,
    createRestrictingPlanGas: 8000,
    gasPrice: '746a528800',
}
const GASPRICE = {
    gasPrice: '746a528800',
    submitTextGasprice: 1500000e9,
    submitVersionGasprice: 2100000e9,
    submitCancelGasprice: 3000000e9,
}
const CONTRACT_ADDRESS = {
    restrictingPlanContract: '0x1000000000000000000000000000000000000001',
    stakingContract: '0x1000000000000000000000000000000000000002',
    delegateContract: '0x1000000000000000000000000000000000000002',
    nodeContract: '0x1000000000000000000000000000000000000002',
    slashContract: '0x1000000000000000000000000000000000000004',
    ProposalContract: '0x1000000000000000000000000000000000000005',
}

module.exports = {
    FUNCTYPE: FUNCTYPE,
    CONTRACT_ADDRESS: CONTRACT_ADDRESS,
    GAS: GAS,
    GASPRICE: GASPRICE,
}