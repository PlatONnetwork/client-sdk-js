var Accounts = require("./../packages/web3-eth-accounts");
var ethereumWallet = require("ethereumjs-wallet");
var chai = require("chai");
var assert = chai.assert;
var Web3 = require("../packages/web3");
var web3 = new Web3();

var tests = [];
for (var i = 0; i < 1000; i++) {
    tests.push(i);
}

describe("platon", function() {
    describe("accounts", function() {
        tests.forEach(function(test, i) {
            it("create platon.account, and compare to ethereumjs-wallet", function() {
                var platonAccounts = new Accounts();

                // create account
                var acc = platonAccounts.create();

                // create ethereumjs-wallet account
                var ethWall = ethereumWallet.fromPrivateKey(
                    Buffer.from(acc.privateKey.replace("0x", ""), "hex")
                );

                // compare addresses
                assert.equal(acc.address, ethWall.getChecksumAddressString());
            });
        });
    });
});
