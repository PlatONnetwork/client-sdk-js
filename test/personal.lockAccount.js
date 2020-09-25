var testMethod = require("./helpers/test.method.js");

var method = "lockAccount";

var tests = [
    {
        args: ["atp1uqug0zq7rcxddndleq4ux2ft3tv6dqljhyq6jl"], // checksum address
        formattedArgs: ["atp1uqug0zq7rcxddndleq4ux2ft3tv6dqljhyq6jl"],
        result: true,
        formattedResult: true,
        call: "personal_" + method
    },
    {
        args: ["atp1uqug0zq7rcxddndleq4ux2ft3tv6dqljhyq6jl"],
        formattedArgs: ["atp1uqug0zq7rcxddndleq4ux2ft3tv6dqljhyq6jl"],
        result: true,
        formattedResult: true,
        call: "personal_" + method
    }
];

testMethod.runTests(["platon", "personal"], method, tests);
