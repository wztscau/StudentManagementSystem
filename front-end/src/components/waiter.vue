<!--
  @Author: wuzitao
  @Date:   2017-08-08 09:14:40
  @Last Modified time: 2017-08-20 02:24:23
-->
<template>
  <div class="mask mask-center light" id="waiter">
    <i class="ace-icon fa fa-spinner fa-spin blue bigger-300"></i>
  </div>
</template>

<script>
  export default {
    name: 'waiter',
    data () {
      return {
        shown: false
      }
    }
  }
</script>

<style scoped>
  .mask {
    position: fixed;
    z-index: 9999;
  }
  .light {
    background-color: rgba(255,255,255, .2);
  }
  .mask-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #waiter {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: none;
  }
</style>