var FakeIpcProvider = require("./helpers/FakeIpcProvider");
var FakeHttpProvider = require("./helpers/FakeHttpProvider");

var chai = require("chai");
var assert = chai.assert;
var Web3 = require("../packages/web3");
var Eth = require("../packages/web3-eth");
var Personal = require("../packages/web3-eth-personal");
var Accounts = require("../packages/web3-eth-accounts");
var Contract = require("../packages/web3-eth-contract");
var Net = require("../packages/web3-net");

var tests = [
    {
        Lib: Web3
    },
    {
        Lib: Eth
    },
    {
        Lib: Personal
    },
    {
        Lib: Net
    },
    {
        Lib: Accounts
    }
];

describe("lib/web3/setProvider", function() {

    tests.forEach(function(test) {
        it(
            test.Lib.name + " should set the provider using constructor",
            function() {
                var provider1 = new FakeHttpProvider();
                var lib;

                if (test.swarm) {
                    lib = new test.Lib("http://localhost:8500");

                    assert.equal(lib.currentProvider, "http://localhost:8500");
                } else {
                    lib = new test.Lib(provider1);

                    assert.equal(
                        lib.currentProvider.constructor.name,
                        provider1.constructor.name
                    );
                    assert.equal(
                        lib._requestManager.provider.constructor.name,
                        provider1.constructor.name
                    );
                }
            }
        );
        it(
            test.Lib.name +
                " should set the provider using setProvider, after empty init",
            function() {
                var provider1 = new FakeHttpProvider();
                var lib = new test.Lib();

                if (test.swarm) {
                    assert.isNull(lib.currentProvider);

                    lib.setProvider("http://localhost:8500");

                    assert.equal(lib.currentProvider, "http://localhost:8500");
                } else {
                    assert.isNull(lib.currentProvider);
                    assert.isNull(lib._requestManager.provider);

                    lib.setProvider(provider1);

                    assert.equal(
                        lib.currentProvider.constructor.name,
                        provider1.constructor.name
                    );
                    assert.equal(
                        lib._requestManager.provider.constructor.name,
                        provider1.constructor.name
                    );
                }
            }
        );
        it(
            test.Lib.name +
                " should set the provider using constructor, and change later using setProvider",
            function() {
                var provider1 = new FakeHttpProvider();
                var provider2 = new FakeIpcProvider();
                var swarmProvider1 = "http://localhost:8500";
                var swarmProvider2 = "http://swarm-gateways.net";

                var lib;

                if (test.swarm) {
                    lib = new test.Lib(swarmProvider1);

                    assert.equal(lib.currentProvider, swarmProvider1);

                    lib.setProvider(swarmProvider2);

                    assert.equal(lib.currentProvider, swarmProvider2);

                    lib.setProvider(swarmProvider1);

                    assert.equal(lib.currentProvider, swarmProvider1);
                } else {
                    lib = new test.Lib(provider1);

                    assert.equal(
                        lib.currentProvider.constructor.name,
                        provider1.constructor.name
                    );
                    assert.equal(
                        lib._requestManager.provider.constructor.name,
                        provider1.constructor.name
                    );

                    lib.setProvider(provider2);

                    assert.equal(
                        lib.currentProvider.constructor.name,
                        provider2.constructor.name
                    );
                    assert.equal(
                        lib._requestManager.provider.constructor.name,
                        provider2.constructor.name
                    );

                    lib.setProvider(provider1);

                    assert.equal(
                        lib.currentProvider.constructor.name,
                        provider1.constructor.name
                    );
                    assert.equal(
                        lib._requestManager.provider.constructor.name,
                        provider1.constructor.name
                    );
                }
            }
        );
    });
});
