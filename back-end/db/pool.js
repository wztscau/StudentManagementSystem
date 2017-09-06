/*
* @Author: wuzitao
* @Date:   2017-08-01 20:56:10
* @Last Modified time: 2017-08-13 00:38:23
*/
'use strict'
const fs = require('fs')
const path = require('path')
const mysql = require('mysql')
const util = require('../util/util')

const log = path.resolve('./log/')
fs.existsSync(log) || fs.mkdirSync(log)

const pool = mysql.createPool(require('../config/db'))

const df = 'yyyy-MM-dd hh:mm:ss'
const date = new Date()
const getSqlType = sql => {
	return sql.match(/^(.*?)\s/)[1]
}

let writeErrorLog = function (err, errType, filePrefix=errType) {
	let errText = `[${errType.toUpperCase()} ERROR] - ` + date.format(df) + ` - ${err.message}\n`
	fs.open(path.join(log, `${filePrefix.toLowerCase()}-excetion.` + date.format('yyyyMMdd') ),
			'a', function (err, fd) {
		if (err) throw err
		fs.writeFileSync(fd, errText)
		fs.close(fd)
	})
}

let query = (sql, sqls, conn, succCb, sqlArgs) => {
	function queryCb (err, result) {
		if (err) {
				console.error(err)
			conn.rollback()
			writeErrorLog(err, getSqlType(sql), 'query')
		} else {
			// 如果不是最后一条sql就不commit
			if (sqls.indexOf(sql) !== sqls.length -1) {
				return
			}
			conn.commit(function (err) {
				// commit失败
				if (err) {
						console.error(err)
					conn.rollback()
					writeErrorLog(err, 'COMMIT')
				} else {
					succCb(result)
        	// succCb.apply(null, result);
        	conn.release()
				}
			})
		}
	}
	sqlArgs ? conn.query(sql, sqlArgs, queryCb) : conn.query(sql, queryCb)
}

module.exports = {
	succConnection(sqls) {
		let sqlArgs, succCallback = arguments[1]
		if (arguments[2]) {
			succCallback = arguments[2]
			sqlArgs = arguments[1]
		}
		pool.getConnection( (err, conn) => {
			// 连接失败
			if (err) {
					console.error(err)
				writeErrorLog(err, 'CONNECTION')
			} else {
				conn.beginTransaction(function (err) {
					// transaction问题
					if (err) {
							console.error(err)
						writeErrorLog(err, 'transaction')
					} else {
						typeof sqls === 'string' && ( sqls = [sqls] )
						for (let i = 0; i < sqls.length; i++) {
							query(sqls[i], sqls, conn, succCallback, sqlArgs)
						}
					}
				})
			}
		})
	} 
}