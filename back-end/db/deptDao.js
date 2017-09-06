/*
* @Author: wuzitao
* @Date:   2017-08-12 22:59:03
* @Last Modified time: 2017-09-03 14:07:18
*/

'use strict'
const BaseDao = require('./baseDao.js')

const fun = {
	get: 'get_all_department_info',
	add: 'add_department_batch'
}

exports = module.exports = function (f, p) {
	const query = new BaseDao()

	switch (f.toLowerCase()) {
		case fun.get:
			return query.select({
				$table: 'department',
				$column: [
					'd_name',
					'batch',
					'people_count',
					'reg_time'
				]
			})

		case fun.add:
			let map = {
				'前端': 22,
				'UI': 12,
				'Java': 88,
				'未知': 99
			}
			return query.select({
				$table: 'department',
				$column: 'max(batch) batch',
				$where: { d_name: p.name }
			})
			.then(result => {
				let batch = result[0].batch + 1
				return query.insert({
					$table: 'department',
					did: map[p.name],
					d_name: p.name,
					batch,
				})
			})

		default: return null
	}
}

exports.fun = fun
