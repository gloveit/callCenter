<template>
  <div class="box">
    <div class="head">
      <div class="tiaoj">
        <div class="shu1A">
          <el-date-picker
            type="year"
            v-model="beginDate"
            value-format="yyyy"
            placeholder="起始年份">
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
            <th class="index">月份</th>
            <th class="index">接通电话量</th>
            <th class="index">漏接电话量</th>
            <th class="index">呼出电话量</th>
            <th class="index">共计</th>
          </tr>
          <tr v-for="i in list">
            <td>{{i.month}}</td>
            <td>{{i.inbound}}</td>
            <td>{{i.inboundL}}</td>
            <td>{{i.outbound}}</td>
            <td>{{i.sum}}</td>
          </tr>
          <tr v-for="i in total">
            <td>共计</td>
            <td>{{i.service_count}}</td>
            <td>{{i.inbound_count-i.service_count}}</td>
            <td>{{i.outbound_count}}</td>
            <td>{{totalT}}</td>
          </tr>
        </table>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
  export default {
    name:"statisticsM",
    data() {
      return {
        ops:{
          bar: {
            background: "rgba(144,147,153,.3)",
            onlyShowBarOnScroll: true,
          },
        },
        beginDate:new Date().getFullYear()+"",
        list:[],
        total:[],
        //合计
        totalT:"0",
      }
    },
    methods:{
      //投诉明细报表
      getList(){
        this.list = [];
        this.axios({
          method:"post",
          url:"/report/calls",
          data:{year:this.beginDate},
        }).then((res) => {
          if(res.status == 200){
            const monthIn = [0,0,0,0,0,0,0,0,0,0,0,0];
            const monthInL = [0,0,0,0,0,0,0,0,0,0,0,0];
            const monthOut = [0,0,0,0,0,0,0,0,0,0,0,0];
            const month =["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
            res.data.list.forEach((i) => {
              let mon =i.stat_date.substring(5);
              mon = mon.replace(/\b(0+)/gi,"")
              monthIn[mon-1] = i.service_count;
              monthInL[mon-1] = i.request_service_count - i.service_count;
              monthOut[mon-1] = i.outbound_count;
              this.list.push({
                inbound:monthIn[mon-1],
                outbound:monthOut[mon-1],
                inboundL:monthInL[mon-1],
                month:month[mon-1],
                sum:monthIn[mon-1]+monthOut[mon-1]+monthInL[mon-1]
              });
            });
            this.total = res.data.sumRow;
            let that = this;
            res.data.sumRow.forEach(function(i){
              let totalT =  i.inbound_count + i.outbound_count;
              that.totalT = totalT;
            });
          }else{
            this.$message.error("请求失败");
          }
        })
      },
      printContent(){
        this.printH("呼入呼出月报表 "+this.beginDate)
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
