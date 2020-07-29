#define TESTNET
#include <platon/platon.hpp>
#include <platon/fixedhash.hpp>
#include <string>
using namespace platon;
using int8_type_array = std::array<int8_t, 2>;
using int16_type_array = std::array<int16_t, 2>;
using uint8_type_array = std::array<uint8_t, 2>;
using uint16_type_array = std::array<uint16_t, 2>;
using int8_type_vector = std::vector<int8_t>;
using int16_type_vector =  std::vector<int16_t>;
using uint8_type_vector = std::vector<uint8_t>;
using uint16_type_vector = std::vector<uint16_t>;
using int8_type_list = std::list<int8_t>;
using int16_type_list =  std::list<int16_t>;
using uint8_type_list = std::list<uint8_t>;
using uint16_type_list = std::list<uint16_t>;
using uint8_string_type_map = std::map<uint8_t, std::string>;
using uint16_string_type_map = std::map<uint16_t, std::string>;
using uint8_string_type_pair = std::pair<uint8_t, std::string>;
using uint16_string_type_pair = std::pair<uint16_t, std::string>;
using uint8_type_set = std::set<uint8_t>;
using uint16_type_set = std::set<uint16_t>;
using uint32_type_set = std::set<uint32_t>;

struct Member {
  std::string name;
  std::string Name() const { return name; }
  PLATON_SERIALIZE(Member, (name))
};


CONTRACT EventTopic : public platon::Contract{
   public:
      PLATON_EVENT3(stringAndAddrAndBoolean,std::string, Address, bool)
      PLATON_EVENT3(intNumber, int8_t, int16_t, int32_t)
      PLATON_EVENT3(uintNumber, uint8_t, uint16_t, uint32_t)
      PLATON_EVENT2(intArray, int8_type_array, int16_type_array)
      PLATON_EVENT2(uintArray, uint8_type_array, uint16_type_array)
      PLATON_EVENT2(intVector, int8_type_vector, int16_type_vector)
      PLATON_EVENT2(uintVector, uint8_type_vector,  uint16_type_vector)
      PLATON_EVENT2(intList, int8_type_list, int16_type_list)
      PLATON_EVENT2(uintList, uint8_type_list, uint16_type_list)
	  PLATON_EVENT2(uintMap, uint8_string_type_map, uint16_string_type_map)
	  PLATON_EVENT2(uintPair, uint8_string_type_pair, uint16_string_type_pair)
	  PLATON_EVENT3(uintSet, uint8_type_set, uint16_type_set, uint32_type_set)
	  PLATON_EVENT3(fixHash, FixedHash<10>, FixedHash<20>, FixedHash<30>)
	  PLATON_EVENT1(structEvent, Member)
	  

      ACTION void init(){}

      ACTION void setStringAndAddressAndBoolean(std::string name, Address address, bool b){
           PLATON_EMIT_EVENT3(stringAndAddrAndBoolean,name,address,b);
      }

      ACTION void setIntNumber(int8_t i8, int16_t i16, int32_t i32){
          PLATON_EMIT_EVENT3(intNumber,i8,i16,i32);
      }

      ACTION void setUintNumber(uint8_t ui8, uint16_t ui16, uint32_t ui32){
          PLATON_EMIT_EVENT3(uintNumber,ui8,ui16,ui32);
      }

      ACTION void setIntArray(std::array<int8_t, 2> i8Array, std::array<int16_t, 2> i16Array){
          PLATON_EMIT_EVENT2(intArray,i8Array,i16Array);
      }

      ACTION void setUintArray(std::array<uint8_t, 2> ui8Array,  std::array<uint16_t, 2> ui16Array){
          PLATON_EMIT_EVENT2(uintArray,ui8Array,ui16Array);
      }

      ACTION void setIntVector(std::vector<int8_t> i8Array, std::vector<int16_t> i16Array){
          PLATON_EMIT_EVENT2(intVector,i8Array,i16Array);
      }

      ACTION void setUintVector(std::vector<uint8_t> ui8Array,  std::vector<uint16_t> ui16Array){
          PLATON_EMIT_EVENT2(uintVector,ui8Array,ui16Array);
      }

      ACTION void setIntList(std::list<int8_t> i8Array, std::list<int16_t> i16Array){
          PLATON_EMIT_EVENT2(intList,i8Array,i16Array);
      }

      ACTION void setUintList(std::list<uint8_t> ui8Array,  std::list<uint16_t> ui16Array){
          PLATON_EMIT_EVENT2(uintList,ui8Array,ui16Array);
      }
	  
	  ACTION void setMap(std::map<uint8_t, std::string> m1, std::map<uint16_t, std::string> m2){
		  PLATON_EMIT_EVENT2(uintMap,m1,m2);
	  }
	  
	  ACTION void setPair(std::pair<uint8_t, std::string> p1, std::pair<uint16_t, std::string> p2){
		  PLATON_EMIT_EVENT2(uintPair,p1,p2);
	  }
	  
	  ACTION void callSet(std::set<uint8_t> s1, std::set<uint16_t> s2, std::set<uint32_t> s3){
		  PLATON_EMIT_EVENT3(uintSet,s1,s2,s3);
	  }
	  
	  ACTION void setFixHash(FixedHash<10> f1, FixedHash<20> f2, FixedHash<30> f3){
		  PLATON_EMIT_EVENT3(fixHash,f1,f2,f3);
	  }
	  
	  ACTION void setStruct(Member st1){
		  PLATON_EMIT_EVENT1(structEvent,st1);
	  }
	  

   private:
      platon::StorageType<"sstorage"_n, std::string> stringstorage;
};

PLATON_DISPATCH(EventTopic, (init)(setStringAndAddressAndBoolean)(setIntNumber)(setUintNumber)(setIntArray)(setUintArray)(setIntVector)(setUintVector)(setIntList)(setUintList)(setMap)(setPair)(callSet)(setFixHash)(setStruct))
