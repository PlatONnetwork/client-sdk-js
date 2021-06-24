var chai = require("chai");
var assert = chai.assert;
var Platon = require("../packages/web3-eth");
var Web3 = require("../packages/web3");

var platon = new Platon();

var setValue = "0x47d33b27bb249a2dbab4c0612bf9caf4c1950855";

describe("web3.platon", function() {
    describe("defaultAccount", function() {
        it("should check if defaultAccount is set to proper value", function() {
            assert.equal(platon.defaultAccount, null);
            assert.equal(platon.personal.defaultAccount, null);
            assert.equal(platon.Contract.defaultAccount, null);
            assert.equal(platon.getCode.method.defaultAccount, null);
        });
        it("should set defaultAccount for all sub packages is set to proper value, if Platon package is changed", function() {
            platon.defaultAccount = setValue;

            assert.equal(platon.defaultAccount, setValue.toLowerCase());
            assert.equal(platon.personal.defaultAccount, setValue);
            assert.equal(platon.Contract.defaultAccount, setValue.toLowerCase());
            assert.equal(platon.getCode.method.defaultAccount, setValue.toLowerCase());
        });
        it("should fail if address is invalid, wich is to be set to defaultAccount", function() {
            assert.throws(function() {
                platon.defaultAccount =
                    "0x17F33b27Bb249a2DBab4C0612BF9CaF4C1950855";
            });
        });
        it("should have different values for two Platon instances", function() {
            var platon1 = new Platon();
            platon1.defaultAccount = setValue;
            assert.equal(platon1.defaultAccount, setValue.toLowerCase());

            var platon2 = new Platon();
            assert.equal(platon2.defaultAccount, null);
        });
        it("should have different values for two Web3 instances", function() {
            var web31 = new Web3();
            web31.platon.defaultAccount = setValue;
            assert.equal(web31.platon.defaultAccount, setValue.toLowerCase());

            var web32 = new Web3();
            assert.equal(web32.platon.defaultAccount, null);
        });
    });
});
