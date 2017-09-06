<!--
  @Author: wuzitao
  @Date:   2017-07-23 22:01:56
  @Last Modified time: 2017-08-30 10:58:55
-->
<template>
  <div id="app">
    <navbar ref="navbar"></navbar>
    <waiter ref="waiter"></waiter>
    <confirm-dialog></confirm-dialog>
    <back-to-top></back-to-top>
    <router-view></router-view>
  </div>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import Navbar from './components/navbar.vue'
  import Waiter from './components/waiter.vue'
  import ConfirmDialog from './components/widget/confirm-dialog.vue'
  import BackToTop from './components/back-to-top.vue'

  export default {
    name: 'app',
    components: {
      [Navbar.name]: Navbar,
      [Waiter.name]: Waiter,
      [ConfirmDialog.name]: ConfirmDialog,
      [BackToTop.name]: BackToTop
    },
    methods: {
      queryToString (query) {
        let str = '?'
        for (let key in query) {
          str += key + '=' + query[key] + '&'
        }
        str.replace(/&$/, '')
        return str.replace(/&$/, '')
      }
    },
    beforeCreate () {
      let self = this
      // vue全局方法注册
      Vue.prototype.changeTab = function (title, method, query) {
        // 重载
        if ($.isPlainObject(method)) {
          query = method
          method = 'replace'
        }
        let href = $(`[data-title="${title}"]`).parents('.nav').find('li').removeClass('active')
          .end().end().addClass('active')
          .parents('.submenu').slideDown('fast')
          .end().attr('data-href')
        this.$router[method || 'replace'](href + self.queryToString(query))
      }
      Vue.prototype.getRootPath = function () {
        const regRootPath = /(^\/.*?)(\/|$)/
        return this.$route.path.match(regRootPath)[1]
      }
      Vue.prototype.getId = function () {
        return this.$route.params.id
      }
      Vue.prototype.refresh = function (query) {
        this.$router.replace('/_blank' + self.queryToString(Object.assign({
          origin: this.$route.path
        }, query)))
      }
      Vue.prototype.onImgError = function (e) {
        e.target.src = require('./assets/img/nopic.jpg')
      }
      // 初始化__role，避免空指针异常
      Object.getPrototypeOf(Object.getPrototypeOf(this)).__role__ = ''
      Vue.prototype.__getRole__ = function () {
        return $.get(this.api.role)
          .then(data => {
            return (Object.getPrototypeOf(Object.getPrototypeOf(this)).__role__ = data.role)
          })
      }
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
