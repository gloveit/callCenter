<template>
  <div class="article">
    <vue-scroll :ops="ops" @handle-resize="handleResize">
      <div class="ge"></div>
      <h3 class="titlestyle">{{title}}</h3>
      <p class="article_author">作者：{{author}} &nbsp;&nbsp;&nbsp;创作时间：{{createtime}}</p>
      <div class="content">
        <div v-html="content" class="articleCon ql-editor"></div>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title: '',
        ops: {
          vuescroll:{
            mode: 'slide',
            pushLoad:{
              enable:false
            },
            pullRefresh:{
              enable:false
            },
            scroller:{
              bouncing: ['bottom'],
              minZoom: 1,
            },
          },
          scrollPanel:{
            scrollingX:false,
          },
          bar: {
            background: "rgba(144,147,153,.3)",
            onlyShowBarOnScroll: true,
          }
        },
        content: "",
        author: "",
        createtime: ""
      }
    },
    computed: {
    },
    methods: {
      handleResize(){
        if(window.screen.width <= 500){
          this.ops.vuescroll.mode = "slide";
        }else{
          this.ops.vuescroll.mode = "native";
        }
      },
      initEveryArticle() {
        let that = this;
        this.axios({
          method: "post",
          url: "/knowledge/findKnowledge",
          params: {
            id: this.$route.query.id
          }
        }).then(res => {
          if(res.status == 200 && res.data){
            let data = res.data;
            let {id, title, body, create_time, user} = data;
            let author = user.name;
            let createtime = create_time.slice(0, 10);
            that.title = title;
            document.title = title;
            // console.log(body);
            that.content = body;
            that.author = author;
            that.createtime = createtime;
          }else{
            this.$message.error("获取文章失败！")
          }
        })
      }
    },
    mounted() {
      this.handleResize();
      if(!this.$route.query.id){
        this.$message.error("暂无文章，请返回！");
      }else{
        this.initEveryArticle()
      }
    },
  }
</script>

<style scoped>
  .article {
    width: 100%;
    height: 100%;
    padding:10px 100px 10px 100px;
    overflow: hidden auto;
  }
  .ge{
    height:20px;
  }
  .back {
    width: 50px;
    height: 30px;
    padding: 0;
    float: right;
    margin-right: 20px
  }

  .titlestyle {
    height: 46px;
    display: flex;
    /*justify-content: center;*/
    align-items: center;
    text-align: center;
    font-size: 22px;
  }

  .article_author {
    height:25px;
    display: flex;
    /*justify-content: center;*/
    align-items: center;
    font-size: 14px;
    color: #ccc
  }

  .content {
    width: 100%;
    padding-top:15px;
    /*height: calc(100% - 72px);*/
    font-size: 16px;
    /*padding: 10px;*/
    /* background:#0f0 */
  }

  .article_time {
    font-size: 14px;
    text-align: center;
    color: #ccc
  }
  .btnback {
    height: 30px;
  }

  .articleCon {
    padding: 0;
    width:100%;
    overflow-x: hidden;
  }

  @media screen and (max-width: 500px) {
    .ge{
      height:0px;
    }
    .article{
      padding:0px 10px;
    }
  }
</style>
