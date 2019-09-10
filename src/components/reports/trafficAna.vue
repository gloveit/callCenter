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
            <th class="index">#</th>
            <th class="index">一月</th>
            <th class="index">二月</th>
            <th class="index">三月</th>
            <th class="index">四月</th>
            <th class="index">五月</th>
            <th class="index">六月</th>
            <th class="index">七月</th>
            <th class="index">八月</th>
            <th class="index">九月</th>
            <th class="index">十月</th>
            <th class="index">十一月</th>
            <th class="index">十二月</th>
            <th class="index">共计</th>
          </tr>
          <tr>
            <td>接通量(个)</td>
            <td v-for="i in service">{{i}}</td>
            <td v-for="i in totalSum">{{i.service_count}}</td>
          </tr>
          <tr>
            <td>漏接量(个)</td>
            <td v-for="i in NoService">{{i}}</td>
            <td v-for="i in totalSum">{{i.no_service_count}}</td>
          </tr>
          <tr>
            <td>共计(个)</td>
            <td v-for="i in total">{{i}}</td>
            <td v-for="i in totalSum">{{i.request_service_count}}</td>
          </tr>
          <tr>
            <td>接通率(%)</td>
            <td v-for="i in serviceRate">{{i}}</td>
            <td v-for="i in totalSum">{{i.service_rate}}</td>
          </tr>
          <tr>
            <td>漏接率(%)</td>
            <td v-for="i in NoServiceRate">{{i}}</td>
            <td v-for="i in totalSum">{{i.no_service_rate}}</td>
          </tr>
          <tr>
            <td>日均话务量(个)</td>
            <td v-for="i in average">{{i}}</td>
            <td v-for="i in totalSum">{{i.average_day_count}}</td>
          </tr>
        </table>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
  export default {
    name:"trafficAna",
    data() {
      return {
        ops:{
          bar: {
            background: "rgba(144,147,153,.3)",
            onlyShowBarOnScroll: true,
          },
        },
        beginDate:"2018",
        totalSum:[],
        service:[],
        NoService:[],
        total:[],
        serviceRate:[],
        NoServiceRate:[],
        average:[],
        serviceT:"",
        NoServiceT:"",
        totalT:"",
        serviceRateT:"",
        NoServiceRateT:"",
        averageT:"",
      }
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
          url:"/report/callsRate",
          data:{year:this.beginDate},
        }).then((res) => {
          if(res.status == 200){
            console.log(res.data.list);
            const project = ["接通量(个)","漏接量(个)","共计(个)","接通率(%)","漏接率(%)","日均话务量(个)"];
            const service = [0,0,0,0,0,0,0,0,0,0,0,0];
            const NoService = [0,0,0,0,0,0,0,0,0,0,0,0];
            const total = [0,0,0,0,0,0,0,0,0,0,0,0];
            const serviceRate = [0,0,0,0,0,0,0,0,0,0,0,0];
            const NoServiceRate = [0,0,0,0,0,0,0,0,0,0,0,0];
            const average = [0,0,0,0,0,0,0,0,0,0,0,0];
            res.data.list.forEach(function(i){
              let mon =i.stat_date.substring(5);
              switch(mon){
                case "01" :
                  service[0] = i.service_count;
                  NoService[0] = i.no_service_count;
                  total[0] = i.request_service_count;
                  serviceRate[0] = i.service_rate;
                  NoServiceRate[0] = i.no_service_rate;
                  serviceRate[0] = i.service_rate;
                  average[0] = i.average_day_count;
                  break;
                case "02" :
                  service[1] = i.service_count;
                  NoService[1] = i.no_service_count;
                  total[1] = i.request_service_count;
                  serviceRate[1] = i.service_rate;
                  NoServiceRate[1] = i.no_service_rate;
                  serviceRate[1] = i.service_rate;
                  average[1] = i.average_day_count;
                  break;
                case "03" :
                  service[2] = i.service_count;
                  NoService[2] = i.no_service_count;
                  total[2] = i.request_service_count;
                  serviceRate[2] = i.service_rate;
                  NoServiceRate[2] = i.no_service_rate;
                  serviceRate[2] = i.service_rate;
                  average[2] = i.average_day_count;
                  break;
                case "04" :
                  service[3] = i.service_count;
                  NoService[3] = i.no_service_count;
                  total[3] = i.request_service_count;
                  serviceRate[3] = i.service_rate;
                  NoServiceRate[3] = i.no_service_rate;
                  serviceRate[3] = i.service_rate;
                  average[3] = i.average_day_count;
                  break;
                case "05" :
                  service[4] = i.service_count;
                  NoService[4] = i.no_service_count;
                  total[4] = i.request_service_count;
                  serviceRate[4] = i.service_rate;
                  NoServiceRate[4] = i.no_service_rate;
                  serviceRate[4] = i.service_rate;
                  average[4] = i.average_day_count;
                  break;
                case "06" :
                  service[5] = i.service_count;
                  NoService[5] = i.no_service_count;
                  total[5] = i.request_service_count;
                  serviceRate[5] = i.service_rate;
                  NoServiceRate[5] = i.no_service_rate;
                  serviceRate[5] = i.service_rate;
                  average[5] = i.average_day_count;
                  break;
                case "07" :
                  service[6] = i.service_count;
                  NoService[6] = i.no_service_count;
                  total[6] = i.request_service_count;
                  serviceRate[6] = i.service_rate;
                  NoServiceRate[6] = i.no_service_rate;
                  serviceRate[6] = i.service_rate;
                  average[6] = i.average_day_count;
                  break;
                case "08" :
                  service[7] = i.service_count;
                  NoService[7] = i.no_service_count;
                  total[7] = i.request_service_count;
                  serviceRate[7] = i.service_rate;
                  NoServiceRate[7] = i.no_service_rate;
                  serviceRate[7] = i.service_rate;
                  average[7] = i.average_day_count;
                  break;
                case "09" :
                  service[8] = i.service_count;
                  NoService[8] = i.no_service_count;
                  total[8] = i.request_service_count;
                  serviceRate[8] = i.service_rate;
                  NoServiceRate[8] = i.no_service_rate;
                  serviceRate[8] = i.service_rate;
                  average[8] = i.average_day_count;
                  break;
                case "10" :
                  service[9] = i.service_count;
                  NoService[9] = i.no_service_count;
                  total[9] = i.request_service_count;
                  serviceRate[9] = i.service_rate;
                  NoServiceRate[9] = i.no_service_rate;
                  serviceRate[9] = i.service_rate;
                  average[9] = i.average_day_count;
                  break;
                case "11" :
                  service[10] = i.service_count;
                  NoService[10] = i.no_service_count;
                  total[10] = i.request_service_count;
                  serviceRate[10] = i.service_rate;
                  NoServiceRate[10] = i.no_service_rate;
                  serviceRate[10] = i.service_rate;
                  average[0] = i.average_day_count;
                  break;
                case "12" :
                  service[11] = i.service_count;
                  NoService[11] = i.no_service_count;
                  total[11] = i.request_service_count;
                  serviceRate[11] = i.service_rate;
                  NoServiceRate[11] = i.no_service_rate;
                  serviceRate[11] = i.service_rate;
                  average[11] = i.average_day_count;
                  break;
              }
            });
            this.totalSum = res.data.sumRow;
            this.service = service;
            this.NoService = NoService;
            this.total = total;
            this.serviceRate = serviceRate;
            this.NoServiceRate = NoServiceRate;
            this.average = average;
          }else{
            this.$message.error("请求失败");
          }
        })
      },
      printContent(){
        this.printH("话务量分析统计 "+this.beginDate)
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

</style>
