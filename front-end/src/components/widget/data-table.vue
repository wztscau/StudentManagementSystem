<!--
  @Author: wuzitao
  @Date:   2017-08-19 18:14:53
  @Last Modified time: 2017-08-30 11:18:51
-->
<template>
  <div class="dataTables_wrapper form-inline no-footer">
    <table ref="table" class="table table-striped table-bordered table-hover dataTable no-footer">
      <thead>
        <tr>
          <th>
            <slot name='th'></slot>
          </th>
          <th v-for="title,index of titles" class="sorting"
            @click="sortBy(columns[index])"
            >
            {{ title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry,index of filteredData">
          <td>
            <slot :name="'td' + index"></slot>
          </td>
          <td v-for="key,index2 of columns">

            <!-- input -->
            <div v-if="filteredData._extraData&amp;&amp;filteredData._extraData[index2]&amp;&amp;filteredData._extraData[index2].editable">
              <i class="fa fa-check green" style="display: none;" title="提交" 
                @click="emitDataSubmit($event, { value: entry[key], key, index })"></i>
              <span contenteditable="false"
                @keydown.enter.prevent.stop
                @keyup.enter="emitDataSubmit($event, { value: entry[key], key, index })"
                @blur="entry[key] = $event.target.textContent">{{ entry[key] }}</span>
              <i class="fa fa-pencil blue" title="编辑" data-edit
                @click="openEditor($event)"></i>
              <i class="fa fa-times red" style="display: none;" title="撤销"
                @click="revoke($event, { index, key })"></i>
            </div>

            <!-- select -->
            <div v-else-if="filteredData._extraData&amp;&amp;filteredData._extraData[index2]&amp;&amp;filteredData._extraData[index2].selectable">
              <i class="fa fa-check green" style="display: none;" title="提交"
                @click="emitDataSubmit($event, { value: entry[key], key, index })"></i>
              <select disabled="false"
                @change="entry[key] = $event.target.value">
                <option v-if="filteredData._extraData[index2].options" v-for="option of filteredData._extraData[index2].options"
                  :value="option"
                  :selected="option === entry[key]">
                  {{ option }}
                </option>
              </select>
              <i class="fa fa-pencil blue" title="编辑" data-edit
                @click="openEditor($event)"></i>
              <i class="fa fa-times red" style="display: none;" title="撤销"
                @click="revoke($event, { index, key })"></i>
            </div>

            <!-- default -->
            <span v-else>{{ entry[key] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import $ from 'jquery'
  import toast from '../../utils/toast.min.js'
  import s from '../../assets/strings.json'

  export default {
    name: 'data-table',
    props: {
      titles: Array,
      columns: Array,
      tableData: Array
    },
    data () {
      let sortOrders = {}
      this.columns.forEach(key => {
        sortOrders[key] = 1
      })
      return {
        originRoutePath: this.$route.path,
        originData: [],
        editing: false,
        filteredData: [],
        sortOrders
      }
    },
    methods: {
      toggleEditor (event, edit) {
        // 不可同时编辑多条数据
        if (edit) {
          if (this.editing) {
            this.commitFirst()
            return
          } else {
            this.editing = true
          }
        }
        // 提交转为退出编辑
        if (!edit) {
          this.editing = false
        }
        // 切换按钮及编辑状态
        let $editor = $(event.target).parent().find('i').toggle().siblings('[contenteditable],select')
        $editor.prop({
          contenteditable: edit,
          disabled: !edit
        }).focus()
      },
      commitFirst () {
        toast(s['commit-first'])
        $(event.target).parents('table').find('[contenteditable=true],[disabled=false]').focus()
      },
      openEditor (e) {
        this.toggleEditor(e, true)
      },
      emitDataSubmit (e, data) {
        this.toggleEditor(e, false)
        // 改变原本的tableData，不刷新页面
        let originIndex = this.filteredData[data.index]._originIndex
        this.$set(this.tableData[originIndex], data.key, data.value)
        // 触发回调
        this.$emit('data-submit', { key: data.key, value: $.trim(data.value), index: data.index })
      },
      revoke (e, data) {
        this.toggleEditor(e, false)
        // 撤销为原来的数据
        let newIdx = data.index
        let oldIdx = this.filteredData[newIdx]._originIndex
        let oldVal = this.tableData[oldIdx][data.key]
        this.filteredData[newIdx][data.key] = oldVal // 自动刷新view
      },
      sortBy (sortKey) {
        if (this.editing) {
          this.commitFirst()
          return
        }
        let data = this.filteredData
        let order = (this.sortOrders[sortKey] *= -1) || 1 // 反复倒序
        data = data.sort((a, b) => {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      },
      scrollInto () {
        $scrollInto(this.$refs.table)
      }
    },
    watch: {
      tableData: {
        handler () {
          // 克隆data数组
          this.filteredData = this.tableData.map((el, idx) => {
            el._originIndex = idx
            return $.extend({}, el)
          })
          this.filteredData._extraData = this.tableData._extraData
        }
      },
      $route (newVal) {
        if (newVal.path === this.originRoutePath) {
          this.scrollInto() // 重新加入监听
        } else {
          $header && $header.remove()
          $(window).off('scroll', onScroll) // 要移除监听，否则header不消失
        }
      }
    },
    mounted () {
      this.scrollInto()
    }
  }

  let $header = null,
      $table = null
  function $scrollInto (table) {
    $table = $(table)
    $header = $('<table></table>').append($table.find('thead').clone(true, true))
      .addClass('table table-striped table-bordered table-hover dataTable no-footer')
      .css({
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      })
    $(window).on('scroll', onScroll)
  }

  function onScroll () {
    if (this.scrollY >= $table.offset().top) {
      $header.appendTo($table.parent())
    } else {
      $header.remove()
    }
  }
</script>
  
<style scoped>
  .dataTables_wrapper {
    overflow: auto;
    white-space: nowrap;
  }
  .sorting {
    min-width: 5em;
  }
  .table select {
    padding: 0;
    margin: 0;
    border: none;
    color: #2c3e50;
    height: 1.25em;
    margin-top: -0.25em;
  }
  .table select:focus {
    outline: -webkit-focus-ring-color auto 5px;
  }
  .table-striped>tbody>tr:nth-of-type(odd) select {
    background-color: #f9f9f9;
  }
  .table-hover>tbody>tr:hover select {
    background-color: #f5f5f5;
  }
  i {
    cursor: pointer;
    transition: transform 0.2s;
  }
  i:hover {
    transform: scale(1.2);
  }
</style>