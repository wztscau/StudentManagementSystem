<!--
  @Author: wuzitao
  @Date:   2017-08-11 16:09:19
  @Last Modified time: 2017-08-14 14:14:35
-->
<template>
  <div class="breadcrumbs ace-save-state" id="breadcrumbs">
    <ul class="breadcrumb">
      <li v-for="elem,index of mBread"
        :class="{ active: index === mBread.length-1 }"
        >
        <i class="ace-icon fa fa-home home-icon" v-if="index === 0"></i>
        <router-link v-if="index !== mBread.length-1"
          :to="elem.href"
          >
          {{ elem.title }}
        </router-link>
        <span v-if="index === mBread.length-1">{{ elem.title }}</span>
        </li>
    </ul><!-- /.breadcrumb -->

    <div class="nav-search" id="nav-search">
      <form class="form-search">
        <span class="input-icon">
          <input type="text" placeholder="查找功能..." class="nav-search-input" id="nav-search-input" autocomplete="off" v-model="search"
          @keydown.down.prevent="moveActive(1)"
          @keydown.up.prevent="moveActive(-1)"
          @keyup.enter.prevent="toRouter(menu[currActiveIndex])">
          <ul class="typeahead dropdown-menu" style="top: 28px; left: 0px;"
            :style="{ display: menu.length ? 'block' : 'none'}">
            <li :data-value="entry" v-for="entry,index of menu"
              :class="{ active: currActiveIndex === index }"
              @mouseover="currActiveIndex = index">
              <a @click="toRouter(entry)">
                {{ getForeSearch(entry) }}<strong>{{ search }}</strong>{{ getBackSearch(entry) }}
              </a>
            </li>
          </ul>
          <i class="ace-icon fa fa-search nav-search-icon"></i> 
        </span>
      </form>
    </div><!-- /.nav-search -->
  </div>
</template>

<script>
  import menuMap from '../assets/menu-mapping.json'

  const menus = (function () {
    return Object.keys(menuMap).map(key => {
      return menuMap[key]
    })
  })()

  export default {
    name: 'breadcrumbs',
    props: {
      bread: Array
    },
    data () {
      return {
        search: '',
        searchShown: false,
        currActiveIndex: 0
      }
    },
    methods: {
      getIndexOfSearch (val, tail) {
        return val.indexOf(this.search) + (tail ? this.search.length : 0)
      },
      getForeSearch (val) {
        return val.substring(0, this.getIndexOfSearch(val))
      },
      getBackSearch (val) {
        return val.substring(this.getIndexOfSearch(val, true), val.length)
      },
      toRouter (routeName) {
        this.changeTab(routeName)
        // 重置
        this.menu.splice(0, this.menu.length)
        this.search = ''
        this.currActiveIndex = 0
      },
      moveActive (direction) {
        this.currActiveIndex = direction > 0 ? this.currActiveIndex + 1 : this.currActiveIndex - 1
        ;(this.currActiveIndex < 0) && (this.currActiveIndex = this.menu.length - 1)
        ;(this.currActiveIndex > this.menu.length - 1) && (this.currActiveIndex = 0)
      }
    },
    computed: {
      mBread () {
        return [{ title: '首页', href: this.getRootPath() + '/news' }].concat(this.bread)
      },
      menu () {
        return menus.filter(el => {
          return this.search && el.includes(this.search)
        })
      }
    }
  }
</script>
  
<style scoped>
  a {
    cursor: pointer;
  }
</style>