/*
* @Author: wuzitao
* @Date:   2017-07-23 23:29:18
* @Last Modified time: 2017-08-30 09:22:40
*/
'use strict'
const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const router = require('./routes')

require('./m.js')(app)

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ 
	extended: true, // post中要用到true
	limit: '5mb' // 设置最大请求体，避免报413错误
}))
app.use(bodyParser.json({ limit: '2048kb' }))
app.use(cookieParser())
app.use(session(require('./config/session')))
app.use(router)

const PORT = process.env.PORT || 9999
app.listen(PORT, function () {
	console.log(`DevServer start on port:${ PORT}`)
})