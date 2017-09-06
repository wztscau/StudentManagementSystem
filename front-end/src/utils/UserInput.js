/*
* @Author: wuzitao
* @Date:   2017-08-07 23:02:38
* @Last Modified time: 2017-08-13 01:11:09
*/
const distinctObjectArrayBy = require('util.js').distinctObjectArrayBy

function UserInput () {
	this.reflects = [
		{
			name: 'tel',
			reg: /^(13[0-9]|15[0-9]|18[0-9])\d{8}$/
		},
		{
			name: 'qq',
			reg: /^[1-9][0-9]{4,15}$/
		}
	];
	addMethod.bind(this)(this.reflects);
}
UserInput.prototype.add = function (obj) {
	if (obj instanceof Array) {
		for (let o of obj) {
			if (!(o.reg instanceof RegExp)) {
				throw 'The reg must be a RegExp';
			}
			this.reflects.push(o);
		}
	} else {
		this.reflects.push(obj);
		if (!(obj.reg instanceof RegExp)) {
			throw 'The reg must be a RegExp';
		}
	}
	this.reflects = distinctObjectArrayBy(this.reflects, 'name');
	addMethod.bind(this)(this.reflects);
	return this;
}
function addMethod (refs) {
	for (let o of refs) {
		this['isIllegal'+upFirstCase(o.name)] = function (str) {
			return o.reg.test(str);
		};
	}
}
function upFirstCase (str) {
	return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
	    return v1.toUpperCase() + v2.toLowerCase();
	});
}
function distinctObjectArrayBy (arr, key) {
	let a = [];
	let names = [];
	for (let i = arr.length - 1; i >= 0; i--) {
		let o = arr[i];
		if (names.indexOf(o[key]) === -1) {
			a.push(o);	
			names.push(o[key]);
		}
	}
	return a.reverse();
}
export default UserInput;