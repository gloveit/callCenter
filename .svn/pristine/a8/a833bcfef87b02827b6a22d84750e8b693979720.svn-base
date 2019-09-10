<template>
  <div style="width:100%;height:100%">
    <vue-scroll :ops="ops">
      <div class="gdForm r2" style="width:100%;">
        <span>受理类别:</span>
        <el-radio-group v-model="sllbReq.SLLBText" size="small">
          <el-radio-button @click.native="getListX(i.id,i.name)" :label="i.name" v-for="i in sldlList" :key="i.id"></el-radio-button>
        </el-radio-group>
        <el-switch style="margin-left:10px;"
                   v-model="zhedie"
                   active-text="展开"
                   inactive-text="折叠">
        </el-switch>
      </div>
      <div class="slxl" :style="{height:zhedie?'auto':'0'}">
        <el-radio v-model="sllbReq.SLLBXLText" @click.native="sllbReq.SLLBXL=i.id"
                  :label="i.name" class="sradio"
                  v-for="(i,index) in slxlList" :key="i.id">{{i.name}}</el-radio>
        <!--<el-checkbox-group v-model="sllbReq.SLLBXLText">-->
        <!--<el-checkbox-->
        <!--:label="i.name" class="sradio"-->
        <!--v-for="(i,index) in slxlList" :key="i.id">{{i.name}}</el-checkbox>-->
        <!--</el-checkbox-group>-->
      </div>
      <div class="gdForm r2">
        <span>用户ID</span>
        <el-input v-model="newGd.YHID" class="inp" size="small"></el-input>
      </div>
      <div class="gdForm r2 mo">
        <span>用户名称</span>
        <el-input v-model="newGd.YHMC" class="inp" size="small"></el-input>
      </div>
      <div class="gdForm r1">
        <span>地址</span>
        <el-input v-model="newGd.DZ" class="inp" size="small"></el-input>
      </div>
      <div class="gdForm r2">
        <span>手机号</span>
        <el-input v-model="gdData.SJH" class="inp" size="small"></el-input>
      </div>
      <div class="gdForm r2 mo">
        <span>完成日期</span>
        <el-date-picker
          size="small" type="date"
          v-model="newGd.JHRQ"
          value-format="yyyyMMdd"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="gdForm r2">
        <span>接受部门</span>
        <el-select v-model="newGd.JSBM" placeholder="请选择" size="small" class="inp">
          <el-option v-for="(i,index) in glzList" :value="i" :key="index"></el-option>
        </el-select>
      </div>
      <div class="gdForm r2 mo">
        <span>电话来源</span>
        <el-select v-model="newGd.DHLY" placeholder="请选择" size="small" class="inp">
          <el-option value="96577"></el-option>
          <el-option value="12319"></el-option>
          <el-option value="市长办公电话"></el-option>
          <el-option value="12345"></el-option>
          <el-option value="数字化平台"></el-option>
          <el-option value="119"></el-option>
        </el-select>
      </div>
      <div class="gdForm">
        <span>问题描述</span>
        <el-input v-model="gdData.GDNR" class="inp" type="textarea" :autosize="{ minRows: 3, maxRows: 6}"></el-input>
      </div>
      <div class="gdForm save">
        <el-button type="primary" size="small" @click="save">保存</el-button>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
    export default {
      name:"",
      data() {
        return {
          ops:{
            bar: {
              background: "rgba(144,147,153,.3)",
              // onlyShowBarOnScroll: false,
            },
          },
          //受理类型大类列表
          sldlList:[],
          //受理类型小类列表
          slxlList:"",
          sllbReq:{
            SLLB:"",SLLBText:"",
            SLLBXL:"",SLLBXLText:"",
          },
          zhedie:true,
        }
      },
      props:{
        newGd:{
          type:Object,
          require:true
        }
      },
      computed: {
        gdData: {
          get: function () {
            return this.$store.state.gdData;
          },
          set: function (newValue) {

          }
        },
        gdSource() {
          return this.$store.state.gdSource;
        },
        //管理站列表
        glzList(){
          return this.$store.state.glzList;
        },
      },
      methods:{
        save(){
          this.axios({
            method:"post",
            url:"/dcgd/postCSTaskInfo",
            params:{...this.newGd,source:2}
          }).then((res) => {
            if(res.status == 200){
              if(res.data.FHM == "M000"){
                this.$message.success("工单信息提交成功!");
                this.$store.state.callOrder = true;
              }else{
                this.$message.info(res.data.FHXX);
              }
            }
          })
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
              if(this.$route.query.dl && this.$route.query.dl != ""){
                if(this.$route.query.dl==1){
                  this.sllbReq.SLLBText = "咨询"
                  this.getListX(1,"咨询")
                }
                else if(this.$route.query.dl==2){
                  this.sllbReq.SLLBText = "投诉处理"
                  this.getListX(4,"投诉处理")
                }
                else if(this.$route.query.dl==3){
                  this.sllbReq.SLLBText = "故障报修"
                  this.getListX(3,"故障报修")
                }
                else if(this.$route.query.dl==4){
                  this.sllbReq.SLLBText = "事故处理"
                  this.getListX(5,"事故处理")
                }
              }
              else if(!this.slxlList.length){
                this.getListX(res.data[0].id);
                //默认选中第一个大类
                this.sllbReq.SLLBText = res.data[0].name;
              }
            }
          })
        },
        //受理小类列表
        getListX(id,name){
          this.slxlList = [];
          this.sllbReq.SLLB = id;
          this.sllbReq.SLLBXL = "";
          this.sllbReq.SLLBXLText = "";
          this.axios({
            method:"get",
            url:"/dcgd/secondWorkorderCategory",
            params:{
              pid:id
            }
          }).then((res) => {
            if(res.status==200){
              this.slxlList = res.data;
            }
          })
        },
      },
      mounted(){
        this.getListD();
      }
    }

</script>

<style lang="scss" scoped>
  .gdForm{
    width:100%;
    display: flex;
    align-items: center;
    color:#1F233E;
    font-size: 14px;
    margin-top:10px;
    margin-bottom:14px;
    float: left;
    &.r2{
      width:46%;
      margin-right:8%;
    }
    &.r2.mo{
      margin-right:0;
    }
    $s:80px;
    span{
      width:$s;
    }
    .inp{
      width:calc(100% - #{$s});
    }
    /deep/ .inp input.el-input__inner{
      background:rgba(243,243,243,1);
    }
    /deep/ .el-textarea__inner{
      background-color:rgba(243,243,243,1);
    }
    &.save{
      justify-content: flex-end;
    }
  }
  .slxl{
    width:100%;clear: both;
    overflow: hidden;
    .sradio{
      width:33%;
      box-sizing: border-box;
      margin:{
        /*right:8px;*/
        /*bottom:8px;*/
      }
    }
    /deep/ .el-radio+.el-radio{
      margin:{
        left:0px;
      }
    }
    /deep/ .el-checkbox+.el-checkbox{
      margin-left:0px;
    }
  }
</style>
