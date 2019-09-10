<template>
  <div class="box">
    <div class="head">
      <div class="tiaoj">
        <div class="shu1A">
          <el-date-picker
            type="date"
            v-model="tjian.start_time"
            value-format="yyyyMMdd"
            placeholder="起始时间">
          </el-date-picker>
        </div>
        <div class="shu1A">
          <el-date-picker
            type="date"
            v-model="tjian.end_time"
            value-format="yyyyMMdd"
            placeholder="截止时间">
          </el-date-picker>
        </div>
        <div class="shu1A">
          <el-input v-model="tjian.glz" class="souInput1A" placeholder="管理站">
          </el-input>
        </div>
        <el-button type="primary" plain @click="getList">查询</el-button>
        <el-button type="primary" plain @click="exportAll">导出全部</el-button>
      </div>
      <div class="p_a_r10 cur_p">
        <img src="@/assets/imgs/print.png" @click="printContent" title="打印">
      </div>
    </div>
    <div class="content">
      <vue-scroll :ops="ops">
        <table class="table">
          <tr>
            <th class="index">管理站</th>
            <th class="index">注册码</th>
            <th class="index">卡号</th>
            <th class="index">人口数</th>
            <th class="index">用户id</th>
            <th class="index">用户名称</th>
            <th class="index">别名</th>
            <th class="index">手机号</th>
            <th class="index">时间</th>
            <th class="index">地址</th>
          </tr>
          <tr v-for="i in list" :key="i.id">
            <td>{{i.glz}}</td>
            <td>{{i.zcm}}</td>
            <td>{{i.kh}}</td>
            <td>{{i.rks}}</td>
            <td>{{i.yhid}}</td>
            <td>{{i.yhmc}}</td>
            <td>{{i.yhbm}}</td>
            <td>{{i.sjh}}</td>
            <td>{{i.time?i.time.substring(0,10):""}}</td>
            <td>{{i.dz}}</td>
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
  </div>
</template>

<script>
  export default {
    name:"msgAddList",
    data() {
      return {
        ops:{
          bar: {
            background: "rgba(144,147,153,.3)",
            onlyShowBarOnScroll: true,
          },
        },
        tjian:{
          start_time:window.getNowFormatDate('',-1),
          end_time:window.getNowFormatDate('',0),
          glz:"",
        },
        page:1,
        cnt:10,
        totalNum:0,
        //补录列表
        list:[],
      }
    },
    components:{

    },
    computed:{
    },
    methods:{
      //获取补录列表
      getList(){
        this.list = []
        this.axios({
          method:"get",
          url:"/userrecord/userRecordLists",
          params:{...this.tjian,page:this.page,cnt:this.cnt},
        }).then((res) => {
          if(res.status == 200){
            if(res.data.lists && res.data.lists.length){
              this.list = res.data.lists;
              this.totalNum = res.data.num;
            }
          }else{
            this.$message.error("请求失败");
          }
        })
      },
      changePage(page){
        this.page = page;
        this.getList();
      },
      printContent(){
        this.printH("补录列表 "+this.tjian.beginDate+"至"+this.tjian.endDate)
      },
      //全部导出
      exportAll(){
        let url = "/userrecord/userRecordLists?";
        let str = "";
        for(let key in this.tjian){
          url = url + key + "=" + this.tjian[key] + "&"
        }
        url = url + "page=" + this.page+"&cnt="+this.cnt+"&";
        url = url+"mode=export&names=glz,zcm,kh,rks,yhid,yhmc,yhbm,sjh,time,dz&titles=管理站,注册码,卡号,人口数,用户id,用户名称,别名,手机号,时间,地址"
        window.open(url)
      },
    },
    mounted(){
      let end = new Date();
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
    .zxzh{width:130px;}
    .zxmc{width:130px;}
    .my{width:100px;}
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
    margin-right:30px;
  }
  .shu1A{
    width:180px;height:32px;
    margin-right:30px;
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
</style>

</style>
