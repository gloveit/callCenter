<template>
  <div class="box">
    <div class="head">
      <!--<span class="title">工单列表</span>-->
      <div class="tiaoj">
        <span>分类：</span>
        <el-select v-model="tjian.FL" class="select1A" placeholder="分类">
          <el-option value="" label="全部"></el-option>
          <el-option value="咨询"></el-option>
          <el-option value="投诉"></el-option>
          <el-option value="报修"></el-option>
          <el-option value="报警"></el-option>
        </el-select>
        <span>回复状态：</span>
        <el-select v-model="tjian.HFBZ" class="select1A" placeholder="">
          <el-option value="" label="全部"></el-option>
          <el-option value="是"></el-option>
          <el-option value="否"></el-option>
        </el-select>
        <el-date-picker
          type="date"
          v-model="tjian.QSRQ"
          value-format="yyyyMMdd"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          type="date"
          v-model="tjian.ZZRQ"
          value-format="yyyyMMdd"
          placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" plain @click="getList">查询</el-button>
      </div>
    </div>
    <div class="content">
      <vue-scroll :ops="ops1">
        <table class="table">
          <tr>
            <th class="index">序号</th>
            <th class="xxid">信息ID</th>
            <th class="ptdm">平台代码</th>
            <th class="zh">用户账号</th>
            <th class="fl">分类</th>
            <th class="sjh">手机号</th>
            <th class="bt">标题</th>
            <th class="zw">正文</th>
            <th class="tp">图片</th>
            <th class="hf">回复</th>
            <th class="gd">生成工单</th>
          </tr>
          <tr v-for="(i,index) in list">
            <td>{{(page-1)*10+index+1}}</td>
            <td>{{i.XXID}}</td>
            <td>{{i.PTDM}}</td>
            <td>{{i.YHZH}}</td>
            <td>{{i.FL}}</td>
            <td>{{i.SJH}}</td>
            <td>
              <el-tooltip class="" effect="light" placement="top">
                <div slot="content" class="moreNr">{{i.BT}}</div>
                <el-button class="gdnr_tishi">{{i.BT}}</el-button>
              </el-tooltip>
            </td>
            <td>
              <el-tooltip class="" effect="light" placement="top">
                <div slot="content" class="moreNr">{{i.ZW}}</div>
                <el-button class="gdnr_tishi">{{i.ZW}}</el-button>
              </el-tooltip>
            </td>
            <td class="tp" @click="showImg(i.TPURI)"><img :src="i.TPURI" alt=""></td>
            <td class="hf" @click="huifu(i.XXID)">
              <img src="@/assets/imgs/huifu.png" alt="">
            </td>
            <td class="gd" @click="goGD(i.SJH,i.BT,i.ZW,i.FL)">
              <img src="@/assets/imgs/scgd.png" alt="">
            </td>
          </tr>
        </table>
      </vue-scroll>
    </div>
    <div class="fenye">
      <el-pagination
        :current-page="page"
        layout="total, prev, pager, next, jumper"
        @current-change="changePage"
        :total="totalNum">
      </el-pagination>
    </div>
    <div class="xxbl cx" v-if="hfShow">
      <div class="head">
        <span>回复</span>
        <div class="close" @click="closeHf">关闭</div>
      </div>
      <div class="con2">
        <vue-scroll :ops="ops">
          <div class="zu">
            <span class="label">信息ID</span>
            <el-input v-model="hfData.XXID" size="small" class="input xxid" readonly></el-input>
          </div>
          <div class="zu in">
            <span class="label">回复人姓名</span>
            <el-input v-model="HFRXM" size="small" class="input"></el-input>
          </div>
          <div class="zu in">
            <span class="label">服务机构电话</span>
            <el-input v-model="hfData.FWDH" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">回复摘要</span>
            <!--<el-input v-model="hfData.HFZY" size="small" class="input"></el-input>-->
            <el-input
              class="input"
              type="textarea"
              v-model="hfData.HFZY"
              :rows="2"
              placeholder="请输入内容"
            />
          </div>
          <div class="zu">
            <span class="label">回复正文</span>
            <el-input
              class="input"
              type="textarea"
              v-model="hfData.HFZW"
              :rows="4"
              placeholder="请输入内容"
            >
            </el-input>
          </div>
          <div class="zu">
            <span class="label">服务机构地址</span>
            <el-input v-model="hfData.FWDZ" size="small" class="input"></el-input>
          </div>
          <div class="zu ti">
            <el-button size="small" type="primary" @click="huifuSave">提交</el-button>
          </div>
        </vue-scroll>
      </div>
    </div>
    <div class="tupian" v-if="imgShow" @click="closeImg">
      <img :src="imgUrl" alt="">
    </div>
    <div class="modal" v-if="hfShow || imgShow"></div>
  </div>
