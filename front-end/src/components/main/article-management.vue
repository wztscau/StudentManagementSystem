<!--
  @Author: wuzitao
  @Date:   2017-09-02 13:05:34
  @Last Modified time: 2017-09-02 13:05:34
-->
<template>
  <div id="article-management">
    <ul class="list-unstyled">
      <profile-list v-for="article,index of articles"
        :control="article"
        :key="index"
        @data-title-click="modifyArticle">
        <span id="article-status" class="label label-xlg arrowed arrowed-right"
          :class="[ article.status ? 'label-success' : 'label-inverse' ]">
          {{ article.status ? "已发布" : "草稿" }}
        </span>
        <span id="article-top" class="label label-xlg label-danger arrowed arrowed-right jump" v-if="article.up">
          已置顶
        </span>
        <div slot="extra" class="unused">
          <i class="ace-icon fa fa-list-ul bigger-110"></i>
          <span>{{ article.sort }}</span>
          <i class="ace-icon fa fa-clock-o bigger-110"></i>
          <span>{{ article.time }}</span>
          <i class="ace-icon fa fa-eye bigger-110"></i>
          <span>{{ article.visit }}人浏览</span>
          <div class="visible-xs-block visible-sm-inline visible-md-inline visible-lg-inline pull-right">
            <strong><a id="toper" class="green" v-if="article.status&amp;&amp;!article.up"
              @click="top(index)">置顶</a></strong>
            <strong><a id="editor" class="blue" @click="edit(index)">编辑</a></strong>
            <strong><a id="deleter" class="red" @click="deleteArticle(index)">删除</a></strong>
          </div>
        </div>
      </profile-list>
    </ul>
  </div>
</template>

<script>
  import $ from 'jquery'
  import ProfileList from '../widget/profile-list.vue'
  import { getRealTime } from '../../utils/util.js'
  import toast from '../../utils/toast.min.js'
  import s from '../../assets/strings.json'
  import { SAVE_KEY } from './article-publishment.vue'

  export default {
    name: 'article-management',
    components: {
      [ProfileList.name]: ProfileList
    },
    data () {
      let articles = [], storage = localStorage
      // 取出自动保存的文章
      for (let key in storage) {
        let value = JSON.parse(storage[key])
        value.visit = 0
        value.hideHead = true
        if (new RegExp('^' + SAVE_KEY).test(key)) {
          articles.push(value)
        }
      }
      return {
        articles
      }
    },
    methods: {
      initMyArticles () {
        $.get(this.api.myArticle, { uname: this.getId() })
          .done(data => {
            // 已发布和草稿都添加进文章列表中
            this.articles = this.articles.concat(data.map(el => {
              return {
                title: el.article_title,
                content: el.article_content,
                summary: el.article_summary,
                time: getRealTime(el.publish_time),
                visit: el.click,
                sort: el.sort_name,
                up: el.up,

                status: 1,
                hideHead: true
              }
            }))
            this.saveArticles(this.articles)
          })
      },
      modifyArticle (data) {
        this.changeTab('发表新文章', { title: data.title })
      },
      edit (index) {
        this.modifyArticle(this.articles[index])
      },
      deleteArticle (index) {
        this.confirm('你是否确认要删除该文章？', code => {
          if (code) {
            if (this.articles[index].status) {
              // 删除线上文章
              $.post(this.api.delArticle, {
                  uname: this.getId(),
                  title: this.articles[index].title
                })
                .done(data => {
                  if (data.result) {
                    this.removeArticleFromList(index)
                    toast(s['delete-article-success'])
                  }
                })
            } else {
              // 删除草稿文章
              localStorage.removeItem(SAVE_KEY + this.articles[index].title)
              this.removeArticleFromList(index)
              toast(s['delete-article-success'])
            }
          }
        })
      },
      top (index) {
        $.post(this.api.top, { uname: this.getId(), title: this.articles[index].title, up: 1 })
          .done(data => {
            if (data.result) {
              toast(s['top-article-success'])
              this.articles[index].up = 1
            }
          })
      },
      removeArticleFromList (index) {
        this.articles.splice(index, 1)
      },
      saveArticles (arts) {
        for (let entry of arts) {
          sessionStorage.setItem(SAVE_KEY + entry.title, JSON.stringify(entry))
        }
      }
    },
    created () {
      this.initMyArticles()
    },
    updated () {
      $resetProfileTitle(this)
    }
  }

  function $resetProfileTitle (vm) {
    $(vm.$el).find('.profile-title').css('margin-top', '1em')
  }
</script>
  
<style inline>
  .profile-extra span {
    margin-right: 1rem;
  }
  .profile-extra a {
    margin-right: 1rem;
    cursor: pointer;
  }
  #article-status {
    position: absolute;
    right: 0;
    top: 0.5em;
  }
  #article-top {
    position: absolute;
    right: 75px;
    top: 0.5em;
  }
</style>