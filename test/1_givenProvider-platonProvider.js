var chai = require('chai');
var assert = chai.assert;
global.ethereumProvider = 'http://givenProvider:8500';

describe('Web3.providers.givenProvider', function () {
    describe('should be set if platonProvider is available ', function () {
        it('when instantiating Web3', function () {
            var Web3 = require('../packages/web3/src');
            assert.deepEqual(Web3.givenProvider, global.ethereumProvider);
        });

        it('when instantiating Platon', function () {
            var Platon = require('../packages/web3-eth/src');
            assert.deepEqual(Platon.givenProvider, global.ethereumProvider);
        });
    });
});

