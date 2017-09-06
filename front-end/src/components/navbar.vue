<!--
  @Author: wuzitao
  @Date:   2017-08-06 18:34:11
  @Last Modified time: 2017-08-20 02:17:57
-->
<template>
	<div class="navbar navbar-default" id="navbar">
    <div class="navbar-container">
      <button type="button" class="navbar-toggle menu-toggler pull-left" id="menu-toggler" data-target="#sidebar" v-if="!out"
      @click.stop="showSidebar">
        <span class="sr-only">Toggle sidebar</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <!-- left -->
      <div class="navbar-header pull-left">
        <a href="/" class="navbar-brand">
          <small>
            <i class="fa fa-leaf"></i>
            学生管理系统
          </small>
        </a>
      </div>
      <!-- right -->
      <button class="my-right btn btn-inverse" v-if="!out"
        @click="signOut()">
        <i class="ace-icon fa fa-sign-out bigger-150"></i>
        登出
      </button>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import toast from '../utils/toast.min.js'
  import s from '../assets/strings.json'

	export default {
		name: 'navbar',
    data () {
      return {
        out: true
      }
    },
    methods: {
      showSidebar () {
        $(function ($) {
          $('#menu-toggler').toggleClass('display')
          $('#sidebar').toggleClass('display')
        })
      },
      signOut () {
        $.post(this.api.logout, { uname: this.getId() })
          .done(data => {
            if (data === 'ok') {
              this.$router.replace('/login')
              this.out = true
            }
          })
      }
    }
	}
</script>

<style scoped>
	#navbar {
		height: 45px;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1250;
	}
  .my-right {
    position: absolute;
    right: 0;
    top: 0;
  }
  button.my-right:hover i {
    animation: right 1s;
  }
  @keyframes right {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(10px);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>