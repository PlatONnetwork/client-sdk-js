var testMethod = require("./helpers/test.method.js");

var method = "getAccounts";

var tests = [
    {
        result: ["0x47d33b27bb249a2dbab4c0612bf9caf4c1950855"],
        formattedResult: ["0x47d33b27bb249a2dbab4c0612bf9caf4c1950855"], // checksum address
        call: "personal_listAccounts"
    }
];

testMethod.runTests(["platon", "personal"], method, tests);