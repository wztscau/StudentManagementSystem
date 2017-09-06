/*
* @Author: wuzitao
* @Date:   2017-08-07 14:49:58
* @Last Modified time: 2017-08-30 16:56:57
*/

'use strict'
const query = require('../db/userDao')

module.exports = function User (req, res) {
	this.isPwdCorrect = pms => {
		let uname = pms.uname
		query(query.fun.pwd, pms)
			.done( result => {
				if (result[0] && result[0].status) {
					// 没有登录过就记录登记时间和次数
					if (!req.session[uname]) {
						this.record(uname)
					}
					req.session[uname] = uname; // 有该用户名才算有登录过并且未过期
					res.send({ result: true });
				} else {
					res.send({ result: false });
				}
			})
		return this
	}
	this.record = uname => {
		query(query.fun.record, { uname })
		return this
	}
	this.isLogin = id => {
		if (req.session[id]) 
			res.send({ isVisit: true })
		else 
			res.send({ isVisit: false })
		return this
	}
	this.modifyPwd = pms => {
		query(query.fun.mdpwd, pms)
			.done( result => {
				res.send({ result })
			})
		return this
	}
	this.getPersonalData = pms => {
		query(query.fun.perdata, pms)
			.done(result => {
				if (!result[0]) 
					res.send({ info: '' })
				else
					res.send({ info: result[0] })
			})
		return this
	}
	this.checkId = pms => {
		query(query.fun.checkid, pms)
			.done(result => {
				if (result[0])
					res.send({ isExist: true })
				else
					res.send({ isExist: false })
			})
		return this
	}
	this.addUser = pms => {
		query(query.fun.adduser, pms)
			.done(result => {
				res.send({ result })
			})
		return this
	}
	this.getUserInfo = pms => {
		query(query.fun.getuser, pms)
			.done(result => {
				res.send(result)
			})
		return this
	}
	this.modifyUser = pms => {
		query(query.fun.moduser, pms)
			.done(result => {
				res.send({ result })
			})
	}
	this.disableUser = pms => {
		query(query.fun.disable, pms)
			.done(result => {
				res.send({ result })
			})
		return this
	}
	this.setHeadImage = pms => {
		query(query.fun.sethead, pms)
			.done(result => {
				res.send({ result })
			})
	}
}