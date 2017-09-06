<!--
  @Author: wuzitao
  @Date:   2017-08-11 14:20:24
  @Last Modified time: 2017-08-28 17:26:29
-->
<template>
  <div id="person-data">
    <div class="row">
      <div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4">
        <span class="profile-picture block">
          <img id="head-img" class="editable img-responsive editable-click editable-empty" :src="headSrc" @error="onImgError($event)">
        </span>
      </div>
    </div>
    <user-data-form :form-data="formData"></user-data-form>
  </div>
</template>

<script>
  import $ from 'jquery'
  import UserDataForm from '../widget/user-data-form.vue'
  import { labels, holders, icos, sex } from '../../assets/form.json'
  import s from '../../assets/strings.json'
  import toast from '../../utils/toast.min.js'

  export default {
    name: 'person-data',
    components: {
      [UserDataForm.name]: UserDataForm
    },
    data () {
      return {
        // 初始化表单元素
        formData: this.addStaticData([
          { input: '' },
          { input: '' },
          { radio: sex },
          { 'input.number': '' },
          { input: '' },
          { input: '' },
          { select: [] },
          { select: [] },
          { 'input.tel': '' },
          { input: '' },
          { 'input.email': '' }
        ]),
        headSrc: ''
      }
    },
    methods: {
      addStaticData (formData) {
        return formData.map((elem, index) => {
          elem.label = labels[index]
          elem.holder = holders[index]
          elem.ico = icos[index]
          elem.disabled = true
          return elem
        })
      },
      initUserData () {
        $.get(this.api.person, { uname: this.getId() })
          .done(data => {
            let info = data.info
            let formData = this.formData

            formData[0].input = info._id.replace(/^(\d{2})\d{14}(\w{2})$/, '$1**************$2')
            formData[1].input = info.realname
            formData[2].value = info.sex
            formData[3]['input.number'] = info.age
            formData[4].input = info.school
            formData[5].input = info.birthplace
            formData[6].default = info.party
            formData[7].select = info.department
            formData[8]['input.tel'] = info.phone
            formData[9].input = info.qq
            formData[10]['input.email'] = info.email

            this.headSrc = info.head
          })
      }
    },
    created () {
      this.initUserData()
    },
    mounted () {
      $resetHeadImg()
    }
  }

  function $resetHeadImg () {
    let $headImg = $('#head-img')
    let width = $headImg.width()
    $headImg.width(width).height(width)
  }

</script>
  
<style scoped>
  #person-data {
    padding: 12px;
  }
  #head-img {
    width: 100%;
  }
</style>