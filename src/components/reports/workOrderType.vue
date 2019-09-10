<template>
  <div class="box">
    <div class="head">
      <div class="tiaoj">
        <div class="shu1A">
          <el-date-picker
            type="date"
            v-model="tjian.start_time"
            value-format="yyyy-MM-dd"
            placeholder="起始时间">
          </el-date-picker>
        </div>
        <div class="shu1A">
          <el-date-picker
            type="date"
            v-model="tjian.end_time"
            value-format="yyyy-MM-dd"
            placeholder="截止时间">
          </el-date-picker>
        </div>
        <el-select v-model="tjian.dhly" style="width:140px;" class="select1A" placeholder="电话来源">
          <el-option value="" label="全部"></el-option>
          <el-option value="96577"></el-option>
          <el-option value="12319"></el-option>
          <el-option value="市长办公电话"></el-option>
          <el-option value="12345"></el-option>
          <el-option value="数字化平台"></el-option>
          <el-option value="119"></el-option>
        </el-select>
        <el-select v-model="tjian.sllb" style="width:140px;" class="select1A" placeholder="接收部门">
          <el-option value="" label="全部"></el-option>
          <el-option v-for="(item,index) in sldlList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
        <el-button type="primary" plain @click="getList">查询</el-button>
      </div>
      <div class="p_a_r10 cur_p">
        <img src="@/assets/imgs/print.png" @click="printContent" title="打印">
      </div>
    </div>
    <div class="content">
      <vue-scroll :ops="ops1">
        <table class="table">
          <tr>
            <th class="zhedie">折叠</th>
            <th class="">大类</th>
            <th class="">小类</th>
            <th class="">小类数量</th>
            <th class="">大类数量</th>
          </tr>
          <template v-for="(item,index) in list">
            <tr v-for="(i,index) in item.subCategories" v-if="!item.zhedie">
              <td :rowspan="item.subCategories.length" v-if="index==0" @click="zhedie(item,true)" class="zhedietd">
                <el-switch v-model="item.zhedie"></el-switch>
              </td>
              <td class="" :rowspan="item.subCategories.length" v-if="index==0">{{item.name}}</td>
              <td>{{i.name}}</td>
              <td>{{i.count}}</td>
              <td class="" :rowspan="item.subCategories.length" v-if="index==0">{{item.count}}</td>
            </tr>
            <tr v-if="item.zhedie">
              <td @click="zhedie(item,false)" class="zhedietd">
                <el-switch v-model="item.zhedie"></el-switch>
              </td>
              <td class="">{{item.name}}</td>
              <td>...</td>
              <td>...</td>
              <td class="">{{item.count}}</td>
            </tr>
          </template>
        </table>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
    export default {
      name:"workOrderType",
      data() {
        return {
          ops1:{
            bar: {
              background: "rgba(144,147,153,.3)",
              onlyShowBarOnScroll: true,
            },
          },
          list:[],
          zhedieType:1,//1不折叠2折叠
          sldlList:[],
          tjian:{
            start_time:"",
            end_time:"",
            dhly:"",
            sllb:"",
          },
        }
      },
      components:{
      },
      computed:{
      },
      methods:{
        //获取工单列表
        getList(){
          this.list = [];
          this.axios({
            method:"post",
            url:"/dcgd/workorderCategoryStat",
            params:{...this.tjian},
          }).then((res) => {
            if(res.status == 200){
              if(res.data.length){
                this.list = res.data;
              }
            }else{
              this.$message.error("请求失败");
            }
          })
        },
        zhedie(item,type){
          item.zhedie = type;
          this.$forceUpdate();
        },
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
        printContent(){
          if(this.tjian.beginDate && this.tjian.endDate){
            this.printH("工作类别统计 "+this.tjian.beginDate+"至"+this.tjian.endDate)
          }else{
            this.printH("工作类别统计")
          }
        },
      },
      mounted(){
        this.getList();
        this.getListD();
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
      td:focus,td:hover{
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
        .index{
          width:20px;
        }
        .zhedie{
          width:90px;
        }
        .zhedietd{
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
