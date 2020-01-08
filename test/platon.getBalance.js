var testMethod = require("./helpers/test.method.js");
var Platon = require("../packages/web3-eth");

var platon = new Platon();

var method = "getBalance";

var tests = [
    {
        args: ["0x000000000000000000000000000000000000012d", 2],
        formattedArgs: ["0x000000000000000000000000000000000000012d", "0x2"],
        result: "0x31981",
        formattedResult: "203137",
        call: "platon_" + method
    },
    {
        args: ["0x000000000000000000000000000000000000012d", "0x1"],
        formattedArgs: ["0x000000000000000000000000000000000000012d", "0x1"],
        result: "0x31981",
        formattedResult: "203137",
        call: "platon_" + method
    },
    {
        args: ["0x000000000000000000000000000000000000012d", 0x1],
        formattedArgs: ["0x000000000000000000000000000000000000012d", "0x1"],
        result: "0x31981",
        formattedResult: "203137",
        call: "platon_" + method
    },
    {
        args: ["0x000000000000000000000000000000000000012d"],
        formattedArgs: [
            "0x000000000000000000000000000000000000012d",
            platon.defaultBlock
        ],
        result: "0x31981",
        formattedResult: "203137",
        call: "platon_" + method
    },
    {
        args: ["0XDBDBDB2CBD23B783741E8D7FCF51E459B497E4A6", 0x1],
        formattedArgs: ["0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6", "0x1"],
        result: "0x31981",
        formattedResult: "203137",
        call: "platon_" + method
    },
    {
        args: ["0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6", 0x1], // checksum address
        formattedArgs: ["0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6", "0x1"],
        result: "0x31981",
        formattedResult: "203137",
        call: "platon_" + method
    },
    {
        args: ["0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6", 0x1],
        formattedArgs: ["0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6", "0x1"],
        result: "0x31981",
        formattedResult: "203137",
        call: "platon_" + method
    },
    {
        args: ["dbdbdb2cbd23b783741e8d7fcf51e459b497e4a6", 0x1],
        formattedArgs: ["0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6", "0x1"],
        result: "0x31981",
        formattedResult: "203137",
        call: "platon_" + method
    },
    {
        args: ["0x000000000000000000000000000000000000012d", 0x1],
        formattedArgs: ["0x000000000000000000000000000000000000012d", "0x1"],
        result: "0x31981",
        formattedResult: "203137",
        call: "platon_" + method
    },
    {
        args: ["0x000000000000000000000000000000000000012d"],
        formattedArgs: ["0x000000000000000000000000000000000000012d", "latest"],
        result: "0x31981",
        formattedResult: "203137",
        call: "platon_" + method
    },
];

testMethod.runTests("platon", method, tests);
