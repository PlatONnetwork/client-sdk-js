var chai = require("chai");
var assert = chai.assert;
var Platon = require("../packages/web3-eth");

var platon = new Platon();

var setValue = 123;

describe("web3.platon", function() {
    describe("defaultBlock", function() {
        it("should check if defaultBlock is set to proper value", function() {
            assert.equal(platon.defaultBlock, "latest");
            assert.equal(platon.personal.defaultBlock, "latest");
            assert.equal(platon.Contract.defaultBlock, "latest");
            assert.equal(platon.getCode.method.defaultBlock, "latest");
        });
        it("should set defaultBlock for all sub packages is set to proper value, if Eth package is changed", function() {
            platon.defaultBlock = setValue;

            assert.equal(platon.defaultBlock, setValue);
            assert.equal(platon.personal.defaultBlock, setValue);
            assert.equal(platon.Contract.defaultBlock, setValue);
            assert.equal(platon.getCode.method.defaultBlock, setValue);
        });
    });
});
