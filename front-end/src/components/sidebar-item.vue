<!--
  @Author: wuzitao
  @Date:   2017-08-12 17:49:36
  @Last Modified time: 2017-08-22 21:18:05
-->
<template>
  <li @click.stop="expand($event)" :data-title="control.title" :data-href="toRouter">
    <router-link :to="toRouter">
      <i class="menu-icon fa"
        :class="[ 'fa-'+control.ico, { 'fa-caret-right': control.ico === undefined } ]"></i>
      <span class="menu-text">
        {{ control.title }}
      </span>

      <b class="arrow fa fa-angle-down" v-if="hasSub"></b>
    </router-link>

    <b class="arrow"></b>

    <ul class="submenu" v-if="hasSub" style="display: none;">
      <!-- emit again -->
      <sidebar-item @item-click="emit"
        v-for="subcontrol,index of control.children" :control="subcontrol" :key="index">
      </sidebar-item>
    </ul>
  </li>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'sidebar-item',
    props: {
      control: Object
    },
    computed: {
      hasSub () {
        return this.control.children && this.control.children.length
      },
      toRouter () {
        return this.getRootPath() + this.control.router || ''
      }
    },
    methods: {
      // 滑出菜单
      expand (event) {
        let target = event.currentTarget
        $(target).parents('.nav').find('li').removeClass('active') // other li
        $(target).addClass('active') // this
          .children('.submenu').slideDown('fast') // this submenu
          .end().siblings('li').children('.submenu').slideUp('fast') // other submenu

        this.emit(target)
      },
      emit (target) {
        this.$emit('item-click', target)
      }
    },
    data () {
      return {

      }
    }
  }
</script>
  
<style scoped>
  
</style>