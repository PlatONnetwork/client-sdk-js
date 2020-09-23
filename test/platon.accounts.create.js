var Accounts = require("./../packages/web3-eth-accounts");
var ethers = require('ethers');
var utils = require("../packages/web3-utils")
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

var tests = [];
for (var i = 0; i < 10; i++) {
    tests.push(i);
}

let main_net_hrp = "atp";
let test_net_hrp = "atx";

describe("platon", function () {
    describe("accounts", function () {

        tests.forEach(function (test, i) {
            it("create platon.account, and compare to platon wallet", function () {
                var platonAccounts = new Accounts();

                // create account
                var acc = platonAccounts.create();

                // create ethers wallet
                var ethWall = new ethers.Wallet(acc.privateKey);

                // compare addresses and private keys
                assert.equal(acc.address.testnet, utils.toBech32Address(test_net_hrp, ethWall.address));
                assert.equal(acc.address.mainnet, utils.toBech32Address(main_net_hrp, ethWall.address));
                assert.equal(acc.privateKey, ethWall.privateKey);
            });

        });
    });
});
