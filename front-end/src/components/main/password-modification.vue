<!--
  @Author: wuzitao
  @Date:   2017-08-14 17:23:53
  @Last Modified time: 2017-08-20 02:25:05
-->
<template>
  <div id="password-modification">
    <user-data-form :form-data="formData" ref="dataForm"></user-data-form>
    <btn-multiple :funs="btnFuns" @data-submit="submit"></btn-multiple>
  </div>
</template>

<script>
  import $ from 'jquery'
  import UserDataForm from '../widget/user-data-form.vue'
  import BtnMultiple from '../widget/btn-multiple.vue'
  import s from '../../assets/strings.json'
  import { md5 } from '../../utils/cryption.js'
  import toast from '../../utils/toast.min.js'

  const labels = ['旧密码', '新密码', '再次确认密码']
  const dataPref = '#data-ff-'

  export default {
    name: 'password-modification',
    components: {
      [UserDataForm.name]: UserDataForm,
      [BtnMultiple.name]: BtnMultiple
    },
    data () {
      return {
        formData: [
          { 'input.password': '', error: s['wrong-password'] },
          { 'input.password': '', error: s['input-correct-password'] },
          { 'input.password': '', error: s['password-not-the-same'] }
        ],
        btnFuns: {
          checked: true,
          value: ['提交']
        },
        canSubmit: false
      }
    },
    methods: {
      addStaticData () {
        this.formData.forEach((elem, index) => {
          elem.label = labels[index]
          elem.ico = 'lock'
        })
      },
      submit () {
        let oldPwd = $.trim($(`${dataPref + labels[0]}`).val())
        let newPwd = $.trim($(`${dataPref + labels[2]}`).val())
        // 两次密码输入不一致
        if (!this.canSubmit) {
          $('.form-group').each(function (index) {
            if ($(this).find('input').val() === '') {
              $(this).addClass('has-error')
            }
          })
          return
        }
        // 原密码和新密码相同
        if (oldPwd === newPwd) {
          this.toggleError(true, 0, s['password-should-different'])
          return
        }
        // 最终提交
        $.post(this.api.login, {
            uname: this.getId(),
            pwd: md5(oldPwd)
          })
          // 检查密码是否正确
          .done(data => {
            if (data.result) {
              return $.post(this.api.pwd, {
                pwd: md5(newPwd),
                uname: this.getId()
              })
            } else {
              toast(s['wrong-password'])
              this.toggleError(true, 0, s['wrong-password'])
            }
          })
          // 提交成功
          .done(data => {
            if (data && data.result) {
              this.toggleError(false, 0)
              toast(s['success-modify-password'])
            }
          })
      },
      toggleError (is, index, err) {
        let $hasError = $(`${dataPref + labels[index]}`).parents('.form-group')
        if (is) {
          this.formData[index].error = err || this.formData[index].error
          $hasError.addClass('has-error')
        } else {
          $hasError.removeClass('has-error')
        }
        return this
      },
      checkAgainPwd () {
        let vm = this
        $(`${dataPref + labels[1]},
           ${dataPref + labels[2]}`)
          .each(function (index) {
            $(this).on('input', function (e) {
            let newPwd = $.trim($(`${dataPref + labels[1]}`).val())
            let againPwd = $.trim($(`${dataPref + labels[2]}`).val())
            // 不能为空
            if (newPwd === '' && againPwd === '') {
              return
            }
            // 密码不一致
            if (newPwd !== againPwd) {
              vm.toggleError(true, 2).canSubmit = false // 增加报错，不允许提交
            } else {
              vm.toggleError(false, 1).toggleError(false, 2).canSubmit = true // 撤销报错,允许提交
            }
          })
        })
      }
    },
    created () {
      this.addStaticData()
    },
    mounted () {
      this.checkAgainPwd()
    }
  }
</script>
  
<style scoped>
  
</style>