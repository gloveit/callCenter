<template>
  <div class="box">
    <vue-scroll :ops="ops">
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
        <div class="table">
          <div class="tb1">
            <div class="tb border">类别</div>
            <div class="tb border" v-for="i in list">{{i.name}}</div>
            <div class="tb border">合计</div>
          </div>
          <div class="tb2">
            <div class="tb border">数量</div>
            <div class="tb border" v-for="i in list">{{i.value}}</div>
            <div class="tb border">{{total}}</div>
          </div>
        </div>
        <div style="height:10px;"></div>
        <div class="echart border">
          <div id="Analysis"></div>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
  export default {
    name:"piece",
    data() {
      return {
        ops:{
          bar: {
            background: "rgba(144,147,153,.3)",
            onlyShowBarOnScroll: true,
          },
        },
        total:0,
        list:[],
        name:"",
        sum:"",
        beginDate:"2016-1-01",
        endDate:"",
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
      //来电类别分析报表
      getList(){
        this.list = [];
        this.axios({
          method:"post",
          url:"/report/PieAnalysis",
          params:{start_time:this.beginDate,end_time:this.endDate},
        }).then((res) => {
          if(res.status == 200){
            this.list = res.data;
            let Sum = res.data;
            const tSum = [];
            const Name = [];
            for(let i =0;i<Sum.length;i++){
              let sum=Sum[i].value;
              tSum.push(sum);
            }
            this.sum = tSum;
            this.total = this.getSum(tSum);
            for(let i =0;i<Sum.length;i++){
              let name=Sum[i].name;
              Name.push(name);
            }
            this.name =Name;
            this.echart();
          }else{
            this.$message.error("请求失败");
          }
        })
      },
      echart(data){
        this.Analysis = this.$echarts.init(document.getElementById('Analysis'));
        let option = {
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'horizontal',
            x: 'right',
            y: 'top',
            top:5,
            data: this.name
          },
          grid:{
            top:40
          },
          series : [
            {
              name: '来电分析',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:this.list,
              label: {
                normal: {
                  show: true,
                  color:'#000',
                  fontsize:14,
                  formatter: "{b}:{c}",
                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        this.Analysis.setOption(option);
      },
      printContent(){
        this.printH("派单分析报表 "+this.beginDate+"至"+this.endDate)
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
    height:calc(100% - #{$headHeight} - 40px - #{$box1paddingTop} * 2);
    padding:0px 5px 5px;
    box-sizing: border-box;
    position:relative;
  .echart{
    width: 90%;
    height: calc(100% - 120px);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: justify;
  #Analysis{
    width: 800px;
    height: 300px;
  }
  }
  }
  .table{
    width:100%;
    height: 120px;
    border-collapse: collapse;
    box-sizing: border-box;
    table-layout: fixed;
  .tb{
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: justify;
  }
  .tb1{
    display: flex;
    height: 50%;
  }
  .tb2{
    display: flex;
    height: 50%;
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
</style>
