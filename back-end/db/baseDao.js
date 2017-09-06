/*
* @Author: wuzitao
* @Date:   2017-08-02 10:35:59
* @Last Modified time: 2017-09-01 21:41:02
*/
'use strict'
const pool = require('./pool')
const u = require('../util/util')
const events = require('events')
const emitter = new events.EventEmitter()
const Promise = require('bluebird')

// emitter.setMaxListeners(50)

function replaceHolder (replacer) {
	let holder = ''
	if (replacer instanceof Array) {
		holder = replacer.join(',').replace(/,$/, '')
	}
	if (typeof replacer === 'string' || typeof replacer === 'number') {
		holder = replacer
	}
	return holder
}

/**
 * 将sql语句中所有参数$xxx替换成实际值
 * @param  {String} sql       [description]
 * @param  {Object} replacers [description]
 * @return {String}           [description]
 */
function replaceSql (sql, replacers) {
	for (let key in replacers) {
		sql = sql.replace(key, replaceHolder(replacers[key]))
	}
	return sql
}

let statement = {
	whereSql (where, sql='') {
		// 使用闭包是因为要用到全局的sql
		function inner (whereArr) {
			for (let whereObj of whereArr) {
				let relation  = whereObj.relation
				if (relation) {
					if (relation.toLowerCase() === 'and') { sql += ' AND ' }
					if (relation.toLowerCase() === 'or')  { sql += ' OR '  }
				}

				// 数组需递归其对象
				if (whereObj instanceof Array) {
					inner.inArray = true							 // 数组确认
					inner.objCount = 0 								 // 对象数量确认(可自增)
					inner.objLength = whereObj.length  // 对象数量确认(不变)
					inner.deep = !!inner.deep + 1      // 数组深度确认
					inner(whereObj)
				} else {
					//只有是数组中第一个对象才加(
					if (inner.inArray) {
						// 数组对象计数
						inner.objCount += 1
						if (inner.objCount === 1) {
							sql += '('
						}
					}

					let value = whereObj.value
					let compare = whereObj.compare && whereObj.compare.toUpperCase() || '='
					let valueText = '', isText = false
					// between
					if (/between/i.test(compare)) {
						valueText = u.addQuote(value[0]) + ' AND ' + u.addQuote(value[1])
						isText = true
					}
					// in
					if (/in/i.test(compare)) {
						valueText += '('
						for (let val of value) {
							valueText += u.addQuote(val) + ','
						}
						valueText = valueText.replace(/,$/, '')
						valueText += ')'
						isText = true
					}
					// 陈述句or字符串或数字
					valueText = whereObj.forceText
						? value // 强制使用陈述句
						: ( isText ? valueText : u.addQuote(value) ) // 字符串要加""
					// 最后将整理好的name=value加入sql中
					sql += whereObj.name + ' ' + compare + ' ' + valueText
					//只有是数组中最后一个对象才加)
					if (inner.inArray && inner.objLength === inner.objCount) {
						for (let i = 0; i < inner.deep; i++) {
							sql += ')'
						}
						inner.inArray = false // 重置
						inner.deep = 0
					}
				}
			}
			return sql
		}

		let whereArr = where
		if (u.isPlainObject(where)) {
			// 规范输入，如{ name: id, value: xxx }
			whereArr = [where]
			// 简便输入，如{ id: xxx}
			if (where['name'] === undefined) {
				let key = Object.keys(where)[0]
				whereArr = [{ name: key, value: where[key] }]
			}
		}
		return inner(whereArr)
	},
	order_bySql(order, sql='') {
		let orderArr = order
		if (typeof order === 'string') {
			orderArr = [{ value: order }]
		}
		if (u.isPlainObject(order)) {
			orderArr = [order]
		}
		for (let orderObj of orderArr) {
			sql += orderObj.value + ' ' + (orderObj.by || '') + ','
		}
		return sql.replace(/,$/, '')
	},
	group_bySql(groupArr, sql='') {
		for (let groupObj of groupArr) {
			sql += groupObj.value + ','
		}
		return sql.replace(/,$/, '')
	},
	limitSql(limitArr, sql='') {
		if (typeof limitArr === 'number') return limitArr
		return sql + limitArr[0] 
			+ (limitArr[1] ? ',' + limitArr[1] : '')
	},

}

