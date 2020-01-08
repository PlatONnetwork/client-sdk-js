var chai = require('chai');
var assert = chai.assert;
var u = require('./helpers/test.utils.js');

var Platon = require('../packages/web3-eth');
var platon = new Platon();

describe('platon', function() {
    describe('methods', function() {
        u.methodExists(platon, 'getBalance');
        u.methodExists(platon, 'getStorageAt');
        u.methodExists(platon, 'getTransactionCount');
        u.methodExists(platon, 'getCode');
        u.methodExists(platon, 'isSyncing');
        u.methodExists(platon, 'sendTransaction');
        u.methodExists(platon, 'call');
        u.methodExists(platon, 'getBlock');
        u.methodExists(platon, 'getTransaction');
        u.methodExists(platon, 'getBlockTransactionCount');
        u.methodExists(platon, 'subscribe');
        u.methodExists(platon, 'Contract');
        u.methodExists(platon, 'getGasPrice');
        u.methodExists(platon, 'getAccounts');
        u.methodExists(platon, 'getBlockNumber');
        u.methodExists(platon, 'getProtocolVersion');
        u.methodExists(platon, 'setProvider');
        u.propertyExists(platon, 'givenProvider');
        u.propertyExists(platon, 'defaultBlock');
        u.propertyExists(platon, 'defaultAccount');

        u.propertyExists(platon, 'net');
        u.methodExists(platon.net, 'getId');
        u.methodExists(platon.net, 'isListening');
        u.methodExists(platon.net, 'getPeerCount');

        u.propertyExists(platon, 'personal');
        u.methodExists(platon.personal, 'sendTransaction');
        u.methodExists(platon.personal, 'newAccount');
        u.methodExists(platon.personal, 'unlockAccount');
    });
});

