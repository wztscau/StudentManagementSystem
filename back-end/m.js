/*
* @Author: wuzitao
* @Date:   2017-08-07 09:13:15
* @Last Modified time: 2017-08-11 16:01:40
*/
const path = require('path')
const express = require('express')
const app = express()
const u = require('./util/util')

module.exports = function (app) {
	let dataMaggie = require('../others/Maggie/server')
	app.use(express.static(path.resolve('../others/')))
	app.get('/maggie', function (req, res) {
		res.sendFile(path.resolve('../others/Maggie/index.html'))
	})
	app.get('/maggie/data/:content', function (req, res) {
		let content = req.params.content
		if (content === 'msg') {
			let query = req.query // 如果没有query(?后面的)，则是空对象，不是undefined
			if (u.isEmptyObject(query)) {
				res.json( dataMaggie.getMsg() )
			} else {
				res.json( dataMaggie.putMsg(query) )
			}
			return
		}
		if (content === 'img') {
			res.json( dataMaggie.getImg() )
			return
		}
		res.end('404 error')
	})
}