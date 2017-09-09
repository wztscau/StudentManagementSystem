# 学生管理系统（Node+Vue前后端分离的spa）
## 项目介绍

## 开发环境
Nodejs6.0.1 + Vue-cli2.8.2 + Sublime text3 + Webpack2.6.1 + Nginx1.12.1 + MySQL Server5.7

## 框架及插件
#### 前端：
- vue-cli: 搭建vue环境的脚手架工具
- webpack: 模块化项目的打包工具
- jquery: 主要用到其进行DOM操作和ajax
- boostrap: 响应式样式框架
- font-awesome: 一套绝佳的图标字体库和CSS框架
- cropper: 基于jquery的图片裁剪插件

#### 后端：
- express: 一个简洁而灵活的 node.js Web应用框架
- express-session: 本来是express中的一部分，4.0之后将很多模块独立出去
- bluebird: 便于异步编程的Promise集成工具，可为fs类似的包含大量异步操作的模块提供promise操作
- mysql: 用于node连接mysql数据库的模块

## 功能模块

## 填过的坑
1. **前端服务器访问后端服务器的跨域问题**

	第一种解决方式： 后端服务器上设置`res.setHeader("Access-Control-Allow-Origin", 前端地址)`,获得跨域权限，但是这种方式有个缺陷，req.session在后端拿不到。
 
	第二种解决方式： 前端服务器上在config -> index.js上设置dev -> proxyTable: `{ '/api': { target: 后端地址, changeOrigin: true } }`, 提供一个完整的转发接口就可以完成前后端的通信。
 
2. **import boostrap找不到jquery的问题**

	原因是webpack打包过程中只识别jquery，不识别jQuery或$之类的写法，因此需要在build -> webpack.dev.conf中加入`new webpack.ProvidePlugin({ jQuery: 'jquery', $: 'jquery', 'window.jQuery': 'jquery' })`
 
3. **父组件向子组件传递对象数组且在子组件内修改数据并将结果返回给父组件的问题**

	众所周知，vue2.0开始规定了子组件不能直接修改从父组件接收的prop，但是同时我们又想在子组件内修改其中的一些属性，以达到更新绑定在子组件上一些数据的目的，这就有点矛盾了。于是我想到一个方法既可以在不改变父组件数据的情况下修改从父组件传下来的数据。这里只对 **对象数组（数组中只存放对象）** 进行分析。

	1. 子组件修改从父组件传下来的数据而不改变父组件原本的数据

		首先在子组件中获得父组件传下来的一份克隆数组（一般是直接接收，如果是从网络读数据则需要watch），而且数组中的对象全部需要克隆一份

	2. 子组件中的对象数组中的元素顺序发生改变，如何在父组件中获得原来那个对象的坐标？

		在将数组中对象克隆的时候为对象新增一个内置属性_originIndex，这样不管数组顺序如何改变，只要获得该对象就可以获得其原本的坐标，然后就可以将_originIndex，emit给父组件，让父组件获得对应的对象
		
4. **router-view不能响应@click事件，如果想在上面使用click事件，还是要用回\<a\>标签，click事件中实现$router的跳转**

5. **router-view无法自主刷新，只能折衷于先跳转到一个空白路由_blank，再跳回来当前路由**

6. **数据刷新后立刻对DOM进行访问的问题**
	
	在数据刷新后，vue会对组件立即进行重新渲染，但是渲染需要一定的时间，如果在渲染完成之后立刻对DOM进行访问（如jQuery的查询），会得不到该DOM，因此需要加上vm.$nextTick(callback)，然后对DOM的操作和访问都在callback里面完成
	
7. **vue实例里面的data中的对象通过增加属性不能响应的问题**

	由于vue的限制，直接通过对数组的下标或增加对象上的方法改变值不能得到预期的效果，view得不到更新。vue1.x可以用vm.$set方法解决该问题，但是自2.0以后便不支持该形式，因此比较好的解决方法是先声明data的对象的所有属性，然后改变值的时候就能够得到响应。
	
8. **post请求的数据接收以及413错误**

	在node中，在默认设置下，是不能获得post的请求数据的，需要引入body-parser模块以及设置express.use({ bodyParser.urlecoded({ extended: true }) })。而且默认情况下，过大的数据请求会被服务器拒绝，可以有两种方法解决：
	1. 设置bodyParser.urlencoded({ limit: 最大请求体如'5mb' })
	2. 使用Nginx反向代理服务器设置client_max_body_size最大请求体

## 待改进地方
- 需要尽量减少对DOM的操作，尽管有些复杂的DOM需要用到jQuery去完成，不过能用数据驱动的view尽量用vue实现。而且vue中的事件不能被jQuery克隆，应该还是谨慎在vue中使用jQuery
- 组件间的数据和事件传递（父与子、兄弟之间、隔代之间）在一个项目中应该得到很好的控制。如果项目越做越大，组件间的操作会变得越来越难管理。vue在这方面做得有显不足，因此需要用到vuex来对大型应用进行管理，比如侧边栏和各个页面的对应关系等
- 在缓存方面上做得工夫不足，应该增强在服务器上对用户信息的缓存（使用session缓存用户信息），以及在本地对不容易变化的数据进行缓存，减少对网络的请求次数
