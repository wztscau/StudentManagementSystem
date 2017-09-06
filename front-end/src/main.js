/*
* @Author: wuzitao
* @Date:   2017-07-23 22:01:56
* @Last Modified time: 2017-09-05 14:29:04
*/
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import $ from 'jquery'
import App from './App'
import router from './router'
import store from './store'
import api from '../../back-end/config/api.json'
import ajaxSetup from './config/ajaxSetup'

require('./assets/ace-master/css/bootstrap.min.css')
require('./assets/ace-master/font-awesome/4.5.0/css/font-awesome.min.css')
require('./assets/ace-master/css/ace.min.css')
require('./assets/ace-master/css/ace-skins.min.css')
require('./assets/ace-master/js/markdown.min.js')
require('./assets/ace-master/js/bootstrap-markdown.min.js')

'use strict'

Vue.config.productionTip = false
Vue.prototype.api = api // api转发接口
$.ajaxSetup(ajaxSetup) // $.ajax全局设置

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

$($ => {
	$(document).on('click', function (event) {
		$('[data-rel=popover]').popover('hide')
	})
})
