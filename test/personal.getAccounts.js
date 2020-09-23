var testMethod = require("./helpers/test.method.js");

var method = "getAccounts";

var tests = [
    {
        result: ["atp1uqug0zq7rcxddndleq4ux2ft3tv6dqljhyq6jl"],
        formattedResult: ["atp1uqug0zq7rcxddndleq4ux2ft3tv6dqljhyq6jl"], // checksum address
        call: "personal_listAccounts"
    }
];

testMethod.runTests(["platon", "personal"], method, tests);
