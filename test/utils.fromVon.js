var assert = require("assert");
var utils = require("../packages/web3-utils/src");

describe("lib/utils/utils", function() {
    describe("fromVon", function() {
        it("should return the correct value", function() {
            assert.equal(
                utils.fromVon("1000000000000000000", "von"),
                "1000000000000000000"
            );
            assert.equal(
                utils.fromVon("1000000000000000000", "kvon"),
                "1000000000000000"
            );
            assert.equal(
                utils.fromVon("1000000000000000000", "mvon"),
                "1000000000000"
            );
            assert.equal(
                utils.fromVon("1000000000000000000", "gvon"),
                "1000000000"
            );
            assert.equal(
                utils.fromVon("1000000000000000000", "szabo"),
                "1000000"
            );
            assert.equal(
                utils.fromVon("1000000000000000000", "finney"),
                "1000"
            );
            assert.equal(utils.fromVon("1000000000000000000", "lat"), "1");
            assert.equal(
                utils.fromVon("1000000000000000000", "klat"),
                "0.001"
            );
            assert.equal(
                utils.fromVon("1000000000000000000", "grand"),
                "0.001"
            );
            assert.equal(
                utils.fromVon("1000000000000000000", "mlat"),
                "0.000001"
            );
            assert.equal(
                utils.fromVon("1000000000000000000", "glat"),
                "0.000000001"
            );
            assert.equal(
                utils.fromVon("1000000000000000000", "tlat"),
                "0.000000000001"
            );
        });
    });
});
