<template>
  <div class="box">
    <div class="head">
      <div class="p_a_r5">
        <el-button type="primary" plain @click="exportAll">导出全部</el-button>
      </div>
    </div>
    <div class="head">
      <!--<span class="title">工单列表</span>-->
      <div class="tiaoj">
        <el-select v-model="tjian.jsbm" class="select1A" placeholder="接收部门">
          <el-option value="" label="全部"></el-option>
          <el-option value="建设路站"></el-option>
          <el-option value="大营盘站"></el-option>
          <el-option value="新建路站"></el-option>
          <el-option value="迎新街站"></el-option>
          <el-option value="河西站"></el-option>
          <el-option value="和平北站"></el-option>
          <el-option value="工营事团"></el-option>
          <el-option value="管线所"></el-option>
        </el-select>
        <el-select v-model="tjian.sllb" class="select1A" placeholder="受理类别">
          <el-option value="" label="全部"></el-option>
          <el-option v-for="(item,index) in sldlList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
        <div class="shu1A">
          <el-input v-model="tjian.yhmc" class="souInput1A" placeholder="用户名称">
          </el-input>
        </div>
        <div class="shu1A">
          <el-input v-model="tjian.sjh" class="souInput1A" placeholder="手机号">
          </el-input>
        </div>
        <div class="shu1A">
          <el-date-picker
            type="date"
            v-model="tjian.start_creat_time"
            value-format="yyyyMMdd"
            placeholder="创建开始日期">
          </el-date-picker>
        </div>
        <div class="shu1A">
          <el-date-picker
            type="date"
            v-model="tjian.end_creat_time"
            value-format="yyyyMMdd"
            placeholder="创建完成日期">
          </el-date-picker>
        </div>
        <el-button type="primary" plain @click="getList">查询</el-button>
        <el-button type="danger" plain @click="clearSearch">重置</el-button>
      </div>
    </div>
    <div class="content">
      <vue-scroll :ops="ops1">
        <table class="table" id="TD" >
          <tr>
            <th class="index">#</th>
            <th class="gdh">工单号</th>
            <!--<th class="yhid">用户ID</th>-->
            <th class="xm">姓名</th>
            <th class="sjh">手机号</th>
            <th class="dz">地址</th>
            <th class="jsbm">接收部门</th>
            <th class="nr">工单内容</th>
            <th class="rq">创建日期</th>
            <!--<th class="rq">计划完成日期</th>-->
            <th class="cjr">创建人</th>
            <th >完成日期</th>
            <th >返单信息</th>
            <th class="duban">督办</th>
          </tr>
          <tr @dblclick="gdJindu(i.kfgdh)" v-for="(i,index) in list">
            <td>{{(page-1)*10+index+1}}</td>
            <td>{{i.kfgdh}}</td>
            <!--<td>{{i.yhid}}</td>-->
            <td>
              <el-tooltip class="" effect="light" :content="i.yhmc" placement="top">
                <el-button class="gdnr_tishi">{{i.yhmc}}</el-button>
              </el-tooltip>
            </td>
            <td>{{i.sjh}}</td>
            <td>
              <el-tooltip class="" effect="light" :content="i.dz" placement="top">
                <el-button class="gdnr_tishi">{{i.dz}}</el-button>
              </el-tooltip>
            </td>
            <td>{{i.jsbm}}</td>
            <td>
              <el-tooltip class="" effect="light" placement="top">
                <div slot="content" class="moreNr">{{i.gdnr}}</div>
                <el-button class="gdnr_tishi">{{i.gdnr}}</el-button>
              </el-tooltip>
            </td>
            <td>{{i.creat_time?i.creat_time.substring(0,10):""}}</td>
            <!--<td>{{i.jhrq?(i.jhrq.substring(0,4)+"-"+i.jhrq.substring(4,6)+"-"+i.jhrq.substring(6)):""}}</td>-->
            <td>{{i.user?i.user.name:""}}</td>
            <td>{{i.wcrq?i.wcrq.substring(0,10):""}}</td>
            <td>
              <el-tooltip class="" effect="light" :content="i.fdxx" placement="top">
                <el-button class="gdnr_tishi">{{i.fdxx}}</el-button>
              </el-tooltip>
            </td>
            <td><el-button class="gdnr_tishi">督办</el-button></td>
          </tr>
          <tr>
            <td colspan="11" v-if="!list.length">暂无数据</td>
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
    <div class="xxbl cx" v-if="jdShow">
      <div class="head">
        <span>工单督办</span>
        <div class="close" @click="closeJd">关闭</div>
      </div>
      <div class="con2">
        <vue-scroll :ops="ops">
          <div class="zu">
            <span class="label">用户ID</span>
            <el-input v-model="jdData.YHID" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">用户名称</span>
            <el-input v-model="jdData.YHMC" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">客服系统工单号</span>
            <el-input v-model="jdData.KFGDH" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">业务系统工单号</span>
            <el-input v-model="jdData.YWGDH" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">任务创建日期</span>
            <el-input v-model="jdData.CJRQ" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">计划完成日期</span>
            <el-input v-model="jdData.JDWCRQ" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">任务节点</span>
            <el-input v-model="jdData.RWJD" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">节点完成日期</span>
            <el-input v-model="jdData.JDWCRQ" size="small" class="input"></el-input>
          </div>
        </vue-scroll>
      </div>
    </div>
    <div class="modal" v-if="jdShow"></div>
  </div>
