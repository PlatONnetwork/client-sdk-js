const BN = require('bn.js');
const numberToBN = require('number-to-bn');

const zero = new BN(0);
const negative1 = new BN(-1);

// complete ethereum unit map
const unitMap = {
    'nolat':    '0',
    'von':      '1',
    'kvon':     '1000',
    'Kvon':     '1000',
    'babbage':  '1000',
    'femtolat': '1000',
    'mvon':     '1000000',
    'Mvon':     '1000000',
    'lovelace': '1000000',
    'picolat':  '1000000',
    'gvon':     '1000000000',
    'Gvon':     '1000000000',
    'shannon':  '1000000000',
    'nanolat':  '1000000000',
    'nano':     '1000000000',
    'szabo':    '1000000000000',
    'microlat': '1000000000000',
    'micro':    '1000000000000',
    'finney':   '1000000000000000',
    'millilat': '1000000000000000',
    'milli':    '1000000000000000',
    'lat':      '1000000000000000000',
    'klat':     '1000000000000000000000',
    'grand':    '1000000000000000000000',
    'mlat':     '1000000000000000000000000',
    'glat':     '1000000000000000000000000000',
    'tlat':     '1000000000000000000000000000000'
};

/**
 * Returns value of unit in Wei
 *
 * @method getValueOfUnit
 * @param {String} unit the unit to convert to, default ether
 * @returns {BigNumber} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */
function getValueOfUnit(unitInput) {
    const unit = unitInput ? unitInput.toLowerCase() : 'lat';
    var unitValue = unitMap[unit]; // eslint-disable-line

    if (typeof unitValue !== 'string') {
        throw new Error(`[ethjs-unit] the unit provided ${unitInput} doesn't exists, please use the one of the following units ${JSON.stringify(unitMap, null, 2)}`);
    }

    return new BN(unitValue, 10);
}

function numberToString(arg) {
    if (typeof arg === 'string') {
        if (!arg.match(/^-?[0-9.]+$/)) {
            throw new Error(`while converting number to string, invalid number value '${arg}', should be a number matching (^-?[0-9.]+).`);
        }
        return arg;
    } else if (typeof arg === 'number') {
        return String(arg);
    } else if (typeof arg === 'object' && arg.toString && (arg.toTwos || arg.dividedToIntegerBy)) {
        if (arg.toPrecision) {
            return String(arg.toPrecision());
        } else { // eslint-disable-line
            return arg.toString(10);
        }
    }
    throw new Error(`while converting number to string, invalid number value '${arg}' type ${typeof arg}.`);
}

function fromVon(weiInput, unit, optionsInput) {
    var wei = numberToBN(weiInput); // eslint-disable-line
    var negative = wei.lt(zero); // eslint-disable-line
    const base = getValueOfUnit(unit);
    const baseLength = unitMap[unit].length - 1 || 1;
    const options = optionsInput || {};

    if (negative) {
        wei = wei.mul(negative1);
    }

    var fraction = wei.mod(base).toString(10); // eslint-disable-line

    while (fraction.length < baseLength) {
        fraction = `0${fraction}`;
    }

    if (!options.pad) {
        fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
    }

    var whole = wei.div(base).toString(10); // eslint-disable-line

    if (options.commify) {
        whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    var value = `${whole}${fraction == '0' ? '' : `.${fraction}`}`; // eslint-disable-line

    if (negative) {
        value = `-${value}`;
    }

    return value;
}

function toVon(etherInput, unit) {
    var ether = numberToString(etherInput); // eslint-disable-line
    const base = getValueOfUnit(unit);
    const baseLength = unitMap[unit].length - 1 || 1;

    // Is it negative?
    var negative = (ether.substring(0, 1) === '-'); // eslint-disable-line
    if (negative) {
        ether = ether.substring(1);
    }

    if (ether === '.') { throw new Error(`[ethjs-unit] while converting number ${etherInput} to von, invalid value`); }

    // Split it into a whole and fractional part
    var comps = ether.split('.'); // eslint-disable-line
    if (comps.length > 2) { throw new Error(`[ethjs-unit] while converting number ${etherInput} to von,  too many decimal points`); }

    var whole = comps[0], fraction = comps[1]; // eslint-disable-line

    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    if (fraction.length > baseLength) { throw new Error(`[ethjs-unit] while converting number ${etherInput} to von, too many decimal places`); }

    while (fraction.length < baseLength) {
        fraction += '0';
    }

    whole = new BN(whole);
    fraction = new BN(fraction);
    var wei = (whole.mul(base)).add(fraction); // eslint-disable-line

    if (negative) {
        wei = wei.mul(negative1);
    }

    return new BN(wei.toString(10), 10);
}

module.exports = {
    unitMap,
    numberToString,
    getValueOfUnit,
    fromVon,
    toVon,
};
