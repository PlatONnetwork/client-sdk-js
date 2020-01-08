var chai = require("chai");
var assert = chai.assert;
var u = require("./helpers/test.utils.js");
var Platon = require("../packages/web3-eth");
var platon = new Platon();

describe("web3.net", function() {
    describe("methods", function() {
        u.methodExists(platon.net, "getId");
        u.methodExists(platon.net, "getNetworkType");
        u.methodExists(platon.net, "isListening");
        u.methodExists(platon.net, "getPeerCount");
    });
});
