var u = require("./helpers/test.utils.js");
var Web3 = require("../packages/web3/src");
var web3 = new Web3();
var chai = require("chai");
var assert = chai.assert;

describe("web3", function() {
    describe("version", function() {
        it("version is 0.15.1", function() {
            assert.deepEqual(web3.version, "0.15.1");
        });
    });

    describe("methods", function() {
        u.methodExists(web3, "setProvider");

        u.propertyExists(web3, "givenProvider");

        u.propertyExists(web3, "platon");

        u.propertyExists(web3, "utils");
    });
});
