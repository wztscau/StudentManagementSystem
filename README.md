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
- express： 一个简洁而灵活的 node.js Web应用框架
- bluebird： 便于异步编程的Promise集成工具，可为fs类似的包含大量异步操作的模块提供promise操作
- mysql： 用于node连接mysql数据库的模块

## 功能模块

## 填过的坑
1. **前端服务器访问后端服务器的跨域问题**

    第一种解决方式： 后端服务器上设置`res.setHeader("Access-Control-Allow-Origin", 前端地址)`,获得跨域权限，但是这种方式有个缺陷，req.session在后端拿不到。
 
    第二种解决方式： 前端服务器上在config -> index.js上设置dev -> proxyTable: `{ '/api': { target: 后端地址, changeOrigin: true } }`, 提供一个完整的转发接口就可以完成前后端的通信。
 
2. **import boostrap找不到jquery的问题**

    原因是webpack打包过程中只识别jquery，不识别jQuery或$之类的写法，因此需要在build -> webpack.dev.conf中加入`new webpack.ProvidePlugin({ jQuery: 'jquery', $: 'jquery', 'window.jQuery': 'jquery' })`
 
3. 父组件向子组件传递对象数组且在子组件内修改数据并将结果返回给父组件的问题

    众所周知，vue2.0开始规定了子组件不能直接修改从父组件接收的prop，但是同时我们又想在子组件内修改其中的一些属性，以达到更新绑定在子组件上一些数据的目的，这就有点矛盾了。于是我想到一个方法既可以在不改变父组件数据的情况下修改从父组件传下来的数据。这里只对 **对象数组（数组中只存放对象）** 进行分析。
  1. 子组件修改从父组件传下来的数据而不改变父组件原本的数据

    首先在子组件中获得父组件传下来的一份克隆数组（一般是直接接收，如果是从网络读数据则需要watch），而且数组中的对象全部需要克隆一份

  2. 子组件中的对象数组中的元素顺序发生改变，如何在父组件中获得原来那个对象的坐标？

    在将数组中对象克隆的时候为对象新增一个内置属性_originIndex，这样不管数组顺序如何改变，只要获得该对象就可以获得其原本的坐标，然后就可以将_originIndex，emit给父组件，让父组件获得对应的对象

## 待改进地方
