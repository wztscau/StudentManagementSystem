<!--
  @Author: wuzitao
  @Date:   2017-08-28 16:16:45
  @Last Modified time: 2017-08-28 22:36:26
-->
<template>
  <div id="headimg-upload">
    <input type="file" accept="image/*" @change="selectImage($event)"/>
    <span style="color: red;">请选择小于5M的图片格式文件</span>
    <div id="img-result" class="def-bg"></div>
    <div class="mask dark max mask-center" v-if="cropping">
      <div class="img-container">
        <img ref="img-crop"/>
        <button class="btn btn-primary btn-block" @click="cropImage()">确定</button>
      </div>
    </div>
    <button class="btn btn-info" type="button" 
      :disabled="!cropped"
      @click="submitImage()">
      <i class="ace-icon fa fa-check bigger-110"></i>
      上传图片
    </button>
  </div>
</template>

<script>
  import $ from 'jquery'
  import '../../assets/cropper/dist/cropper.min.js'
  import '../../assets/cropper/dist/cropper.min.css'
  import toast from '../../utils/toast.min.js'
  import s from '../../assets/strings.json'

  export default {
    name: 'headimg-upload',
    data () {
      return {
        cropping: false,
        cropped: false,
        loaded: false
      }
    },
    methods: {
      selectImage (e) {
        let input = e.target
        let file = input.files[0]
        // 未选中图片
        if (!file) return
        // 非图片格式
        if (!/image\/*/.test(file.type)) {
          toast(s['invalid-image-type'])
          return
        }
        // 图片大于5M
        if (file.size / 1024 / 1024 > 5) {
          toast(s['img-le-5M'])
          return
        }
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          // 得到img的base64
          let data = e.target.result
          let img = this.$refs['img-crop']
          img.src = data
          $(img).cropper({ aspectRatio: 1 })
          // 添加图片移动监听
          $(document).on('keydown', function (e) {
            e.preventDefault()
            switch (e.which) {
              case 37: $(img).cropper('move', 10, 0)
                break
              case 38: $(img).cropper('move', 0, 10)
                break
              case 39: $(img).cropper('move', -10, 0)
                break
              case 40: $(img).cropper('move', 0, -10)
                break
            }
          })
          // 确认加载完毕
          this.loaded = true
        }
        // 显示cropper
        this.cropping = true
      },
      cropImage () {
        if (!this.loaded) return
        // 得到canvas
        let imgCrop = this.$refs['img-crop']
        let canvas = $(imgCrop).cropper('getCroppedCanvas')
        canvas.style.width = canvas.style.height = '100%'
        canvas.id = 'canvas-cropped'
        // 先清空后放入canvas
        $('#img-result').empty().append(canvas).removeClass('def-bg')
        // 恢复原来界面
        this.cropping = false
        this.cropped = true
        this.loaded = false
      },
      submitImage () {
        // 压缩图片
        let base64 = $('#canvas-cropped')[0].toDataURL('image/jpeg', 0.5)
        // 提交
        $.post(this.api.uploadImg, { base64, uname: this.getId() })
          .done(data => {
            if (data.result) {
              toast(s['upload-img-success'])
            }
          })
      }
    },
    mounted () {
      createCropper(this)
    }
  }

  function createCropper (vm) {
    $(vm.$el).children('img').cropper()
  }
</script>
  
<style scoped>
  .mask {
    position: fixed;
    z-index: 9999;
  }
  .dark {
    background-color: rgba(0,0,0,.8);
  }
  .max {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .mask-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img-container {
    width: 300px;
    height: 300px;
  }
  #img-result {
    width: 200px;
    height: 200px;
  }
  .def-bg {
    background-image: url('../../assets/img/nopic.jpg');
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>