</template>

<script>
    export default {
      name:"userInteractive",
      data() {
        return {
          ops1:{
            bar: {
              background: "rgba(144,147,153,.3)",
              onlyShowBarOnScroll: true,
            },
          },
          ops:{
            bar: {
              background: "rgba(144,147,153,.3)",
              onlyShowBarOnScroll: false,
            },
          },
          tjian:{
            FL:"",
            HFBZ:"否",
            QSRQ:window.getNowFormatDate('-',-1),
            ZZRQ:window.getNowFormatDate('-',0),
          },
          list:[],
          hfShow:false,
          //回复
          hfData:{
            XXID:"",
            HFZY:"",
            HFZW:"",
            FWDZ:"",
            FWDH:"",
          },
          imgShow:false,
          //当前页数
          page:1,
          totalNum:1,
          size:10,
        }
      },
      components:{

      },
      computed:{
        //回复人姓名
        HFRXM:{
          get: function () {
            return this.$store.state.agentInfo.loginName;
          },
          set: function (newVal) {
            // return newVal;
          }
        }
      },
      methods:{
        //获取用户交互列表
        getList(){
          this.list = [];
          this.axios({
            method:"post",
            url:"/dcgd/getUserAppeal",
            params:{
              NUM:this.page,SIZE:this.size,
              ...this.tjian
            }
          }).then((res) => {
            if(res.status == 200){
              if(res.data.lists){
                this.list = res.data.lists;
                this.totalNum = Number(res.data.RECORDS);
              }
            }else{
              this.$message.error("请求失败");
            }
          })
        },
        //放大图片
        showImg(url){
          this.imgUrl = url;
          this.imgShow = true;
        },
        //回复按钮点击
        huifu(XXID){
          this.hfShow = true;
          this.hfData = {
            XXID:XXID,
            HFZY:"",
            HFZW:"",
            FWDZ:"",
            FWDH:"96577",
            HFRXM:"",
          };
        },
        //回复提交
        huifuSave(){
          if(!this.hfData.HFZY){
            this.$message.info("请填写回复摘要!")
            return
          }
          if(!this.hfData.HFZW){
            this.$message.info("请填写回复正文!")
            return;
          }
          if(!this.hfData.FWDZ){
            this.$message.info("请填写服务地址!")
            return;
          }
          if(!this.hfData.FWDH){
            this.$message.info("请填写服务电话!")
            return;
          }
          if(!this.HFRXM){
            this.$message.info("请填写回复人姓名!")
            return;
          }
          this.axios({
            method:"post",
            url:"/dcgd/postReplyToUser",
            params:{
              ...this.hfData,
              HFRXM:this.HFRXM
            }
          }).then(res => {
            if(res.status == 200){
              if(res.data.FHM == "M000"){
                this.$message.sucess("回复成功!");
              }else{
                this.$message.error("回复失败!");
              }
            }
          })
        },
        //生成工单
        goGD(SJH,BT,ZW,FL){
          let curTabs = this.$store.state.tabViews;
          let a = curTabs.findIndex((value) => {
            return value.title == "新建工单";
          })
          let dl = '';
          if(FL == "咨询"){
            dl = 1;
          }
          if(FL == "投诉"){
            dl = 2;
          }
          if(FL == "报修"){
            dl = 3;
          }
          if(FL == "报警"){
            dl = 4;
          }
          //当前未打开新建工单页面
          if(a == -1){
            this.$store.state.gdData.SJH = SJH;
            this.$store.state.gdData.GDNR = "<"+BT+">" + "\n" +ZW;
            //来源APP
            this.$store.state.gdSource = 3;
            this.$store.state.goRoute("/workOrder?dl="+dl,"新建工单");
          }
          //当前已经有打开新建工单页面
          else{
            this.$confirm('您当前有未关闭的新建工单页面，是否覆盖?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              lockScroll:false,
            }).then(() => {
              let s = async () => {
                let a = await this.$store.state.closeTab("新建工单","/workOrder");
                this.$store.state.gdData.SJH = SJH;
                this.$store.state.gdData.GDNR = "<"+BT+">" + "\n" +ZW;
                //来源APP
                this.$store.state.gdSource = 3;
                this.$store.state.goRoute("/workOrder?dl="+dl,"新建工单");
              }
              s();
            }).catch(() => {
              console.log("已取消覆盖");
            });
          }
        },
        //关闭回复弹窗
        closeHf(){
          this.hfShow = false;
        },
        //关闭图片放大
        closeImg(){
          this.imgShow = false;
        },
        //翻页
        changePage(page){
          this.page = page;
          this.getList();
        },
      },
      mounted(){
        this.getList();
      }
    }

