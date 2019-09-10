<template>
  <div class="box">
    <div class="head">
      <div class="p_a_r5">
        <el-button type="primary" plain @click="getList">查询</el-button>
        <el-button type="danger" plain @click="clearSearch">重置</el-button>
        <el-button type="primary" plain @click="exportAll">导出全部</el-button>
      </div>
    </div>
    <div class="head tjRow">
      <!--<span class="title">工单列表</span>-->
      <div class="tiaoj">
        <div class="zu">
          <div class="lab">接收部门：</div>
          <el-select v-model="tjian.jsbm" class="select1A" placeholder="接收部门">
            <el-option value="" label="全部"></el-option>
            <el-option value="建设路站"></el-option>
            <el-option value="大营盘站"></el-option>
            <el-option value="新建路站"></el-option>
            <el-option value="迎新街站"></el-option>
            <el-option value="河西站"></el-option>
            <el-option value="和平北站"></el-option>
            <el-option value="工营事团"></el-option>
            <el-option value="管线所"></el-option>
          </el-select>
        </div>
        <div class="zu">
          <div class="lab">受理类别：</div>
          <el-select v-model="tjian.sllb" class="select1A" placeholder="受理类别">
            <el-option value="" label="全部"></el-option>
            <el-option v-for="(item,index) in sldlList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </div>
        <div class="zu">
          <div class="lab">状态：</div>
          <el-select v-model="tjian.status" class="select1A" placeholder="全部">
            <el-option v-for="(item,index) in statusList" :label="item.name" :value="item.value" :key="index"></el-option>
          </el-select>
        </div>
        <div class="zu">
          <div class="lab">用户名称：</div>
          <div class="shu1A">
            <el-input v-model="tjian.yhmc" class="souInput1A" placeholder="用户名称">
            </el-input>
          </div>
        </div>
        <div class="zu">
          <div class="lab">手机号：</div>
          <el-input v-model="tjian.sjh" class="souInput1A" placeholder="手机号">
          </el-input>
        </div>
        <div class="zu">
          <div class="lab">创建开始日期</div>
          <el-date-picker
            type="date"
            v-model="tjian.start_creat_time"
            value-format="yyyyMMdd"
            placeholder="创建开始日期">
          </el-date-picker>
        </div>
        <div class="zu">
          <div class="lab">创建完成日期：</div>
          <el-date-picker
            type="date"
            v-model="tjian.end_creat_time"
            value-format="yyyyMMdd"
            placeholder="创建完成日期">
          </el-date-picker>
        </div>
        <div class="zu">
          <div class="lab">创建人：</div>
          <el-select v-model="tjian.creat_user_id" class="select1A" placeholder="创建人">
            <el-option value="" label="全部"></el-option>
            <el-option v-for="(item,index) in cjrList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="content">
      <vue-scroll :ops="ops1">
        <table class="table" id="TD" >
          <tr>
            <th class="index">#</th>
            <th class="gdh">工单号</th>
            <!--<th class="yhid">用户ID</th>-->
            <th class="xm">姓名</th>
            <th class="sjh">手机号</th>
            <th class="dz">地址</th>
            <th class="jsbm">接收部门</th>
            <th class="nr">工单内容</th>
            <th class="rq">创建日期</th>
            <!--<th class="rq">计划完成日期</th>-->
            <th class="cjr">创建人</th>
            <th >完成日期</th>
            <th >返单信息</th>
            <th class="duban">操作</th>
            <th class="duban">详情</th>
          </tr>
          <tr @dblclick="gdJindu(i.kfgdh)" v-for="(i,index) in list">
            <td>{{(page-1)*10+index+1}}</td>
            <td>{{i.kfgdh}}</td>
            <!--<td>{{i.yhid}}</td>-->
            <td>
              <el-tooltip class="" effect="light" :content="i.yhmc" placement="top">
                <el-button class="gdnr_tishi">{{i.yhmc}}</el-button>
              </el-tooltip>
            </td>
            <td>{{i.sjh}}</td>
            <td>
              <el-tooltip class="" effect="light" :content="i.dz" placement="top">
                <el-button class="gdnr_tishi">{{i.dz}}</el-button>
              </el-tooltip>
            </td>
            <td>{{i.jsbm}}</td>
            <td>
              <el-tooltip class="" effect="light" placement="top">
                <div slot="content" class="moreNr">{{i.gdnr}}</div>
                <el-button class="gdnr_tishi">{{i.gdnr}}</el-button>
              </el-tooltip>
            </td>
            <td>
              {{i.creat_time?i.creat_time.substring(0,10):""}}<br/>
              {{i.creat_time?i.creat_time.substring(11,19):""}}
            </td>
            <!--<td>{{i.jhrq?(i.jhrq.substring(0,4)+"-"+i.jhrq.substring(4,6)+"-"+i.jhrq.substring(6)):""}}</td>-->
            <td>{{i.user?i.user.name:""}}</td>
            <td>
              {{i.wcrq?i.wcrq.substring(0,10):""}}<br/>
              {{i.wcrq?i.wcrq.substring(11,19):""}}
            </td>
            <td>
              <el-tooltip class="" effect="light" :content="i.fdxx" placement="top">
                <el-button class="gdnr_tishi">{{i.fdxx}}</el-button>
              </el-tooltip>
            </td>
            <td>
              <div class="dbBtn" v-if="i.status!=1&&i.status!=3&&i.status!=7&&i.status!=2">-</div>
              <div class="dbBtn" v-if="i.status==1 || i.status==3 || i.status==2" @click="dubanShow(i,i.kfgdh,i.status)">督办</div>
              <div class="dbBtn" v-if="i.status == 7" @click="dubanShow(i,i.kfgdh,i.status)">回访</div>
            </td>
            <td><div class="dbBtn" @click="showDetail(i,i.kfgdh)">查看</div></td>
          </tr>
          <tr>
            <td colspan="13" v-if="!list.length">暂无数据</td>
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
    <div class="xxbl cx" v-if="jdShow">
      <div class="head">
        <span>工单进度查询</span>
        <div class="close" @click="closeJd">关闭</div>
      </div>
      <div class="con2">
        <vue-scroll :ops="ops">
          <div class="zu">
            <span class="label">用户ID</span>
            <el-input v-model="jdData.YHID" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">用户名称</span>
            <el-input v-model="jdData.YHMC" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">客服系统工单号</span>
            <el-input v-model="jdData.KFGDH" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">业务系统工单号</span>
            <el-input v-model="jdData.YWGDH" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">任务创建日期</span>
            <el-input v-model="jdData.CJRQ" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">计划完成日期</span>
            <el-input v-model="jdData.JDWCRQ" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">任务节点</span>
            <el-input v-model="jdData.RWJD" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">节点完成日期</span>
            <el-input v-model="jdData.JDWCRQ" size="small" class="input"></el-input>
          </div>
        </vue-scroll>
      </div>
    </div>
    <div class="xxbl cx" v-if="dbShow">
      <div class="head">
        <span v-if="!dbData.hidden">工单督办</span>
        <span v-if="!hfData.hidden">工单回访</span>
        <div class="close" @click="closeDb">关闭</div>
      </div>
      <div class="con2">
        <vue-scroll :ops="ops2">
          <el-collapse v-model="activeNames2">
            <el-collapse-item title="工单内容" name="1">
              <div class="zu">
                <span class="label">工单号</span>
                <el-input v-model="detailData.detail.kfgdh" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">姓名</span>
                <el-input v-model="detailData.detail.yhmc" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">手机号</span>
                <el-input v-model="detailData.detail.sjh" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">地址</span>
                <el-input v-model="detailData.detail.dz" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">接收部门</span>
                <el-input v-model="detailData.detail.jsbm" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">工单内容</span>
                <el-input v-model="detailData.detail.gdnr" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">创建日期</span>
                <el-input v-model="detailData_d_creat_time" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">完成日期</span>
                <el-input v-model="detailData_d_wcrq" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">创建人</span>
                <el-input v-model="detailData_d_username" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">返单信息</span>
                <el-input v-model="detailData.detail.fdxx" :disabled="true" size="small" class="input"></el-input>
              </div>
            </el-collapse-item>
            <el-collapse-item title="督办内容" name="2" v-show="!dbData.hidden">
              <div class="zu">
                <span class="label">受理人</span>
                <el-input v-model="dbData.slr" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">录入内容</span>
                <el-input v-model="dbData.lrnr" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">结果</span>
                <el-input v-model="dbData.jg" size="small" class="input"></el-input>
              </div>
              <div class="one">
                <el-button type="primary" size="small" @click="submitDb(detailData.detail)">提交督办</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="回访内容" name="3" v-show="!hfData.hidden">
              <div class="zu">
                <span class="label">受理人</span>
                <el-input v-model="hfData.slr" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">录入内容</span>
                <el-input v-model="hfData.lrnr" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">结果</span>
                <el-input v-model="hfData.jg" size="small" class="input"></el-input>
              </div>
              <div class="one">
                <el-button type="primary" size="small" @click="submitHf(detailData.detail)">提交回访</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </vue-scroll>
      </div>
    </div>
    <div class="xxbl cx gdxq" v-if="detailShow">
      <div class="head">
        <span>工单详情</span>
        <div class="close printGdxq" @click="printDetail">打印</div>
        <div class="close" @click="detailShow=false">关闭</div>
      </div>
      <div class="con2">
        <vue-scroll :ops="ops2">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="工单内容" name="1">
              <div class="zu">
                <span class="label">工单号</span>
                <el-input v-model="detailData.detail.kfgdh" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">姓名</span>
                <el-input v-model="detailData.detail.yhmc" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">手机号</span>
                <el-input v-model="detailData.detail.sjh" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">地址</span>
                <el-input v-model="detailData.detail.dz" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">接收部门</span>
                <el-input v-model="detailData.detail.jsbm" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">工单内容</span>
                <el-input v-model="detailData.detail.gdnr" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">创建日期</span>
                <el-input v-model="detailData_d_creat_time" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">完成日期</span>
                <el-input v-model="detailData_d_wcrq" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">创建人</span>
                <el-input v-model="detailData_d_username" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">返单信息</span>
                <el-input v-model="detailData.detail.fdxx" :disabled="true" size="small" class="input"></el-input>
              </div>
            </el-collapse-item>
            <el-collapse-item title="督办内容" name="2" v-show="detailData.duban.length">
              <table class="table">
                <tr>
                  <th>录入日期</th>
                  <th>录入人</th>
                  <th>受理人</th>
                  <th>录入内容</th>
                  <th>结果</th>
                </tr>
                <tr v-for="i in detailData.duban" :key="i.id">
                  <td>{{i.lrrq?i.lrrq.substring(0,10):""}}<br/>
                    {{i.lrrq?i.lrrq.substring(11,19):""}}</td>
                  <td>{{i.lrr_name}}</td>
                  <td>{{i.slr}}</td>
                  <td>
                    {{i.lrnr}}
                    <!--<el-tooltip class="" effect="light" :content="i.lrnr" placement="top">-->
                      <!--<el-button class="gdnr_tishi">{{i.lrnr}}</el-button>-->
                    <!--</el-tooltip>-->
                  </td>
                  <td>
                    {{i.jg}}
                    <!--<el-tooltip class="" effect="light" :content="i.jg" placement="top">-->
                      <!--<el-button class="gdnr_tishi">{{i.jg}}</el-button>-->
                    <!--</el-tooltip>-->
                  </td>
                </tr>
              </table>
            </el-collapse-item>
            <el-collapse-item title="回访内容" name="3" v-show="!detailData.huifang.hidden">
              <div class="zu">
                <span class="label">录入日期</span>
                <el-input v-model="detailData_h_lrrq" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">录入人</span>
                <el-input v-model="detailData.huifang.lrr_name" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">受理人</span>
                <el-input v-model="detailData.huifang.slr" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">录入内容</span>
                <el-input v-model="detailData.huifang.lrnr" :disabled="true" size="small" class="input"></el-input>
              </div>
              <div class="zu">
                <span class="label">结果</span>
                <el-input v-model="detailData.huifang.jg" :disabled="true" size="small" class="input"></el-input>
              </div>
            </el-collapse-item>
          </el-collapse>
        </vue-scroll>
      </div>
    </div>
    <div class="modal" v-if="jdShow || dbShow || detailShow"></div>
  </div>
