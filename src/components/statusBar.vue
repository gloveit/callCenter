<template>
    <div class="all" v-loading="loginLoading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="timeBox">
        <div class="title">持续时间：</div>
        <div class="ka">
          <span class="i">{{time.shi}}</span>
          <span class="m">:</span>
          <span class="i">{{time.fen}}</span>
          <span class="m">:</span>
          <span class="i">{{time.miao}}</span>
        </div>
      </div>
      <div class="annius" id="newPhoneBar">
        <ul>
          <li @click="chatOn" id="imActions">
            <img src="@/assets/imgs/yiqiyong.png" v-if="imgShow.chat" alt="">
            <img src="@/assets/imgs/weiqiyong.png" v-else alt="">
            <div class="zi">{{agent.weChat}}</div>
          </li>
          <li @click="agentLogin">
            <!--<img src="@/assets/imgs/nojiuxu.png" v-if="agent.status==''">-->
            <img src="@/assets/imgs/jiuxu.png">
            <div class="zi">{{agent.status}}</div>
          </li>
          <li @click="setBusy">
            <img src="@/assets/imgs/zhixian.png" alt="" v-if="clickSwitch.call">
            <img src="@/assets/imgs/nozhixian.png" alt="" v-else>
            <div class="zi">{{agent.busy}}</div>
          </li>
          <li @click="complete">
            <img src="@/assets/imgs/wancheng.png" alt="" v-if="clickSwitch.complete">
            <img src="@/assets/imgs/nowancheng.png" alt="" v-else>
            <div class="zi">完成</div>
          </li>
          <li @click="hangupClick">
            <img src="@/assets/imgs/guaduan.png" alt="" v-if="clickSwitch.hangup">
            <img src="@/assets/imgs/noguaduan.png" alt="" v-else>
            <div class="zi">挂断</div>
          </li>
          <li @click="holdClick">
            <img src="@/assets/imgs/shihui.png" alt="" v-if="clickSwitch.hold">
            <img src="@/assets/imgs/noshihui.png" alt="" v-else>
            <div class="zi">{{agent.hold}}</div>
          </li>
          <li clickid="imgTransfer" id="imgTransfer" @click="transferToAgent" v-if="agentButton.transferAgent">
            <img src="@/assets/imgs/zhuanzuoxi.png" alt="" v-if="clickSwitch.zhuan">
            <img src="@/assets/imgs/nozhuanzuoxi.png" alt="" v-else>
            <div class="zi">转接坐席</div>
          </li>
          <li clickid="imgTransfer" id="imgOutbound" @click="outbound" v-if="agentButton.callPhone">
            <img src="@/assets/imgs/hudianhua.png" alt="" v-if="clickSwitch.call">
            <img src="@/assets/imgs/nohudianhua.png" alt="" v-else>
            <div class="zi">呼叫电话</div>
          </li>
          <li clickid="imgTransfer" id="imgCallAgent" @click="callAgent" v-if="agentButton.callAgent">
            <img src="@/assets/imgs/huzuoxi.png" alt="" v-if="clickSwitch.call">
            <img src="@/assets/imgs/nohuzuoxi.png" alt="" v-else>
            <div class="zi">呼叫坐席</div>
          </li>
          <li clickid="imgInvite" id="imgInvite" @click="inviteAgent" v-if="agentButton.inviteAgent">
            <img src="@/assets/imgs/zhuanzuoxi.png" alt="" v-if="clickSwitch.zhuan">
            <img src="@/assets/imgs/nozhuanzuoxi.png" alt="" v-else>
            <div class="zi">邀请坐席</div>
          </li>
          <li>
            <img src="@/assets/imgs/daifuwu0.png" v-if="agent.wait==0">
            <img src="@/assets/imgs/daifuwu1.png" v-else>
            <div class="zi">待服务:{{agent.wait}}</div>
          </li>
          <li style="margin-left:16px;" @click="addGd('/workOrder','新建工单')">
            <img src="@/assets/imgs/addForm.png" alt="">
            <div class="zi">新建工单</div>
          </li>
          <li>
            <div class="weiHF" @click="goHuifu">{{huifuNum}}</div>
          </li>
        </ul>
      </div>
      <div class="mine">
        <div class="name">{{nick}}</div>
        <img src="@/assets/imgs/logout.png" @click="logout" class="logout">
      </div>
      <div id="uiComponent">

      </div>
    </div>
