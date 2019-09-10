<template>
  <div class="box">
    <div class="head">
      <div class="tiaoj">
        <div class="shu1A">
          <el-date-picker
            type="date"
            v-model="beginDate"
            value-format="yyyy-MM-dd"
            placeholder="起始时间">
          </el-date-picker>
        </div>
        <div class="shu1A">
          <el-date-picker
            type="date"
            v-model="endDate"
            value-format="yyyy-MM-dd"
            placeholder="截止时间">
          </el-date-picker>
        </div>
        <el-button type="primary" plain @click="getList">查询</el-button>
      </div>
      <div class="p_a_r10 cur_p">
        <img src="@/assets/imgs/print.png" @click="printContent" title="打印">
      </div>
    </div>
    <div class="content">
      <vue-scroll :ops="ops">
        <table class="table">
          <tr>
            <th class="index">工号</th>
            <th class="index">事故处理</th>
            <th class="index">投诉处理</th>
            <th class="index">故障报修</th>
          </tr>
          <tr v-for="i in list">
            <td>{{i.username}}</td>
            <td>{{i.事故处理?i.事故处理:0}}</td>
            <td>{{i.投诉处理?i.投诉处理:0}}</td>
            <td>{{i.故障报修?i.故障报修:0}}</td>
          </tr>
        </table>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
  export default {
    name:"work",
    data() {
      return {
        ops:{
          bar: {
            background: "rgba(144,147,153,.3)",
            onlyShowBarOnScroll: true,
          },
        },
        beginDate:"2016-1-01",
        endDate:"",
        //工单列表
        list:[],
        username:"",
        //合计
        total:"0",
      }
    },
    components:{

    },
    computed:{
    },
    methods:{
      //求和方法
      getSum:function(ar){
        let arr=ar;
        let sum=arr.reduce(function(prev, curr, idx, arr){
          return prev + curr;
        });
        return  sum;
      },
      //投诉明细报表
      getList(){
        this.axios({
          method:"post",
          url:"/report/NumCount",
          params:{start_time:this.beginDate,end_time:this.endDate},
        }).then((res) => {
          if(res.status == 200){
            this.list = res.data;
          }else{
            this.$message.error("请求失败");
          }
        })
      },
      printContent(){
        this.printH("工单量统计报表 "+this.beginDate+"至"+this.endDate)
      },
    },
    mounted(){
      const end = new Date();
      this.endDate=end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate() + ' ' + end.getHours() + ':' + end.getMinutes() + ':' + end.getSeconds();
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
