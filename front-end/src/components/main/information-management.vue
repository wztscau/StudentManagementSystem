<!--
  @Author: wuzitao
  @Date:   2017-08-19 15:42:14
  @Last Modified time: 2017-08-30 11:02:07
-->
<template>
  <div id="information-management">
    <data-table
      :titles="titles"
      :columns="columns"
      :table-data="tableData"
      @data-submit="submit"
      >
      <i class="fa fa-refresh green" title="刷新" slot="th"
        @click="refresh()"></i>
      <!-- 禁用框 -->
      <div :slot="'td' + index" v-for="row,index of tableData">
        <i class="fa fa-ban red" title="禁用该用户" 
          @click="disableUser(index)"></i>
        <confirm-dialog-body v-if="index === currIndex"
          :display="'float'"
          :text="confirmText"
          @confirm="confirmDisable"
          >
        </confirm-dialog-body>
      </div>
    </data-table>
  </div>
</template>

<script>
  import $ from 'jquery'
  import DataTable from '../widget/data-table.vue'
  import ConfirmDialogBody from '../widget/confirm-dialog-body.vue'
  import toast from '../../utils/toast.min.js'
  import s from '../../assets/strings.json'
  import form from '../../assets/form.json'

  const titles = ['账号', '姓名', '身份', '部门', /* '身份证', */ '性别', '年龄', '毕业学校', '籍贯', '政治面貌', '电话', 'QQ', '邮箱']
  const columns = ['uid', 'realname', 'role', 'department', /* '_id', */ 'sex', 'age', 'school', 'birthplace', 'party', 'phone', 'qq', 'email']
  const editables = ['age', 'school', 'birthplace', 'phone', 'qq', 'email']
  const selectables = ['department', 'sex', 'party']

  export default {
    name: 'information-management',
    components: {
      [DataTable.name]: DataTable,
      [ConfirmDialogBody.name]: ConfirmDialogBody
    },
    data () {
      return {
        titles,
        columns,
        tableData: [],
        currIndex: -1,
        confirmText: ''
      }
    },
    methods: {
      initData () {
        $.get(this.api.getUser, { columns })
          .done(data => {
            this.tableData = data
            // 设置额外信息
            this.tableData._extraData = []
            Object.keys(data[0]).forEach((elem, index) => {
              let extra = {}
              let key = columns[index]
              editables.indexOf(key) !== -1 && (extra.editable = true)
              selectables.indexOf(key) !== -1 && (extra.selectable = true) && (extra.options = form[key])
              this.tableData._extraData.push(extra)
            })
          })
      },
      submit (data) {
        let obj = {
          set: { [data.key]: data.value },
          where: this.tableData[data.index].uid
        }
        $.post(this.api.modUser, {
            set: { [data.key]: data.value },
            uname: this.tableData[data.index].uid
          })
          .done(data => {
            data.result && toast(s['modify-succeeded'])
          })
      },
      disableUser (index) {
        this.currIndex = index // 出现确认框
        this.confirmText = `禁用【【${this.tableData[index].realname}】】 确定？`
      },
      confirmDisable (code) {
        let tmpIndex = this.currIndex
        if (code) {
          $.post(this.api.disable, { uname: this.tableData[tmpIndex].uid })
            .done(data => {
              if (data.result) {
                this.tableData.splice(tmpIndex, 1)
              }
            })
        }
        this.currIndex = -1 // remove dialog
      }
    },
    created () {
      this.initData()
    }
  }

</script>
  
<style scoped>
  
</style>