</template>

<script>
  import simpleBar from "../../static/agentbar/simpleBarUI.js"
    export default {
        name: "status-bar",
        data(){
          return{
            time:{
              shi:"--",fen:'--',miao:'--'
            },
            loginLoading:false,
            agent:{
              weChat:"未启用",
              status:"未登录",
              busy:"置忙",
              hold:"保持",
              wait:0
            },
            imgShow:{
              chat:false,
              jiuxu:false,
            },
            clickSwitch:{
              complete:false,
              hangup:false,
              hold:false,
              zhuan:false,
              call:false,
            },
            timeInterval:null,
            //未回复消息条数
            huifuNum:0,
          }
        },
        computed:{
          weChatOn(){
            return this.$store.state.weChatOn;
          },
          nick(){
            if(this.$store.state.agentInfo.trueName){
              return this.$store.state.agentInfo.trueName;
            }else{
              if(window.getSession('agentInfo') && window.isJson(window.getSession('agentInfo'))){
                return JSON.parse(window.getSession('agentInfo')).trueName;
              }else{
                return "金卡管理员";
              }
            }
          },
          accessInfo(){
            return {
              realm: this.$store.state.agentInfo.enterpriseName,
              agent_id : this.$store.state.agentInfo.enterpriseName+this.$store.state.agentInfo.loginName,
              nick:this.$store.state.agentInfo.trueName,
            }
          },
          agentButton(){
            return this.$store.state.agentButton;
          },
        },
        methods:{
          logout(){
            this.$confirm('是否退出登录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              lockScroll:false,
            }).then(() => {
              this.logoutOk();
            }).catch(() => {
              console.log("退出登录操作已取消")
            });
          },
          logoutOk(){
            //退出登录的时候退出坐席
            SimpleAgentMgr.disconnect();
            SIM.stop();
            this.agent.status = "未登录";
            this.agent.weChat = "未启用";
            this.$store.state.weChatOn = false;
            this.imgShow.chat = false;
            //清除用户信息和菜单信息
            this.$root.clearUser();
            this.axios({
              method:"post",
              url:"/logout",
              data:{},
              transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
              }],
              headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            }).then((res)=> {
              if(res.data.status == "success"){
                this.$router.push({path:"/login"});
              }else{
                this.$router.push({path:"/login"});
                this.$message.error("已退出登录,但响应错误!");
              }
            }).catch((res) => {
              this.$router.push({path:"/login"});
              this.$message.error("已退出登录,但退出请求出错!");
            })
          },
          addGd(p1,t1){
            //清空state中的手机号、问题描述
            this.$store.state.gdData = {SJH:"", GDNR:"",};
            //来源其他
            this.$store.state.gdSource = 0;
            //打开新建工单页
            this.$store.state.goRoute(p1,t1);
          },
          timeF(t){
            let arr = t.split(":");
            this.time = {
              shi:arr[0],fen:arr[1],miao:arr[2]
            }
          },
          phoneOn(){
            console.log("接通")
            this.clickSwitch = {
              ...this.clickSwitch,
              complete:false,
              hangup:true,
              hold:true,
              zhuan:true,
            }
            //清空state中的手机号、问题描述
            this.$store.state.gdData = {SJH:this.$store.state.phone.num, GDNR:"",};
            //来源其他
            this.$store.state.gdSource = 1;
            this.$store.state.goRoute("/workOrder1","电话工单");
            clearInterval(this.timeInterval)
            this.timeInterval = setInterval(() => {
              let time = $("#statusDuration").text();
              this.timeF(SAM.getDisplayStatusDuration());
            },1000)
          },
          //登录成功后运行
          loginAfter(){
            // SAM.complete();
            this.agent.status = "就绪";
            SAM.ready();
            SAM.startQueueMonitor();
            this.clickSwitch.call = true;
          },
          onService(e) {
            let that = this;
            console.log("ssss-eventType",e.eventType);
            //登录成功
            if(e.eventType == "onLoginSuccess"){
              console.log("ssss-登录成功");
              this.loginLoading = false;
              this.loginAfter();
            }
            //登出
            else if(e.eventType == "onLogout"){
              this.clickSwitch.call = false;
              this.loginLoading = false;
              //关闭微信聊天
              SIM.stop();
              this.agent.status = "未登录";
              this.agent.weChat = "未启用";
              this.$store.state.weChatOn = false;
              this.imgShow.chat = false;
            }
            // else if(e.isServiceEvent){}
            //振铃
            else if (e.eventType == SimpleAgentMgr.EVENT_SERVICE_START) {
              console.log("ssss振铃")
              this.clickSwitch.hangup = true;
              let phoneNumber = "";
              //呼出
              if (SimpleAgentMgr.getACDEvent().acdCall.isOutBound) {
                // 取 callee
                phoneNumber = SimpleAgentMgr.getACDEvent().acdCall.callee;
                console.log("正在呼出电话：" + phoneNumber);
                if (SimpleBarUI.options && SimpleBarUI.options.onPhoneNumberDisplay) {
                  phoneNumber = SimpleBarUI.options.onPhoneNumberDisplay(phoneNumber);
                }
                let content = "号码: " + phoneNumber;
                setTimeout(function() {
                  QPhoneTool.acceptCall();
                }, 1000);
                if (phoneNumber) {
                  layer.open({
                    type: 1 //Page层类型
                    ,area: ['350px', '180px']
                    ,title: "正在呼出"
                    ,shade: 0 //遮罩透明度
                    ,content: '<div style="padding:20px;text-align:left;">' + content + '</div>'
                    ,btn: ["取消呼出"]
                    ,closeBtn: 0
                    ,end: function() {
                      SimpleAgentMgr.cancelAction(SimpleBarUI.cancelActionId);
                    }
                  }, function() {
                    SimpleAgentMgr.cancelAction(SimpleBarUI.cancelActionId);
                  });
                }
              }else{
                //呼入
                phoneNumber = SimpleAgentMgr.getACDEvent().acdCall.caller;
                //IP电话不弹窗
                if(this.$store.state.agentInfo.phoneType == "pstnPhone"){
                  this.$store.state.callShow = false;
                  this.$store.commit('cphone',{title:"IP电话呼入",num:phoneNumber})
                  return;
                }
                //视频呼入
                if (SAM.getACDEvent().acdCall.isVideo ) {
                  console.log("视频呼入来自：" + phoneNumber);
                  this.$store.state.phone = {
                    title:"视频呼入",num:phoneNumber
                  }
                }
                //电话呼入
                else {
                  console.log("电话呼入来自：" + phoneNumber);
                  this.axios({
                    method:"get",
                    url:"/dc/getUserInfo",
                    params:{
                      YHLY:1,
                      TJLX:4,
                      TJ:phoneNumber
                    }
                  }).then((res)=>{
                    this.$store.commit('cphone',{title:"正在呼入",num:phoneNumber})
                    //查询用户姓名
                    if(res.data.YHMC){
                      this.$store.state.phone.title = res.data.YHMC
                    }else{
                      this.$store.state.phone.title = "未知客户";
                    }
                    this.$store.state.userInter.TJ = phoneNumber;
                    this.$store.state.callShow = true;
                  }).catch(error=>{
                    this.$store.state.phone.title = "未知客户";
                    this.$message.warning("查询电话来源信息失败！")
                  })
                }
              }
            }
            //电话接通
            else if (e.eventType == SimpleAgentMgr.EVENT_SERVICE_PICKUP) {
              console.log("ssss-eventType电话接通");
              if(this.$store.state.agentInfo.phoneType == "pstnPhone"){
              	//关闭来电弹窗
                this.$store.state.callShow = false;
                //关闭layer弹窗
                layer.closeAll();
                this.$message.info("已在PSTN或SIP电话端接听。");
                //表示电话已接听、非来电时挂断
                this.$store.state.callOffIf = 2;
                this.phoneOn();
              }
              this.phoneOn();
            }
            //坐席状态改变
            else if(e.eventType == "onAgentStatusChange"){
              console.log("ssss坐席状态改变");
              console.log("ssss状态名:",SAM.getDisplayStatus());
              this.agent.status = SAM.getDisplayStatus();
              //正在通话中
              if(SAM.isAgentInService()){
                this.phoneOn();
                if(QPhoneTool.qPhone && QPhoneTool.qPhone.currentCall){
                  QPhoneTool.acceptCall();
                }
              }
              else if(SAM.getDisplayStatus() == "接待客户"){
                if(this.$store.state.agentInfo.phoneType == "pstnPhone"){
                  this.$store.state.callShow = false;
                  this.$message.info("已在PSTN或SIP电话端接听。");
                  this.phoneOn();
                }
              }
              else if(SAM.getDisplayStatus() == "正在通话"){
                this.phoneOn();
              }
              else if(SAM.getDisplayStatus() == "正在呼叫"){
                this.clickSwitch.hangup = true;
              }
              else if(SAM.getDisplayStatus() == "就绪"){
                this.clickSwitch.hangup = false;
                this.clickSwitch.hold = false;
                this.clickSwitch.zhuan = false;
                this.agent.hold = "保持";
                clearInterval(that.timeInterval);
                this.time = {
                  shi:"--",fen:'--',miao:'--'
                }
              }
              else if(SAM.getAgentStatus().status == "ready"){
                this.agent.busy = "置忙";
              }
              else if(SAM.getAgentStatus().status == "not_ready"){
                this.agent.busy = "置闲";
              }
            }
            else if(e.eventType == "onAgentPartnerStatusChange"){
              console.log("ssss_partner",SAM.getQueueList().length)
              this.agent.wait = SAM.getQueueList().length;
            }
            else if(e.eventType == "request_changed"){
              console.log("ssss-队列长度",SAM.getQueueList().length)
              this.agent.wait = SAM.getQueueList().length;
            }
            else if(e.eventType == "request_cancelled"){
              console.log("ssss-请求取消",SAM.getQueueList().length)
              this.agent.wait = SAM.getQueueList().length;
              this.$store.state.callShow = false;
            }
            else if(e.eventType == "request_satisified"){
              console.log("ssss_满意",SAM.getQueueList().length)
              this.agent.wait = SAM.getQueueList().length;
            }
            //微信收到消息
            else if (e.eventType == "recv_msg") {
              console.log("ssss收到微信消息",e.msg.session.id);
              //互联网聊天红点提醒
              if(this.$route.path != "/weChat" && this.agent.weChat == "已开启"){
                this.$store.commit("cchatAlarm",true);
              }
              let chatId = $("#weChat01").contents().find("#chatButtons>.layui-btn-normal").attr("data-node-id");
              if(chatId && Object.getOwnPropertyNames(this.$store.state.usersInfo).length == 1){
                let a = {};
                a[chatId] = {
                  id:chatId,
                  newGd:{
                    DZ:"",
                    YHID:"",
                    YHMC:"",
                    JSBM:"",
                    // GDH:"",
                    SJH:"",
                    JHRQ:"",
                    GDNR:"",
                  },
                }
                this.$store.commit("cusersInfo",a)
                this.$store.state.chatIdAc = chatId;
              }
            }
            //完成
            else if (e.eventType == "service_complete" ) {
              console.log("ssss-完成");
              this.clickSwitch.complete = false;
            }
            //挂断
            else if(e.eventType=="service_end"){
              console.log("ssss-挂断");
              this.$store.state.callShow = false;
              clearInterval(that.timeInterval);
              this.time = {
                shi:"--",fen:'--',miao:'--'
              }
              if(this.$store.state.agentInfo.phoneType == "pstnPhone"){
                this.$message.info("已在PSTN或SIP电话端挂断。");
                this.clickSwitch = {
                  hangup:false,
                  complete:true,
                  hold:false,
                  zhuan:false,
                  call:true,
                }
                return;
              }
              //来电时挂断
              if(this.$store.state.callOffIf == 1){
                this.$message.info("已拒绝来电");
                return;
              }
              //通话时挂断
              else if(this.$store.state.callOffIf == 2){
                this.clickSwitch = {
                  hangup:false,
                  complete:true,
                  hold:false,
                  zhuan:false,
                  call:true,
                }
                this.$message.info("已挂断");
              }
              //呼叫时挂断
              else if(this.$store.state.callOffIf == 3){
                this.clickSwitch = {
                  hangup:false,
                  complete:true,
                  hold:false,
                  zhuan:false,
                  call:true,
                }
                this.$message.info("已挂断");
              }
            }
          },
          loadQPhoneComponent(){
            try {
              var options = {
                "webrtcFirst": "true",
                "baseUrl": location.origin + "/onesoul/"
              }
              QPhoneTool.init(options);
              /**
               * NOTE:若能 init 完成而没有异常，则QPhone 组件加载成功了。
               */

              QPhoneTool.OnRegisterSuccessful = function() {
                console.log("qphone#######已连接");
              };

              QPhoneTool.OnRegisterFailed = function() {
                //console.log("qphone#######注册失败");
              };
              QPhoneTool.OnUnregistered = function() {
                //console.log("qphone#######已断开");
              };

              // 呼叫事件的接管
              QPhoneTool.OnCallIncoming = function(currentCall) {
                //qphonePickup();
              };

              QPhoneTool.OnCallTerminated = function(callHangUpObject) {
                $("#calltip").hide(500);
                //console.log("qphone#######呼叫已终止");
              };

              QPhoneTool.OnCallConnected = function(callStartedObject) {
                //console.log("qphone#######正在通话");
              };

              QPhoneTool.OnException = function(e) {
                //console.log("qphone#######正在通话" + "QPhone出错:" + e.message);
              };

            }
            catch (e) {
              console.log("qphone exception:" + e.message);
            }
          },
          chatOn(){
            if(this.agent.status == "未登录"){
              layer.msg("尚未登录坐席")
            }else{
              if(this.agent.weChat == "未启用"){
                SIM.start();
                this.agent.weChat = "已开启";
                this.$store.state.weChatOn = true;
                this.imgShow.chat = true;
                var options = {
                  nick: this.accessInfo.nick,  //显示名称，必填
                  ability: 3,    // 通道能力
                  domains: ["webchat", "weixin", "qq", "app" ] // 启用的通道。
                }
                //来自simpleBarUI.js-启用互联网座席
                simpleBar.applyCurrentIMAgentAction({
                  "showTip": "show",
                  "action": simpleBar.currentImAgentAction
                });
                SAM.sendIMReady(options, function() {

                }, function(e) {

                });
              }else{
                SIM.stop();
                this.agent.weChat = "未启用";
                this.$store.state.weChatOn = false;
                this.imgShow.chat = false;
              }
            }
          },
          //坐席登录
          agentLogin(){
            var paramObject = SimpleAgentUIComponent.onConnectParams();
            if(this.agent.status == '未登录'){
              this.loginLoading = true;
              SimpleAgentMgr.connect(paramObject.accessInfo, paramObject.telOption, paramObject.agentStatus);
              SimpleAgentMgr.addEventListener(this.onService, "initService");
              SAM.startCrossBrowserService(window);
              CSAM.start(window);
              CSAM.onSAMEvent = function(event) {
              };
              //已经登录过了-Already logined
              if(SAM.status==SAM.STATUS_LOGINED){
                this.loginAfter();
              }
            }else if(this.agent.status == '就绪'){
              this.loginLoading = true;
              //停止队列监控添加后出现错误，先去掉
              // SAM.stopQueueMonitor();
              SimpleAgentMgr.disconnect();
            }else{
              layer.msg("当前状态不可退出");
            }
          },
          //置忙置闲
          setBusy(){
            if(this.agent.busy == "置忙"){
              SAM.busy();
            }else{
              SAM.ready();
            }
          },
          //完成
          complete(){
            if(!this.clickSwitch.complete){
              // return;
            }
            let curTabs = this.$store.state.tabViews;
            let a = curTabs.findIndex((value) => {
              return value.title =="电话工单";
            })
            if(a == -1){this.$store.state.callOrder = true;}
            if(this.$store.state.callOrder){
              SAM.complete();
              this.clickSwitch.complete = false;
              this.$store.state.closeTab("电话工单","/workOrder1");
            }else{
              this.$alert('尚未保存工单信息', '提示', {
                confirmButtonText: '确定',
                type: 'warning',
                lockScroll:false,
                callback: action => {

                }
              })
            }
          },
          //保持
          holdClick(){
            if(!this.clickSwitch.hold){
              return;
            }
            if(this.agent.hold == "保持"){
              SAM.hold();
              this.agent.hold = "拾回";
            }else{
              SAM.unhold();
              this.agent.hold = "保持";
            }
          },
          //挂断
          hangupClick(){
            if(!this.clickSwitch.hangup){
              return;
            }
            SAM.hangup();
            if (QPhoneTool.qPhone && QPhoneTool.qPhone.currentCall) {
              QPhoneTool.qPhone.currentCall.Hangup();
            }
          },
          //转接坐席
          transferToAgent:function(){
            if(!this.clickSwitch.zhuan){
              return;
            }
            simpleBar.transferAgent();
          },
          //呼叫电话
          outbound(){
            //呼叫时挂断标识
            this.$store.state.callOffIf = 3;
            if(this.clickSwitch.call){
              $("[clickid='imgOutbound']").eq(0).trigger("click");
            }
          },
          //呼叫坐席
          callAgent(){
            if(this.clickSwitch.call){
              $("[clickid='imgCallAgent']").eq(0).trigger("click");
            }
          },
          //邀请坐席
          inviteAgent:function(){
            if(!this.clickSwitch.zhuan){
              return;
            }
            simpleBar.inviteAgent();
          },
          //获取未回复条数
          getWH(){
            this.axios({
              method:"post",
              url:"/dcgd/getUserAppeal",
              params:{
                NUM:1,SIZE:10,
                FL:"", HFBZ:"否",
                QSRQ:window.getNowFormatDate('-',-1),
                ZZRQ:window.getNowFormatDate('-',0),
              }
            }).then(res => {
              if(res.status == 200){
                if(res.data.RECORDS){
                  this.huifuNum = res.data.RECORDS;
                }
              }
            })
          },
          //跳转用户交互页面
          goHuifu(){
            this.$store.state.goRoute("/userInteractive","用户交互");
          },
        },
        mounted(){
          let that = this;
          let agentInfo = {};
          if(window.getSession('agentInfo') && window.isJson(window.getSession('agentInfo'))){
            agentInfo = JSON.parse(window.getSession('agentInfo'));
            this.accessInfo.nick = agentInfo.trueName;
          }
          SimpleAgentUIComponent.onConnectParams = () => {
            return {
              "accessInfo": {
                // "service_base_url": "http://118.31.169.180/", // 服务根地址
                service_base_url:location.origin + "/onesoul/",
                "realm": agentInfo.enterpriseName, // 企业登录名
                "agent_id": agentInfo.enterpriseName+"."+agentInfo.loginName,
                "agent_password": agentInfo.password,
                "acd_node_id": "acd",
                "nick_name": agentInfo.trueName,
                "phone":agentInfo.phoneNum,
                "1":1,
                "phone_type":agentInfo.phoneType,
                "third_validate_url": ""
              },
              "telOption": {
                "type": agentInfo.phoneType, // 此为常量，请勿更改。
                "loginMode": 3, // 1 - 永久在线(虚拟座席), 3 - 与通讯状态绑定，一旦agentbar通讯断开即认为登出
                "transferMode": "one_step", // one_step 一步转接, two_step 二步转接
                "phone": agentInfo.phoneNum, // 座席的电话号码。可使用直线电话号码，或者 sip 话机的地址(如 2323@domain:port )。
                "realPhone": agentInfo.phoneNum
              },
              "imOption": {
                "status": "ready", // IM 初始状态，ready 或 not_ready
                "nick": agentInfo.trueName,  //显示名称，必填
                "ability": 3,  // 通道能力，即同时接待客户数
                "domains": ["webchat", "weixin" ] // 启用的通道。
              },
              "agentStatus": "ready", // 初始状态，可以是 ready 或 not_ready
            };
          }
          SimpleAgentMgr.createAgentBarComponent("newPhoneBar");
          // SimpleAgentMgr.addEventListener(this.onService, "initService");
          var options = {
            "webrtcFirst": true,
            "imUIObject": null, // IM 通道对应的 UI id
            "baseUrl": location.origin + "/onesoul/"
          }
          window.SimpleBarUI.init(options);
          let paramObject = SimpleAgentUIComponent.onConnectParams();
          // SimpleAgentMgr.connect(paramObject.accessInfo, paramObject.telOption,paramObject.agentStatus);
          if(true || paramObject.accessInfo.phone_type == "softPhone"){
            this.loadQPhoneComponent();
          }

          this.getWH();
          //定时获取未回复的条数
          let weiduInter = setInterval(this.getWH,10000);
          this.$once("hook:beforeDestroy", () => {
            clearInterval(weiduInter);
          })
        }
    }
