var testMethod = require("./helpers/test.method.js");

var method = "getGasPrice";
var methodCall = "platon_gasPrice";

var tests = [
    {
        result: "0x15f90",
        formattedResult: "90000",
        call: methodCall
    }
];

testMethod.runTests("platon", method, tests);
