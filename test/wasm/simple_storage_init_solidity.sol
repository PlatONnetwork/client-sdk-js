pragma solidity ^0.4.25;

contract SimpleStorage {
    uint storedData;

     function SimpleStorage(uint x) public{
        storedData = x;
    }

    function set(uint x) public {
        storedData = x;
    }

    function get() constant returns (uint) {
        return storedData;
    }
}
