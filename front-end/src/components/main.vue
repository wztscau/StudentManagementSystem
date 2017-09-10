<!--
  @Author: wuzitao
  @Date:   2017-08-06 21:22:17
  @Last Modified time: 2017-08-22 21:48:40
-->
<template>
  <div id="main">
    <keep-alive>
      <sidebar v-if="shown" @item-click="changeBread"></sidebar>
    </keep-alive>
    <div class="main-content">
      <div class="main-content-inner">
        <breadcrumbs :bread="breadcrumbs"></breadcrumbs>

        <div class="page-content">
          <div class="row">
            <div class="col-xs-12">
              <!-- 对routerview进行缓存 -->
              <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
              </keep-alive>
              <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Sidebar from './sidebar.vue'
  import Breadcrumbs from './breadcrumbs.vue'
  import cookieOpts from '../config/cookieOpts.js'
  import { getMenuRouter } from '../router'
  import menuMap from '../assets/menu-mapping.json'

  export default {
    name: 'main',
    data () {
      return {
        shown: false,
        breadcrumbs: []
      }
    },
    components: {
      [Sidebar.name]: Sidebar,
      [Breadcrumbs.name]: Breadcrumbs
    },
    methods: {
      removeCookies () {
        $.removeCookie(cookieOpts._name.user, cookieOpts)
        $.removeCookie(cookieOpts._name.remem, cookieOpts)
      },
      // 检查是否已经登录，未登录则返回登录页面
      loginIfEnter () {
        $('body').hide()
        // 从登录页面跳转过来就不用再查询是否登录过了
        if (this.$router.isLogin) {
          this.showFunctionality()
          this.$router.isLogin = false
          $('body').show()
          return
        }
        // 直接从地址栏输入，查询是否登录过
        $.post(this.api.session, {
            id: this.$route.params.id
          })
          .done(data => {
            // 没有登录过就返回登录页面
            if (!data.isVisit) {
              this.$router.replace('/login')
              this.showFunctionality(false)
              this.removeCookies()
            } else {
              this.showFunctionality()
              this.shown = true
            }
          })
          .fail(() => {
            // 访问失败也返回到登录页面
            this.$router.replace('/login')
          })
          .always(() => {
            $('body').show()
          })
      },
      showFunctionality (shown = true) {
        this.$parent.$refs.navbar.out = !shown
        this.shown = shown
      },
      changeBread (target) {
        this.breadcrumbs = [{
          title: target.dataset.title,
          href: target.dataset.href
        }]
      }
    },
    mounted () {
      this.loginIfEnter()
    }
  }

</script>
<style scoped>
  #main {
    margin-top: 45px;
    position: relative;
  }
  .main-content {
    background-color: #fff;
  }
  .page-header {
    position: relative;
  }
</style>