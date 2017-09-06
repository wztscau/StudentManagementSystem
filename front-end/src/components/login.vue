<!--
  @Author: wuzitao
  @Date:   2017-08-05 22:12:39
  @Last Modified time: 2017-08-20 02:25:38
-->
<template>
  <div id="login" class="login-layout">
    <div class="main-container">
      <div class="main-content">
        <div class="row">
          <div class="col-sm-10 col-sm-offset-1">
            <div class="login-container">

              <div class="space-6"></div>

              <div class="position-relative">
                <div id="login-box" class="login-box visible widget-box no-border">
                  <div class="widget-body">
                    <div class="widget-main">
                      <h4 class="header blue lighter bigger">
                        <i class="fa fa-coffee green"></i>
                        登录管理系统
                      </h4>

                      <div class="space-6"></div>

                      <form role="form">
                        <fieldset>
                          <label class="block clearfix">
                            <span class="block input-icon input-icon-right">
                              <input id="uname" type="text" class="form-control" placeholder="请输入用户名"
                              data-rel="popover" data-content="用户名不能为空" data-placement="bottom"
                              v-model.trim="uname"
                              @keyup.enter="login"/>
                              <i class="ace-icon fa fa-user"></i>
                            </span>
                          </label>

                          <label class="block clearfix">
                            <span class="block input-icon input-icon-right">
                              <input id="pwd" type="password" class="form-control" placeholder="请输入密码"
                              data-rel="popover" data-content="密码不能为空" data-placement="bottom"
                              v-model.trim="pwd"
                              @keyup.enter="login"/>
                              <i class="ace-icon fa fa-lock"></i>
                            </span>
                          </label>

                          <div class="space"></div>

                          <div class="clearfix">
                            <label class="inline">
                              <input type="checkbox" class="ace" ref="remem"/>
                              <span class="lbl"> 记住密码</span>
                            </label>

                            <label class="inline">
                              <input type="checkbox" class="ace" ref="visitor"/>
                              <span class="lbl"> 访客</span>
                            </label>
                            
                            <button type="button" class="width-35 pull-right btn btn-sm btn-primary"
                              @click.stop="login">
                              <i class="fa fa-key"></i>
                              登录
                            </button>
                          </div>

                          <div class="space-4"></div>
                        </fieldset>
                      </form>
<!-- end -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="alert-login" class="alert alert-danger">
      <strong>
        请先登录！
      </strong>
      <br>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import 'jquery.cookie'
  import 'bootstrap'
  import crypto from 'crypto'

  import s from '../assets/strings.json'
  import toast from '../utils/toast.min.js'
  import cookieOpts from '../config/cookieOpts.js'
  import cryption from '../utils/cryption.js'

  export default {
    name: 'login',
    data () {
      return {
        uname: this.getUserInfo(0),
        pwd: this.getUserInfo(1)
      }
    },
    methods: {
      login () {
        let checked = this.$refs.visitor.checked
        // 不允许填空信息
        if (this.dealEmptyMsg() && !checked) {
          return
        }
        // 访客模式
        if (checked) {
          this.uname = '1234567890'
          this.pwd = '123456'
        }
        // 提交
        $.post(this.api.login, {
            uname: this.uname,
            pwd: cryption.md5(this.pwd)
          })
          .done(data => {
            if (data.result) {
              if (this.$refs.remem.checked) {
                this.saveCookies()
              } else {
                this.removeCookies()
              }
              this.$router.isLogin = true // 指明是由登录页面转过去而不是从地址栏输入的
              this.$router.push('/' + this.uname)
            } else {
              toast(s['wrong-password-disabled'])
            }
          })
      },
      dealEmptyMsg () {
        if (this.uname === '') {
          $('#uname').popover('show')
          return true
        }
        if (this.pwd === '') {
          $('#pwd').popover('show')
          return true
        }
        return false
      },
      saveCookies (uname, pwd) {
        $.cookie(cookieOpts._name.user,
          cryption.aes(cryption.aes(this.uname) + '&' + cryption.aes(this.pwd)))
        $.cookie(cookieOpts._name.remem, this.$refs.remem.checked, cookieOpts)
      },
      removeCookies () {
        $.removeCookie(cookieOpts._name.user, cookieOpts)
        $.removeCookie(cookieOpts._name.remem, cookieOpts)
      },
      getUserInfo (index) {
        let cookie = $.cookie(cookieOpts._name.user)
        if (!cookie) return ''
        return cryption.deaes(cryption.deaes(cookie).split('&')[index])
      },
      autoLogin () {
        $.post(this.api.session, {
            id: this.getUserInfo(0)
          })
          .done(data => {
            // 登录过就跳到主页面
            if (data.isVisit) {
              this.$router.push('/' + this.getUserInfo(0))
            }
          })
          .catch(() => {
            $showAlert() // 异常就发出警告
          })
      }
    },
    mounted () {
      this.autoLogin()
      this.$refs.remem.checked = $.cookie('remem') || false
    }
  }

  function $showAlert () {
    $('#alert-login').css('top', '0')
    $(document).click(function (e) {
      $('#alert-login').css('top', '-53px')
    })
  }

</script>

<style>
  #login {
    height: 0;
    margin-top: 16rem;
  }
  #alert-login {
    position: fixed;
    top: -53px;
    left: calc(50% - 50px);
    width: 100px;
    white-space: nowrap;
    transition: top 1s;
    z-index: 5555;
  }
</style>