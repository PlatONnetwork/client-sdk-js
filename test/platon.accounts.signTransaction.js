var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Web3 = require('../packages/web3');
var Accounts = require("./../packages/web3-eth-accounts");
var ethjsSigner = require("ethjs-signer");
var utils = require("../packages/web3-utils")
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var hrp = 'lat'
var common = {
    baseChain: 'mainnet',
    customChain: {
        name: 'custom-network',
        networkId: 1,
        chainId: 1,
    },
    harfork: 'petersburg',
};

var clone = function (object) { return object ? _.clone(object) : []; };

var tests = [
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        iban: 'XE25RG8S3H5TX5RD7QTL5UPVW90AHN2VYDC',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "20000000000",
            gas: 21000,
            to: '0x3535353535353535353535353535353535353535',
            toIban: 'XE4967QZMA14MI680T89KSPPJEJMU68MEYD', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "",
            common: common
        },
        // signature from platon_signTransaction
        rawTransaction: "0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88da07e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0",
        oldSignature: "0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a7640000801ba0300e0d8f83ac82943e468164fa80236fdfcff21f978f66dd038b875cea6faa51a05a8e4b38b819491a0bb4e1f5fb4fd203b6a1df19e2adbec2ebdddcbfaca555f0",
        transactionHash: "0xda3be87732110de6c1354c83770aae630ede9ac308d9f7b399ecfba23d923384",
        messageHash: "0x7dbc5644b83abd32d014d170ba9bdc855c126328c0cb41af0ed6422bef0bb32e"
    }
];

describe("platon", function () {
    describe("accounts", function () {
        // For each test
        tests.forEach(function (test, i) {
            if (test.error) {

                it("signTransaction must error", function(done) {
                    var ethAccounts = new Accounts("", hrp);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, utils.toBech32Address(hrp, test.address));
                    testAccount.signTransaction(test.transaction).catch(function (err) {
                        assert.instanceOf(err, Error);
                        done();
                    });
                });

            } else {

                it("signTransaction must compare to platon_signTransaction", function(done) {
                    var ethAccounts = new Accounts("", hrp);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, utils.toBech32Address(hrp, test.address));

                    testAccount.signTransaction(test.transaction).then(function (tx) {
                        assert.equal(tx.messageHash, test.messageHash);
                        assert.equal(tx.transactionHash, test.transactionHash);
                        assert.equal(tx.rawTransaction, test.rawTransaction);
                        done();
                    });
                });

                it("signTransaction will call for nonce", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);
                    provider.injectResult('0xa');
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'platon_getTransactionCount');
                        
                        assert.deepEqual(payload.params, [utils.toBech32Address(hrp,test.address), "latest"]);
                    });

                    var ethAccounts = new Accounts(web3, hrp);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, utils.toBech32Address(hrp, test.address));

                    var transaction = clone(test.transaction);
                    delete transaction.nonce;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    });
                });

                it("signTransaction will call for gasPrice", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult('0x5022');
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'platon_gasPrice');
                        assert.deepEqual(payload.params, []);
                    });

                    var ethAccounts = new Accounts(web3, hrp);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, utils.toBech32Address(hrp, test.address));

                    var transaction = clone(test.transaction);
                    delete transaction.gasPrice;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    });
                });

                it("signTransaction will call for chainId", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'platon_chainId');
                        assert.deepEqual(payload.params, []);
                    });

                    var ethAccounts = new Accounts(web3, hrp);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, utils.toBech32Address(hrp, test.address));

                    var transaction = clone(test.transaction);
                    delete transaction.chainId;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    });
                });

                it("signTransaction will call for networkId", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'platon_networkId');
                        assert.deepEqual(payload.params, []);
                    });

                    var ethAccounts = new Accounts(web3, hrp);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, utils.toBech32Address(hrp, test.address));

                    var transaction = clone(test.transaction);
                    delete transaction.common;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    });
                });

                it("signTransaction will call for nonce, gasPrice, chainId and networkId", function(done) {
                    var provider = new FakeHttpProvider();
                    var web3 = new Web3(provider);

                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'platon_chainId');
                        assert.deepEqual(payload.params, []);
                    });
                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'platon_gasPrice');
                        assert.deepEqual(payload.params, []);
                    });
                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'platon_getTransactionCount');
                        assert.deepEqual(payload.params, [utils.toBech32Address(hrp, test.address), "latest"]);
                    });
                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'platon_networkId');
                        assert.deepEqual(payload.params, []);
                    });

                    var ethAccounts = new Accounts(web3, hrp);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, utils.toBech32Address(hrp, test.address));

                    var transaction = clone(test.transaction);
                    delete transaction.chainId;
                    delete transaction.gasPrice;
                    delete transaction.nonce;
                    delete transaction.common;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    });
                });

                it("recoverTransaction, must recover signature", function() {
                    var ethAccounts = new Accounts("", hrp);

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, utils.toBech32Address(hrp, test.address));

                    testAccount.signTransaction(test.transaction).then(function (tx) {
                        assert.equal(ethAccounts.recoverTransaction(tx.rawTransaction), test.address);
                    });
                });

                it("recoverTransaction, must also recover old signature from eth-signer", function() {
                    var ethAccounts = new Accounts();

                    var oldSignature = ethjsSigner.sign(test.transaction, test.privateKey);

                    assert.equal(ethAccounts.recoverTransaction(oldSignature), test.address);
                });
            }
        });
    });
});