</template>

<script>
    export default {
      name:"workOrderList",
      data() {
        return {
          ops1:{
            bar: {
              background: "rgba(144,147,153,.3)",
              onlyShowBarOnScroll: true,
            },
          },
          ops:{
            bar: {
              background: "rgba(144,147,153,.3)",
              onlyShowBarOnScroll: false,
            },
          },
          ops2:{
            bar: {
              background: "rgba(144,147,153,.3)",
              onlyShowBarOnScroll: false,
            },
            scrollPanel:{
              scrollingX:false
            }
          },
          //受理类别查询列表
          sldlList:[],
          cjrList:[],//创建人列表
          statusList:[{name:"全部",value:""},{name:"可督办",value:"1,3"},{name:"已督办",value:"2"},{name:"已返单",value:"7"},{name:"已回访",value:"0"}],
          // 工单列表查询条件
          tjian:{jsbm:"",sllb:"",status:"",yhmc:"",sjh:"",start_creat_time:"",end_creat_time:""},
          //工单列表
          list:[],
          jdShow:false,
          //工单进度
          jdData:{
            YHID:"",
            YHMC:"",
            KFGDH:"",
            YWGDH:"",
            CJRQ:"",
            JHRQ:"",
            RWJD:"",
            JDWCRQ:"",
          },
          dbShow:false,
          dbData:{},
          detailShow:false,
          detailData:{detail:null,duban:[],huifang:{hidden:true}},
          activeNames: ['1',"2","3"],//详情展开的面板
          activeNames2:["1","2","3"],//督办或回访
          dbData:{hidden:true},
          hfData:{hidden:true},
          //当前页数
          page:1,
          totalNum:1,
          cnt:10,
        }
      },
      components:{

      },
      computed:{
        detailData_d_creat_time:function(){
          // return (this.detailData.detail && this.detailData.detail.creat_time) ?
          //   this.detailData.detail.creat_time.substring(0,10) : ""
          return this.detailData.detail.creat_time
        },
        detailData_d_wcrq:function(){
          // return (this.detailData.detail && this.detailData.detail.wcrq) ?
          //   this.detailData.detail.wcrq.substring(0,10) : ""
          return this.detailData.detail.wcrq
        },
        detailData_d_username:function(){
          return (this.detailData.detail && this.detailData.detail.user) ?
            this.detailData.detail.user.name : ""
        },
        detailData_h_lrrq:function() {
          return this.detailData.huifang.lrrq
        },
      },
      methods:{
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
        //获取创建人列表
        getCjr(){
          this.cjrList = [];
          this.axios({
            method:"get",
            url:"/user/allUsers",
          }).then((res) => {
            if(res.status==200){
              this.cjrList = res.data;
            }
          })
        },
        //重置查询
        clearSearch(){
          this.tjian =
            {jsbm:"",sllb:"",yhmc:"",sjh:"",start_creat_time:"",end_creat_time:""};
          this.list = [];
        },
        //获取工单列表
        getList(){
          this.list = [];
          this.axios({
            method:"post",
            url:"/dcgd/getWorkOrderListsBy",
            params:{...this.tjian,page:this.page,cnt:this.cnt},
          }).then((res) => {
            if(res.status == 200){
              if(res.data.lists){
                this.list = res.data.lists;
                this.totalNum = res.data.num
              }
            }else{
              this.$message.error("请求失败");
            }
          })
        },
        //全部导出
        exportAll(){
          let url = "/dcgd/getWorkOrderListsBy?";
          let str = "";
          for(let key in this.tjian){
            url = url + key + "=" + this.tjian[key] + "&"
          }
          url = url + "page=" + this.page+"&cnt="+this.cnt+"&";
          url = url+"mode=export&names=kfgdh,yhid,yhmc,sjh,dz,jsbm,gdnr,creat_time,jhrq,user.name&titles=工单号,用户ID,姓名,手机号,地址,接收部门,工单内容,创建日期,计划完成日期,创建人"
          window.open(url)
        },
        //显示工单进度弹窗
        gdJindu(gdh){
          if(!gdh){
            this.$message.info("该工单未查询到工单进度!");
            return;
          }
          this.dbShow = false;
          this.detailShow = false;
          this.jdShow = true;
          this.jdData = {};
          this.axios({
            method:"get",
            url:"/dcgd/getUserTaskTrace",
            params:{
              TJLX:1,
              TJ:gdh
            }
          }).then((res) => {
            if(res.status == 200){
              if(res.data.FHM == "M000"){
                  this.jdData = res.data.lists[0];
                  this.jdData.KFGDH = gdh;
              }else{
                this.$message.info(res.data.FHXX);
                this.jdData = {};
              }
            }else{
              this.$message.error("请求错误!")
            }
          })
        },
        //显示督办、回访弹窗
        dubanShow(detail,kfgdh,flag){
          this.jdShow = false;
          this.detailShow = false;
          this.dbShow = true;
          this.detailData = {detail:null,duban:{hidden:true},huifang:{hidden:true}};
          this.detailData.detail = detail;
          if(flag == 1 || flag == 3 || flag == 2){
            this.dbData = {hidden:false}
            this.hfData = {hidden:true}
          }
          if(flag == 7){
            this.dbData = {hidden:true}
            this.hfData = {hidden:false}
          }
        },
        //显示详情
        showDetail(detail,gdh){
          this.jdShow = false;
          this.dbShow = false;
          this.detailShow = true;
          this.detailData = {detail:null,duban:[],huifang:{hidden:true}};
          this.detailData.detail = detail;
          this.axios({
            method:"get",
            url:"/gdls/getWorkOrderHistoryListsBykfgdh",
            params:{
              kfgdh:gdh
            }
          }).then((res) => {
            if(res.status == 200){
              if(res.data.status == "success"){
                if(res.data.date.lists && res.data.date.lists.length){
                  res.data.date.lists.forEach((v,i) => {
                    //督办
                    if(v.status && v.status == 2){
                      this.detailData.duban.push(v);
                    }
                    //回访
                    if(v.status && v.status == 0){
                      this.detailData.huifang = v;
                    }
                  })
                }else{

                }
              }else{
                this.$message.info(res.data.msg);
                this.detailData = {};
              }
            }else{
              this.$message.error("请求错误!")
            }
          })
        },
        submitDb(detail){
          if(!this.dbData.lrnr){
            this.$alert("录入内容不可为空！");
            return;
          }
          let data = {
            jsbm:detail.jsbm,
            kfgdh:detail.kfgdh,
            yhid:detail.yhid,
            yhmc:detail.yhmc,
            dz:detail.dz,
            sjh:detail.sjh,
            gdnr:detail.gdnr,
            creat_time:detail.creat_time,
            creat_user_id:detail.creat_user_id,
            sllb:detail.sllb,
            sllbxl:detail.sllbxl,
            dhly:detail.dhly,
            status:2,
            source:0,
            slr:this.dbData.slr,
            lrnr:this.dbData.lrnr,
            jg:this.dbData.jg
          }
          this.axios({
            method:"post",
            url:"/dcgd/addWorkOrderHistory",
            params:{...data},
          }).then((res) => {
            if(res.status == 200){
              this.$message.success("督办已提交！")
              this.dbShow = false;
              this.getList()
            }else{
              this.$message.error("提交失败");
            }
          })
        },
        submitHf(detail){
          if(!this.hfData.lrnr){
            this.$alert("录入内容不可为空！");
            return;
          }
          let data = {
            jsbm:detail.jsbm,
            kfgdh:detail.kfgdh,
            yhid:detail.yhid,
            yhmc:detail.yhmc,
            dz:detail.dz,
            sjh:detail.sjh,
            gdnr:detail.gdnr,
            creat_time:detail.creat_time,
            creat_user_id:detail.creat_user_id,
            sllb:detail.sllb,
            sllbxl:detail.sllbxl,
            dhly:detail.dhly,
            status:0,
            source:0,
            slr:this.hfData.slr,
            lrnr:this.hfData.lrnr,
            jg:this.hfData.jg
          }
          this.axios({
            method:"post",
            url:"/dcgd/addWorkOrderHistory",
            params:{...data},
          }).then((res) => {
            if(res.status == 200){
              this.$message.success("回访已提交！")
              this.dbShow = false;
              this.getList()
            }else{
              this.$message.error("提交失败");
            }
          })
        },
        closeJd(){
          this.jdShow = false;
        },
        closeDb(){
          this.dbShow = false;
        },
        //翻页
        changePage(page){
          this.page = page;
          this.getList();
        },
        //打印工单详情弹窗内容
        printDetail(){
          $(".xxbl.gdxq").css({"width":"100%","height":"100%"});
          $(".xxbl.gdxq .close").hide();
          window.print();
          $(".xxbl.gdxq").css({"width":"711px","height":"569px"});
          $(".xxbl.gdxq .close").show();
        },
      },
      mounted(){
        this.getListD();
        this.getCjr();
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
      &.tjRow{
        height:calc(#{$headHeight} + #{$box1paddingTop} * 2 + 15px);
        width:100%;
        padding:0 5px;
        .zu{
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: start;
          .lab{
            color:#606266;
          }
          /deep/ .el-date-editor.el-input{width:153px;}
        }
      }
    }
    .fenye{
      height:40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    $cha_c: ($headHeight + ($box1paddingTop * 2))*2+15+40;
    .content{
      height:calc(100% - #{$cha_c});
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
        .gdh{
          width:150px;
        }
        .yhid{
          width:110px;
        }
        .xm{
          width:140px;
        }
        .sjh{
          width:100px;
        }
        .dz{
          width:160px;
        }
        .jsbm{
          width:100px;
        }
        .nr{
          //width:150px;
        }
        .rq{
          width:100px;
        }
        .cjr{width:100px;}
        .duban{width:50px;}
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
      width:140px;
      margin-right:6px;
    }
    .shu1A{
      width:180px;height:40px;
      margin-right:6px;
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
      height:calc(100% - 35px);
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
      .one{
        width:100%;
        float:left;
        margin-top:15px;
        padding-right:4%;
        margin-bottom:10px;
        display: flex;
        justify-content: flex-end;
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
  .dbBtn{
    cursor: pointer;
    transition: .2s all;
  }
  .dbBtn:hover{
    transform: scale(1.2);
  }
  .p_a_r5{
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
  /deep/ .el-collapse-item__header{
    font-size:16px;
    font-weight: 600;
  }
  .cx .head .printGdxq.close{
    right:65px;
    transition: all .3s;
    &:hover{
      color:#007DDB;
      font-weight: bold;
    }
  }
  //工单详情中的单元格换行
  .xxbl.gdxq .table tr td{
    white-space: normal;
  }
</style>
