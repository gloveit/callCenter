<template>
  <div class="content">
    <div  class="common">
      <div class="filter" >
        <div style="margin-bottom: 10px;">
        <span class="label">客户电话</span>
        <el-input v-model="searchPhone" placeholder="请输入" style="width: 15%;margin-right: 15px;"></el-input>
        <span class="label">服务时间</span>
        <el-date-picker v-model="beginDate" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd  HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss" default-time="12:00:00" style="width: 20%;"></el-date-picker>
        <span class="label">至</span>
        <el-date-picker v-model="endDate" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd  HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss" default-time="12:00:00" style="width: 20%;margin-right: 15px;"></el-date-picker>
        <span class="label">座机号</span>
        <el-input v-model="loginName" placeholder="请输入" style="width: 15%;margin-right: 15px;"></el-input>
        </div>
        <div>
        <span class="label">服务方式</span>
          <el-select v-model="domain" placeholder="请选择" style="width: 15%;margin-right: 15px;">
            <el-option v-for="item in option1" :key="item.value"
                       :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        <!--<el-input v-model="domain" placeholder="请输入" style="width: 15%;margin-right: 15px;"></el-input>-->
        <span class="label">呼叫方向</span>
        <el-select v-model="direction" placeholder="请选择" style="width: 20%;margin-right: 15px;">
          <el-option v-for="item in options" :key="item.value"
                     :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span class="label">是否接听</span>
        <el-select v-model="accept" placeholder="请选择" style="width: 16%;margin-right: 5px;">
          <el-option v-for="item in option" :key="item.value"
                     :label="item.label" :value="item.value">
          </el-option>
        </el-select>
          <el-button type="primary" plain style="margin-left:5px;" @click="find">查询</el-button>
          <el-button type="danger" plain style="margin-left:5px;" @click="clearFind">重置</el-button>
        </div>
      </div>
      <div style="height: calc(100% - 132px)" v-loading="loading">
        <el-table highlight-current-row border id="callRecord" :data="tableData3" style="width: 100%;" :height="tableHeight">
          <el-table-column type="index" :index="typeIndex"></el-table-column>
          <el-table-column prop="callout_no" :formatter="kehuCall_com" label="客户电话"></el-table-column>
          <el-table-column prop="talking_start_time" label="接听时间" width="180"></el-table-column>
          <el-table-column prop="talk_time_duration" label="持续时间"></el-table-column>
          <el-table-column prop="direction" label="呼叫方向" :formatter="dire"></el-table-column>
          <el-table-column prop="pick_status" label="是否接听" :formatter="pick"></el-table-column>
          <el-table-column prop="domain" label="服务来源" :formatter="service"></el-table-column>
          <el-table-column prop="true_name" label="座机号"></el-table-column>
          <el-table-column prop="content_desc" label="满意度"></el-table-column>
          <el-table-column label="留言内容" >
            <template slot-scope="scope">
              <p v-if="scope.row.domain == 'PSTN'">
                <el-button size="mini" @click="Playback(scope.$index, scope.row,1)">录音</el-button>
              </p>
              <p v-if="scope.row.domain == 'webchat'">
                <el-button size="mini" @click="Playback(scope.$index, scope.row,2)">消息</el-button>
              </p>
            </template>
          </el-table-column>
          <!--<el-table-column label="录音" >-->
            <!--<template slot-scope="scope">-->
              <!--<el-button size="mini" @click="Playback(scope.$index, scope.row)">回放</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </div>
      <div class="page">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                       :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="dataCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="查看录音"
      :visible.sync="wavShow"
      :modal-append-to-body=false
      v-if="wavShow"
      width="35%">
      <div class="audioList" v-for="(v,index) in wavList" :key="index">
        <audio controls="controls" id="wavAudio" autoplay>
          <source :src="baseUrl+v.record_file_url.substring(1)" type="audio/wav" />
        </audio>
      </div>
      <div v-if="!wavList.length">
        暂无录音
      </div>
      <span slot="footer">
        <el-button @click="wavShow = false" size="small">取 消</el-button>
        <el-button type="primary" @click="wavShow = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name:"",
      data() {
        return {
          tableHeight:"100%",
          searchPhone:'',
          beginDate:window.getNowFormatDate("-")+' 00:00:00',
          endDate:window.getNowFormatDate("-")+' 23:59:59',
          loginName:'',
          //当前页
          currentPage: 1,
          //初始化总条数
          dataCount:0,
          //每页显示多少条
          pageSize:10,
          tableData3: [],
          direction: '',
          accept:'',
          domain:'',
          options: [{
              value: "",
              label: '全部'
            },
            {
            value: 0,
            label: '呼入'
          }, {
            value: 1,
            label: '呼出'
          }, {
            value: 2,
            label: '内部呼叫'
          }],
          option: [{
            value: "",
            label: '全部'
          },
            {
            value: true,
            label: '已接听'
          }, {
            value: false,
            label: '未接听'
          }],
          option1: [{
            value: "",
            label: '全部'
          },
            {
              value: 'PSTN',
              label: '电话'
            }, {
              value: 'webchat',
              label: '微信聊天'
            }],
          wavShow:false,
          wavUrl:"",
          wavList:[],
          loading:false,
        }
      },
      computed:{
        baseUrl(){
          return this.$store.state.agentInfo.baseUrl;
        }
      },
      methods:{
        kehuCall_com(row){
          if(row.direction==1){
            return row.callin_no.split('@')[0];
          }else{
            return row.callout_no;
          }
        },
        call:function(){
          let that=this;
          this.loading = true;
          that.axios.get('/callDetail/callDetailList?page='+that.currentPage+'&searchPhone='+that.searchPhone+'&beginDate='+that.beginDate+'&endDate='+that.endDate+'&loginName='+that.loginName+'&callDirection='+that.direction+'&accept='+that.accept+'&domain='+that.domain)
            .then(function (response) {
            that.loading = false;
            that.tableData3=response.data.date.list;
            that.dataCount=response.data.date.total;
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
          });
        },
        typeIndex(index){
          return index + (this.currentPage - 1) * 10 + 1;
        },
        dire:function(row, column){
          return row.direction === 0 ? '呼入' : row.direction === 1 ? '呼出' : '内部呼叫';
        },
        pick:function(row, column){
          if(row.pick_status == true){
            return "已接听"
          }else{
            if(row.pick_status == false){
              return "未接听"
            }
          }
        },
        service:function(row, column){
          if(row.domain="PSTN"){
            return "电话"
          }else if(row.domain="webchat"){
            return "web"
          }
        },
        handleSizeChange(size) {
          this.pageSize = size;
        },
        handleCurrentChange: function(currentPage){
          this.currentPage = currentPage;
          this.call(currentPage);
        },
        find:function(){
          if(this.beginDate == null ){
            this.beginDate = "";
          }
          if(this.endDate == null ){
            this.endDate = "";
          }
          this.call();
        },
        //重置查询
        clearFind(){
          this.currentPage = 1;
          this.searchPhone = "";
          this.beginDate = window.getNowFormatDate("-")+' 00:00:00';
          this.endDate = window.getNowFormatDate("-")+' 23:59:59';
          this.loginName = "";
          this.direction = "";
          this.accept = "";
          this.domain = "";
          this.tableData3 = [];
          this.dataCount = 0;
        },
        Playback(index,row,type){
          if(type == 1){
            let baseUrl = this.$store.state.agentInfo.baseUrl;
            // this.wavUrl = row.record_file_url;
            // this.wavShow = true;
            this.axios.get('/callDetail/fileUrl?callId='+row.call_id)
              .then(res => {
                this.wavList = []
                if(res.data.list && res.data.list.length){
                  this.wavList = res.data.list
                }
                this.wavShow = true;
              })
              .catch(err => {
                console.log(error);

              });
          }else{
            if(row.call_id == ""||row.call_id == null){
              alert("没有留言");
            }else{
              this.action="http://118.31.169.180/webchatSessionDetail.action?params.session_id="+row.call_id;
              window.open(this.action,'留言回放','height=300,width=600,top=200%,left=150%');
            }
          }
        },
        handleDelete(index, row) {
          console.log(index, row);
        }
      },
      mounted(){
        this.call();
      },
    }
</script>

<style scoped>
  .content{
    width: 100%;
    height:100%;
    overflow:hidden;
    background: #ffffff;
    position: relative;
    padding-top: 10px;
    z-index: 1;
  }
  .common{
    width: 100%;
    height:100%;
    margin: 0px auto;
  }
  .filter{
    margin-bottom: 10px;
    height: 90px;
  }
  .page{
    float: right;
    margin-top: 10px;
  }
.label{
  color:#909399;
}
  .audioList{
    margin-bottom:5px;
    text-align: center;
  }
  .audioList audio{
    width:100%;
    height:35px;
  }
</style>
