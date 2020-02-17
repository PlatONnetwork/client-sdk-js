# rlp 编码规则

## 1. rlp 简介

rlp 目前支持处理两种类型，字节数组和字节数组列表。

- 字节数组。各个语言的基础类型，需要转换成字节数组，转换规则 rlp 编码不统一规定，可以自定义转换规则。

基础类型转换为字节数组之后，再对字节数组进行rlp编码，生成rlp编码二进制序列，`rlp_data = rlp(convert_to_byte_array(base_type_data))`。

字节数组rlp编码规则：

**规则1**：如果字节数组的长度是1个字节，并且它的值在[0x00, 0x7f] 范围之间，那么其RLP编码前缀为空，即为就是字节数组本身。

**规则2**: 如果一个字节数组的长度是0-55字节，前缀的值是0x80加上字节数组的长度，rlp编码为 `byte(0x80+length(byte_data))+byte_data`。

**规则3**: 如果字节数组的长度值大于55个字节，将长度值转换为大端表示的字节数组，前缀为0xb7加上大端表示的字节数组长度值的长度加上长度值的大端表示的字节数组，rlp编码为 `byte(0xb7+length(convert_to_byte_array(length(byte_data))) + convert_to_byte_array(length(byte_data)) + byte_data`。

- 字节数组列表。字节数组列表的编码是递归的，先编码最里层的各个字节数组（编码方式为字节数组的编码方式），编码结果拼接在一起，再对拼接结果进行一次编码，`rlp_data = rlp(rlp(byte_data1)+rlp(byte_data2)+rlp(byte_data3)+...)`。

拼接结果进行编码的规则为：

**规则1**：如果拼接结果的长度是0-55字节，前缀的值是0xc0加上拼接结果的总长度，rlp编码为`byte(0xc0+length(join_data))+join_data`

**规则2**: 如果拼接结果的长度值大于55字节，将长度值转换为大端表示的字节数组，前缀是0xf7加上大端表示的拼接结果长度值的长度加上长度值的大端表示的字节数组，rlp编码为 `byte(0xf7+length(convert_to_byte_array(length(join_data))) + convert_to_byte_array(length(join_data)) + join_data`。

## 2. 基础类型 rlp 编码

基础类型编码的重点是将基础类型转换为字节数组，因为rlp规则里面要将无符号的长度值转换为字节数组，所以rlp默认支持将无符号整型转换为字节数组。

### 2.1 无符号整型 RLP 编码

各种硬件平台整型表示有大端字节序和小端字节序之分，rlp统一编码为大端字节序字节数组，将无符号整型转换为字节数组的算法为：

```cpp
u512 u512_data = u512(unsigned_data); // uint8_t, uint16_t, uint32_t, uint64_t, u128, u160, u256都高位填充0扩展为 512 位无符号大整型。
std::vector<byte> byte_data;
for(; u512_data; u512_data >>= 8)
    byte_data.push_back(u512_data & 0xff);
std::reverse(byte_data.begin(), byte_data.end());
std::vector<byte> rlp_data = rlp(byte_data);
```

例如：`uint32_t data_32= 1*256*256*256 + 2*256*256 + 3*256 + 4` 转换为大端表示的字节数组为 0x01, 0x02, 0x03, 0x04，因为字节长度4，应用字节数组rlp编码的规则2，前缀是0x84, rlp编码结果为 0x84, 0x01, 0x02, 0x03, 0x04。

例如： `uint32_t data_32= 3*256 + 4` 转换为大端表示的字节数组为 0x00, 0x00, 0x03, 0x04，高2个字节都是0，rlp 不会存储此两个字节，字节长度为2，应用字节数组rlp编码的规则2，前缀是0x82, rlp编码结果为 0x82, 0x03, 0x04。

### 2.2 布尔类型 RLP 编码

布尔类型只有false 和 true 两个值，将 true 强制转换为无符号整型1， 将 false 强制转换为无符号整型0，此时其 rlp 编码规则归结为无符号整型的 rlp 编码规则。解码时， 将 1 强制转换为 true， 将 0 强制转换为 false。

### 2.3 有符号整数 RLP 编码

有符号整型采用符号位+数据的表示，负数时高位符号位为1，数据为补码表示，正数时高位符号位为0，数据为源码表示。

编码时先将有符号数强类型制转换为对应类型的无符号数，此种强制类型转换直接copy原来的字节，此时归结为无符号整型。因为负数时，最高位为1，退化为固定长度的字节，不会有压缩，占用较大的字节，比如-1，强制转换后为0xffffffff, 转换为字节数组后为4个字节，故采用zigzag编码转换有符号数为无符号整数。

zigzag编码规则：

**step1.** 将有符号整型统一转换为64位的有符号long类型, `long long_data = long(data)`。

**step2.** 将64位的有符号long类型转换为64位的无符号整型，`uint64_t u64_data = uint64_t((long_data << 1) ^ (long_data >> 63))`。

**step3.** 用无符号整型的 rlp 编码规则编码这个64位的无符号整型， `rlp_data = rlp(u64_data)`

zigzag解码规则：

**step1.** 用无符号整型的 rlp 解码规则解码这个64位的无符号整型, `uint64_t u64_data = rlp_decode(rlp_data)`。

**step2.** 将64位的无符号uint64_t类型转换为64位的有符号整型，`long long_data = long((u64_data >> 1) ^ -(u64_data & 1))`

**step3.** 将有符号整型 long 强制转换为要获得的有符号整型数据类型。

例如：`int negative_data = -1` 在 32 位机器上将其强制转换为 long 类型 `long long_data = long(negative_data)`。第二部转换为64位的无符号整型值为1，此时归结为无符号整型的rlp编码，编码结果为 0x01，rlp二进制序列只占用一个字节。