function sortSelectSql (originSql) {
	let reSelect = /select.*?#/gi,
			reWhere = /where.*?#/gi,
			reOrder_by = /order by.*?#/gi,
			reGroup_by = /group by.*?#/gi,
			reHaving = /having.*?#/gi,
			reLimit = /limit.*?#/gi
			
	let sql = ''
	sql += originSql.match(reSelect)
		+ ( originSql.match(reWhere) || '' )
		+ ( originSql.match(reGroup_by) || '' )
		+ ( originSql.match(reHaving) || '' )
		+ ( originSql.match(reLimit) || '' )
		+ ( originSql.match(reOrder_by) || '' )
		
	sql = sql.replace(/#/g, ' ')
	return sql
}

function tableJoinOn (tables) {
	let sql = ''
	if (!(tables instanceof Array)) {
		tables = [{ name: tables, join: '', on: '' }]
	}
	sql += tables[0].name
	for (let i = 1, len = tables.length; i < len; i++) {
		let tab = tables[i]
		sql += ' ' + (tab.join || 'inner') + ' join '
		sql += tab.name
		if (tab.on) {
			let on = tab.on
			if (typeof on === 'string') {
				on = { value: on }
			}
			sql += ' on '
			sql += tab.name + '.' + on.value 
				+ ' = '
				+ (on.table || tables[0].name) + '.' + (on.prevValue || on.value)
		}
	}
	return sql
}

function BaseDao () {}
BaseDao.prototype = {
	constructor: BaseDao,
	select(args, cb) {
		return new Promise( (resolve, reject) => {
			let originSql = 'SELECT $column FROM $table#'
			let resArgs = { 
				$column: args.$column || '*',
				$table: tableJoinOn(args.$table)
			}

			for (let key in args) {
				if (key === '$column' || key === '$table') {
					continue
				}
				// 对象转为字符串,如resArgs.$where=statement.whereSql(args.$where)
				resArgs[key] = statement[key.substring(1).toLowerCase() + 'Sql'](args[key])
				// 使用#占位符
				originSql += '#' + key.substring(1).toUpperCase().replace('_', ' ') + ' ' + key + '#'
			}

			// 去掉占位符，替换参数为陈述语句
			let sql = replaceSql(sortSelectSql(originSql), resArgs)
			
			this.commit(sql, result => { cb ? cb(result) : resolve(result) })
		})
	},
	insert(args, cb) {
		return new Promise( (resolve, reject) => {
			let sql = `INSERT INTO ${args.$table}(`
			let resArgs = {}

			for (let key in args) {
				if (key === '$table') continue
				resArgs[key] = args[key]
				sql += key + ','
			}
			sql += ') '
			sql += 'VALUES('

			for (let key in resArgs) {
				// 对value中的双引号进行转义
				let value = resArgs[key]
				value = value.replace ? value.replace(/"/g, '\\"') : value
				sql += u.addQuote(value) + ','
			}
			sql += ')'
			sql = sql.replace(/,\)/g, ')')

			this.commitExceptSelect(sql, cb, resolve)
		})
	},
	update(args, cb) {
		return new Promise( (resolve, reject) => {
			let originSql = 'UPDATE $table SET '
			let resArgs = { $table: args.$table }

			for (let key in args.$set) {
				// 对value中的双引号进行转义
				let value = args.$set[key]
				value = value.replace ? value.replace(/"/g, '\\"') : value
				originSql += key + '=' + u.addQuote(value) + ','
			}
			originSql = originSql.replace(/,$/, '')
			args.$where && (originSql += ' WHERE $where')

			resArgs.$where = statement.whereSql(args.$where)
			let sql = replaceSql(originSql, resArgs)

			this.commitExceptSelect(sql, cb, resolve)
		})
	},
	delete(args, cb) {
		return new Promise( (resolve, reject) => {
			let originSql = 'DELETE FROM $table WHERE $where'
			let resArgs = { $table: args.$table }
			resArgs.$where = statement.whereSql(args.$where)
			let sql = replaceSql(originSql, resArgs)

			this.commitExceptSelect(sql, cb, resolve)
		})
	},
	commit(sql, cb) {
		// 不需要开启事务
		if (!this.transaction) {
			console.log(sql)
			pool.succConnection(sql, cb)
			return
		}
		// 需要开启事务
		emitter.addListener('transaction', function (status) {
			if (status) {
				this.sqlArr.push(sql)
				this.sqlLen++
				this.cb = cb
			} else {
				// 最后一条才需要把所有的sql语句交给数据库处理
				if (this.sqlLen === this.sqlArr.length) {
					console.log(this.sqlArr)
					pool.succConnection(this.sqlArr, this.cb)
				}
				// 移除所有的监听事件
				emitter.removeAllListeners('transaction')
				// 清空sql数组
				this.sqlArr = []
			}
		}.bind(this) )
	},
	commitExceptSelect (sql, cb, resolve) {
		this.commit(sql, result => {
			result = result.affectedRows // number
			cb ? cb(result) : resolve(result) 
		})
	},
	begin() {
		if (this.transaction) return // 防止open多次
		this.transaction = true
		this.sqlLen = 0
		this.sqlArr = []
		setTimeout( () => emitter.emit('transaction', true) )
		return this
	},
	end() {
		if (!this.transaction) return // 防止end多次
		this.transaction = false
		setTimeout( () => emitter.emit('transaction', false) )
		return this
	}
}

module.exports = BaseDao
