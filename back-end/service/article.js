/*
* @Author: wuzitao
* @Date:   2017-08-25 16:39:24
* @Last Modified by:   wuzitao
* @Last Modified time: 2017-09-05 14:55:54
*/
const query = require('../db/articleDao')

module.exports = function Article (req, res) {
	this.addArticle = pms => {
		query(query.fun.add, pms)
			.done(result => {
				res.send({ result })
			})
		return this
	}
	this.getArticles = pms => {
		query(query.fun.getall, pms)
			.done(result => {
				res.send(result)
			})
		return this
	}
	this.getPersonalArticle = pms => {
		query(query.fun.getperson, pms)
			.done(result => {
				res.send(result)
			})
		return this
	}
	this.addVisit = pms => {
		query(query.fun.visit, pms)
			.done(result => {
				result && res.send('ok')
			})
		return this
	}
	this.getMyArticles = pms => {
		query(query.fun.my, pms)
			.done(result => {
				res.send(result)
			})
		return this
	}
	this.deleteArticle = pms => {
		query(query.fun.del, pms)
			.done(result => {
				res.send({ result })
			})
		return this
	}
	this.topArticle = pms => {
		query(query.fun.top, pms)
			.done(result => {
				res.send({ result })
			})
		return this
	}
}