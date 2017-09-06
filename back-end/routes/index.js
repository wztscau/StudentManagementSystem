/*
* @Author: wuzitao
* @Date:   2017-08-07 16:11:35
* @Last Modified time: 2017-09-05 16:32:31
*/

'use strict'
const express = require('express')
const router = express.Router()
const api = require('../config/api.json')

const User = require('../service/user')
const Permisson = require('../service/permisson.js')
const Article = require('../service/article.js')
const Department = require('../service/department.js')

router.use( (req, res, next) => {
	// res.setHeader("Access-Control-Allow-Origin", require('../config/client'));
	// res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
	// res.setHeader("Access-Control-Allow-Headers", "Authorization,Origin,X-Requested-With,Content-Type,Accept");
	// res.setHeader("Access-Control-Allow-Credentials", "true");

	next()
})

router.post(api.login, (req, res) => {
	// 要登录过才可以直接进入主页面，否则需要登录
	new User(req, res).isPwdCorrect(req.body)
})

router.post(api.logout, (req, res) => {
	delete req.session[req.body.uname]
	res.end('ok')
})

router.post(api.session, (req, res) => {
	new User(req, res).isLogin(req.body.id)
})

router.get(api.permission, (req, res) => {
	new Permisson(req, res).get(req.query)
})

router.get(api.role, (req, res) => {
	res.send({ role: req.session.role || '' })
})

router.post(api.pwd, (req, res) => {
	new User(req, res).modifyPwd(req.body)
})

router.get(api.person, (req, res) => {
	new User(req, res).getPersonalData(req.query)
})

router.get(api.checkId, (req, res) => {
	new User(req, res).checkId(req.query)
})

router.post(api.addUser, (req, res) => {
	new User(req, res).addUser(req.body)
})

router.get(api.getUser, (req, res) => {
	new User(req, res).getUserInfo(req.query)
})

router.post(api.modUser, (req, res) => {
	new User(req, res).modifyUser(req.body)
})

router.post(api.disable, (req, res) => {
	new User(req, res).disableUser(req.body)
})

router.post(api.addArticle, (req, res) => {
	new Article(req, res).addArticle(req.body)
})

router.post(api.uploadImg, (req, res) => {
	new User(req, res).setHeadImage(req.body)
})

router.get(api.getArticle, (req, res) => {
	new Article(req, res).getArticles(req.query)
})

router.get(api.getPersonalArticle, (req, res) => {
	new Article(req, res).getPersonalArticle(req.query)
})

router.post(api.addVisit, (req, res) => {
	new Article(req, res).addVisit(req.body)
})

router.get(api.myArticle, (req, res) => {
	new Article(req, res).getMyArticles(req.query)
})

router.post(api.delArticle, (req, res) => {
	new Article(req, res).deleteArticle(req.body)
})

router.get(api.dept, (req, res) => {
	new Department(req, res).get(req.query)
})

router.post(api.batch, (req, res) => {
	new Department(req, res).add(req.body)
})

router.post(api.top, (req, res) => {
	new Article(req, res).topArticle(req.body)
})

module.exports = router