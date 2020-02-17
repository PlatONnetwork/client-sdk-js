## 合约实例化修改
对于Solidity的合约`web3.platon.Contract`类简化了与以太坊区块链上智能合约的交互。创建合约对象时，只需指定相应智能合约的json接口，web3就可以自动地将所有的调用转换为底层基于RPC的ABI调用。通过web3的封装，与智能合约的交互就像与JavaScript对象一样简单。

实例化一个新的合约对象：

```
new web3.platon.Contract(jsonInterface[, address][, options])
```

参数：

*  jsonInterface - Object: 要实例化的合约的json接口
*  address - String: 可选，要调用的合约的地址，也可以在之后使用 myContract.options.address = '0x1234..' 来指定该地址
*  options - Object : 可选，合约的配置对象，其中某些字段用作调用和交易的回调：
   *  from - String: 交易发送方地址
   *  gasPrice - String: 用于交易的gas价格，单位：wei
   *  gas - Number: 交易可用的最大gas量，即gas limit
   *  data - String: 合约的字节码，部署合约时需要
   *  vmType - Number: 合约类型。0表示solidity合约，1表示wasm合约。不传默认是solidity合约。(新增字段)

返回值：

`Object`: The contract instance with all its methods and events.

为了区分，传进来的是solidity合约还是wasm合约，**在options的基础上增加一个vmType字段，类型为Number**，如果options没有传vmType字段，那么默认是solidity合约。如果传了，那么：

* 0 表示是solidity合约
* 1 表示是wasm合约

在此后合约的部署，调用操作中，将type字段读取出来，依照相对应的合约进行后续操作。

## abi 设计

### Solidity
合约接口的JSON格式。包含一系列的函数和或事件的描述。一个描述函数的JSON包含下述的字段：

* type: 可取值有function，constructor，fallback（无名称的默认函数）
* inputs: 一系列的对象，每个对象包含下述属性：
  * name: 参数名称
  * type: 参数的规范型(Canonical Type)。
* outputs： 一系列的类似inputs的对象，如果无返回值时，可以省略。
* constant: true表示函数声明自己不会改变区块链的状态。
* payable: true表示函数可以接收ether，否则表示不能。
  
其中type字段可以省略，默认是function类型。构造器函数和回退函数没有name或outputs。回退函数也没有inputs。

向不支持payable发送ether将会引发异常，禁止这么做。

事件用JSON描述时几乎是一样的：

* type: 总是event
* name: 事件的名称
* inputs: 一系列的对象，每个对象包含下述属性：
  * name: 参数名称
  * type: 参数的规范型(Canonical Type)。
* indexed: true代表这个这段是日志主题的一部分，false代表是日志数据的一部分。
* anonymous: true代表事件是匿名声明的。

### wasm

无官方文档，只能根据官方提供的一个cpp文件编译后的abi文件进行推测

```cpp

#include<string>
#include<vector>
#define Action __attribute__((annotate("Action"), used))
#define Const __attribute__((annotate("Const"), used))
#define Event0 __attribute__((annotate("Event0"), used))
#define Event1 __attribute__((annotate("Event1"), used))
#define Event2 __attribute__((annotate("Event2"), used))

using namespace std;

struct N {
  int nnn;
  char ccc;
};

class M :public N {
  public:
    int mmm;
    N n;
    int get(){return mmm;}
};

typedef int qint;

class Hello {
  public:
   int hh;

   Action void base0(bool a, char b, short c, int d, long long e){
   }

   Action void base1(bool a, unsigned char b, unsigned short c, unsigned int d, unsigned long long e){
   }

   Action int h(qint i, const M &m){
     return i+m.mmm;
   }

   Const vector<N> f(vector<N> n){
     return n;
   }

   Event1 void g(string s, char x, int i){
   }
};

extern "C"
int invoke(){
  return 5;
}

```

