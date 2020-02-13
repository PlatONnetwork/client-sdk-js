
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
