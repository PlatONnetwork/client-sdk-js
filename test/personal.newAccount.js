var testMethod = require("./helpers/test.method.js");

var method = "newAccount";

var tests = [
    {
        args: ["P@ssw0rd!"],
        formattedArgs: ["P@ssw0rd!"],
        result: ["atp1uqug0zq7rcxddndleq4ux2ft3tv6dqljhyq6jl"],
        formattedResult: ["atp1uqug0zq7rcxddndleq4ux2ft3tv6dqljhyq6jl"], // checksum address
        call: "personal_newAccount"
    }
];

testMethod.runTests(["platon", "personal"], method, tests);
