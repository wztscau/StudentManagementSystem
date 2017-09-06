/*
* @Author: wuzitao
* @Date:   2017-08-25 16:23:38
* @Last Modified by:   wuzitao
* @Last Modified time: 2017-09-05 15:51:23
*/
const BaseDao = require('./baseDao')
const Promise = require('bluebird')
const u = require('../util/util')

const fun = {
	add: 'add_article',
	getall: 'get_all_articles',
	getperson: 'get_personal_artical',
	visit: 'add_visitor',
	my: 'get_my_articles',
	del: 'delete_my_article',
	top: 'push_article_to_top'
}

exports = module.exports = function (f, p) {
	const query = new BaseDao()

	let $where = [
		{ name: 'article_title', value: p.title },
		{ name: 'user_id', value: p.uname, relation: 'and' },
	]

	switch (f) {
		case fun.add:
			
			return query.select({
				$table: 'article',
				$where
			})
			.then(result => {
				// 更新或新增
				if (result.length) {
					return query.update({
						$table: 'article',
						$set: { article_content: p.content, article_summary: p.summary,
							sort_name: p.sort_name,
							publish_time: new Date().format('yyyy-MM-dd hh-mm-ss')
						},
						$where
					})
				}
				return query.insert({
					$table: 'article',
					article_title: p.title,
					article_content: p.content,
					article_summary: p.summary,
					sort_name: p.sort_name,
					user_id: p.uname
				})
			})

		case fun.getall:
			return query.select({
				$table: [
					{ name: 'article' },
					{ name: 'baseinfo', on: {
						value: 'uid',
						prevValue: 'user_id'
					}}
				],
				$column: ['article_content', 'article_title', 'article_summary', 'publish_time', 'click', 'sort_name', 'up', 'head', 'realname', 'article.user_id id'],
				$order_by: [
					{ value: 'up', by: 'desc' },
					{ value: 'publish_time', by: 'desc' }
				]
			})

		case fun.getperson:
			// 联表查询
			const $table = [
				{ name: 'article' },
				{ name: 'baseinfo', on: {
					value: 'uid',
					prevValue: 'user_id'
				}},
			]
			return query.select({
				$table,
				$column: ['article_content', 'head', 'click'],
				$where: [
					{ name: 'user_id', value: p.uname },
					{ name: 'article_title', value: p.title, relation: 'and' }
				]
			})
			.then(result1 => {
				return new Promise(resolve => {
					query.select({
						$table,
						$column: ['sum(click) sumClick', 'count(*) countArticle'],
						$where: { user_id: p.uname }
					})
					.then(result2 => {
						resolve([result1, result2]) // 需要将两个结果合并
					})
				})
			})

		case fun.visit:
			return query.select({
				$table: 'article',
				$column: 'click',
				$where
			})
			.then(result => {
				let click = result[0].click
				return query.update({
					$table: 'article',
					$set: { click: click + 1 },
					$where
				})
			})

		case fun.my:
			return query.select({
				$table: 'article',
				$column: ['article_content', 'article_title', 'article_summary', 'publish_time', 'click', 'sort_name', 'up'],
				$where: { user_id: p.uname },
				$order_by: { value: 'publish_time', by: 'desc' }
			})

		case fun.del:
			return query.delete({
				$table: 'article',
				$where: [
					{ name: 'user_id', value: p.uname },
					{ name: 'article_title', value: p.title, relation: 'and' }
				]
			})

		case fun.top:
			return query.update({
				$table: 'article',
				$set: { up: Number(p.up) },
				$where: [
					{ name: 'user_id', value: p.uname },
					{ name: 'article_title', value: p.title, relation: 'and' }
				]
			})

		default: return null
	}
}
exports.fun = fun
