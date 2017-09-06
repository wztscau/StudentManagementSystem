<!--
  @Author: wuzitao
  @Date:   2017-08-18 19:57:34
  @Last Modified time: 2017-08-18 20:42:24
-->
<template>
  <div>
    
  </div>
</template>

<script>
  export default {
    name: 'blank',
    data () {
      let route = this.$route
      let query = ''
      for (let key in route.query) {
        if (key === 'origin') continue
        query += key + '=' + route.query[key] + '&'
      }
      this.$router.replace(this.$route.query.origin + '?' + query.replace(/&$/, ''))
      return {

      }
    }
  }
</script>
  
<style scoped>
  
</style>