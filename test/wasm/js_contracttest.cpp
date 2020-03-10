#include <platon/platon.hpp>
#include <string>
#include <list>
using namespace platon;

class message {
   public:
      std::string head;
      PLATON_SERIALIZE(message, (head))
};

class my_message : public message {
   public:
      std::string body;
      std::string end;
      PLATON_SERIALIZE_DERIVED(my_message, message, (body)(end))
};


CONTRACT JSSDKTestContract: public platon::Contract
{
  PLATON_EVENT1(transfer,std::string,std::string)
	PLATON_EVENT1(setUint16Evt,std::string,std::string,uint16_t)
	PLATON_EVENT2(setUint32Evt,std::string,uint32_t,std::string,uint32_t,uint32_t)
	public:
		ACTION void init()
		{
			// do something to init.
		}
	
	public:

		ACTION void setUint8(uint8_t input)
		{
      DEBUG("js_contract", "setUint8", input);
			PLATON_EMIT_EVENT1(transfer,"js_contract", "event");
			tUint8.self() = input;
		}
		CONST uint8_t getUint8()
		{
			return tUint8.self();
		}

		ACTION void setUint16(uint16_t input)
		{
      DEBUG("js_contract", "setUint16", input);
			PLATON_EMIT_EVENT1(setUint16Evt,"topic1","data1",input);
			tUint16.self() = input;
		}
		CONST uint16_t getUint16()
		{
			return tUint16.self();
		}
		
		ACTION void setUint32(uint32_t input)
		{
      DEBUG("js_contract", "setUint32", input);
			PLATON_EMIT_EVENT2(setUint32Evt,"topic1",input,"data1",input,input);
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
		
		ACTION void setString(const std::string& input)
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

		//ACTION void setU256(uint64_t input)
		//{
      //DEBUG("js_contract", "setU256", input);
			//tU256.self() = u256(input);
		//}
		//CONST std::string getU256()
		//{
			//return to_string(tU256.self());
		//}


    ACTION void setMessage(const message &msg) {
      DEBUG("js_contract", "setMessage", msg.head);
      sMessage.self() = msg;
		}
		CONST message getMessage() {
      return sMessage.self();
		}

		ACTION void setMyMessage(const my_message &msg) {
                    sMyMessage.self() = msg;
                    DEBUG("js_contract", "setMyMessage", msg.head, msg.body, msg.end);
		}
		CONST my_message getMyMessage() {
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

		ACTION void setFloat(float input) {
		  DEBUG("js_contract", "setFloat", input);
			tFloat.self() = input;
		}
		CONST float getFloat() {
		  return tFloat.self();
		}
		ACTION void setDouble(double input) {
		  DEBUG("js_contract", "setDouble", input);
			tDouble.self() = input;
		}
		CONST double getDouble() {
      return tDouble.self();
		}

		ACTION void setVector(const std::vector<uint16_t>& vec) {
		  for(auto iter = vec.begin(); iter != vec.end(); iter++) {
        DEBUG("js_contract", "setVector", *iter);
      }
		  sVector.self() = vec;
		}
		CONST std::vector<uint16_t> getVector() {
		  return sVector.self();
		}

    ACTION void setMap(const std::map<std::string,std::string>& input) {
      for (auto iter=input.begin(); iter!=input.end(); iter++) {
				DEBUG("js_contract", "setMap", iter->first, iter->second);
			}
      sMap.self() = input;
		}
		CONST std::map<std::string,std::string> getMap() {
		  return sMap.self();
		}

		ACTION void testMultiParams(const message &msg, int32_t input1, bool input2) {
		  DEBUG("js_contract", "testMultiParams", msg.head, input1, input2);
      sMessage.self() = msg;
			tInt32.self() = input1;
			tBool.self() = input2;
		}

		ACTION void setBytes(const bytes input) {
		  for (int i=0; i<sizeof(input); ++i) {
				DEBUG("js_contract", "setBytes", input[i]);
			}
		  sBytes.self() = input;
		}
		CONST bytes getBytes() {
      return sBytes.self();
		}
		ACTION void setArray(const std::array<std::string,10>& input) {
		  for(auto iter = input.begin(); iter != input.end(); iter++) {
        DEBUG("js_contract", "setArray", *iter);
      }
		  sArray.self() = input;
		}
		CONST std::array<std::string,10> getArray() {
		  return sArray.self();
		}
		ACTION void setPair(const std::pair<std::string,int32_t>& input) {
		  DEBUG("js_contract", "setPair", input.first, input.second);
		  sPair.self() = input;
		}
		CONST std::pair<std::string,int32_t> getPair() {
		  return sPair.self();
		}
		ACTION void setSet(const std::set<std::string>& input) {
		  for(auto iter = input.begin(); iter != input.end(); iter++) {
        DEBUG("js_contract", "setSet", *iter);
      }
		  sSet.self() = input;
		}
		CONST std::set<std::string> getSet() {
		  return sSet.self();
		}
		//ACTION void setU160(u160 input)
		//{
      //DEBUG("js_contract", "setU160", input);
			//sU160.self() = input;
		//}
		//CONST u160 getU160()
		//{
			//return sU160.self();
		//}
		//ACTION void setU256new(u256 input)
		//{
      //DEBUG("js_contract", "setU256new", input);
			//sU256.self() = input;
		//}
		//CONST u256 getU256new()
		//{
			//return sU256.self();
		//}
		//ACTION void setBigInt(bigint input)
		//{
      //DEBUG("js_contract", "setBigInt", input);
			//sBigint.self() = input;
		//}
		//CONST bigint getBigInt()
		//{
			//return sBigint.self();
		//}
		ACTION void setFixedHash(const FixedHash<256>& input) {
		  //DEBUG("js_contract", "setFixedHash", input);
			sFixedHash.self() = input;
		}
		CONST FixedHash<256> getFixedHash() {
		  return sFixedHash.self();
		}
		
	  ACTION void setList(const std::list<std::string>& input) {
		  for(auto iter = input.begin(); iter != input.end(); iter++) {
        DEBUG("js_contract", "setList", *iter);
      }
		  sList.self() = input;
		}
		CONST std::list<std::string> getList() {
		  return sList.self();
		}
		ACTION void setAddress(const Address& addr) {
		  sAddress.self() = addr;
		}
		CONST Address getAddress() {
		  return sAddress.self();
		}
		
	private:
		platon::StorageType<"suint1"_n, uint8_t> tUint8;
		platon::StorageType<"suint2"_n, uint16_t> tUint16;
		platon::StorageType<"suint3"_n, uint32_t> tUint32;
		platon::StorageType<"suint5"_n, uint64_t> tUint64;
		platon::StorageType<"sstring"_n, std::string> tString;
		platon::StorageType<"sbool"_n, bool> tBool;
		platon::StorageType<"sbyte"_n, char> tByte;
		//platon::StorageType<"su123"_n, u256> tU256;

		platon::StorageType<"message"_n, message> sMessage;
		platon::StorageType<"mymessage"_n, my_message> sMyMessage;

		platon::StorageType<"sint1"_n, int8_t> tInt8;
		platon::StorageType<"sint2"_n, int16_t> tInt16;
		platon::StorageType<"sint3"_n, int32_t> tInt32;
		platon::StorageType<"sint5"_n, int64_t> tInt64;
		platon:: StorageType<"storagefloat"_n,float> tFloat;
    platon:: StorageType<"storagedouble"_n,double> tDouble;

		platon::StorageType<"vectorvar"_n, std::vector<uint16_t>> sVector;
		platon::StorageType<"mapvar"_n,std::map<std::string,std::string>> sMap;

		platon::StorageType<"bytesvar"_n, bytes> sBytes;
		platon::StorageType<"arrayvar"_n, std::array<std::string,10>> sArray;
		platon::StorageType<"pairvar"_n, std::pair<std::string,int32_t>> sPair;
		platon::StorageType<"setvar"_n, std::set<std::string>> sSet;
		//platon::StorageType<"u111var"_n, u160> sU160;
		//platon::StorageType<"u222var"_n, u256> sU256;
		//platon::StorageType<"bigintvar"_n, bigint> sBigint;
		platon::StorageType<"fixedhashvar"_n, FixedHash<256>> sFixedHash;
		platon::StorageType<"listvar"_n, std::list<std::string>> sList;
		platon::StorageType<"address"_n, Address> sAddress;
};

PLATON_DISPATCH(JSSDKTestContract,(init)
(setUint8)(getUint8)(setUint16)(getUint16)(setUint32)(getUint32)(setUint64)(getUint64)
(setString)(getString)(setBool)(getBool)(setChar)(getChar)
(setMessage)(getMessage)(setMyMessage)(getMyMessage)
(setInt8)(getInt8)(setInt16)(getInt16)(setInt32)(getInt32)(setInt64)(getInt64)
(setFloat)(getFloat)(setDouble)(getDouble)(setVector)(getVector)(setMap)(getMap)(testMultiParams)
(setBytes)(getBytes)(setArray)(getArray)(setPair)(getPair)(setSet)(getSet)
(setFixedHash)(getFixedHash)
(setList)(getList)(setAddress)(getAddress))

