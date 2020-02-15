#include <platon/platon.hpp>
#include <string>
using namespace platon;

class message
{
public:
    std::string head;
    PLATON_SERIALIZE(message, (head))
};

class my_message : public message
{
public:
    std::string body;
    std::string end;
    PLATON_SERIALIZE_DERIVED(my_message, message, (body)(end))
};

CONTRACT JSSDKTestContract : public platon::Contract
{

public:
    ACTION void init()
    {
        // do something to init.
    }

public:
    ACTION void setUint8(uint8_t input)
    {
        DEBUG("js_contract", "setUint8", input);
        tUint8.self() = input;
    }
    CONST uint8_t getUint8()
    {
        return tUint8.self();
    }

    ACTION void setUint16(uint16_t input)
    {
        DEBUG("js_contract", "setUint16", input);
        tUint16.self() = input;
    }
    CONST uint16_t getUint16()
    {
        return tUint16.self();
    }

    ACTION void setUint32(uint32_t input)
    {
        DEBUG("js_contract", "setUint32", input);
        tUint32.self() = input;
    }
    CONST uint32_t getUint32()
    {
        return tUint32.self();
    }

    ACTION void setUint64(uint64_t input)
    {
        DEBUG("js_contract", "setUint64", input);
        tUint64.self() = input;
    }
    CONST uint64_t getUint64()
    {
        return tUint64.self();
    }

    ACTION void setString(const std::string &input)
    {
        DEBUG("js_contract", "setString", input);
        tString.self() = input;
    }
    CONST std::string getString()
    {
        return tString.self();
    }

    ACTION void setBool(bool input)
    {
        DEBUG("js_contract", "setBool", input);
        tBool.self() = input;
    }
    CONST bool getBool()
    {
        return tBool.self();
    }

    ACTION void setChar(char input)
    {
        DEBUG("js_contract", "setChar", input);
        tByte.self() = input;
    }
    CONST char getChar()
    {
        return tByte.self();
    }

    ACTION void setU256(uint64_t input)
    {
        DEBUG("js_contract", "setU256", input);
        tU256.self() = u256(input);
    }
    CONST std::string getU256()
    {
        return to_string(tU256.self());
    }

    ACTION void setMessage(const message &msg)
    {
        DEBUG("js_contract", "setMessage", msg.head);
        sMessage.self() = msg;
    }
    CONST message getMessage()
    {
        return sMessage.self();
    }

    ACTION void setMyMessage(const my_message &msg)
    {
        sMyMessage.self() = msg;
        DEBUG("js_contract", "setMyMessage", msg.head, msg.body, msg.end);
    }
    CONST my_message getMyMessage()
    {
        return sMyMessage.self();
    }

private:
    platon::StorageType<"suint8"_n, uint8_t> tUint8;
    platon::StorageType<"suint16"_n, uint16_t> tUint16;
    platon::StorageType<"suint32"_n, uint32_t> tUint32;
    platon::StorageType<"suint64"_n, uint64_t> tUint64;
    platon::StorageType<"sstring"_n, std::string> tString;
    platon::StorageType<"sbool"_n, bool> tBool;
    platon::StorageType<"sbyte"_n, char> tByte;
    platon::StorageType<"su256"_n, u256> tU256;

    platon::StorageType<"message"_n, message> sMessage;
    platon::StorageType<"my_message"_n, my_message> sMyMessage;
};

PLATON_DISPATCH(JSSDKTestContract, (init)(setUint8)(getUint8)(setUint16)(getUint16)(setUint32)(getUint32)(setUint64)(getUint64)(setString)(getString)(setBool)(getBool)(setChar)(getChar)(setU256)(getU256)(setMessage)(getMessage)(setMyMessage)(getMyMessage))
