<!--
  @Author: wuzitao
  @Date:   2017-08-30 10:49:05
  @Last Modified time: 2017-08-30 11:32:14
-->
<template>
  <a id="back-to-top" class="btn-scroll-up btn btn-sm btn-inverse">
    <i class="ace-icon fa fa-angle-double-up icon-only bigger-200"></i>
  </a>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: 'back-to-top',
    data () {
      return {

      }
    },
    mounted () {
      let self = this
      $(window).on('scroll', function (e) {
        if (this.scrollY > 20) {
          $(self.$el).addClass('display')
        } else {
          $(self.$el).removeClass('display')
        }
      })
      $(self.$el).on('click', function (e) {
        $(document.body).animate({ scrollTop: 0 }, 200)
      })
    }
  }
</script>
  
<style scoped>
  
</style>