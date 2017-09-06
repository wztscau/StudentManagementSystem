function isEmptyObject (obj) {
  for (var p in obj) {
  	return false;
  }
  return true;
}
function log () {
  console.log.apply(console, arguments);
}
function addQuote (val) {
  return typeof val === 'string' ? `"${val}"` : val;
}
function fillZero (n) {
  return n < 10 ? '0' + n : '' + n
}
function isPlainObject (obj) {
  return typeof obj === 'object'
    && Object.getPrototypeOf(obj).constructor === Object
}
module.exports = (function () {
  Date.prototype.Format = Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  return {
    isEmptyObject, log, addQuote, fillZero, isPlainObject
  };
})();