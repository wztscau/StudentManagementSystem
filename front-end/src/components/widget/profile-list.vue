<!--
  @Author: wuzitao
  @Date:   2017-08-30 16:38:47
  @Last Modified time: 2017-08-30 22:34:35
-->
<template>
  <li class="profile-activity clearfix">
    <div class="pull-left profile-img" v-if="!control.hideHead">
      <img :src="control.head" @error="onImgError($event)"/>
      <span>{{ control.name }}</span>
    </div>
    <h3 class="profile-title">
      <a @click="$emit('data-title-click',control)">{{ control.title }}</a>
    </h3>
    <p class="profile-content">{{ control.summary | elli }}</p>
    <slot></slot>
    <div class="profile-extra pull-right">
      <slot name="extra"></slot>
    </div>
  </li>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'profile-list',
    props: {
      control: Object
    },
    data () {
      return {

      }
    },
    filters: {
      elli (content) {
        if (!content) return content
        return content.length > 100
          ? content.substring(0, 97) + '...'
          : content
      }
    },
    mounted () {
    }
  }

</script>
  
<style scoped>
  li {
    position: relative;
  }
  .profile-title {
    margin-top: 0;
  }
  .profile-title > a {
    color: #333;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
  }
  .profile-title > a:hover {
    color: #c00;
  }
  .profile-content {
    color: #888;
  }
  .profile-extra {
    margin-top: 4px;
  }
  
  .profile-img img {
    display: block;
  }
  .profile-img span {
    display: block;
    margin-top: 0.5em;
  }
</style>