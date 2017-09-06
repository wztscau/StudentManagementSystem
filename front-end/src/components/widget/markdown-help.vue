<!--
  @Author: wuzitao
  @Date:   2017-08-21 15:58:35
  @Last Modified time: 2017-08-22 20:48:38
-->
<template>
  <div id="markdown-help" class="modal-content">
    <h1>Markdown语法帮助</h1>
    <div>
      <ul>
        <li><a>标题</a>
          <div>
            在文字写书写不同数量的#可以完成不同的标题，如下：<br>
            <br>
            # 一级标题<br>
            ## 二级标题<br>
            ### 三级标题<br>
            #### 四级标题<br>
            ##### 五级标题<br>
            ###### 六级标题<br>
              <br>
            等号及减号也可以进行标题的书写，不过只能书写二级标题，并且需要写在文字的下面<br>，减号及等号的数量不会影响标题的基数，如下：<br>
              <br>
            二级标题<br>
            =========<br>
             <br>
            二级标题<br>
            ---------<br>
          </div>
        </li>
        <li><a>列表</a>
          <div>
            无序列表的使用，在符号“-”后加空格使用。如下：<br>
            <br>
            - 无序列表1<br>
            - 无序列表2<br>
            - 无序列表3<br>
            <br>
            如果要控制列表的层级，则需要在符号“-”前使用空格。如下：<br>
            <br>
            - 无序列表1<br>
            - 无序列表2<br>
              - 无序列表2.1<br>
                 - 列表内容<br>
                 - 列表内容<br>
            <br>
             <br>
            <br>
            有序列表的使用，在数字及符号“.”后加空格几个，如下：<br>
            <br>
            1. 有序列表1<br>
            2. 有序列表2<br>
            3. 有序列表3<br>
            有序列表如果要区分层级，也可以在数字前加空格。<br>
          </div>
        </li>
        <li><a>引用</a>
          <div>
            引用的格式是使用符号“>”后面书写文字，及可以使用引用。如下：<br>
            <br>
            >这个是引用<br>
            > 是不是和电子邮件中的<br>
            > 引用格式很像<br>
          </div>
        </li>
        <li><a>粗体与斜体</a>
          <div>
            粗体的使用是在需要加粗的文字前后各加两个“*”，而斜体的使用则是在需要斜体的文<br>字前后各加一个“*”，如果要使用粗体和斜体，那么就是在需要操作的文字前后各加三<br> 个“*”。如下：<br> 
            <br> 
            **这个是粗体**<br>
            *这个是斜体*<br>
            ***这个是粗体加斜体***<br> 
          </div>
        </li>
        <li><a>链接与图片</a>
          <div>
            在文中直接加链接，中括号中是需要添加链接的文字，圆括号中是需要添加的链接，如<br>下：<br>
            <br>
            [link text](http://example.com/ "optional title")<br>
            <br>
            在引用中加链接，第一个中括号添加需要添加的文字，第二个中括号中是引用链接的id，之后在引用<br>中，使用id加链接：如下：<br>
            <br>
            [link text][id]<br>
            [id]: http://example.com/ "optional title here"<br>
            <br>
            在文中直接引用链接，直接使用尖括号，把链接加入到尖括号中就可以实现，如下：<br>
            <br>
            <pre>
              <http://example.com/> or &lt;address @example.com&gt;<br>
            </pre>
            插入互联网上图片，格式如下：<br>
            <br>
            ![这里写图片描述](http://img3.douban.com/mpic/s1108264.jpg)<br>
            ![这里写图片描述][jane-eyre-douban]<br>
            [jane-eyre-douban]: http://img3.douban.com/mpic/s1108264.jpg<br>
          </div>
        </li>
        <li><a>代码块</a>
          <div>
            用TAB键起始的段落，会被认为是代码块，如下：<br>
            <br>
            <pre>
                &lt;php&gt;<br>
                    echo “hello world";<br>
                &lt;/php&gt;<br>
            </pre>
            <br>
            如果在一个行内需要引用代码，只要用反引号`引起来就好，如下：<br>
            <br>
            Use the `printf()` function.<br>
          </div>
        </li>
        <li><a>分割线与删除线</a>
          <div>
            可以在一行中用三个以上的星号、减号、底线来建立一个分隔线，同时需要在分隔线的<br>上面空一行。如下：<br>
            <br>
            ---<br>
            ****<br>
            ___<br>
            <br>
            删除线的使用，在需要删除的文字前后各使用两个符合“~”，如下<br>
            <br>
            ~~Mistaken text.~~<br>
          </div>
        </li>
        <li><a>代码块与语法高亮</a>
          <div>
            在需要高亮的代码块的前一行及后一行使用三个反引号“`”，同时第一行反引号后面表<br>面代码块所使用的语言，如下：<br>
            <br>
            ```ruby<br>
            require 'redcarpet'<br>
            markdown = Redcarpet.new("Hello World!")<br>
            puts markdown.to_html<br>
            ```            <br>
          </div>
        </li>
        <li><a>表格</a>
          <div>
            可以使用冒号来定义表格的对齐方式，如下：<br>
            <br>
            | Tables | Are | Cool |<br>
            | ------------- |:-------------:| -----:|<br>
            | col 3 is | right-aligned | $1600 |<br>
            | col 2 is | centered | $12 |<br>
            | zebra stripes | are neat | $1 |<br>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'markdown-help',
    data () {
      return {
      }
    },
    mounted () {
      $(this.$el).find('a').on('click', function () {
        console.log('c')
        $(this).parents('ul').find('div').hide()
        $(this).next('div').show()
      })
    }
  }
</script>
  
<style scoped>
  #markdown-help {
    display: none;
    position: absolute;
    top: 0;
    right: 20px;
  }
  #markdown-help ul {
    width: 25%;
    max-height: 420px;
    overflow: auto;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .modal-content {
    width: 300px;
    height: 470px;
  }
  .modal-content li > div {
    display: none;
    width: 75%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    overflow: auto;
    background-color: #fff;
    color: black;
    text-align: left;
    border-left: 1px solid #ccc;
    padding: 1em;
    z-index: 1023;
  }
  .modal-content li:first-child > div {
    display: block;
  }
  .model-content li:active > div {
    display: block;
  }
</style>