<!--
  @Author: wuzitao
  @Date:   2017-08-10 15:46:31
  @Last Modified time: 2017-08-22 21:18:10
-->
<template>
  <div id="sidebar" class="sidebar responsive ace-save-state" data-sidebar="true" data-sidebar-scroll="true" data-sidebar-hover="true"
    @click.stop>

        <div class="sidebar-info">
          <img :src="info.head" class="user-head img-circle pull-left" width="40" height="40" @error="onImgError($event)"/>
          <div class="bigger-130">{{ info.name }}</div>
          <div>{{ info.role }}</div>
        </div>

        <ul class="nav nav-list">
          <sidebar-item v-for="control,index of controls"
            :control="control"
            :key="index"
            @item-click="itemClick">
          </sidebar-item>
        </ul><!-- /.nav-list -->

        <div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
          <i id="sidebar-toggle-icon" class="ace-icon fa fa-angle-double-left ace-save-state"
            @click="toggleMenu()"></i>
        </div>
      </div>
</template>

<script>
  import $ from 'jquery'
  import SideBarItem from './sidebar-item.vue'
  import menu from '../assets/menu.json'

  export default {
    name: 'sidebar',
    components: {
      [SideBarItem.name]: SideBarItem
    },
    data () {
      return {
        controls: [],
        info: { head: '', name: '', role: '' }
      }
    },
    methods: {
      // 滑出 / 折叠侧边栏
      toggleMenu () {
        $(event.currentTarget).toggleClass('fa-angle-double-left fa-angle-double-right')
          .parents('#sidebar').toggleClass('menu-min')
      },
      parseMenuFuns (str) {
        let arr = str.split('&')
        let retArr = []
        for (let i = 0, len = arr.length; i < len; i++) {
          let items = arr[i].split('.')
          let obj = { children: [] }

          if (items[1]) {
            for (let j = 0; j < i; j++) {
              if (retArr[j].title === items[0]) {
                retArr[j].children.push({ title: items[1] })
                break
              }
            }
          } else {
            obj.title = items[0]
            retArr.push(obj)
          }
        }
        return retArr
      },
      addExtraMenuMessage (data) {
        function set (elem, child) {
          for (let key in menu) {
            // 设置父路由和图标
            let entry = menu[key]
            if (elem.title === key) {
              elem.ico = entry.ico
              elem.router = entry.router
            }
            // 设置子路由
            child && child(entry)
          }
        }
        return data.map(elem => {
          if (elem.children && elem.children.length) {
            elem.children = elem.children.map(subelem => {
              set(elem, (entry) => {
                let subentry = entry[subelem.title]
                if (subentry) {
                  subelem.router = subentry.router
                }
              })
              return subelem
            })
          } else {
            set(elem)
          }

          return elem
        })
      },
      getMenuFuns () {
        $.get(`${this.api.permission}?uname=${this.getId()}`)
          .done(data => {
            this.controls = this.addExtraMenuMessage(this.parseMenuFuns(data.name))
            this.info.role = data.role
            this.renderFinished = true

            this.initTab()
          })
      },
      initUserInfo () {
        $.get(this.api.person, { uname: this.getId() })
          .done(data => {
            this.info.head = data.info.head || 'not found'
            this.info.name = data.info.realname
          })
      },
      itemClick (data) {
        // 传上去
        this.$emit('item-click', data)
      },
      initTab () {
        if (this.$route.path === this.getRootPath()) {
          this.$nextTick(() => {
            this.changeTab('最新动态')
          })
        }
      }
    },
    mounted () {
      this.getMenuFuns()
      this.initUserInfo()
      $element()
    }
  }

  function $hideSidebar () {
    if ($('#menu-toggler').is(':visible')) {
      $(document).click(function (e) {
        $('#sidebar').removeClass('display')
        $('#menu-toggler').removeClass('display')
        $('#sidebar-toggle-icon').addClass('fa-angle-double-right')
      })
    }
  }

  function $element () {
    $hideSidebar()
    // 收起侧边栏,因为要监听menu-toggler的动态变化,只能监听window的宽高变化
    $(window).on('resize', e => {
      $hideSidebar()
    })
  }

</script>
  
<style scoped>
  .sidebar.responsive {
    z-index: 20;
  }
  .sidebar.responsive,
  .sidebar:before {
    position: fixed;
  }
  .sidebar-info {
    color: #bac2c8;
    padding: 10px 15px 10px 7px;
  }
  .user-head {
    margin-right: 1rem;
  }
</style>