<!--
  @Author: wuzitao
  @Date:   2017-08-14 21:32:59
  @Last Modified time: 2017-08-20 00:55:43
-->
<template>
  <div class="btn-multiple">
    <a class="btn btn-app btn-xs" v-for="name,index of getValue(funs)"
      :class="clz[index].btn"
      @click="emitDataSubmit()">
      <i class="ace-icon fa bigger-230"
        :class="clz[index].fa"></i>
      {{ name }}
    </a>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'btn-multiple',
    props: {
      funs: Object
    },
    data () {
      let clz = [
        { btn: 'btn-primary', fa: 'fa-pencil-square-o' },
        { btn: 'btn-success', fa: 'fa-check' }
      ]
      this.funs.checked && clz.reverse()
      return {
        clz
      }
    },
    methods: {
      emitDataSubmit () {
        this.$emit('data-submit', this.$data)
      },
      getValue (funs) {
        if (!funs.value) return []
        return funs.value instanceof Array ? funs.value : [funs.value]
      },
      toggle () {
        if (this.getValue(this.funs).length === 2) {
          $toggle()
        }
      }
    },
    mounted () {
      this.toggle()
      $scrollInto()
    }
  }

  function $scrollInto () {
    let $btn = $('.btn-multiple')
    let mutedHeight = $('.breadcrumbs').outerHeight(true)
    let oCss = {
      position: $btn.css('position'),
      top: $btn.css('top')
    }
    let mt = $('.navbar').outerHeight()

    $(window).on('scroll', function (e) {
      if (this.scrollY >= mutedHeight) {
        $btn.css({
          position: 'fixed',
          top: mt
        })
      } else {
        $btn.css(oCss)
      }
    })
  }

  function $toggle () {
    $('.btn-multiple').click(function (e) {
      $(this).css('transform', `rotateX(${
        this.editable ? 0 : 180
      }deg)`)
      this.editable = !this.editable
    })
  }

  function $move () {
    $('.btn-multiple').appendTo('.page-header')
  }

</script>
  
<style scoped>
  .btn-multiple {
    position: absolute;
    width: 64px;
    height: 64px;
    right: 0;
    top: -10px;
    z-index: 100;
    transform-style: preserve-3d;
    transition: transform 1s;
  }
  .btn-multiple a {
    position: absolute;
  }
  .btn-multiple a:nth-child(1) {
    transform: rotate(0deg) translateZ(32px);
  }
  .btn-multiple a:nth-child(2) {
    transform: rotateX(-180deg) translateZ(32px);
  }
  .btn-multiple:hover i {
    animation: up 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  @keyframes up {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
      font-size: 25px;
    }
    100% {
      transform: translateY(0);
    }
  }
</style>