</script>

<style scoped>
  .all{
    width:100%;
    height:10%;
    background: #E4E9F8;
    padding:0 10px;
    box-sizing:border-box;
    position: relative;
    /*overflow: hidden;*/
  }
  .timeBox{
    width:7%;
    height:100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    float: left;
    margin-right:10px;
  }
  .timeBox>div{
    display: flex;
    align-items: center;
    color:#1F233E;
  }
  .timeBox>.title{
    font-size: 12px;
    height:20px;
  }
  .timeBox>.ka{
    height:40%;
    font-size: 14px;
  }
  .timeBox>.ka .i{
    width:25.4%;
    height:80%;
    background: #d9d9d9;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .timeBox>.ka .m{
    background: #E4E9F8;
    display: flex;
    justify-content: center;
    align-items: center;
    width:11.9%;
    height:100%;
  }
  .annius{
    width:60%;
    height:100%;
    float: left;
  }
  .annius>ul{
    width:100%;
    height:100%;
    display: flex;
    align-items: center;
  }
  .annius>ul li{
    width:60px;
    height:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .annius>ul li>img{
    width:33px;
    height:auto;
  }
  .annius>ul>li>.zi{
    color:#1F233E;
    font-size: 12px;
  }
  .mine{
    min-width:120px;
    height: 100%;
    position: absolute;
    right:0;
    display: flex;
    align-items: center;
    justify-content: center;
    color:#1F233E;
  }
  .logout{
    cursor: pointer;
    margin-left:8px;
  }
  .weiHF{
    width:26px;
    height:26px;
    border-radius: 50%;
    background:#e6a23c;
    color:#fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
