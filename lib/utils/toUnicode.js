/**
 * @description 只转换汉字字符
 * @author liangyanxiang
 * @param {*} str
 * @returns
 */
function toUnicode (str) {
  return str.replace (/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function (newStr) {
    return '\\u' + newStr.charCodeAt (0).toString (16);
  });
}

module.exports=toUnicode