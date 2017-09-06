/*
* @Author: wuzitao
* @Date:   2017-07-23 22:01:56
* @Last Modified time: 2017-08-30 11:53:43
*/
import Vue from 'vue'
import Router from 'vue-router'

import Welcome from '../Welcome.vue'
import Building from '../Building.vue'
import Blank from '../components/_blank.vue'
import Login from '../components/login.vue'
import Main from '../components/main.vue'

import News from '../components/main/news.vue'
import PersonData from '../components/main/person-data.vue'
import PasswordModification from '../components/main/password-modification.vue'
import InformationProfile from '../components/main/information-profile.vue'
import InformationInput from '../components/main/information-input.vue'
import InformationManagement from '../components/main/information-management.vue'
import ArticlePublishment from '../components/main/article-publishment.vue'
import HeadimgLoad from '../components/main/headimg-upload.vue'
import Programmer from '../components/main/programmer.vue'
import ArticleManagement from '../components/main/article-management.vue'

import menu from '../assets/menu.json'
import menuMap from '../assets/menu-mapping.json'

Vue.use(Router)

const mainRoot = '/:id(\\d{10})'
// cn
export const getMenuRouter = function (rootNeed = true, title, subtitle) {
  if (typeof rootNeed !== 'boolean') {
    title = arguments[0]
    subtitle = arguments[1]
  }
  let root = rootNeed ? mainRoot : ''
  if (subtitle) return root + menu[title][subtitle].router
  return root + menu[title].router
}

export default new Router({
  // mode: 'history',
  routes: [
    {
      name: Welcome.name,
      path: '/welcome',
      component: Welcome
    },
    {
      name: Blank.name,
      path: '/_blank',
      component: Blank
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      name: Login.name,
      path: '/login',
      component: Login
    },
    {
      name: Main.name,
      path: mainRoot,
      component: Main,

      children: [
        {
          name: Building.name,
          path: mainRoot + '/',
          component: Building
        },
        {
          name: News.name,
          path: getMenuRouter(menuMap.news),
          component: News
        },
        {
          name: PersonData.name,
          path: getMenuRouter(menuMap.person),
          component: PersonData
          // meta: { keepAlive: true }
        },
        {
          name: PasswordModification.name,
          path: getMenuRouter(menuMap.person, menuMap.password),
          component: PasswordModification
        },
        {
          name: HeadimgLoad.name,
          path: getMenuRouter(menuMap.person, menuMap.headimg),
          component: HeadimgLoad
        },
        {
          name: InformationInput.name,
          path: getMenuRouter(menuMap.account, menuMap.information),
          component: InformationInput
        },
        {
          name: InformationProfile.name,
          path: getMenuRouter(menuMap.account),
          component: InformationProfile
        },
        {
          name: InformationManagement.name,
          path: getMenuRouter(menuMap.account, menuMap.maccount),
          component: InformationManagement,
          meta: { keepAlive: true }
        },
        {
          name: ArticlePublishment.name,
          path: getMenuRouter(menuMap.programmer, menuMap.publish),
          component: ArticlePublishment
        },
        {
          name: Programmer.name,
          path: getMenuRouter(menuMap.programmer),
          component: Programmer
        },
        {
          name: ArticleManagement.name,
          path: getMenuRouter(menuMap.programmer, menuMap.article),
          component: ArticleManagement
        }
      ]
    }
  ]
})
