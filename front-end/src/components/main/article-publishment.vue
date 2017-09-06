<!--
  @Author: wuzitao
  @Date:   2017-08-21 16:05:21
  @Last Modified time: 2017-08-30 21:20:02
-->
<template>
  <div id="article-publishment">
    <span id="btn-md-help" class="help-button pull-right">
      <i>?</i>
      <markdown-help></markdown-help>
    </span>
    <label><select @change="selectChange($event)">
      <option value="def">请选择分类...</option>
      <option v-for="value of sorts"
        :value="value"
        :selected="value === sort">
        {{ value }}
      </option>
    </select></label>
    <input type="text" class="input-lg bigger-150 block form-control" placeholder="请输入文章标题..." v-model="title" @input="autoSave()"/>
    <textarea id="apmd" data-provide="markdown" v-model="content" @input="autoSave()"></textarea>
    <div id="succ-save" class="alert alert-info">
      <strong>
        保存成功！
      </strong>
      <br>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import bootstrap from 'bootstrap'
  import MarkdownHelp from '../widget/markdown-help.vue'
  import s from '../../assets/strings.json'
  import toast from '../../utils/toast.min.js'
  import { formatDate } from '../../utils/util.js'

  const SAVE_KEY = 'article-'

  export default {
    SAVE_KEY,
    name: 'article-publishment',
    components: {
      [MarkdownHelp.name]: MarkdownHelp
    },
    data () {
      let title = this.$route.query.title || '文章标题'
      // 自动保存的store
      let autoSaveStore = JSON.parse(localStorage.getItem(SAVE_KEY + title))
      // 由选择编辑传过来的store
      let editStore = JSON.parse(sessionStorage.getItem(SAVE_KEY + title))
      let store = autoSaveStore || editStore
      return {
        title,
        content: store ? store.content : '',
        summary: '',
        sort: store ? store.sort : '',
        canSave: true,
        sorts: ['UI', 'Java', '前端']
      }
    },
    methods: {
      autoSave () {
        if (this.canSave) {
          setTimeout(() => {
            this.saveContent()
            $popSaveSuccess()
            this.canSave = true
          }, 5000) // 5s保存一次文本内容
          this.canSave = false
        }
      },
      saveContent () {
        localStorage.setItem(SAVE_KEY + this.title, JSON.stringify({
          title: this.title,
          content: this.content,
          summary: this.summary,
          sort: this.sort,
          time: formatDate(new Date(), 'yyyy-MM-dd hh-mm-ss')
        }))
      },
      clearStorage () {
        localStorage.removeItem(SAVE_KEY + this.title)
        sessionStorage.removeItem(SAVE_KEY + this.title)
      },
      selectChange ($event) {
        this.sort = $event.target.value
        this.autoSave()
      }
    },
    mounted () {
      $selectTitle()
      $createMarkdown(this)
    }
  }

  function $createMarkdown (vm) {
    let $apmd = $('#apmd')
    let $preview = null
    $apmd.markdown({
      hiddenButtons: 'bootstrap-markdown-cmdPreview',
      onShow () {
        $('.md-real-preview').remove() // boot-md有个bug，刷新后旧的preview不清除
        $preview = $('<div>').insertAfter('#apmd').addClass('md-real-preview')
        $resetBtnSubmit()
      },
      onChange (e) {
        $preview.html(e.parseContent())
        vm.summary = $preview.text().substring(0, 119)
      },
      onBlur (e) {
        this.onChange(e)
      },
      onFocus (e) {
        this.onChange(e)
      },
      additionalButtons: [
        [{
          name: 'mGroup',
          data: [{
            name: 'submit',
            title: '发表文章',
            btnText: '发表文章',
            btnClass: 'btn btn-primary btn-sm',
            icon: { fa: 'fa fa-search' },
            callback: function (e) { submit.call(vm, e) }
          }]
        }]
      ]
    })
    $apmd.parent().find('.btn').not('.btn-primary').addClass('btn-white')
  }

  function submit (md) {
    // 首先触发onchange事件，以保证所有数据都是最新的
    md.change()
    // 判空
    if ($.trim(this.title) === '') {
      toast(s['input-title-first'])
      return
    }
    if ($.trim(this.content) === '') {
      toast(s['input-content-first'])
      return
    }
    if (!this.sort) {
      toast(s['sort-first'])
      return
    }
    // 提交
    $.post(this.api.addArticle, {
        uname: this.getId(),
        title: this.title,
        content: this.content,
        summary: this.summary,
        sort_name: this.sort
      })
      .done(data => {
        if (data.result) {
          this.clearStorage() // 清除缓存
          this.confirm('文章已成功发表，是否继续写新文章？', code => {
            code
              ? this.refresh()
              : this.changeTab('程序员世界')
          })
        }
      })
  }

  function $selectTitle () {
    // 自动获得选中
    $('#article-publishment').find('input').on('focus', function () {
      $(this).select()
    }).focus()
  }

  function $resetBtnSubmit () {
    $('.md-header').find('.btn-group').last().addClass('md-submit')
  }

  function $popSaveSuccess () {
    let $save = $('#succ-save')
    let top = $save.css('top')
    $save.css('top', 0)
    setTimeout(() => {
      $save.css('top', top)
    }, 1000)
  }

</script>
  
<style>
  #article-publishment .form-control {
    margin-bottom: 0;
  }
  #article-publishment .form-control:focus,
  #article-publishment .md-editor.active {
    border-color: #D5D5D5;
  }
  #apmd.md-input,
  .md-real-preview {
    display: inline-block;
    width: 50%;
    height: 35em;
    overflow: auto;
    font-size: 14px;
    padding: 1em;
    vertical-align: top;
  }
  #apmd.md-input {
    border-right: dashed 1px;
  }
  .md-real-preview {
    word-break: break-word;
  }
  #btn-md-help {
    position: relative;
  }
  #btn-md-help:hover > i {
    display: inline-block;
    transform: rotate(360deg);
    transition: transform 0.5s;
  }
  #btn-md-help:hover::before {
    display: block;
  }
  #btn-md-help::before {
    content: " ";
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 150%;
    height: 80px;
  }
  #btn-md-help:hover > #markdown-help {
    display: block;
    z-index: 1023;
  }
  .md-submit {
    position: absolute;
    right: 45px;
  }
  #succ-save {
    position: fixed;
    top: -53px;
    left: calc(50% - 50px);
    width: 100px;
    white-space: nowrap;
    transition: top .5s;
    z-index: 5555;
  }
</style>