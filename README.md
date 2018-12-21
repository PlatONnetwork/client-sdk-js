# Overview
> Javascript SDK is a Js development kit for PlatON public chain provided by PlatON for Javascript developers.

# Use

* install 

```
cnpm i https://github.com/PlatONnetwork/client-sdk-js
```

* use in project

````js
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider('http://host:port'));
}
````

# Other
[more reference wiki](https://github.com/PlatONnetwork/wiki/wiki)