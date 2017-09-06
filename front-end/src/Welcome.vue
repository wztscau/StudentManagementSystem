<!--
  @Author: wuzitao
  @Date:   2017-08-22 19:55:47
  @Last Modified time: 2017-08-22 23:09:35
-->
<template>
  <div id="welcome" class="container">
    <h1 id="intro">学生管理系统简介</h1>
    <button id="btn-left">向左</button>
    <div id="container">
      <ul id="imgul">
        <li v-for="src of imgs"><img :src="src" alt="" /></li>
      </ul>
      <button id="source">获取源码</button>
      <button id="enter">进入系统</button>
      <ul id="btns">
        <li v-for="entry,idx of imgs" class="btn1" :class="{ active1: idx === 0 }"></li>
      </ul>
    </div>
    <button id="btn-right">向右</button>
  </div>
</template>

<script>
  import $ from 'jquery'
  import i01 from './assets/img/01.png'
  import i02 from './assets/img/02.png'
  import i03 from './assets/img/03.png'
  import i04 from './assets/img/04.png'
  import i05 from './assets/img/05.png'
  import i06 from './assets/img/06.png'
  import extra from './assets/img/extra.png'

  export default {
  	name: 'welcome',
    data () {
      return {
        imgs: [i01, extra, i02, i03, i04, i05, i06]
      }
    },
    mounted () {
      let index = 0
      let self = this
      $('#imgul').css('width', this.imgs.length * 100 + '%')
        .children('li').css('width', 100 / this.imgs.length + '%')
      let w = $('#imgul li').width()
      $('#btn-left').click(function (event) {
        index = index <= 0 ? 0 : index - 1
        move(index, w)
      })
      $('#btn-right').click(function (event) {
        index = index >= self.imgs.length - 1 ? self.imgs.length - 1 : index + 1
        move(index, w)
      })
      $('.btn1').click(function (event) {
        index = $(this).index()
        move(index, w)
      })
      $('#enter').click(function (event) {
        self.$router.push('/login')
      })
      $('#source').click(function (event) {
        window.open(require('./config/server') + '/Student-management-system.zip')
      })
    }
  }

  function move (index, w) {
    let offset = -index * w + 'px'
    $('#imgul').css('left', offset)
    $('.btn1').eq(index).addClass('active1')
      .siblings().removeClass('active1')
  }

</script>
  
<style scoped>
	html, body {
		width: 100%;
		height: 100%;
	}
  #welcome {
  	width: 100%;
  	height: 100%;
  	position: fixed;
  	z-index: 5000;
  	background-color: #fff;
  	display: flex;
  	justify-content: center;
  	align-items: center;
  }
  #container {
  	width: 600px;
  	height: 600px;
    overflow: hidden;
    position: relative;
  }
  #intro {
    position: fixed;
    top: 0;
    left: 0;
  }
  #imgul {
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
    transition: left 1s;
    left: 0;
  }
  li {
    list-style: none; 
  }
  #imgul > li {
    height: 100%;
    float: left;
    vertical-align: top;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #imgul img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  #btns {
    position: absolute;
    bottom: 0;
    left: 150px;
  }
  .btn1 {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid black;
    box-sizing: border-box;
    margin: 0 5px;
    float: left;
    cursor: pointer;
  }
  .btn1:active {
    background-color: black;
    
  }
  .active1 {
    background-color: black;
  }
  #source {
    position: absolute;
    bottom: 30px;
    left: 120px;
  }
  #enter {
    position: absolute;
    bottom: 30px;
    left: 200px;
  }
</style>