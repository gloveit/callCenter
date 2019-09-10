<template>
  <div class="box">
    <div class="head">
      <div class="tiaoj">
        <div class="shu1A">
          <el-date-picker
            type="date"
            v-model="tjian.beginDate"
            value-format="yyyy-MM-dd"
            placeholder="起始时间">
          </el-date-picker>
        </div>
        <div class="shu1A">
          <el-date-picker
            type="date"
            v-model="tjian.endDate"
            value-format="yyyy-MM-dd"
            placeholder="截止时间">
          </el-date-picker>
        </div>
        <el-select v-model="tjian.domains" style="width:140px;" class="select1A" placeholder="接收部门">
          <el-option label="全部" value="all"></el-option>
          <el-option label="电话" value="PSTN"></el-option>
          <el-option label="Web" value="webchat"></el-option>
          <el-option label="微信" value="weixin"></el-option>
          <el-option label="App" value="app"></el-option>
          <el-option label="互联网客服" value="other"></el-option>
        </el-select>
        <div class="shu1A">
          <el-input v-model="tjian.loginName" class="souInput1A" placeholder="坐席登录名">
          </el-input>
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
            <th class="zxzh">坐席账号</th>
            <th class="zxmc">坐席名称</th>
            <th class="my">非常满意</th>
            <th class="my">满意</th>
            <th class="my">一般</th>
            <th class="my">不满意</th>
            <th class="my">非常不满意</th>
            <th class="my">评分</th>
          </tr>
          <tr v-for="(i,index) in list" :key="index">
            <td>{{(page-1)*10+index+1}}</td>
            <td>{{i.login_name}}</td>
            <td>{{i.true_name}}</td>
            <td>{{i.contentment1}}</td>
            <td>{{i.contentment2}}</td>
            <td>{{i.contentment3}}</td>
            <td>{{i.contentment4}}</td>
            <td>{{i.contentment5}}</td>
            <td>{{gradeCalc(i.contentment1,i.contentment2,i.contentment3,i.contentment4,i.contentment5)}}</td>
          </tr>
          <tr>
            <td>合计</td>
            <td>-</td>
            <td>-</td>
            <td>{{sumList.contentment1}}</td>
            <td>{{sumList.contentment2}}</td>
            <td>{{sumList.contentment3}}</td>
            <td>{{sumList.contentment4}}</td>
            <td>{{sumList.contentment5}}</td>
            <td>{{gradeCalc(sumList.contentment1,sumList.contentment2,sumList.contentment3,sumList.contentment4,sumList.contentment5)}}</td>
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
      name:"satisfyReport",
      data() {
        return {
          ops:{
            bar: {
              background: "rgba(144,147,153,.3)",
              onlyShowBarOnScroll: true,
            },
          },
          tjian:{
            beginDate:"",
            endDate:"",
            domains:"all",
            deptId:"",
            loginName:"",
            site:"",
            loginNames:"",
            deptIds:"",
          },
          //工单列表
          list:[],
          //合计
          sumList:[],
          //当前页数
          page:1,
          cnt:10,
          totalNum:10,
        }
      },
      components:{

      },
      computed:{
      },
      methods:{
        //满意度分数计算
        gradeCalc(i1,i2,i3,i4,i5){
          if((i1+i2+i3+i4+i5)!=0){
            return ((i1*10+i2*9+i3*8+i4*7+i5*6)/(i1+i2+i3+i4+i5)).toFixed(1);
          }else{
            return 0
          }
        },
        //查询坐席满意度报表
        getList(){
          this.list = [];
          this.axios({
            method:"post",
            url:"/report/satisfaction",
            params:{...this.tjian,page:this.page,cnt:this.cnt,},
          }).then((res) => {
            if(res.status == 200){
              this.totalNum = res.data.total;
              this.list = res.data.list;
              this.sumList = res.data.sumRow[0];
            }else{
              this.$message.error("请求失败");
            }
          })
        },
        //翻页
        changePage(page){
          this.page = page;
          this.getList();
        },
        printContent(){
          if(this.tjian.beginDate && this.tjian.endDate){
            this.printH("满意度报表 "+this.tjian.beginDate+"至"+this.tjian.endDate)
          }else{
            this.printH("满意度报表")
          }
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
