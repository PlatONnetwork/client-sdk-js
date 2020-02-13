#include <platon/platon.hpp>

using namespace platon;

CONTRACT SimpleStorageInit : public Contract {
 public:
    ACTION void init(int i) {
        n_.self() = i;
    }

    ACTION void set(int i) {
        n_.self() = i;
    }

    CONST int get() {
        return n_.get();
    }

 private:
    //Int<"test"_n> n_;
    StorageType<"test"_n, int> n_;
};

PLATON_DISPATCH(SimpleStorageInit, (init)(set)(get));
