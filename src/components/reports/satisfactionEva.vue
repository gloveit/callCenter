<template>
  <div class="box">
    <vue-scroll :ops="ops">
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
        <table class="table">
          <tr>
            <th class="index">序号</th>
            <th class="index">名称</th>
            <th class="index">满意程度</th>
            <th class="index">话务总量</th>
            <th class="index">百分比(%)</th>
          </tr>
          <tr v-for="(i,index) in list" :key="index">
            <td>{{index+1}}</td>
            <td>{{i.name}}</td>
            <td>{{i.conArray}}</td>
            <td>{{Sum}}</td>
            <td>{{i.rateArray}}%</td>
          </tr>
          <tr>
            <td></td>
            <td>合计</td>
            <td>{{Sum}}</td>
            <td>{{Sum}}</td>
            <td>100%</td>
          </tr>
        </table>
        <div style="height:10px;"></div>
        <div class="echart border">
          <div id="warranty"></div>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
  export default {
    name:"satisfactionEva",
    data() {
      return {
        ops:{
          bar: {
            background: "rgba(144,147,153,.3)",
            onlyShowBarOnScroll: true,
          },
        },
        beginDate:"2018",
        total:0,
        list:[],
        name:[],
        Rate:[],
        Sum:"",
      }
    },
    components:{

    },
    computed:{
    },
    methods:{
      //保修类别对比报表
      getList(){
        this.list = [];
        this.axios({
          method:"post",
          url:"/report/satisfactionCalls",
          data:{year:this.beginDate},
        }).then((res) => {
          if(res.status == 200){
            let name =[];
            res.data.grades.forEach(function(i){
              name.push(i.grade_name);
            });
            this.name = name;
            this.Rate = res.data.contentmentRateArray;
            console.log(this.Rate);
            for(let i=0;i<name.length;i++){
              let obj ={};
              obj["name"] = name[i];
              obj["conArray"] = res.data.contentmentArray[i];
              obj["rateArray"] = res.data.contentmentRateArray[i];
              this.list.push(obj);
            }
            this.Sum = res.data.sum;
            this.echart();
          }else{
            this.$message.error("请求失败");
          }
        })
      },
      echart(data){
        this.warranty = this.$echarts.init(document.getElementById('warranty'));
        let option = {
          title: {
            text: '满意率（%）',
            textStyle:{
              fontWeight:200,
              fontSize:12
            }
          },
          color: ['#3398DB','#006699'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: this.yearlist
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '0',
            top:'25px',
            containLabel: true
          },
          xAxis : [{
            type : 'category',
            data : this.name,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval:0,
            },
          }],
          yAxis : [{
            type : 'value'
          }],
          series : [
            {
              type:'bar',
              barWidth: '20%',
              data:this.Rate,
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
            }
          ]
        };
        this.warranty.setOption(option);
      },
      printContent(){
        this.printH("工单类别周报表 "+this.beginDate)
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
  .border{
    border:1px solid #e2e5ec;
  }
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
  .content{
    height: 100%;
    /*height:calc(100% - #{$headHeight} - 40px - #{$box1paddingTop} * 2);*/
    padding:0px 5px 5px;
    box-sizing: border-box;
    position:relative;
  .echart{
    width: 100%;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: justify;
  #warranty{
    width: 800px;
    height: 220px;
  }
  }
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
