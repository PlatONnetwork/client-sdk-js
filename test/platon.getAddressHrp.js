var testMethod = require("./helpers/test.method.js");

var method = "getAddressHrp";
var methodCall = "platon_getAddressHrp";

var tests = [
    {
        result: "atp",
        formattedResult: "atp",
        call: methodCall
    }
];

testMethod.runTests("platon", method, tests);
