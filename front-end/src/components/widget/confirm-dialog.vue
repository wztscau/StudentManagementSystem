<!--
  @Author: wuzitao
  @Date:   2017-08-18 16:48:54
  @Last Modified time: 2017-08-22 21:50:22
-->
<template>
  <div class="mask" v-if="shown">
    <div class="modal bootbox fade bootbox-confirm" :class="{ in: shown }">
      <div class="modal-dialog">
        <confirm-dialog-body
          :yes="yes"
          :no="no"
          :text="text"
          @confirm="confirm">
        </confirm-dialog-body>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import ComfirmDialogBody from './confirm-dialog-body.vue'

  let cbArr = [] // 保存callback的队列

  export default {
    name: 'confirm-dialog',
    components: {
      [ComfirmDialogBody.name]: ComfirmDialogBody
    },
    props: {
      yes: { require: false },
      no: { require: false }
    },
    data () {
      return {
        shown: true,
        text: '',
        callback: null
      }
    },
    methods: {
      confirm (code) {
        $('.mask .modal').removeClass('in')
        // 窗口退出需要300ms时间
        setTimeout(() => {
          // 退出窗口
          this.shown = false
          // 触发confirm的回调函数
          this.invokeCallback(code)
        }, 300)
      },
      invokeCallback (code) {
        // 由于在按钮点击后才能进行下一次confirm，cbArr永远只有一个回调
        cbArr.forEach(cb => {
          cb(code) // 执行回调
        })
        cbArr.splice(0, cbArr.length) // 马上移除上一次的回调
      }
    },
    mounted () {
      // 将confirm方法挂载在vue实例上
      Object.getPrototypeOf(Object.getPrototypeOf(this)).confirm = (text, cb = function () {}) => {
        setTimeout(() => { // 给绑定留下时间
          this.shown = true
          this.text = text
          // 绑定回调函数
          cbArr.push(cb)
        })
      }
      this.shown = false // 预加载confirm框
    }
  }
</script>
  
<style scoped>
  .mask {
    background-color: rgba(255,255,255, .2);
    position: fixed;
    z-index: 9999;
  }
  .mask .modal {
    display: block;
  }
  @media (min-width: 768px) {
    .modal-dialog {
      width: 400px;
    }
  }
</style>