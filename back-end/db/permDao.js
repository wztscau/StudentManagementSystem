/*
* @Author: wuzitao
* @Date:   2017-08-12 22:59:03
* @Last Modified time: 2017-08-15 19:08:43
*/

'use strict'
const BaseDao = require('./baseDao.js')

module.exports = function (p) {
	const query = new BaseDao()

	return query.select({
		$table: 'user',
		$column: 'role',
		$where: [
			{ name: 'uid', value: p.uname }
		]
	})
	.then(result => {
		if (!result.length) return []
		return query.select({
			$column: ['perm_names', 'perm_role'],
			$table: 'permission',
			$where: [
				{ name: 'perm_role', value: result[0].role }
			]
		})
	})
}