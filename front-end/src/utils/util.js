/*
* @Author: wuzitao
* @Date:   2017-08-13 01:05:44
* @Last Modified time: 2017-08-30 19:15:49
*/

exports.distinctObjectArrayBy = function (arr, key, reverse) {
	let a = [];
	let names = [];
	function inner (i) {
		let o = arr[i];
		if (names.indexOf(o[key]) === -1) {
			a.push(o);	
			names.push(o[key]);
		}
	}
	if (reverse === 'reverse') {
		for (let i = arr.length - 1; i >= 0; i--) {
			inner(i)
		}
		return a.reverse()
	} else {
		for (let i = 0; i < arr.length; i++) {
			inner(i)
		}
		return a.reverse();
	}
}

const regRootPath = /(^\/.*?)(\/|$)/

exports.getRootPath = function (vm) {
	return vm.$route.path.match(regRootPath)[1]
}

exports.getId = function (vm) {
	return vm.$route.params.id
}

exports.removeArrayElement = function (arr, elem) {
	return arr.splice(arr.indexOf(elem), 1)
}

exports.getRealTime = function (time) {
	return time.replace(/[T]|(\.\d{3}Z)/g, ' ')
}

exports.formatDate = function(date, fmt) {
  var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}