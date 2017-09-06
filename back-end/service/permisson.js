/*
* @Author: wuzitao
* @Date:   2017-08-12 23:05:00
* @Last Modified time: 2017-09-05 16:30:32
*/

'use strict';

module.exports = function Permisson (req, res) {
	const query = require('../db/permDao.js')
	
	this.get = pms => {
		query({ uname: pms.uname })
			.done(result => {
				if (!result.length) res.send('')
				else {
					let row = result[0]
					req.session.role = row.perm_role
					console.log(req.session)
					res.send({ name: row.perm_names, role: row.perm_role })
				}
			})
		return this
	}
}