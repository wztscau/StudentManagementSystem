/*
* @Author: wuzitao
* @Date:   2017-08-14 13:25:39
* @Last Modified time: 2017-08-15 22:39:46
*/
import Vue from 'vue'
import Vuex from 'vuex'
import personData from '../components/main/person-data.vue'
import navbar from '../components/navbar.vue'

Vue.use(Vuex)
export default new Vuex.Store({
	modules: {
		navbar
	}
})
