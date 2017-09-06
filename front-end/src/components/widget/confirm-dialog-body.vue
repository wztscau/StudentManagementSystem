<!--
  @Author: wuzitao
  @Date:   2017-08-20 22:28:00
  @Last Modified time: 2017-08-21 00:27:25
-->
<template>
  <div class="modal-content"
    :class="{ 'dialog-float': display === 'float' }">
    <div class="modal-body">
      <button type="button" class="bootbox-close-button close" data-dismiss="modal" style="margin-top: -10px;"
        @click="exit()">×</button>
      <div class="bootbox-body">
        {{ text }}
      </div>
    </div>
    <div class="modal-footer">
      <button data-bb-handler="cancel" type="button" class="btn btn-default"
        @click="exit()">
        {{ no }}
      </button>
      <button data-bb-handler="confirm" type="button" class="btn btn-primary"
        @click="exit(1)">
        {{ yes }}
      </button>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'confirm-dialog-body',
    props: {
      no: {
        default: '取消',
        require: false
      },
      yes: {
        default: '确定',
        require: false
      },
      text: {
        default: '',
        require: false
      },
      display: {
        default: 'global',
        require: false
      }
    },
    data () {
      return {

      }
    },
    methods: {
      exit (code = 0) { // 0是默认退出，1是确认退出
        this.$emit('confirm', code, this.$el)
      }
    }
  }
</script>
  
<style scoped>
  .dialog-float {
    position: absolute;
  }
</style>