## 数据请求API
| num | api | method | params | return type | return content | description |
| :-: | :-: | :----: | :----: | :---------: | :------------: | :---------- |
| 1 | /api/login | POST | uname, pwd | Json | result\<boolean\> | 检查用户名和密码是否正确，是否为禁用 |
| 2 | /api/session | POST | id | Json | isVisit\<boolean\> | 询用户是否登录过，如登录过且session为过期，可跳过登录页面 |
| 3 | /api/permission | GET | uname | Json | name\<string\>, role\<string\> | 根据用户id查询其角色拥有的权限 |
| 4 | /api/role | GET | \<none\> | Json | role\<string\> | 从session中获取用户权限 |
| 5 | /api/pwd | POST | uname， pwd | Json | result\<boolean\> | 用户修改密码 |
| 6 | /api/person | GET | uname | Json | info\<string\> | 获取用户个人信息 |
| 7 | /api/logout | POST | uname | String | 'ok' | 用户登出 |
| 8 | /api/add-user | POST | info\<json\> | Json | result\<boolean\> | 注册新用户信息 |
| 9 | /api/check-id | GET | id | Json | isExist\<boolean\> | 检查身份证号是否存在，存在则不能新增该用户 |
| 10 | /api/get-user-info | GET | [columns] | Array | result | 得到用户信息，参数用于获取特定的信息，不填则获取所有信息 |
| 11 | /api/modify-user | POST | uname, set\<json\> | Json | result\<boolean\> | 修改一个用户信息 |
| 12 | /api/disable-user | POST | uname | Json | result\<boolean\> | 禁用一个用户 |
| 13 | /api/add-article | POST | uname, title, content, summary, sort_name | Json | result\<boolean\> | 新增或修改一篇文章 |
| 14 | /api/upload-img | POST | uname, base64 | Json | result\<boolean\> | 上传用户头像 |
| 15 | /api/get-article | GET | \<none\> | Array | result | 得到所有的用户文章 |
| 16 | /api/get-personal-article | GET | uname | Array | [result\<array\>, [sumClick\<number\>, countArticle\<number\>]] | 得到指定用户的所有文章信息和总访问量、总发表文章数 |
| 17 | /api/add-visit | POST | uname, title | String | 'ok' | 为指定的文章新增一个访问记录 |
| 18 | /api/my-article | GET | uname | Array | result | 得到该用户的所有文章 |
| 19 | /api/del-my-article | POST | uname, title | Json | result\<boolean\> | 删除用户指定的文章 |
| 20 | /api/get-department-info | GET | \<none\> | Array | result | 得到所有的部门信息 |
| 21 | /api/add-department-batch | POST | name | Json | result\<boolean\> | 增加一个指定部门的批数 |
| 22 | /api/push-to-top | POST | name, title, up | Json | result\<boolean\> | 将一篇指定的文章置顶 |
## 数据库CRUD API
### INSERT
usage: new BaseDao().insert(settings)

| setting | type | extras | sample |
| :-----: | :--: | :----: | :----: |
| $table | String | \<none\> | $table: 'tableName' |
| [anykey] | String/Number/Boolean | \<none\> | uname: 'zhangsan', age: 12 |
### SELECT
usage: new BaseDao().select(settings)

| setting | type | extras | sample |
| :-----: | :--: | :----- | :----- |
| $table | String/Array | name\<string\>, join\<string\>, on\<object,string\><br>on: {<br>table\<string\>, value\<string\>, prevValue\<string\><br>} | $table: 'tableName'<hr>$table: [{<br>name: 'tableName1'<br>}, {<br>name: 'tableName2',<br>on: {<br>table: 'otherTableName',<br>value: 'id',<br>prevValue: 'name'<br>}<br>}] |
| $where | Object/Array | name\<string\>, value\<string\>, relation\<string\>, compare\<string\>, forceText\<boolean\> | $where: {<br>name: 'zhangsan'<br>}<hr>$where: [{<br>name: 'name', value: 'zhangsan'}, {<br>name: 'id', value: '123', relation: 'and'<br>}] |
| $order_by | String/Object/Array | value\<string\>, by\<string\> | $order_by: 'id'<hr>$order_by: {<br>value: 'id',by: 'asc'<br>}<hr>$order_by: [{<br>value: 'id',by: 'desc'<br>},{<br>value: 'name', by: 'asc'<br>}] |
| $group_by | String/Array | \<none\> | $group_by: 'department'<hr>$group_by: ['department', 'article'] |
| $limit | Number/Array | \<none\> | $limit: 5<hr>$limit: [2,5] |
### UPDATE
usage: new BaseDao().update(settings)

| setting | type | extras | sample |
| :-----: | :--: | :----: | :----: |
| $table | String | \<none\> | $table: 'tableName' |
| $set | Object | [anykey]: [anyvalue] | $set: {name: 'zhangsan'} |
| $where | !! saw $where in SELECT | !! saw $where in SELECT | !! saw $where in SELECT |
### DELETE
usage: new BaseDao().delete(settings)

| setting | type | extras | sample |
| :-----: | :--: | :----: | :----: |
| $table | String | \<none\> | $table: 'tableName' |
| $where | !! saw $where in SELECT | !! saw $where in SELECT | !! saw $where in SELECT |
