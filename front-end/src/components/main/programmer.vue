<!--
  @Author: wuzitao
  @Date:   2017-08-30 10:45:34
  @Last Modified time: 2017-08-30 22:35:44
-->
<template>
  <div id="programmer">
    <!-- list -->
    <ul v-if="!entered" class="list-unstyled">
      <profile-list v-for="article,index of articles"
        :control="article"
        :key="index"
        @data-title-click="enterArticle">
        <span id="article-status" class="label label-xlg label-danger arrowed arrowed-right jump" v-if="article.up">
          热门
        </span>
        <div slot="extra" class="unused">
          <i class="ace-icon fa fa-list-ul bigger-110"></i>
          <span>{{ article.sort }}</span>
          <i class="ace-icon fa fa-clock-o bigger-110"></i>
          <span>{{ article.time }}</span>
          <i class="ace-icon fa fa-eye bigger-110"></i>
          <span>{{ article.visit }}人浏览</span>
          <strong><a id="untoper" class="red" v-if="article.up&amp;&amp;role.includes('管理员')"
              @click="cancelTop(index)">取消置顶</a></strong>
        </div>
      </profile-list>
    </ul>
    <!-- entity -->
    <div v-else class="row">
      <span id="btn-back" class="label label-lg label-info arrowed-in-right arrowed"
        @click="backToList()">返回</span>
      <div class="article-side col-xs-6 col-sm-3">
        <img class="img-circle" :src="currArticle.author.head" />
        <div>总访问：{{ currArticle.author.visit }}次</div>
        <div>阅读：{{ currArticle.visit + 1 }}人</div>
        <div>文章：{{ currArticle.author.article }}篇</div>
      </div>
      <div class="article-main col-xs-12 col-sm-9">
        <h1>{{ currArticle.title }}</h1>
        <markdown-preview :content="currArticle.content"></markdown-preview>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import ProfileList from '../widget/profile-list.vue'
  import MarkdownPreview from '../widget/markdown-preview.vue'
  import { getRealTime } from '../../utils/util.js'
  import toast from '../../utils/toast.min.js'
  import s from '../../assets/strings.json'

  export default {
    name: 'programmer',
    components: {
      [ProfileList.name]: ProfileList,
      [MarkdownPreview.name]: MarkdownPreview
    },
    data () {
      return {
        articles: [],
        entered: this.$route.query.id && this.$route.query.title,
        currArticle: {
          content: '',
          title: '',
          visit: 0,
          author: { head: '', visit: 0, article: '' }
        },
        role: ''
      }
    },
    methods: {
      initArticleList () {
        $.get(this.api.getArticle)
          .done(data => {
            let articles = this.articles = data.map(el => {
              return {
                id: el.id,
                title: el.article_title,
                content: el.article_content,
                summary: el.article_summary,
                time: getRealTime(el.publish_time),
                visit: el.click,
                sort: el.sort_name,
                head: el.head || 'not found',
                up: el.up,
                name: el.realname
              }
            })
          })
      },
      enterArticle (control) {
        this.refresh({
          id: control.id,
          title: control.title
        }, 'push')
        this.addVisit(control.id, control.title)
      },
      showArticle (id, title) {
        $.get(this.api.getPersonalArticle, { uname: id, title })
          .done(data => {
            this.currArticle.author.head = data[0][0].head
            this.currArticle.author.visit = data[1][0].sumClick
            this.currArticle.author.article = data[1][0].countArticle
            this.currArticle.title = title
            this.currArticle.visit = data[0][0].click
            this.currArticle.content = data[0][0].article_content
          })
      },
      addVisit (uname, title) {
        $.post(this.api.addVisit, { title, uname })
      },
      backToList () {
        this.refresh()
      },
      cancelTop (index) {
        $.post(this.api.top, { uname: this.getId(), title: this.articles[index].title, up: 0 })
          .done(data => {
            if (data.result) {
              toast(s['untop-article-success'])
              this.articles[index].up = 0
            }
          })
      },
      getRole () {
        this.__getRole__()
          .done(role => {
            this.role = role
          }) // 获得角色
      }
    },
    created () {
      let id = this.$route.query.id,
          title = this.$route.query.title
      if (id && title) {
        // 文章
        this.showArticle(id, title)
      } else {
        // 文章列表
        this.initArticleList()
      }
    },
    mounted () {
      this.getRole()
    }
  }
</script>
  
<style scoped>
  .article-side {
    margin-bottom: 5rem;
  }
  .article-side img {
    width: 100%;
    margin-bottom: 1rem;
  }
  .profile-extra span {
    margin-right: 1rem;
  }
  .profile-extra span:nth-of-type(2) {
    color: #999;
  }
  #btn-back {
    cursor: pointer;
  }
  #article-status {
    position: absolute;
    right: 0;
    top: 0.5em;
  }
  a {
    cursor: pointer;
  }
  .jump {
    animation: jump 0.5s infinite;
  }
  @keyframes jump {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>