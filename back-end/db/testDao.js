const query = require('./baseDao');

let sql = 'select $column from $table';
	let obj = {
		$column: '*',
		$table: 'test_user',
		$where: [
			{
				name: 'uid',
				value: 00000000,
			},
			// [{
			// 				name: 'id',
			// 				value: '1',
			// 				relation: 'or'
			// 			},
			// 			{
			// 				name: 'sex',
			// 				value: '男',
			// 				relation: 'AND'
			// 			}],
		],
		// $order_by: [
		// 	{
		// 		value: 'id'
		// 	}
		// ],
	}

	let selectobj2 = {
		$column: '*',
		$table: 'test',

	}
	let insertObj = {
		$table: 'test',
		name: 'yuanmeiqi',
		sex: '女'
	}
	let insertObj2 = {
		$table: 'test_user',
		uid: '20170525',
		pwd: '女'
	}
query.begin();
// query.begin();

// query.insert(insertObj, function a1() {
// 	// console.log(arguments)
// });
// query.insert(insertObj2, function () {
// 	console.log(arguments)
// });
query.select(obj, function a2(argument) {
	// console.log('prev')
	console.log(arguments)
});

// query.select(selectobj2, function (argument) {
// 	// console.log(arguments)
// });

// query.end();
// query.end();


// query.insert(insertObj, function (argument) {
// 	console.log(arguments)
// })

let updateObj = {
	$table: 'test',
	$set: {
		name: 'wuzitao',
		sex: '女',
	},
	$where: [
		{
			name: 'id',
			value: '19'
		}
	],
}

	// query.update(updateObj, function a3(argument) {
	// 	console.log(arguments)
	// })
	// query.update(updateObj, function (argument) {
	// 	console.log(arguments)
	// })

let deleteObj = {
	$table: 'test',
	$where: [
		{
			name: 'id',
			value: '19',
		}
	],
}

	// query.delete(deleteObj, function (argument) {
	// 	console.log(argument)
	// })
query.end();

router.get('/test', (req, res) => {
	const {tableJoinOn} = require('../db/baseDao.js')
	const BaseDao = require('../db/baseDao.js')
	const baseDao = new BaseDao()
	let args = {
		$table: [
			{ name: 'baseinfo'},
			{ 
				name: 'user', on: {
					table: 'baseinfo',
					value: 'uid',
					prevValue: 'uid'
				} 
			}
		],
		$order_by: 'baseinfo.uid'
	}
	baseDao.select(args)
		.then(result => {
			res.send(result)
		})
})