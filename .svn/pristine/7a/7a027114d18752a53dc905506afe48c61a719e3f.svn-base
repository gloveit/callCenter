<template>
  <div class="box">
    <div class="head">
      <div class="tiaoj">
        <div class="shu1A" style="width:248px;">
          <el-date-picker
            type="daterange"
            v-model="timeRange"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="timeChange"
            unlink-panels
            :default-time="['00:00:00', '23:59:59']"
            placeholder="起始时间">
          </el-date-picker>
        </div>
        <div class="shu1A">
          <el-input v-model="tjian.loginName" class="souInput1A" placeholder="坐席登录名">
          </el-input>
        </div>
        <el-button type="primary" plain @click="getList(1)">查询</el-button>
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
            <th class="xm">姓名</th>
            <th class="cs">分配给坐席次数</th>
            <th class="cs">正常接听次数</th>
            <th class="cs">拒绝分配次数</th>
            <th class="cs">振铃超时次数</th>
            <th class="cs">客户放弃次数</th>
            <th class="cs">其他原因失败次数</th>
            <th class="cs">应答率</th>
            <th class="cs">呼出次数</th>
            <th class="cs">呼出成功次数</th>
          </tr>
          <tr v-for="(i,index) in list" :key="index">
            <td>{{(page-1)*10+index+1}}</td>
            <td>{{i.agent}}</td>
            <td>{{i.request_service_count}}</td>
            <td>{{i.service_count}}</td>
            <td>{{i.refuse_count}}</td>
            <td>{{i.ring_timeout_count}}</td>
            <td>{{i.customer_cancel_count}}</td>
            <td>{{i.fail_count}}</td>
            <td>{{i.request_service_count?(Number(i.service_count / i.request_service_count)*100).toFixed(2)+"%":"-"}}</td>
            <td>{{i.outbound_count}}</td>
            <td>{{i.outbound_succeed_count}}</td>
          </tr>
          <tr v-if='endPage'>
            <td>合计</td>
            <td>{{'IVR : '+isvCount}}</td>
            <td>{{sumList.request_service_count}}</td>
            <td>{{sumList.service_count}}</td>
            <td>{{sumList.refuse_count}}</td>
            <td>{{sumList.ring_timeout_count}}</td>
            <td>{{sumList.customer_cancel_count}}</td>
            <td>{{sumList.fail_count}}</td>
            <td>{{resLv}}</td>
            <td>{{sumList.outbound_count}}</td>
            <td>{{sumList.outbound_succeed_count}}</td>
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
      name:"seatCall",
      data() {
        return {
          ops:{
            bar: {
              background: "rgba(144,147,153,.3)",
              onlyShowBarOnScroll: true,
            },
          },
          pickerOptions: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          defaultTime:"",
          timeRange:"",
          tjian:{
            beginDate:"",
            endDate:"",
            loginName:"",
          },
          //列表
          list:[],
          sumList:{},
          isvCount:0,
          //当前页数
          page:1,
          cnt:10,
          totalNum:10,
        }
      },
      components:{

      },
      computed:{
        resLv:function(){
          if(this.sumList && this.sumList.service_count && this.sumList.request_service_count &&
          this.sumList.service_count!=0 && this.sumList.request_service_count!=0){
            return Number((this.sumList.service_count/this.sumList.request_service_count)*100).toFixed(2)+"%"
          }else{
            return "-"
          }
        },
        endPage:function(){
            console.log("当前页",this.page)
            console.log("当前页",Math.ceil(this.totalNum/this.cnt))
            if(this.page == Math.ceil(this.totalNum/this.cnt)){
                return true
            }else{
                return false
            }
        }
      },
      methods:{
        timeChange(t){
          this.tjian.beginDate = t[0]
          this.tjian.endDate = t[1]
        },
        //查询坐席满意度报表
        getList(p){
          this.list = [];
          let page = 1;
          if(p){page = p}
          this.page = page;
          this.axios({
            method:"post",
            url:"/report/agentInbound",
            params:{...this.tjian,page:page,cnt:this.cnt,domains:"PSTN"},
          }).then((res) => {
            if(res.status == 200){
              this.totalNum = res.data.total;
              this.list = res.data.list;
              if(res.data.sumRow && res.data.sumRow.length){
                this.sumList = res.data.sumRow[0];
              }
              this.isvCount = res.data.isvCount;
            }else{
              this.$message.error("请求失败");
            }
          })
        },
        //翻页
        changePage(page){
          this.getList(page);
        },
        printContent(){
          if(this.tjian.beginDate && this.tjian.endDate){
            this.printH("坐席呼入报表 "+this.tjian.beginDate+"至"+this.tjian.endDate)
          }else{
            this.printH("坐席呼入报表")
          }
        },
      },
      mounted(){
        const end = new Date();
        const start = new Date();
        // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 12);
        this.timeRange = [start,end]
        this.tjian.beginDate = window.getNowFormatDate('-');
        this.tjian.endDate = window.getNowFormatDate('-');
        this.getList(1);
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
        .xm{width:40px;}
        .cs{width:40px;}
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
