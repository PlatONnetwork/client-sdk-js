/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.js
 * @authors:
 *   Fabian Vogelsteller <fabian@ethereum.org>
 *   Gav Wood <gav@parity.io>
 *   Jeffrey Wilcke <jeffrey.wilcke@ethereum.org>
 *   Marek Kotewicz <marek@parity.io>
 *   Marian Oancea <marian@ethereum.org>
 * @date 2017
 */

"use strict";


var version = "0.16.1";
var core = require('web3-core');
var Eth = require('web3-eth');
var Net = require('web3-net');
var Personal = require('web3-eth-personal');
var utils = require('@platonnetwork/web3-utils');
var PPOS = require('@platonnetwork/web3-ppos');

var Web3 = function Web3() {
    var _this = this;

    // sets _requestmanager etc
    core.packageInit(this, arguments);

    this.version = version;
    this.utils = utils;

    // PPOS暂时只支持Node.js环境，而且只支持http协议，不支持浏览器。
    if (typeof global === 'object') {
        // var PPOS = require('../../web3-ppos');
        this.PPOS = PPOS;
        if (typeof arguments[0] === 'string' && arguments[0].startsWith('http')) {
            this.ppos = new PPOS({ provider: arguments[0] })
        }
    }

    this.platon = new Eth(this);

    // overwrite package setProvider
    var setProvider = this.setProvider;
    this.setProvider = function (provider, net) {
        setProvider.apply(_this, arguments);
        this.platon.setProvider(provider, net);

        return true;
    };
};

Web3.version = version;
Web3.utils = utils;
Web3.modules = {
    Platon: Eth,
    Net: Net,
    Personal: Personal,
};

core.addProviders(Web3);

module.exports = Web3;

