var testMethod = require("./helpers/test.method.js");

var method = "getProtocolVersion";
var call = "platon_protocolVersion";

var tests = [
    {
        result: "12345",
        formattedResult: "12345",
        call: call
    }
];

testMethod.runTests("platon", method, tests);