</script>

<style lang="scss" scoped>
  $boxPadding:15px;
  $box1paddingTop:10px;
  $headHeight:42px;
  .box{
    width:100%;
    height:100%;
    border-radius: 5px;
    box-shadow:0px 0px 9px 0px rgba(0,0,0,0.1),-2px 0px 9px 0px rgba(0,0,0,0.1),
    0px 2px 9px 0px rgba(0,0,0,0.1),2px 0px 9px 0px rgba(0,0,0,0.1);
    background: #fff;
    .head{
      height:calc(#{$headHeight} + #{$box1paddingTop} * 2);
      //background: #d9d9d9;
      color:#1F233E;
      display: flex;
      align-items: center;
      font-size: 16px;
      padding:$box1paddingTop $boxPadding;
      position: relative;
      font-family:"Microsoft YaHei";
    }
    .fenye{
      height:40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .content{
      height:calc(100% - #{$headHeight} - 40px - #{$box1paddingTop} * 2);
      padding:0px 5px 5px;
      box-sizing: border-box;
      position:relative;
    }
    table,table tr th, table tr td { border:1px solid #e2e5ec;text-align: center}
    .table{
      width:100%;
      border-collapse: collapse;
      box-sizing: border-box;
      table-layout: fixed;
      &.gd{
        position:absolute;
        z-index:1;
        top:0;
        left:0;
        background: #f1f1f1;
      }
      tr:focus,tr:hover{
        color: #3a8ee6;
        background-color: #ecf5ff;
      }
      /deep/ .el-button{
        color:inherit;
        background:none;
      }
      /deep/ .el-button:active{
        color:inherit;
        background:none;
      }
      /deep/ .el-button:focus{
        color:inherit;
        background:none;
      }
      /deep/ .el-button:hover{
        color:inherit;
        background:none;
      }
      tr{
        height:38px;
        td{
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        img{
          vertical-align: text-top;
        }
        .index{width:36px;}
        .xxid{width:54px;}
        .ptdm{
          width:66px;
        }
        .zh{
          width:220px;
        }
        .fl{
          width:60px;
        }
        .sjh{width:100px;}
        .bt{
          width:210px;
        }
        .zw{
          /*width:150px;*/
        }
        .tp{
          width:100px;
          cursor: pointer;
          img{
            max-height:36px;
          }
        }
        .hf{
          width:60px;
          cursor: pointer;
        }
        .gd{
          width:65px;
          cursor: pointer;
        }
      }
    }
  }
  //头部选择框
  .tiaoj{
    height:100%;
    //position: absolute;
    top:0;
    display: flex;
    align-items: center;
    //left等于第一个表格的宽度+表格padding
    left:145px;
    .select1A{
      width:140px;
      margin-right:20px;
    }
    .shu1A{
      width:180px;height:32px;
      margin-right:6px;
      display: flex;align-items: center;
    }
  }
  .gdnr_tishi{
    width:100%;
    height:100%;
    border:none;
    display: block;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .moreNr{
    width:260px;
    word-wrap:break-word ;
  }
  .cx {
    width: 711px;
    height: 569px;
    position: fixed;
    z-index: 3;
    margin: auto;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: #fff;
    border-radius: 6px;
    $h: 35px;
    $pl: 15px;
    .head {
      height: $h;
      background: #D9D9D9;
      color: #1F233E;
      display: flex;
      align-items: center;
      padding-left: $pl;
      position: relative;
      font-size: 14px;
      .close {
        position: absolute;
        height: 100%;
        right: $pl;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
  .xxbl{
    $pl:15px;
    .con2{
      height:calc(100% - 35px - 60px);
      padding:20px;
      .zu{
        display: flex;
        float: left;
        width:98%;
        margin-top:8px;
        margin-bottom:8px;
        font-size: 14px;
        &.in{
          width:46%;
        }
        &.ti{
          justify-content: flex-end;
        }
        .label{
          width:100px;
          margin-right:10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .input{
          width:calc(100% - 110px);
          &.xxid{
            width:120px;
          }
        }
        /deep/ .el-input__inner{
          background: #f3f3f3;
        }
      }
    }
  }
  .tupian{
    position: fixed;
    z-index:3;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      height:94%;
    }
  }
  .modal{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
    z-index:2;
  }
</style>
