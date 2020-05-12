var testMethod = require("./helpers/test.method.js");

var method = "getTransactionReceipt";

var txResult = {
    blockHash: "0x67f663b2565",
    blockNumber: "5e",
    transactionHash:
        "0xafc3367fa6bae5e0af1832c35721574e8681615c9d91bc0236d27a929abf8641",
    transactionIndex: "0x1",
    contractAddress: "lax1hahqha2mmujx0wktwh3t37s956hxxk5574m2c4",
    cumulativeGasUsed: "0x4b3d0",
    gasUsed: "0x4b3d0",
    logs: []
};
var formattedTxResult = {
    blockHash: "0x67f663b2565",
    blockNumber: 94,
    transactionHash:
        "0xafc3367fa6bae5e0af1832c35721574e8681615c9d91bc0236d27a929abf8641",
    transactionIndex: 1,
    contractAddress: "lax1hahqha2mmujx0wktwh3t37s956hxxk5574m2c4", // checksum address
    cumulativeGasUsed: 308176,
    gasUsed: 308176,
    logs: []
};

var tests = [
/*    {
        args: [
            "0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265"
        ],
        formattedArgs: [
            "0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265"
        ],
        result: txResult,
        formattedResult: formattedTxResult,
        call: "platon_" + method
    },
    {
        args: [
            "0xff960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265"
        ],
        formattedArgs: [
            "0xff960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265"
        ],
        result: {
            status: "0x1",
            blockHash: "0x6fd9e2a26ab",
            blockNumber: "0x15df",
            transactionHash:
                "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
            transactionIndex: "0x1",
            contractAddress: "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
            cumulativeGasUsed: "0x7f110",
            gasUsed: "0x7f110"
        },
        formattedResult: {
            status: true,
            blockHash: "0x6fd9e2a26ab",
            blockNumber: 5599,
            transactionHash:
                "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
            transactionIndex: 1,
            contractAddress: "0x407D73d8a49eeb85D32Cf465507dd71d507100c1", // checksum address
            cumulativeGasUsed: 520464,
            gasUsed: 520464
        },
        call: "platon_" + method
    },*/
    {
        args: [
            "0xafc3367fa6bae5e0af1832c35721574e8681615c9d91bc0236d27a929abf8641"
        ],
        formattedArgs: [
            "0xafc3367fa6bae5e0af1832c35721574e8681615c9d91bc0236d27a929abf8641"
        ],
        result: {
            status: "0x1",
            blockHash: "0x67f663b2565",
            blockNumber: "0x5e",
            transactionHash:
                "0xafc3367fa6bae5e0af1832c35721574e8681615c9d91bc0236d27a929abf8641",
            transactionIndex: "0x1",
            contractAddress: "lax1hahqha2mmujx0wktwh3t37s956hxxk5574m2c4",
            cumulativeGasUsed: "0x4b3d0",
            gasUsed: "0x4b3d0"
        },
        formattedResult: {
            status: true,
            blockHash: "0x67f663b2565",
            blockNumber: 94,
            transactionHash:
                "0xafc3367fa6bae5e0af1832c35721574e8681615c9d91bc0236d27a929abf8641",
            transactionIndex: 1,
            contractAddress: "lax1hahqha2mmujx0wktwh3t37s956hxxk5574m2c4", // checksum address
            cumulativeGasUsed: 308176,
            gasUsed: 308176
        },
        call: "platon_" + method
    }
];

testMethod.runTests("platon", method, tests);
