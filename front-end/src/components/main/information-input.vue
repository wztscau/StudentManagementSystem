<!--
  @Author: wuzitao
  @Date:   2017-08-16 11:10:42
  @Last Modified time: 2017-08-30 17:25:29
-->
<template>
  <div id="information-input">
    <div id="select-teacher-student" v-if="!selected">
      <h2>请选择录入角色</h2>
      <div class="entry">
        <button class="btn btn-app btn-danger"
          @click="enter('teacher')">
          <i class="ace-icon fa fa-male bigger-230"></i>
          教师
        </button>
        <button class="btn btn-app btn-purple"
          @click="enter('student')">
          <i class="ace-icon fa fa-child bigger-230"></i>
          学生
        </button>
      </div>
    </div>
    <div v-else :id="role">
      <h2>
        {{ role_cn }}信息录入
        <small><a id="btn-back" @click="back()">返回</a></small>
      </h2>
      <user-data-form :form-data="formData"></user-data-form>
      <btn-multiple :funs="btnFuns" @data-submit="submit"></btn-multiple>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import UserDataForm from '../widget/user-data-form.vue'
  import BtnMuitiple from '../widget/btn-multiple.vue'
  import { labels, icos, holders, party, sex, department as dept, errors, errorPatterns } from '../../assets/form.json'
  import toast from '../../utils/toast.min.js'
  import s from '../../assets/strings.json'

  const selDefault = '请选择...'

  export default {
    name: 'information-input',
    components: {
      [UserDataForm.name]: UserDataForm,
      [BtnMuitiple.name]: BtnMuitiple
    },
    data () {
      return {
        selected: Number(this.$route.query.selected) || false,
        role: this.$route.query.role || '',
        formData: this.addStaticData([
          { input: '' },
          { input: '' },
          { radio: sex },
          { 'input.number': '' },
          { input: '' },
          { input: '' },
          { select: party, default: selDefault },
          { select: dept, default: selDefault },
          { 'input.tel': '' },
          { input: '' },
          { 'input.email': '' }
        ]),
        btnFuns: {
          checked: true,
          value: '提交'
        }
      }
    },
    computed: {
      role_cn () {
        let role = this.role
        return role === 'teacher'
          ? '教师'
          : (role === 'student' ? '学生' : '')
      }
    },
    methods: {
      enter (role) {
        this.role = role
        this.selected = true
      },
      addStaticData (formData) {
        return formData.map((elem, index) => {
          elem.label = labels[index]
          elem.ico = icos[index]
          elem.holder = holders[index]
          elem.error = ''
          elem.errEmpty = errors[labels[index]][0]
          elem.errIllegal = errors[labels[index]][1]
          return elem
        })
      },
      back () {
        this.confirm('不保存数据吗?', code => {
          code && (this.selected = false)
        })
      },
      onChange () {
        let vm = this
        $('#' + this.role).find('.form-group').each(function (index) {
          $(this).find('select,input').on('input change', function (e) {
            vm.check(this, index)
          })
        })
      },
      // 校验
      check (el, index) {
        let vm = this
        // 输入框
        if (!new RegExp(errorPatterns[labels[index]]).test(el.value)) {
          vm.formData[index].error = vm.formData[index].errIllegal
          vm.showError(index)
        } else {
          vm.showError(index, false)
        }
        // 单选框
        if ($(el).is(':radio')) {
          vm.showError(index, false)
        }
        // 下拉列表
        if ($(el).is('select')) {
          if (el.value === selDefault) {
            vm.formData[index].error = vm.formData[index].errEmpty
            vm.showError(index)
          } else {
            vm.showError(index, false)
          }
        }
      },
      showError (index, shown = true) {
        let $formGroup = $(`${'#data-ff-' + labels[index]}`).parents('.form-group')
        if (shown) {
          $formGroup.addClass('has-error')
        } else {
          $formGroup.removeClass('has-error')
        }
        // 通过检查与否
        this.formData[index].checked = !shown
      },
      submit () {
        let canSubmit = this.formData.every(elem => { return elem.checked })
        let formData = this.formData
        // 截断提交
        if (!canSubmit) {
          toast(s['enter-correct-message'])
          return
        }
        // 提交的数据
        let dataSubmit = {
          role: this.role_cn,
          uname: this.getId(),
          _id: formData[0].input,
          realname: formData[1].input,
          sex: formData[2].value,
          age: formData[3]['input.number'],
          school: formData[4].input,
          birthplace: formData[5].input,
          party: formData[6].value,
          d_name: formData[7].value,
          phone: formData[8]['input.tel'],
          qq: formData[9].input,
          email: formData[10]['input.email']
        }
        // 模拟系统的confirm，不过不能实现阻塞函数，只能用回调函数
        this.confirm('确认输入无误？', code => {
          if (!code) return
          // 检查用户是否存在
          $.get(this.api.checkId + `?id=${this.formData[0].input}`)
            .then(data => { // 这里必须用then
              if (data.isExist) {
                toast(s['exist-this-user'])
              } else {
                // 正式提交
                return $.post(this.api.addUser, dataSubmit)
              }
            })
            .done(data => {
              if (data && data.result) {
                this.confirm(`录入成功！！！\n要继续录入${this.role_cn}信息吗？`,
                  code => {
                  code
                    ? this.refresh({
                        role: this.role,
                        selected: 1
                      }) // 刷新
                    : this.changeTab('账户录入/管理') // 跳出去
                })
              }
            })
        })
      },
      getInputKey (control) {
        for (let key in control) {
          if (/^(input)\.?/.test(key) && typeof control[key] === 'string') {
            return key
          }
        }
      }
    },
    mounted () {
      this.selected && this.onChange()
    },
    updated () {
      this.selected && this.onChange()
    }
  }
  
</script>
  
<style scoped>
  #information-input {
    padding-bottom: 2em;
  }
  #select-teacher-student{
    width: 100%;
    height: 10rem;
  }
  #select-teacher-student .entry {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }
  #select-teacher-student button {
    margin: 0 2rem;
  }
  #btn-back {
    cursor: pointer;
  }
  .entry button:hover i {
    animation: swing 1s;
  }
  @keyframes swing {
    0% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(-60deg);
    }
    75% {
      transform: rotate(60deg);
    }
    100% {
      transform: rotate(0);
    }
  }
</style>