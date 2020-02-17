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
    PLATON_EVENT1(transfer, std::string, std::string)
public:
    ACTION void init()
    {
        // do something to init.
    }

public:
    ACTION void setUint8(uint8_t input)
    {
        DEBUG("js_contract", "setUint8", input);
        PLATON_EMIT_EVENT1(transfer, "js_contract", "event");
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

    ACTION void setInt8(int8_t input)
    {
        DEBUG("js_contract", "setInt8", input);
        tInt8.self() = input;
    }
    CONST int8_t getInt8()
    {
        return tInt8.self();
    }

    ACTION void setInt16(int16_t input)
    {
        DEBUG("js_contract", "setInt16", input);
        tInt16.self() = input;
    }
    CONST int16_t getInt16()
    {
        return tInt16.self();
    }

    ACTION void setInt32(int32_t input)
    {
        DEBUG("js_contract", "setInt32", input);
        tInt32.self() = input;
    }
    CONST int32_t getInt32()
    {
        return tInt32.self();
    }

    ACTION void setInt64(int64_t input)
    {
        DEBUG("js_contract", "setInt64", input);
        tInt64.self() = input;
    }
    CONST int64_t getInt64()
    {
        return tInt64.self();
    }

    ACTION void setFloat(float input)
    {
        DEBUG("js_contract", "setFloat", input);
        tFloat.self() = input;
    }
    CONST float getFloat()
    {
        return tFloat.self();
    }
    ACTION void setDouble(double input)
    {
        DEBUG("js_contract", "setDouble", input);
        tDouble.self() = input;
    }
    CONST double getDouble()
    {
        return tDouble.self();
    }

    ACTION void setVector(const std::vector<uint16_t> &vec)
    {
        for (auto iter = vec.begin(); iter != vec.end(); iter++)
        {
            DEBUG("js_contract", "setVector", *iter);
        }
        sVector.self() = vec;
    }
    CONST std::vector<uint16_t> getVector()
    {
        return sVector.self();
    }

    ACTION void setMap(const std::map<std::string, std::string> &input)
    {
        for (auto iter = input.begin(); iter != input.end(); iter++)
        {
            DEBUG("js_contract", "setMap", iter->first, iter->second);
        }
        sMap.self() = input;
    }
    CONST std::map<std::string, std::string> getMap()
    {
        return sMap.self();
    }

    ACTION void testMultiParams(const message &msg, int32_t input1, bool input2)
    {
        DEBUG("js_contract", "testMultiParams", msg.head, input1, input2);
        sMessage.self() = msg;
        tInt32.self() = input1;
        tBool.self() = input2;
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

    platon::StorageType<"sint8"_n, int8_t> tInt8;
    platon::StorageType<"sint16"_n, int16_t> tInt16;
    platon::StorageType<"sint32"_n, int32_t> tInt32;
    platon::StorageType<"sint64"_n, int64_t> tInt64;
    platon::StorageType<"storage_float"_n, float> tFloat;
    platon::StorageType<"storage_double"_n, double> tDouble;

    platon::StorageType<"vector_var"_n, std::vector<uint16_t>> sVector;
    platon::StorageType<"map_var"_n, std::map<std::string, std::string>> sMap;
};

PLATON_DISPATCH(JSSDKTestContract, (init)(setUint8)(getUint8)(setUint16)(getUint16)(setUint32)(getUint32)(setUint64)(getUint64)(setString)(getString)(setBool)(getBool)(setChar)(getChar)(setU256)(getU256)(setMessage)(getMessage)(setMyMessage)(getMyMessage)(setInt8)(getInt8)(setInt16)(getInt16)(setInt32)(getInt32)(setInt64)(getInt64)(setFloat)(getFloat)(setDouble)(getDouble)(setVector)(getVector)(setMap)(getMap)(testMultiParams))