</template>

<script>
    export default {
      name:"workOrderList",
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
          //受理类别查询列表
          sldlList:[],
          // 工单列表查询条件
          tjian:{jsbm:"",sllb:"",yhmc:"",sjh:"",start_creat_time:"",end_creat_time:""},
          //工单列表
          list:[],
          jdShow:false,
          //工单进度
          jdData:{
            YHID:"",
            YHMC:"",
            KFGDH:"",
            YWGDH:"",
            CJRQ:"",
            JHRQ:"",
            RWJD:"",
            JDWCRQ:"",
          },
          //当前页数
          page:1,
          totalNum:1,
          cnt:10,
        }
      },
      components:{

      },
      computed:{
      },
      methods:{
        //受理大类列表
        getListD(){
          this.sldlList = [];
          this.axios({
            method:"get",
            url:"/dcgd/firstWorkorderCategory",
          }).then((res) => {
            if(res.status==200){
              this.sldlList = res.data;
            }
          })
        },
        //重置查询
        clearSearch(){
          this.tjian =
            {jsbm:"",sllb:"",yhmc:"",sjh:"",start_creat_time:"",end_creat_time:""};
          this.list = [];
        },
        //获取工单列表
        getList(){
          this.list = [];
          this.axios({
            method:"post",
            url:"/dcgd/getWorkOrderListsBy",
            params:{...this.tjian,page:this.page,cnt:this.cnt},
          }).then((res) => {
            if(res.status == 200){
              if(res.data.lists){
                this.list = res.data.lists;
                this.totalNum = res.data.num
              }
            }else{
              this.$message.error("请求失败");
            }
          })
        },
        //全部导出
        exportAll(){
          let url = "/dcgd/getWorkOrderListsBy?";
          let str = "";
          for(let key in this.tjian){
            url = url + key + "=" + this.tjian[key] + "&"
          }
          url = url + "page=" + this.page+"&cnt="+this.cnt+"&";
          url = url+"mode=export&names=kfgdh,yhid,yhmc,sjh,dz,jsbm,gdnr,creat_time,jhrq,user.name&titles=工单号,用户ID,姓名,手机号,地址,接收部门,工单内容,创建日期,计划完成日期,创建人"
          window.open(url)
        },
        //打印
        printContent(){

        },
        //显示工单进度弹窗
        gdJindu(gdh){
          if(!gdh){
            this.$message.info("该工单未查询到工单进度!");
            return;
          }
          this.jdShow = true;
          this.jdData = {};
          this.axios({
            method:"get",
            url:"/dcgd/getUserTaskTrace",
            params:{
              TJLX:1,
              TJ:gdh
            }
          }).then((res) => {
            if(res.status == 200){
              if(res.data.FHM == "M000"){
                  this.jdData = res.data.lists[0];
                  this.jdData.KFGDH = gdh;
              }else{
                this.$message.info(res.data.FHXX);
                this.jdData = {};
              }
            }else{
              this.$message.error("请求错误!")
            }
          })
        },
        closeJd(){
          this.jdShow = false;
        },
        //翻页
        changePage(page){
          this.page = page;
          this.getList();
        },
      },
      mounted(){
        this.getListD();
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
        .index{width:30px;}
        .gdh{
          width:150px;
        }
        .yhid{
          width:110px;
        }
        .xm{
          width:140px;
        }
        .sjh{
          width:100px;
        }
        .dz{
          width:160px;
        }
        .jsbm{
          width:100px;
        }
        .nr{
          //width:150px;
        }
        .rq{
          width:100px;
        }
        .cjr{width:100px;}
        .duban{width:70px;}
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
      margin-right:6px;
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
        width:46%;
        margin-right:4%;
        margin-top:8px;
        margin-bottom:8px;
        font-size: 14px;
        .label{
          width:80px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .input{
          width:calc(100% - 60px);
        }
        /deep/ .el-input__inner{
          background: #f3f3f3;
        }
      }
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
