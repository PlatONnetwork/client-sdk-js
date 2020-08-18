// Copyright (c) 2017 Pieter Wuille
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var bech32 = require('./bech32');

module.exports = {
  encode: encode,
  decode: decode,
  DecodeAddress:DecodeAddress,
  EncodeAddress:EncodeAddress,
};

function convertbits (data, frombits, tobits, pad) {
  var acc = 0;
  var bits = 0;
  var ret = [];
  var maxv = (1 << tobits) - 1;
  for (var p = 0; p < data.length; ++p) {
    var value = data[p];
    if (value < 0 || (value >> frombits) !== 0) {
      return null;
    }
    acc = (acc << frombits) | value;
    bits += frombits;
    while (bits >= tobits) {
      bits -= tobits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) {
      ret.push((acc << (tobits - bits)) & maxv);
    }
  } else if (bits >= frombits || ((acc << (tobits - bits)) & maxv)) {
    return null;
  }
  return ret;
}

function decode (hrp, addr) {
  var dec = bech32.decode(addr);
  if (dec === null || dec.hrp !== hrp || dec.data.length < 1 /*|| dec.data[0] > 16*/) {
    return null;
  }
  var res = convertbits(dec.data.slice(0), 5, 8, false);
  if (res === null || res.length < 2 || res.length > 40) {
    return null;
  }
  if (dec.data[0] === 0 && res.length !== 20 && res.length !== 32) {
    return null;
  }
  return {hrp: dec.hrp, program: res};
}

function encode (hrp, program) {
  var ret = bech32.encode(hrp, convertbits(program, 8, 5, true));
  if (decode(hrp, ret) === null) {
    return null;
  }
  return ret;
}

//十六进制字符串转字节数组
function Str2Bytes(str) {
  var pos = 0;
  var len = str.length;
  if(len % 2 != 0)
  {
     return null; 
  }
  len /= 2;
  var hexA = new Array();
  for(var i=0; i < len; i++)
  {
     var s = str.substr(pos, 2);
     if(s == "0x" || s == "0X")
     {
         pos += 2;
         continue;
     }
     var v = parseInt(s, 16);
     hexA.push(v);
     pos += 2;
  }
  return hexA;
}

//字节数组转十六进制字符串
function Bytes2Str(arr) {
  var str = "";
  for(var i=0; i<arr.length; i++)
  {
     var tmp = arr[i].toString(16);
     if(tmp.length == 1)
     {
         tmp = "0" + tmp;
     }
     str += tmp;
  }
  return str;
}

// 解析
function DecodeAddress(hrp, address){
  var ret = decode(hrp, address);
  if (ret === null) {
      return null;
  }

  return Bytes2Str(ret.program)
  //console.log("decode result ==> " + Bytes2Str(ret.program));
}

// 
function EncodeAddress(hrp, strAddress) {
  var program = Str2Bytes(strAddress)
  var ret = encode(hrp, program);
  //console.log("encode result ==> " + ret);
  return ret;
}
