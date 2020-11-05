var Web3A = require('./lib/web3');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Web3A === 'undefined') {
    window.Web3A = Web3A;
}

module.exports = Web3A;
