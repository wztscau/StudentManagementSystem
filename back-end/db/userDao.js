/*
* @Author: wuzitao
* @Date:   2017-08-07 14:49:58
* @Last Modified time: 2017-08-29 19:31:31
*/

'use strict'
const BaseDao = require('./baseDao')
const u = require('../util/util')
const { md5 } = require('../util/cryption.js')

const fun = {
	pwd: 'check_pwd',
	record: 'login_record',
	mdpwd: 'modify_pwd',
	perdata: 'get_personal_data',
	adduser: 'add_user_information',
	checkid: 'check_id',
	getuser: 'get_user_information',
	moduser: 'modify_user_information',
	disable: 'disable_user',
	sethead: 'set_head_img',
	gethead: 'get_head_img'
}

exports = module.exports = function (f, p) {
	const query = new BaseDao()

	let o = { $table: 'user' }

	// if (!p.fun) { throw 'There must be a fun in the query' }
	switch (f.toLowerCase()) {

	case fun.pwd:
		return query.select({
			$table: 'user',
			$column: 'status',
			$where: [
				{ name: 'uid', value: p.uname },
				{ name: 'pwd', value: p.pwd, relation: 'and' }
			]
		})

	case fun.record:
		// 不使用事务
		return query.select({
			$table: 'user',
			$column: 'login_count',
			$where: { uid: p.uname }
		})
		.then( result => {
			return query.update({
				$table: 'user',
				$set: {
					login_time: new Date().format('yyyy-MM-dd hh-mm-ss'),
					login_count: result[0].login_count + 1
				},
				$where: { uid: p.uname }
			})
		})

	case fun.mdpwd:
		return query.update({
			$table: 'user',
			$set: { pwd: p.pwd },
			$where: { uid: p.uname }
		})
		
	case fun.perdata:
		return query.select({
			$table: 'baseinfo',
			$where: { uid: p.uname }
		})

	case fun.checkid:
		return query.select({
			$table: 'baseinfo',
			$column: '_id',
			$where: { _id: p.id }
		})

	case fun.adduser:
		let info = p

		// 得到部门最大的batch
		let promise = query.select({
			$table: 'department',
			$where: [
				{ name: 'd_name', value: info.d_name },
				{ 
					name: 'batch',
					value: `(SELECT MAX(batch) FROM department WHERE d_name="${info.d_name}")`,
					relation: 'and',
					forceText: true // 子查询需用到forceText
				}
			]
		})
		.then(result => {
			let maxBatch = result[0].batch
			let people_count = result[0].people_count
			let did = result[0].did
			// 年份4位+部门id2位+批次2位+序号2位
			let uid = String(new Date().getFullYear())
				+ u.fillZero(did)
				+ u.fillZero(maxBatch)
				+ u.fillZero(people_count + 1)

			query.begin()
			// 更新department表的people_count
			query.update({
				$table: 'department',
				$set: { people_count: people_count + 1},
				$where: [
					{ name: 'did', value: did },
					{ name: 'batch', value: maxBatch, relation: 'and' }
				]
			})
			// 插入到user表
			query.insert({
				$table: 'user',
				uid,
				pwd: md5(info._id.substr(-6)),
				role: info.role,
				status: 1,
				reg_id: info.uname
			})
			// 插入到baseinfo表
			let prom = query.insert({
				$table: 'baseinfo',
				uid,
				_id: info._id,
				realname: info.realname,
				sex: info.sex,
				age: info.age,
				birthplace: info.birthplace,
				party: info.party,
				department: info.d_name,
				phone: info.phone,
				qq: info.qq,
				email: info.email
			})
			query.end()
			return prom
		})

		return promise

	case fun.getuser:
		// uid为主键
		if (p.columns) {
			p.columns = p.columns.map(elem => {
				if (elem === 'uid') {
					return 'user.uid'
				}
				return elem
			})
		}
		return query.select({
			$column: p.columns || '',
			$table: [
				{ name: 'user' },
				{ name: 'baseinfo', on: 'uid' }
			],
			$order_by: 'user.uid'
		})

	case fun.moduser:
		return query.update({
			$table: 'baseinfo',
			$set: p.set,
			$where: { uid: p.uname }
		})

	case fun.disable:
		return query.update({
			$table: 'user',
			$set: { status: 0 },
			$where: { uid: p.uname }
		})

	case fun.sethead:
		return query.update({
			$table: 'baseinfo',
			$set: { head: p.base64 },
			$where: { uid: p.uname }
		})

	default: return null
	}
}

exports.fun = fun
