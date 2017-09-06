<!--
  @Author: wuzitao
  @Date:   2017-09-05 11:03:01
  @Last Modified time: 2017-09-05 11:03:01
-->
<template>
  <div id="markdown-preview"></div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'markdown-preview',
    props: {
      content: String
    },
    data () {
      return {

      }
    },
    methods: {
      parseMarkdownContent () {
        let vm = this
        let $el = $(vm.$el)
        $el.markdown({
          hideable: true,
          onShow (e) {
            e.setContent(vm.content)
            e.blur() // 主动隐藏md-editor
          },
          onBlur (e) {
            $el.html(e.parseContent()) // 得到解析后的content
          }
        })
      }
    },
    watch: {
      content () {
        this.parseMarkdownContent()
      }
    },
    mounted () {
      // parseMarkdownContent不能执行两次
      if (this.content) {
        this.parseMarkdownContent()
      }
    }
  }
</script>
  
<style scoped>
  
</style>