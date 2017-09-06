<!--
  @Author: wuzitao
  @Date:   2017-08-17 19:28:55
  @Last Modified time: 2017-08-17 19:28:56
-->
<template>
  <div id="information-profile">
    <div v-for="control,index of data">
      <h2>
        {{ control.title }}
        <small><a @click="insertBatch(control.title)">新增批次</a></small>
      </h2>
      <data-table
        :table-data="control.tableData"
        :columns="control.columns"
        :titles="control.titles">
      </data-table>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import DataTable from '../widget/data-table.vue'
  import { getRealTime } from '../../utils/util.js'
  import toast from '../../utils/toast.min.js'
  import s from '../../assets/strings.json'

  const titles = ['部门', '批数', '人数', '注册时间']
  const columns = ['d_name', 'batch', 'people_count', 'reg_time']

  export default {
    name: 'information-profile',
    components: {
      [DataTable.name]: DataTable
    },
    data () {
      return {
        data: [
          { title: 'UI', tableData: [], titles, columns },
          { title: '前端', tableData: [], titles, columns },
          { title: 'Java', tableData: [], titles, columns }
        ]
      }
    },
    methods: {
      initData () {
        $.get(this.api.dept)
          .done(data => {
            for (let entry of this.data) {
              for (let dept of data) {
                if (entry.title === dept.d_name) {
                  dept.reg_time = getRealTime(dept.reg_time)
                  entry.tableData.push(dept)
                }
              }
            }
          })
      },
      insertBatch (title) {
        this.confirm('你确定要新增批次吗？', code => {
          code &&
          $.post(this.api.batch, { name: title })
            .done(data => {
              if (data.result) {
                this.refresh()
                toast(s['add-batch-success'])
              }
            })
        })
      }
    },
    created () {
      this.initData()
    }
  }
</script>
  
<style scoped>
  a {
    cursor: pointer;
  }
</style>