### 2.4 字符串 rlp 编码

字符串本身是字符数组，各个语言字符的编码方式不一样，c++ 默认是 ascii 编码， go 默认是 utf8 编码，大部分语言默认采用 utf8 编码，和 ascii 编码 兼容，解释出来的字符串是一样的。各个语言提供了将字符串转换为字节数组的原生方法，所以字符串 rlp 编码为将字符串转换为字节数组，然后对字节数组进行rlp编码。

例如： `std::string strdata = "abc"`, 转换为字节数组为 0x61, 0x62, 0x63, rlp 编码结果为 0x83, 0x61, 0x62, 0x63。

### 2.5 float 和 double rlp 编码

float 和 double 都是 IEEE 规定好的格式，参考普遍实现不进行过多的压缩，直接改变指针类型为相应长度无符号整型，将此块内存强解释为对应的无符号整型，rlp 编码归结为无符号整型的 rlp 编码。

例如：

```cpp
float float_data = -1.2;
uint32_t u32_data = *(uint32_t *)(&float_data)

double double_data = -1.23;
uint64_t u64_data = *(uint64_t *)(&double_data)
```

## 3. 复合结构类型编码

### 3.1 结构体类型 RLP 编码

结构体类型可以转换为字节数组编码。结构体有多个字段组成，按照结构体定义中的顺序，如果此字段是基础类型转换为字节数组，此字段是复合结构类型递归此类型为字节数组列表。此时汇总为字节数组列表，应用字节数组列表的rlp规则编码为二进制序列。

例如：

```cpp
struct one 
{
    std::string m_name;
    uint16_t m_age;  
    uint16_t m_weight;
};

struct group
{
    std::string m_info;
    uint16_t m_number;
    one m_member;
};
one one_data("jatel", 30, 160);
group group_data("group", 3, one_data);
```

group_data 有3个字段，按照定义顺序，m_info 为 string基础类型，转换为字节数组为，0x67, 0x72, 0x6f, 0x75, 0x70。m_number 为 uint16_t基础类型，转换为字节数组为 0x03。m_member 为复合结构类型将各个字段类型转换为字节数组组成字节数组列表为[[0x6a, 0x61, 0x74, 0x0x65, 0x6c], [0x1e], [0xa0]]。

按照字节数组列表编码规则，将字节数组列表的各个字节数组进行rlp编码构成拼接数组，m_info 应用字节数组编码规则2，前缀为 0x80 + 0x05 为 0x85, 编码结果为 0x85, 0x67, 0x72, 0x6f, 0x75, 0x70, m_number应用字节数组编码规则1结果为 0x03, m_member 应用字节数组列表编码规则1编码为 0xc9, 0x85, 0x6a, 0x61, 0x74, 0x65, 0x6c, ox1e, 0x81, 0xa0。最后的拼接数组为 0x85, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x03, 0xc9, 0x85, 0x6a, 0x61, 0x74, 0x0x65, 0x6c, ox1e, 0x81, 0xa0。

对拼接数组进行rlp编码应用字节数组列表编码规则1，拼接数组长度为17，前缀为 oxc0 + 0x11 为 0xd1, 结果为oxd1, 0x85, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x03, 0xc9, 0x85, 0x6a, 0x61, 0x74, 0x0x65, 0x6c, ox1e, 0x81, 0xa0。

### 3.2 子类 RLP 编码

子类继承父类之后，增加自己的新的字段。子类的rlp编码可以将其归结为第一个字段为父类型的复合类型，第二个字段为子类增加的第一个字段， 第三个字段为子类增加的第二个字段，依次类推。通过此方法将继承的rlp编码归结为普通结构体的rlp编码。

### 3.3 序列容器 rlp 编码

序列容器，std::vector, std::list,std::array等以线性形式组织在一起的容器，其数据是顺序的。

可以将其归结为类似结构体，字段类型是一致的，字段个数为容器元素个数，字段顺序就是元素的顺序，然后进行 rlp 编码。

例如：

```cpp
std::vector<uint16_t> vect_data;
vect_data.push_back(1);
vect_data.push_back(2);
vect_data.push_back(3);
```

归结为结构体：

```cpp
struct same
{
    uint16_t data_1;
    uint16_t data_2;
    uint16_t data_3;
};

same same_data {1, 2, 3};
```

vect_data 和 same_data 的编码是一样的。

### 3.4 关联容器 rlp 编码

关联容器，std::map 其存储数据不允许重复，基本类型为 kv 形式的键值对，同样将其归结为结构体类型，结构体字段个数为map的元素个数， 字段类型为第一个字段为k， 第二个字段为v的结构体。

例如：

```cpp
std::map<uint16_t, std::string> map_data;
map_data.insert(std::make_pair(1, "test1"));
map_data.insert(std::make_pair(2, "test2"));
map_data.insert(std::make_pair(3, "test3"));
```

归结为结构体：

```cpp
struct test_pair{
    uint16_t k;
    std::string v;
}
struct same
{
    test_pair data_1;
    test_pair data_2;
    test_pair data_3;
};

same same_data {1, 2, 3};
```

map_data 和 same_data 的编码是一样的。

## 4. 调用合约方法 rlp 编码

调用合约方法时需要对方法名称和参数进行编码，同样归结为结构体编码，此结构体第一个字段固定为 std::string，用来存储方法名称， 第二个字段为函数的第一个参数类型， 第三个字段为函数的第二个参数类型，依次类推。

例如：

```cpp
// 函数原型为
std::string method_name(uint16_t, std::string, int);

struct same {
    std::string name;
    uint16_t para1;
    std::string para2;
    int para3;
};
```

传入参数的 rlp 编码为 same 类型的 rlp 编码。

