/*
* @Author: wuzitao
* @Date:   2017-09-03 13:14:38
* @Last Modified time: 2017-09-03 14:05:23
*/

'use strict';
const query = require('../db/deptDao')

module.exports = function Department (req, res) {
	this.get = pms => {
		query(query.fun.get)
			.done(result => {
				res.send(result)
			})
		return this
	}
	this.add = pms => {
		query(query.fun.add, pms)
			.done(result => {
				res.send({ result })
			})
	}
}