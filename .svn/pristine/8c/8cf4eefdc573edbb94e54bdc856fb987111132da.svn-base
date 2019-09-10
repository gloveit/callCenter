<template>
  <div class="article">
    <p class="btnback">
      <el-tooltip content="返回知识库" placement="top">
        <el-button icon="el-icon-arrow-left" class="back" @click="back"></el-button>
      </el-tooltip>
    </p>
    <vue-scroll :ops="ops">
      <h3 class="titlestyle">{{title}}</h3>
      <p class="article_author">作者：{{author}} &nbsp;&nbsp;&nbsp;创作时间：{{createtime}}</p>
      <div class="content">
        <div v-html="content" class="articleCon ql-editor"></div>
      </div>
    </vue-scroll>
    <!--<p class="btnback">-->
      <!--<el-tooltip content="返回知识库" placement="top">-->
        <!--<el-button icon="el-icon-arrow-left" class="back" @click="back"></el-button>-->
      <!--</el-tooltip>-->
    <!--</p>-->
    <!--<h3 class="titlestyle">{{title}}</h3>-->
    <!--<p class="article_author">太原天然气 &nbsp;&nbsp;&nbsp;作者：{{author}} &nbsp;&nbsp;&nbsp;创作时间：{{createtime}}</p>-->
    <!--<div class="content">-->
      <!--<vue-scroll :ops="ops">-->
        <!--<div v-html="content" class="articleCon ql-editor"></div>-->
      <!--</vue-scroll>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: 'articleDetail',
    data() {
      return {
        webTitle:"太原呼叫中心",
        title: '',
        ops: {
          bar: {
            background: "rgba(144,147,153,.3)",
            onlyShowBarOnScroll: false,
          }
        },
        content: "",
        author: "",
        createtime: ""
      }
    },
    computed: {
      articleId() {
        return this.$store.state.articleId;
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      initEveryArticle() {
        let that = this;
        let id = that.articleId;
        this.axios({
          method: "post",
          url: "/knowledge/findKnowledge",
          params: {
            id: id
          }
        }).then(res => {
          // console.log(res.data);
          let data = res.data;
          let {id, title, body, create_time, user} = data;
          let author = user.name;
          let createtime = create_time.slice(0, 10);
          that.title = title;
          // console.log(body);
          that.content = body;
          that.author = author;
          that.createtime = createtime;
        })
      }
    },
    activated() {
      console.log("文章详情Active")
      this.initEveryArticle()
    },
    mounted() {
      this.initEveryArticle()
    }
  }
</script>

<style scoped>
  .article {
    width: 100%;
    height: 100%;
    overflow: hidden auto;
    padding:10px 100px 10px 100px;
  }

  .back {
    width: 50px;
    height: 30px;
    padding: 0;
    float: right;
    margin-right: 20px
  }

  .titlestyle {
    /*text-align: center;*/
    height:40px;
    font-size: 22px;
  }

  .content {
    width: 100%;
    /*height: calc(100% - 94px);*/
    /*padding-top:10px;*/
    font-size: 16px;
    /*padding: 15px;*/
    /* background:#0f0 */
  }

  .article_author {
    /*text-align: center;*/
    font-size: 14px;
    color: #ccc
  }

  .article_time {
    font-size: 14px;
    text-align: center;
    color: #ccc
  }

  .btnback {
    height: 30px;
    position: absolute;
    right:0;
    top:60px;
  }

  .articleCon {
    /*padding:0px 100px 20px;*/
    padding:10px 0 10px;
  }

  @media screen and (max-width: 500px) {
    .article{
      padding:8px 10px;
    }
  }
</style>
