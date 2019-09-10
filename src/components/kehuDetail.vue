<template>
  <div class="box11">
    <div class="content">
      <div class="xxhang">
        <div class="toux">
          <img src="../assets/imgs/toux_man.png" alt="">
        </div>
        <div class="msg">
          <div class="hang">
            <div class="name">
              <img src="../assets/imgs/gd_name.png" class="">
              <span>{{kehuPanel.YHMC?kehuPanel.YHMC:"姓名"}}</span>
            </div>
            <div class="tel">
              <img src="../assets/imgs/gd_tel.png" class="">
              <span>{{kehuPanel.SJH?kehuPanel.SJH:"电话"}}</span>
            </div>
          </div>
          <div class="hang">
            <div class="address">
              <img src="../assets/imgs/gd_dwei.png" class="">
              <span>{{kehuPanel.DZ?kehuPanel.DZ:"地址"}}</span>
            </div>
          </div>
        </div>
        <div class="anniu">
          <div class="a" @click="search">查询客户</div>
          <div class="a" @click="xxbl">信息补录</div>
        </div>
      </div>
      <div class="xian"></div>
      <div class="xianSHI"></div>
      <div class="form">
        <div class="tab" ref="parent">
          <!--<vue-scroll :ops="ops" ref="vs" @mousewheel.native="wheel">-->
          <ul ref="child" class="olist1">
            <el-tag class="li" v-for="(item,index) in tabList" :key="index" :class="leftPanel==item?'active':''" @click.native="changeLeftPanel(item)">{{item}}</el-tag>
          </ul>
          <!--</vue-scroll>-->
        </div>
        <div class="formList" v-if="leftPanel=='客户信息'">
          <vue-scroll :ops="ops">
            <ul class="ul1A">
              <li>
                <span>用户ID</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.YHID" :disabled="true"></el-input>
              </li>
              <li>
                <span>卡号</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.KH" :disabled="true"></el-input>
              </li>
              <li>
                <span>注册码</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.ZCM" :disabled="true"></el-input>
              </li>
              <li>
                <span>手机号</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.SJH" :disabled="true"></el-input>
              </li>
              <li>
                <span>所属管理站</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.GLZ" :disabled="true"></el-input>
              </li>
              <li>
                <span>抄表方式</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.CBFS" :disabled="true"></el-input>
              </li>
              <li>
                <span>用户名称</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.YHMC" :disabled="true"></el-input>
              </li>
              <li>
                <span>表1读数</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.BS1" :disabled="true"></el-input>
              </li>
              <li>
                <span>表2读数</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.BS2" :disabled="true"></el-input>
              </li>
              <li>
                <span>账户余额</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.YE" :disabled="true"></el-input>
              </li>
              <li>
                <span>抄表周期</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.CBZQ" :disabled="true"></el-input>
              </li>
              <li>
                <span>用户别名</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.YHBM" :disabled="true"></el-input>
              </li>
              <li>
                <span>身份证号</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.shenfen" :disabled="true"></el-input>
              </li>
              <li>
                <span>用户地址</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.DZ" :disabled="true"></el-input>
              </li>
              <li>
                <span>上次抄表日期</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.SCCB" :disabled="true"></el-input>
              </li>
              <li>
                <span>账户欠费</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.ZHQF" :disabled="true"></el-input>
              </li>
              <li>
                <span>违约金</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.WYJ" :disabled="true"></el-input>
              </li>
              <li>
                <span>阶梯累计用量</span>
                <el-input size="small" class="input1A" v-model="kehuPanel.JTLJ" :disabled="true"></el-input>
              </li>
            </ul>
          </vue-scroll>
        </div>
        <div class="formList" v-if="leftPanel=='表具信息'">
        <vue-scroll :ops="ops">
          <ul class="ul1A">
            <li>
              <span>注册码</span>
              <el-input size="small" class="input1A" v-model="bjPanel.ZCM" :disabled="true"></el-input>
            </li>
            <li>
              <span>抄表类型</span>
              <el-input size="small" class="input1A" v-model="bjPanel.CBLX" :disabled="true"></el-input>
            </li>
            <li>
              <span>出厂年份</span>
              <el-input size="small" class="input1A" v-model="bjPanel.CCNF" :disabled="true"></el-input>
            </li>
            <li>
              <span>检表日期</span>
              <el-input size="small" class="input1A" v-model="bjPanel.JBRQ" :disabled="true"></el-input>
            </li>
            <li>
              <span>表状态</span>
              <el-input size="small" class="input1A" v-model="bjPanel.BZT" :disabled="true"></el-input>
            </li>
            <li>
              <span>表体编号</span>
              <el-input size="small" class="input1A" v-model="bjPanel.BTBH" :disabled="true"></el-input>
            </li>
            <li>
              <span>控制器号</span>
              <el-input size="small" class="input1A" v-model="bjPanel.KZQH" :disabled="true"></el-input>
            </li>
            <li>
              <span>基表厂家名称</span>
              <el-input size="small" class="input1A" v-model="bjPanel.JBCJ" :disabled="true"></el-input>
            </li>
            <li>
              <span>控制器厂家名称</span>
              <el-input size="small" class="input1A" v-model="bjPanel.KZQCJ" :disabled="true"></el-input>
            </li>
            <li>
              <span>表型号</span>
              <el-input size="small" class="input1A" v-model="bjPanel.BXH" :disabled="true"></el-input>
            </li>
            <li>
              <span>表种类</span>
              <el-input size="small" class="input1A" v-model="bjPanel.BZL" :disabled="true"></el-input>
            </li>
          </ul>
        </vue-scroll>
      </div>
        <div class="formList" v-if="leftPanel=='充值购气'">
          <vue-scroll :ops="ops">
            <table class="table xx">
              <tr>
                <th class="h1">充值日期</th>
                <th class="h2">交易金额</th>
                <th class="h3">卡表购气量</th>
                <th class="h4">卡表气费</th>
                <th class="h4">流水号</th>
                <th class="h5">卡表累计购气次数</th>
                <th>详情</th>
              </tr>
              <tr v-for="item in czgqPanel">
                <td>{{item.CZRQ}}</td>
                <td>{{item.JYE}}</td>
                <td>{{item.GQL}}</td>
                <td>{{item.QF}}</td>
                <td>{{item.LSH}}</td>
                <td>{{item.LJGQCS}}</td>
                <td @click="showXq('充值购气',item)" class="xxxq"><img src="@/assets/imgs/xxxq.png" alt=""></td>
              </tr>
              <tr v-if="!czgqPanel.length">
                <td colspan="7" style="width:100%;">暂无数据</td>
              </tr>
            </table>
          </vue-scroll>
        </div>
        <div class="formList" v-if="leftPanel=='抄表流水'">
          <vue-scroll :ops="ops">
            <table class="table xx">
              <tr>
                <th class="h1">抄表日期</th>
                <th class="h2">表1读数</th>
                <th class="h3">表2读数</th>
                <th class="h4">气费</th>
                <th class="h4">上期欠费</th>
                <th class="h5">本期欠费</th>
                <th>详情</th>
              </tr>
              <tr v-for="item in cblsPanel">
                <td>{{item.CBRQ}}</td>
                <td>{{item.BS1}}</td>
                <td>{{item.BS2}}</td>
                <td>{{item.QF}}</td>
                <td>{{item.SQQF}}</td>
                <td>{{item.BQQF}}</td>
                <td @click="showXq('抄表流水',item)" class="xxxq"><img src="@/assets/imgs/xxxq.png" alt=""></td>
              </tr>
              <tr v-if="!cblsPanel.length">
                <td colspan="7" style="width:100%;">暂无数据</td>
              </tr>
            </table>
          </vue-scroll>
        </div>
        <div class="formList" v-if="leftPanel=='工单历史'">
          <div style="height:calc(100% - 40px)">
            <vue-scroll :ops="ops">
              <table class="table xx ls">
                <tr>
                  <th class="h1">接收部门</th>
                  <th class="h2">工单内容</th>
                  <th class="h3">创建日期</th>
                  <th class="h4">计划完成日期</th>
                  <th class="h4">创建人</th>
                  <th>详情</th>
                </tr>
                <tr v-for="i in gdlsPanel" @dblclick="gdJindu(i.kfgdh)">
                  <td>{{i.jsbm}}</td>
                  <td>
                    <el-tooltip class="" effect="light" placement="top">
                      <div slot="content" class="moreNr">{{i.gdnr}}</div>
                      <el-button class="gdnr_tishi">{{i.gdnr}}</el-button>
                    </el-tooltip>
                  </td>
                  <td>{{i.creat_time?i.creat_time.substring(0,10):""}}</td>
                  <td>{{i.jhrq?(i.jhrq.substring(0,4)+"-"+i.jhrq.substring(4,6)+"-"+i.jhrq.substring(6)):""}}</td>
                  <td>{{i.user?i.user.name:""}}</td>
                  <td @click="showXq('工单历史',i)" class="xxxq"><img src="@/assets/imgs/xxxq.png" alt=""></td>
                </tr>
                <tr v-if="!gdlsPanel.length">
                  <td colspan="6" style="width:100%;">暂无数据</td>
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
        <div class="formList" v-if="leftPanel=='订单列表'">
          <vue-scroll :ops="ops">
            <table class="table xx">
              <tr>
                <th>姓名</th>
                <th class="h1">商品总价</th>
                <th class="h2">数量</th>
                <th class="h3">手机号</th>
                <th class="h4">实付款</th>
                <th class="h5">状态</th>
                <th>详情</th>
              </tr>
              <tr v-for="item in ddlbPanel">
                <td>{{item.consignee}}</td>
                <td>{{item.price}}</td>
                <td>{{item.quantity}}</td>
                <td>{{item.phone}}</td>
                <td>{{item.amountPaid}}</td>
                <td>{{item.statusDesc}}</td>
                <td @click="showXq('订单列表',item)" class="xxxq"><img src="@/assets/imgs/xxxq.png" alt=""></td>
              </tr>
              <tr v-if="!ddlbPanel.length">
                <td colspan="7" style="width:100%;">暂无数据</td>
              </tr>
            </table>
          </vue-scroll>
        </div>
        <div class="formList" v-if="leftPanel=='来电记录'">
          <vue-scroll :ops="ops">
            <table class="table xx">
              <tr>
                <th class="h1">客户电话</th>
                <th class="h2">接听时间</th>
                <th class="h3">持续时间</th>
                <th class="h4">是否接听</th>
                <th class="h4">座机号</th>
              </tr>
              <tr v-for="item in ldjlPanel">
                <td>{{item.direction==1?item.callin_no.split('@')[0]:item.callout_no}}</td>
                <td>{{item.talking_start_time}}</td>
                <td>{{item.talk_time_duration}}</td>
                <td>{{item.pick_status?'已接':'未接'}}</td>
                <td>{{item.true_name}}</td>
              </tr>
              <tr v-if="!ldjlPanel.length">
                <td colspan="5" style="width:100%;">暂无数据</td>
              </tr>
            </table>
            <div style="text-align: right;">
              <el-pagination @current-change="handleLdjlPage" :current-page="ldjlPage"
                 layout="total, prev, pager, next, jumper" :total="ldjlTotal">
              </el-pagination>
            </div>
          </vue-scroll>
        </div>
      </div>
    </div>
    <!--查询客户-->
    <div class="cx" v-if="cxShow">
      <div class="head">
        <span>查询客户</span>
        <div class="close" @click="closeCx">关闭</div>
      </div>
      <div class="ss">
        <el-select v-model="searchYH.YHLY" style="width:140px;">
          <el-option key="1" label="管理站用户" value="1"></el-option>
          <el-option key="2" label="工营事团用户" value="2"></el-option>
        </el-select>
        <div style="width:90px;">
          <el-select v-model="searchYH.TJLX">
            <el-option key="1" label="用户ID" value="1"></el-option>
            <el-option key="2" label="卡号" value="2"></el-option>
            <el-option key="3" label="表具注册码" value="3"></el-option>
            <el-option key="4" label="手机号" value="4"></el-option>
          </el-select>
        </div>
        <div style="width:280px;">
          <el-input  v-model="searchYH.TJ" class="souInput1A" @keyup.enter.native="searchUser">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </div>
      </div>
      <div class="content">
        <table class="table gd">
          <tr>
            <th class="h1">用户ID</th>
            <th class="h2">姓名</th>
            <th class="h3">电话</th>
            <th class="h4">地址</th>
          </tr>
        </table>
        <vue-scroll :ops="ops1">
          <table class="table">
            <tr>
              <th class="h1">户号</th>
              <th class="h2">姓名</th>
              <th class="h3">电话</th>
              <th class="h4">地址</th>
            </tr>
            <tr v-show="souResult.show" @dblclick="souSure">
              <td>{{souResult.YHID}}</td>
              <td>{{souResult.YHMC}}</td>
              <td>{{souResult.SJH}}</td>
              <td>{{souResult.DZ}}</td>
            </tr>
          </table>
        </vue-scroll>
      </div>
    </div>
    <!--信息补录-->
    <div class="xxbl cx" v-if="blShow">
      <div class="head">
        <span>信息补录</span>
        <div class="close" @click="closeBl">关闭</div>
      </div>
      <div class="con2">
        <vue-scroll :ops="ops">
          <div class="zu">
            <span class="label">用户ID</span>
            <el-input v-model="xxblData.YHID" size="small" class="input" :disabled="true"></el-input>
          </div>
          <div class="zu">
            <span class="label">卡号</span>
            <el-input v-model="xxblData.KH" size="small" class="input" :disabled="true"></el-input>
          </div>
          <div class="zu">
            <span class="label">注册码</span>
            <el-input v-model="xxblData.ZCM" size="small" class="input" :disabled="true"></el-input>
          </div>
          <div class="zu">
            <span class="label">管理站</span>
            <el-select v-model="xxblData.GLZ" size="small" class="input">
              <el-option v-for="(i,index) in glzList" :value="i" :key="index"></el-option>
            </el-select>
          </div>
          <div class="zu">
            <span class="label">手机号</span>
            <el-input v-model="xxblData.SJH" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">用户名称</span>
            <el-input v-model="xxblData.YHMC" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">用户别名</span>
            <el-input v-model="xxblData.YHBM" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">地址</span>
            <el-input v-model="xxblData.DZ" size="small" class="input"></el-input>
          </div>
          <div class="zu">
            <span class="label">人口数</span>
            <el-input v-model="xxblData.RKS" size="small" class="input"></el-input>
          </div>
        </vue-scroll>
      </div>
      <div class="anniu">
        <el-button size="small" @click="closeBl">取消</el-button>
        <el-button type="primary" size="small" @click="saveBl">保存</el-button>
      </div>
    </div>
    <!--详情-->
    <div class="xxbl cx xqForm" v-if="xxxqShow">
      <div class="head">
        <span>{{xqType+"-详情"}}</span>
        <div class="close" @click="closexq">关闭</div>
      </div>
      <div class="con2">
        <vue-scroll :ops="ops" v-if="xqType=='充值购气'" class="xq_czgq">
          <div class="zu">
            <span class="label">充值日期</span>
            <el-input v-model="xqData.CZRQ" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">交易金额</span>
            <el-input v-model="xqData.JYE" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">卡表购气量</span>
            <el-input v-model="xqData.GQL" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">卡表气费</span>
            <el-input v-model="xqData.QF" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">流水号</span>
            <el-input v-model="xqData.LSH" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">卡表累计购气次数</span>
            <el-input v-model="xqData.LJGQCS" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">一档基准量</span>
            <el-input v-model="xqData.JZL1" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">二档基准量</span>
            <el-input v-model="xqData.JZL2" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">卡表一档购气量</span>
            <el-input v-model="xqData.GQL1" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">卡表二档购气量</span>
            <el-input v-model="xqData.GQL2" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">卡表三档购气量</span>
            <el-input v-model="xqData.GQL3" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">卡表保险费</span>
            <el-input v-model="xqData.BXF" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">卡表复置金</span>
            <el-input v-model="xqData.FZJ" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">卡表垃圾费</span>
            <el-input v-model="xqData.LJF" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">入库日期时间</span>
            <el-input v-model="xqData.RKRQ" size="small" class="input" readonly></el-input>
          </div>
        </vue-scroll>
        <vue-scroll :ops="ops" v-if="xqType=='抄表流水'" class="xq_czgq">
          <div class="zu">
            <span class="label">抄表日期</span>
            <el-input v-model="xqData.CBRQ" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">表1读数</span>
            <el-input v-model="xqData.BS1" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">表2读数</span>
            <el-input v-model="xqData.BS2" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">气费</span>
            <el-input v-model="xqData.QF" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">上期欠费</span>
            <el-input v-model="xqData.SQQF" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">本期欠费</span>
            <el-input v-model="xqData.BQQF" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">一档基准量</span>
            <el-input v-model="xqData.JZL1" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">二档基准量</span>
            <el-input v-model="xqData.JZL2" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">一档用量</span>
            <el-input v-model="xqData.YQL1" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">二档用量</span>
            <el-input v-model="xqData.YQL2" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">三档用量</span>
            <el-input v-model="xqData.YQL3" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">保险费</span>
            <el-input v-model="xqData.BXF" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">复置金</span>
            <el-input v-model="xqData.FZJ" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">垃圾费</span>
            <el-input v-model="xqData.LJF" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">违约金</span>
            <el-input v-model="xqData.WYJ" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">本期实收</span>
            <el-input v-model="xqData.BQSS" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">入库日期时间</span>
            <el-input v-model="xqData.RKRQ" size="small" class="input" readonly></el-input>
          </div>
        </vue-scroll>
        <vue-scroll :ops="ops" v-if="xqType=='工单历史'">
          <div class="zu">
            <span class="label">工单号</span>
            <el-input v-model="xqData.kfgdh" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">用户ID</span>
            <el-input v-model="xqData.yhid" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">姓名</span>
            <el-input v-model="xqData.yhmc" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">手机号</span>
            <el-input v-model="xqData.sjh" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">地址</span>
            <el-input v-model="xqData.dz" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">接收部门</span>
            <el-input v-model="xqData.jsbm" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">工单内容</span>
            <el-input v-model="xqData.gdnr" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">创建日期</span>
            <el-input v-model="com_create" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">计划完成日期</span>
            <el-input v-model='com_jhrq' size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">创建人</span>
            <el-input v-model="xqData.GQL2" size="small" class="input" readonly></el-input>
          </div>
        </vue-scroll>
        <vue-scroll :ops="ops" v-if="xqType=='订单列表'">
          <div class="zu">
            <span class="label">姓名</span>
            <el-input v-model="xqData.consignee" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">手机号</span>
            <el-input v-model="xqData.phone" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">地址</span>
            <el-input v-model="xqData.areaName" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">商品总价</span>
            <el-input v-model="xqData.price" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">手续费</span>
            <el-input v-model="xqData.fee" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">运费</span>
            <el-input v-model="xqData.freight" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">税金</span>
            <el-input v-model="xqData.tax" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">促销</span>
            <el-input v-model="xqData.promotionDiscount" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">优惠券</span>
            <el-input v-model="xqData.couponDiscount" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">调整金额</span>
            <el-input v-model="xqData.offsetAmount" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">兑换积分</span>
            <el-input v-model="xqData.exchangePoint" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">订单总价</span>
            <el-input v-model="xqData.amount" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">实付款</span>
            <el-input v-model="xqData.amountPaid" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">退款金额</span>
            <el-input v-model="xqData.refundAmount" size="small" class="input" readonly></el-input>
          </div>
          <div class="zu">
            <span class="label">交易状态</span>
            <el-input v-model="xqData.statusDesc" size="small" class="input" readonly></el-input>
          </div>
          <table class="table xx">
            <tr>
              <th class="h1">图片</th>
              <th class="h2">商品名</th>
              <th class="h3">订单编号</th>
              <th class="h4">商品价格</th>
              <th class="h4">数量</th>
              <th class="h5">规格</th>
            </tr>
            <tr v-for="item in ddlbXqList">
              <td><img :src="item.thumbnail" style="width:50px;" alt=""></td>
              <td>{{item.name}}</td>
              <td>{{item.sn}}</td>
              <td>{{item.price}}</td>
              <td>{{item.quantity}}</td>
              <td>{{item.specifications}}</td>
            </tr>
            <tr v-if="!ddlbXqList.length">
              <td colspan="7" style="width:100%;">暂无数据</td>
            </tr>
          </table>
        </vue-scroll>
      </div>
    </div>
    <!--工单进度-->
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
    <div class="modal" v-if="cxShow || blShow || xxxqShow || jdShow"></div>
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
              onlyShowBarOnScroll: false,
            },
          },
          ops1:{
            bar: {
              background: "rgba(144,147,153,.3)",
              onlyShowBarOnScroll: true,
            },
          },
          tabList:[
            "客户信息","表具信息","充值购气","抄表流水","工单历史","订单列表","来电记录"
          ],
          leftPanel:"客户信息",
          //客户信息
          kehuPanel:{
            YHID:"",
            KH:"",
            ZCM:"",
            SJH:"",
            GLZ:"",
            CBFS:'',
            YHMC:"",
            BS1:"",
            BS2:"",
            YE:"",
            CBZQ:"",
            YHBM:"",
            DZ:"",
            SCCB:"",
            ZHQF:"",
            WYJ:"",
            JTLJ:""
          },
          //表具信息
          bjPanel:{
            ZCM:"",
            CBLX:"",
            CCNF:"",
            JBRQ:"",
            BZT:"",
            BTBH:"",
            KZQH:"",
            JBCJ:"",
            KZQCJ:"",
            BXH:"",
            BZL:"",
          },
          czgqPanel:[],
          cblsPanel:[],
          gdlsPanel:[],
          ddlbPanel:[],//订单列表
          ldjlPanel:[],//来电记录
          ldjlTotal:1,//来电记录总条数
          ldjlPage:1,//来电记录当前页码
          cxShow:false,
          blShow:false,
          xxxqShow:false,//信息详情显示
          xqType:false,//信息详情显示类型
          xqData:{},//信息详情内容
          ddlbXqList:[],//订单详情列表
          jdShow:false,//工单进度显示
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
          //信息补录
          xxblData:{
            YHID:"",
            KH:"",
            ZCM:"",
            GLZ:"",
            SJH:"",
            YHMC:"",
            YHBM:"",
            DZ:"",
            RKS:""
          },
          searchYH:{
            YHLY:"1",
            TJLX:"1",
            TJ:"",
          },
          //查询客户结果
          souResult:{
           show:false,
           YHID:"",
           YHMC:"",
           SJH:"",
           DZ:"",
          },
          //工单历史翻页
          page:1,
          totalNum:1,
        }
      },
      computed:{
        TJ(){
          return this.$store.state.userInter.TJ;
        },
        glzList(){
          return this.$store.state.glzList;
        },
        //工单历史创建日期
        com_create(){
          if(this.xqData.creat_time){
            return this.xqData.creat_time.substring(0,10)
          }else{
            return "";
          }
        },
        //工单历史完成日期
        com_jhrq(){
          if(this.xqData.jhrq){
            return this.xqData.jhrq.substring(0,4)+"-"+this.xqData.jhrq.substring(4,6)+"-"+this.xqData.jhrq.substring(6);
          }else{
            return "";
          }
        }
      },
      watch: {
        TJ:function(old,newd){
          this.getUserInfo();
        }
      },
      methods:{
        wheel(e){
          this.maxCount = this.$refs.child.offsetWidth - this.$refs.parent.offsetWidth;
          this.wheelCout = this.wheelCout+e.deltaY;
          if(this.wheelCout<0){this.wheelCout=0}
          if(this.wheelCout>this.maxCount){this.wheelCout=this.maxCount+5}
          this.$refs['vs'].scrollTo({
            x: this.wheelCout,
          })
        },
        changeLeftPanel(title){
          this.leftPanel = title;
        },
        //查询客户按钮点击
        search(){
          this.souResult = {
            show:false,
            YHID:"",
            YHMC:"",
            SJH:"",
            DZ:"",
          };
          this.cxShow = true;
        },
        //查询客户
        searchUser(){
          this.axios({
            method:"get",
            url:"/dc/getUserInfo",
            params:{...this.searchYH}
          }).then((res) => {
            if(res.status == 200){
              if(res.data.FHM == "M000"){
                for(let key in this.souResult){
                  if(res.data.hasOwnProperty(key)){
                    this.souResult[key] = res.data[key];
                  }
                  this.souResult.show = true;
                }
              }else{
                this.$message.info(res.data.FHXX);
                this.souResult.show = false;
              }
            }
          })
        },
        //查出客户后双击获取客户信息
        souSure(){
          this.getUserInfo(this.searchYH,true);
        },
        //关闭查询客户弹窗
        closeCx(){
          this.cxShow = false;
        },
        //信息补录按钮点击
        xxbl(){
          if(this.kehuPanel.YHID){
            this.blShow = true;
          }else{
            this.$message.info("请先查询用户");
          }
        },
        //信息补录保存
        saveBl(){
          if(!this.xxblData.GLZ){
            this.$message.error("请选择管理站！");
            return;
          }
          let userRecord = {...this.xxblData};
          this.axios({
            method:"post",
            url:"/userrecord/addUserRecord",
            // headers:{
            //   'Content-Type':'application/x-www-form-urlencoded'
            // },
            params:userRecord
          }).then((res) => {
            if(res.data.status == "success"){
              this.$message.success("补录成功！");
              this.closeBl();
            }else{
              this.$message.error("补录失败！请重试！")
            }
          })
        },
        //关闭补录弹窗
        closeBl(){
          this.blShow = false;
        },
        //获取客户信息
        getUserInfo(da,searchClose){
          this.axios({
            method:"get",
            url:"/dc/getUserInfo",
            params:da
          }).then((res) => {
            if(res.status == 200){
              if(res.data.FHM == "M000"){
                let d = {TJ:res.data.YHID}
                //更新客户信息
                for(let key in this.kehuPanel){
                  if(res.data.hasOwnProperty(key)){
                    this.kehuPanel[key] = res.data[key];
                  }
                }
                if(searchClose){
                  //表示是从查询客户双击触发的,所以信息修改后关闭查询客户弹窗
                  this.closeCx();
                }
                let data01 = {...da};
                data01.TJLX = 1;
                data01.TJ = res.data.YHID;
                this.getBjMsg(data01);
                this.getChargeFlow(data01);
                this.getReadFlow(data01);
                this.getGdls();
                this.getOrderList(res.data.SJH);
                this.getLdjl(res.data.SJH);
                //更新信息补录中的三项不可修改项
                this.xxblData.YHID = res.data.YHID;
                this.xxblData.KH = res.data.KH;
                this.xxblData.ZCM = res.data.ZCM;
                this.xxblData.GLZ = res.data.GLZ;
                //更新新建工单的相应表单信息
                this.$parent.newGd.YHID = res.data.YHID;
                this.$parent.newGd.SJH = res.data.SJH;
                this.$parent.newGd.DZ = res.data.DZ;
                this.$parent.newGd.YHMC = res.data.YHMC;
              }else{
                //请求失败
                this.$message.info("未查询到客户信息");
              }
            }
          })
        },
        //表具信息
        getBjMsg(d){
          this.axios({
            method:"get",
            url:"dc/getMeterInfo",
            params:d
          }).then((res) => {
            for(let key in this.bjPanel){
              if(res.data.hasOwnProperty(key)){
                this.bjPanel[key] = res.data[key];
              }
            }
          })
        },
        //充值购气
        getChargeFlow(d){
          this.axios({
            method:"get",
            url:"dc/getChargeFlow",
            params:{
              ...d,
              QSRQ:window.getNowFormatDate("",-20),
              ZZRQ:window.getNowFormatDate()
            }
          }).then((res) => {
            if(res.data.FHM && res.data.FHM == "M000"){
              this.czgqPanel = res.data.lists;
            }
          })
        },
        //抄表流水
        getReadFlow(d){
          this.axios({
            method:"get",
            url:"dc/getReadFlow",
            params:{
              ...d,
              QSRQ:window.getNowFormatDate("",-20),
              ZZRQ:window.getNowFormatDate()
            }
          }).then((res) => {
            if(res.data.FHM && res.data.FHM == "M000"){
              this.cblsPanel = res.data.lists;
            }
          })
        },
        //工单历史
        getGdls() {
          this.axios({
            method: "post",
            url: "/dcgd/getWorkOrderListsBy",
            params: {sjh:this.kehuPanel.SJH,start_create_time:"",end_create_time:"",page:this.page,cnt:10,
              jsbm:'',yhmc:'',sllb:'',status:'',creat_user_id:''
            },
          }).then((res) => {
            if (res.status == 200) {
              if (res.data.lists) {
                this.gdlsPanel = res.data.lists;
                this.totalNum = res.data.num
              }
            } else {
              this.$message.error("请求失败");
            }
          })
        },
        //工单历史翻页
        changePage(page){
          this.page = page;
          this.getGdls();
        },
        //商品列表
        getOrderList(num){
          this.axios({
            method: "post",
            url: "/order/list",
            params: {searchType:"searchByPhoneNum",phoneNum:num},
          }).then((res) => {
            if (res.status == 200) {
              if(res.data.status == "success"){
                this.ddlbPanel = res.data.date;
              }else{
                this.ddlbPanel = [];
                this.$message.warning("订单列表请求失败:"+res.data.msg)
              }
            }
          })
        },
        //来电记录
        getLdjl(phoneNum) {
          this.axios({
            method: "post",
            url: "/callDetail/callDetailList",
            params: {
                searchPhone:phoneNum,
                callDirection:0,
                domain:'PSTN',
                page:this.ldjlPage
            },
          }).then((res) => {
            if (res.status == 200) {
              if (res.data.date.list) {
                this.ldjlPanel = res.data.date.list;
                this.ldjlTotal = res.data.date.total;
              }
            } else {
              this.$message.error("来电记录请求失败");
            }
          })
        },
        handleLdjlPage(page){
          this.ldjlPage = page;
          this.getLdjl();
        },
        //来电时间字符串截取
        timeSub(t){
          if(!t || typeof (t) !== "string"){
            return "";
          }
          return t.substring(0,10)+" "+t.substring(11,19)
        },
        //显示详情
        showXq(type,row){
          this.xqType = type;
          if(this.xqType == "订单列表" && row.orderItemDTOList.length){
            this.ddlbXqList = row.orderItemDTOList;
          }
          this.xqData = row;
          this.xxxqShow = true;
        },
        //关闭详情
        closexq(){
          this.xxxqShow = false;
        },
        //显示工单进度弹窗
        gdJindu(gdh){
          if(!gdh){
            this.$message.info("咨询和查询类工单没有工单进度!");
            return;
          }
          this.jdShow = true;
          this.jdData = {};
          this.axios({
            method:"get",
            url:"/dcgd/getUserTaskTrace",
            params:{
              TJLX:3,
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
        //关闭进度弹窗
        closeJd(){
          this.jdShow = false;
        },
      },
      mounted(){
        //客户信息
        let a = this.$store.state.userInter;
        if(this.$route.path.indexOf("/workOrder1") != -1 && a.TJ && a.YHLY && a.TJLX){
          this.getUserInfo(this.$store.state.userInter);
        }
        //留言管理的处理点击过来的
        if(this.$route.query.type == 1){
          this.getUserInfo(this.$store.state.userInter);
        }
        // this.getOrderList();
      }
    }

</script>

<style lang="scss" scoped>
  .box11{
    width:100%;
    height:100%;
  }
  .box11 .content{
    height:100%;
    box-sizing: border-box;
    position:relative;
  }
  $height1:80px;
  .xxhang{
    height:$height1;
    display: flex;
    align-items: center;
    position: relative;
    .toux{
      width:$height1;
      height:$height1;
      display: flex;
      align-items: center;
      img{
        height:100%;
      }
    }
    .msg{
      position:absolute;
      left:$height1;
      top:0;
      width:68.7%;
      height:100%;
      box-sizing: border-box;
      padding:0 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 16px;
      .hang{
        display: flex;
        &:first-child{
          margin-bottom:6px;
        }
        >div{
          display: flex;
          align-items: center;
          color:rgba(31,35,62,1);
          img{
            margin-right:6px;
          }
        }
        .name{
          margin-right:15px;
        }
      }
    }
    .anniu{
      height:100%;
      position: absolute;
      top:0;
      right:0;
      display: flex;
      justify-content: center;
      flex-direction: column;
      .a{
        padding:6px 10px;
        background:rgba(145,198,66,1);
        /*border-radius:2px;*/
        display: flex;
        height:22px;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color:rgba(255,255,255,1);
        cursor: pointer;
        &:first-child{
          margin-bottom: 8px;
        }
      }
    }
  }
  $xianTop:10px;
  .xian{
    width:100%;
    position:absolute;
    height:1px;
    background: rgba(243,243,243,1);
    left:0;
    top:calc(#{$height1} + #{$xianTop})
  }
  $xianHeight:$xianTop * 2 + 1px;
  .xianSHI{
    width:100%;
    height:$xianHeight;
  }
  $height2:30px;
  .form{
    height:calc(100% - #{$height1} - #{$xianHeight});
    .tab{
      margin-bottom:14px;
      width:100%;
      height:$height2;
    }
    .formList{
      height:calc(100% - #{$height2})
    }
  }
  .olist1 .li{
    /*padding:5px 10px;*/
    margin-right: 5px;
    box-sizing:border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    height:100%;
    border-radius:1px;
    color:#1F233E;
    float: left;
    cursor: pointer;
    &.active{
      background:rgba(121,154,250,1);
      color:rgba(255,255,255,1);
    }
  }
  /deep/ .el-tag{
    border-radius:0;
  }
  .ul1A{
    /*width:100%;*/
  }
  .ul1A li{
    width:44%;
    height:42px;
    float: left;
    margin-right:4%;
    font-size: 14px;
    color:#1F233E;
    display: flex;
    align-items: center;
    margin-top:8px;
    margin-bottom:8px;
    $spanW:80px;
    span{
      width:$spanW;
    }
    .input1A{
      width:calc(100% - #{$spanW});
    }
    /deep/ .input1A input.el-input__inner{
      background:rgba(243,243,243,1);;
    }
    /deep/ .el-input.is-disabled .el-input__inner{
      color:#1F233E;
    }
    /deep/ .el-input.is-disabled .el-input__inner{
      cursor: text;
    }
  }
  .cx{
    width:711px;
    height:569px;
    position: fixed;
    z-index:3;
    margin:auto;
    top:0;right:0;left:0;bottom:0;
    background: #fff;
    border-radius:6px;
    $h:35px;
    $pl:15px;
    .head{
      height:$h;
      background: #D9D9D9;
      color:#1F233E;
      display: flex;
      align-items: center;
      padding-left:$pl;
      position: relative;
      font-size: 14px;
      .close{
        position:absolute;
        height:100%;
        right:$pl;
        top:0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
    $sou:36px;
    .ss{
      width:520px;
      height:$sou;
      margin:15px auto;
      display: flex;
    }
    .content{
      padding:0 $pl $pl;
      height:calc(100% - #{$h} - #{$sou} - 30px);
      position:relative;
      .table{
        width:100%;
        border-collapse: collapse;
        tr{
          border:1px solid #ebeef5;
          height:36px;
          cursor: default;
          .h1{
            width:120px;
          }
          .h2{
            width:100px;
          }
          .h3{
            width:100px;
          }
        }
      }
      .table.gd{
        position:absolute;
        z-index:1;
        top:0;
        left:$pl;
        width:calc(100% - #{$pl} * 2);
        background: #f1f1f1;
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
    .anniu{
      padding:$pl;
      background: #F3F3F3;
      height:60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
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
  .table{
    width:100%;
    border-collapse: collapse;
    word-wrap: break-word; word-break: break-all;
  }
  .table tr{
    height:36px;
  }
  table,table tr th, table tr td { border:1px solid #e2e5ec;text-align: center}
  .fenye{
    height:40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .table.xx.ls{
    /deep/ .el-button{
      color:inherit;
      background:none;
      border:none;
      width:100%;height:100%;
      cursor: default;
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
  }
  .xxxq{
    cursor: pointer;
  }
  .xxbl.cx.xqForm{
    width:850px;
  }
  //充值购气详情表单宽度调整
  .xxbl .con2 .xq_czgq .zu .label{
    width:120px;
  }
  .xxbl .con2 .xq_czgq .zu .input{
    width:calc(100% - 100px);
  }
</style>
