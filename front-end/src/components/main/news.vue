<!--
  @Author: wuzitao
  @Date:   2017-08-22 20:56:08
  @Last Modified time: 2017-08-22 20:57:14
-->
<template>
  <div id="news">
    <markdown-preview :content="content"></markdown-preview>
  </div>
</template>

<script>
  import MarkdownPreview from '../widget/markdown-preview.vue'
  import text from '../../assets/introduce.md'

  export default {
  	name: 'news',
    components: {
      [MarkdownPreview.name]: MarkdownPreview
    },
    data () {
      return {
        content: text
      }
    }
  }
</script>
  
<style scoped>
  #news {
    background-image: url(https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1598082606,2922442645&fm=27&gp=0.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    padding: 2rem;
  }
</style>