```json
[
    {
        "baseclass": [],
        "fields": [
            {
                "name": "nnn",
                "type": "int32"
            },
            {
                "name": "ccc",
                "type": "int8"
            }
        ],
        "name": "N",
        "type": "struct"
    },
    {
        "constant": true,
        "input": [
            {
                "name": "n",
                "type": "N[]"
            }
        ],
        "name": "f",
        "output": "N[]",
        "type": "Action"
    },
	{
        "constant": true,
        "input": [
            {
                "name": "strs",
                "type": "string[]"
            }
        ],
        "name": "aaaa",
        "output": "string[]",
        "type": "Action"
    },
	{
        "constant": true,
        "input": [
        ],
        "name": "testaaa",
        "output": "string[]",
        "type": "Action"
    },
	{
        "constant": true,
        "input": [
            {
                "name": "strs",
                "type": "string"
            }
        ],
        "name": "bbbb",
        "output": "string",
        "type": "Action"
    },
    {
        "baseclass": [
            "N"
        ],
        "fields": [
            {
                "name": "mmm",
                "type": "int32"
            },
            {
                "name": "n",
                "type": "N"
            }
        ],
        "name": "M",
        "type": "struct"
    },
    {
        "constant": false,
        "input": [
            {
                "name": "i",
                "type": "int32"
            },
            {
                "name": "m",
                "type": "M"
            }
        ],
        "name": "h",
        "output": "int32",
        "type": "Action"
    },
    {
        "constant": false,
        "input": [
            {
                "name": "a",
                "type": "bool"
            },
            {
                "name": "b",
                "type": "int8"
            },
            {
                "name": "c",
                "type": "int16"
            },
            {
                "name": "d",
                "type": "int32"
            },
            {
                "name": "e",
                "type": "int64"
            }
        ],
        "name": "base0",
        "output": "void",
        "type": "Action"
    },
    {
        "constant": false,
        "input": [
            {
                "name": "a",
                "type": "bool"
            },
            {
                "name": "b",
                "type": "uint8"
            },
            {
                "name": "c",
                "type": "uint16"
            },
            {
                "name": "d",
                "type": "uint32"
            },
            {
                "name": "e",
                "type": "uint64"
            }
        ],
        "name": "base1",
        "output": "void",
        "type": "Action"
    },
    {
        "input": [
            {
                "name": "s",
                "type": "string"
            },
            {
                "name": "x",
                "type": "int8"
            },
            {
                "name": "i",
                "type": "int32"
            }
        ],
        "name": "g",
        "topic": 1,
        "type": "Event"
    }
]
```

### abi 设计改动
为了最大化复用 solidity 合约相关代码，会将wasm合约代码的abi信息转化为跟solidity合约代码的abi信息属性一致。下面是目前相关的等效的字段。

solidity | wasm| 说明
---------|----------|---------
 inputs | input | 函数或者事件输入描述
 outputs | output | 函数输出描述，还有，solidity是以数组形式输出outputs，而wasm是字符串。
 type:function | type:Action | 函数描述
 type:event | type:Event | 事件描述
 type:constructor| type:Action，name:init | 构造函数描述

### wasm struct 入参设计

对于没有继承的结构体的abi例子描述如下

```json
{
    "baseclass": [],
    "fields": [
        {
            "name": "head",
            "type": "string"
        }
    ],
    "name": "message",
    "type": "struct"
}
```

一个有继承的结构体的abi例子描述如下

```json
{
    "baseclass": [
        "message"
    ],
    "fields": [
        {
            "name": "body",
            "type": "string"
        },
        {
            "name": "end",
            "type": "string"
        }
    ],
    "name": "my_message",
    "type": "struct"
}
```

综合之前web3.js合约对象构造的时候对于入参options.arguments的描述：Array : 可选，在部署时将传入合约的构造函数，以及对于函数的编码的一个例子`contract.methods[methodName].apply(contract.methods, [args1, args2, ..., argsN]).encodeABI()`

为了跟之前的入参保持一致，以及尽量简化入参的输入，采用`数组`的入参方式。数组一来可以跟之前的调用方式保持一致，其次，能按照顺序对结构体的成员进行编码。举一个例子：

对于第一个没有继承的结构体 `message`，那么它的入参形式依次为它的成员，即 `[ head ]`。一个实际的入参示例比如 `[ "HelloWorld" ]`

对于第二个有继承的结构体 `my_message`，那么它的入参形式依次为它基类，然后它自己的成员，即 `[ message, body, end ]` --> `[ [ head ], body, end ]`。一个实际的入参示例比如 `[ [ "HelloWorld" ], "Wasm", "Good" ]`

对于函数调用返回结构体的编码。解码之后跟入参的格式一致。

## 主要修改点

1. 在构造合约实例的时候，入参新增了一个vmType。
2. 为了ABI跟solidity保持一致，在构造合约的时候，对ABI进行了修改。详细请见`web3-eth-contract/src/index.js`文件的`function Contract(jsonInterface, address, options)` (大概在代码96行)
3. 对合约部署的数据与函数调用的data数据最后组装进行了修改。详细请见`web3-eth-contract/src/index.js`文件的`Contract.prototype._encodeMethodABI`函数。(大概在代码547行)
4. 对函数的入参组装进行了修改。详细请见`web3-eth-abi/src/index.js`文件的`ABICoder.prototype.encodeParameters`函数。(大概在代码134行)
5. 对函数的出参解码进行了修改。详细请见`web3-eth-abi/src/index.js`文件的`ABICoder.prototype.decodeParameters`函数。(大概在代码377行)。至于对于入参与入参的编解码的规定，请看后台提供的文件`rlp编码规则.md`
