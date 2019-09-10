/**
 * <p>Copyright: Copyright (c) 2011</p>
 * <p>Company: 杭州网梭科技有限公司</p>
 * <p>Hangzhou Onesoul Technologies Inc. 
 * 	– Confidential and Proprietary</p>
 * 
 * 功能说明： 对 QPhone 组件的简单封装，自动追加 QPhone 组件到页面上。
 *   同时封装了连接的细节，因为 QPhone 需要xmpp的部分参数以便服务端做处理。
 * 
 **/
 
/**
 QPhone 组件：浏览器要求：IE 8,9,10,11 或者 Chrome 34.0.1847.137 或支持 WebRTC 的浏览器(请确保服务端启用了 WebRTC)

 * 
 */
  
var QPhoneTool = {
	
	_accountInfo: null,
	
	qPhone: null,
	
	_qPhoneAdded: false,
    _qPhoneHtml: '<OBJECT ID="QPhone_1" CLASSID="CLSID:E0CBE934-5B56-49D3-85CD-918668F505DB"></OBJECT>'
		+ '<embed id="QPhone_2" type="application/qphone-plugin" style="position: absolute;top: 0px;left: 0px;width:0px;height:0px;"/>'
		+ '<embed id="QPhone_3" type="application/qingzhi-qphone-plugin" style="position: absolute;top: 0px;left: 0px;width:0px;height:0px;"/> ',
	
	init: function(options) {
		
		this._tryCreateComponent(options);
		
		if (window.SimpleAgentMgr) {
			SimpleAgentMgr.addEventListener(this._dealOnAgentEvent, "qphoneTool._dealOnAgentEvent");
		}
		
		this._bindQPhoneEvents();
		
		if (window.VoiceTool) {
			// 初始化语音工具，也只能做一次
			VoiceTool.createComponent("resource/", QPhoneTool.qPhone);
		}
	},
	
	OnRegisterSuccessful: null,
	OnRegisterFailed: null,
	OnUnregistered: null,
	OnCallIncoming: null,
	OnCallTerminated: null,
	OnCallConnected: null,
	OnException: null,
	
	_bindQPhoneEvents: function() {
	
	   	this.qPhone.OnRegisterSuccessful = function() {
			QPhoneTool.qPhone.isConnected = true;
			QPhoneTool.qPhone.isConnected2 = true;
			QPhoneTool.qPhone.currentCall = null;
			
			if (QPhoneTool.OnRegisterSuccessful) {
				QPhoneTool.OnRegisterSuccessful();	
			}
	   	};
	   	
	   	this.qPhone.OnRegisterFailed = function() {
	   		QPhoneTool.qPhone.isConnected = false;
	   		QPhoneTool.qPhone.isConnected2 = false;
	   		QPhoneTool.qPhone.currentCall = null;
	   		
			if (QPhoneTool.OnRegisterFailed) {
				QPhoneTool.OnRegisterFailed();	
			}
	   		
		};
		this.qPhone.OnUnregistered = function() {
			QPhoneTool.qPhone.isConnected = false;
			QPhoneTool.qPhone.isConnected2 = false;
			QPhoneTool.qPhone.currentCall = null;
			
			if (QPhoneTool.OnUnregistered) {
				QPhoneTool.OnUnregistered();	
			}
			
		};   
		
	   	// 呼叫事件的接管
	   	this.qPhone.OnCallIncoming = function(currentCall) {
	   		QPhoneTool.qPhone.currentCall = currentCall;		
	   		
	   		if (window.VoiceTool) {
	   			VoiceTool.OnCallIncoming();
	   		}
	   		
	   		if (QPhoneTool.OnCallIncoming) {
				QPhoneTool.OnCallIncoming(currentCall);	
			}
	   		
	   	};
	   
	   	this.qPhone.OnCallTerminated = function(callHangUpObject) {
	   		QPhoneTool.qPhone.currentCall = null;
	   		
	   		if (window.VoiceTool) {
	   			VoiceTool.OnCallTerminated();
	   		}
	   		
	   		if (QPhoneTool.OnCallTerminated) {
				QPhoneTool.OnCallTerminated(callHangUpObject);	
			}
	   		
	   	}; 
	   	
	   	this.qPhone.OnCallConnected = function(callStartedObject) {  
	   		
	   		if (window.VoiceTool) {		
	   			VoiceTool.OnCallConnected();
	   		}
	   		
	   		QPhoneTool.qPhone.currentCall = callStartedObject;	
	   		
	   		if (QPhoneTool.OnCallConnected) {
				QPhoneTool.OnCallConnected(callStartedObject);	
			}
	   		
	   	};	
		
	},
	
	sendDTMF: function(dtmf) {
		if (QPhoneTool.qPhone && QPhoneTool.qPhone.currentCall) {
			QPhoneTool.qPhone.currentCall.SendDTMF(dtmf);
			return true;	
		}
		else {
			return false;
		}
	},
	
	_dealOnAgentEvent: function(eventObject) {
		
		/**
		 * 身份校验成功事件。
		 */
		if (eventObject.eventType == "onVerifySuccess") {
			
			/**
			 * NOTE: 身份校验成功后才能获取到 相关服务端的配置，这对于
			 *  启用 QPhone 进行软电话接听来说非常重要。 
			 */
			 
			var accountInfo = eventObject.data;
			accountInfo.cm_url = accountInfo.service.cm_host + ":" + accountInfo.service.cm_sip_port;
			
			QPhoneTool.accountInfo = accountInfo;
			QPhoneTool._tryToConnectToServer(accountInfo);
					
		}
		else if (eventObject.eventType == "onLoginSuccess") {
		    
		    if (QPhoneTool.accountInfo) {
			   QPhoneTool._tryToConnectToServer(QPhoneTool.accountInfo);
		    }
		    
		}
		else if (eventObject.eventType == "onDisconnect"
		  || eventObject.eventType == "onLoginFailed" 
		  || eventObject.eventType == "onLogout" ) {
		 
          QPhoneTool.disconnect();
		    
		}
		
	},
	
	_tryCreateComponent: function(options) {
		
		if (this._qPhoneAdded) {
			return;
		}

		$("body").append(this._qPhoneHtml);
		this._qPhoneAdded = true;
		
		// 尝试初始化
		var qPhone1 = document.getElementById("QPhone_1");
		var qPhone2 = document.getElementById("QPhone_2");
		var qPhone3 = document.getElementById("QPhone_3");
		
		this.qPhone = null;
		this.versionDetail = "(ActiveX/NPAPI)";
		
		if (qPhone1 && qPhone1.PhoneVersion) {
			this.qPhone = qPhone1;
			this.ie = true;
		}
		else if (qPhone2 && qPhone2.PhoneVersion) {
			this.qPhone = qPhone2;
			this.chrome = true;
		}
		else if (qPhone3 && qPhone3.PhoneVersion) {
			this.qPhone = qPhone3;
			this.chrome = true;
		}
		else if (window.extensionQPhone) {
			this.qPhone = window.extensionQPhone;
			this.versionDetail = "(网梭UCC扩展插件)";
		}
		
		var priorWebRTC = options && options.webrtcFirst && window.QPhoneH5;
		
		if (priorWebRTC || !this.qPhone && window.QPhoneH5) {
			this.qPhone = QPhoneH5;
			this.webrtc = true;
			
			if (options.baseUrl 
			    && options.baseUrl.toLowerCase().indexOf("http") == 0 ) {
				
				/**
				 * https://xxxx/ccc
				 */
				var items = options.baseUrl.split("//");
				if (items.length >= 2) {
					var host = items[1].split("/")[0];
					this.qPhone.WebsocketServer = "wss://" + host + "/webphone";
				}
				
			}
			
			this.versionDetail = "(WebRTC)";
		}
		
		if (this.qPhone == null) {
			throw new Error("QPhone 未能成功加载。语音视频功能无法使用。请下载安装QPhone组件后再试。");
		}
		
		/**
		 * 确保组件能适应 udp 端口合并的场景，不需要开放一大堆ucp端口了。
		 */
		this.qPhone.MultiplexingChannel  = true; 
		
		this.qPhone.isConnected = false;
		
	},
	
	connect: function(cmHost, cmPort, user, pass) {
		
		var accountInfo = {
			cm_url: cmHost + ":" + cmPort,
			ln: user,
			lp: pass
		}
		
		this._tryToConnectToServer(accountInfo);
		
	},
	
	disconnect: function() {
		
		if (!this.qPhone) {
		    return;
		}
		
		try {
		  this.qPhone.Deinitialize();
		}
		catch (e) {
		    this.qPhone = null;
		}
		
	},
	

	isCanMakeNewCall: function() {
		
		// NOTE: 若当前是不注册的方式，则只需要查看当前的 currentCall 即可。
		return (QPhoneTool.qPhone.currentCall == null);
	},
	
	acceptCall: function(options) {
	
    	if (options && options.LocalIsVideo) {
    		QPhoneTool.qPhone.currentCall.LocalIsVideo = options.LocalIsVideo;
    		QPhoneTool.qPhone.currentCall.VideoCapture = options.VideoCapture;
    		QPhoneTool.qPhone.currentCall.SetVideoWindow(options.localWindow, options.remoteWindow); 
    	}
    	
    	try {
    		QPhoneTool.qPhone.currentCall.Accept();
    	}
    	catch (ex)
    	{
    		throw new Error("accpet call error:" + ex);
    	}
    },
    
    hangup: function() {
        
        if (this.qPhone && QPhoneTool.qPhone.currentCall) {
    		QPhoneTool.qPhone.currentCall.Hangup();
    	}
        else {
            throw new Error("there is no call yet.");
            
        }
    },
    
      /** 
     * 发送DTMF给当前通话的对方
     * NOTE: 必须在当前仍在通话下才行。
     */
     sendDTMF: function(dtmf) {
	
    	if (!QPhoneTool.qPhone.currentCall) {
    		throw new Error("No call to send DTMF");
    	}
    	
    	if (dtmf == null || dtmf == '') {
    		return;
    	}
    	
    	try
    	{
    		QPhoneTool.qPhone.currentCall.SendDTMF(dtmf + "");		
    	}
    	catch(ex)
    	{
    		setTimeout(function() {
    		    throw ex;
    		}, 0);
    	}
    },
	
	makeCall: function(calledNumber) {
		
		if (!this.isCanMakeNewCall()) {
			throw new Error("cannot make new call for current call is not null.");
		}
		
		QPhoneTool.qPhone.currentCall = this.qPhone.MakeCall(calledNumber);	
		
	},

	makeVideoCall: function(calledNumber, tag, localWindow, remoteWindow) {
		
		if (!this.isCanMakeNewCall()) {
			throw new Error("cannot make new video call for current call is not null.");
		}		
		
		QPhoneTool.qPhone.currentCall = this.qPhone.MakeVideoCall(calledNumber, tag, localWindow, remoteWindow);
		
	},

	
	_tryToConnectToServer: function(accountInfo) {
		
		if (this.qPhone 
		    && this.qPhone.isConnected2
		    && this.qPhone.AuthName == accountInfo.ln
		    ) {
			return;
		}
		
		try {
			this.qPhone.Deinitialize();
		}
		catch (e) {
			// ignore this error.
		}
		
		try {
					
			// 为了让断线/重新上线的时候更快地感知，因此设定为 短一些。不设的话内部默认为300 秒。	
			this.qPhone.RegistrationTimeout = 300; 
			
		   	// NOTE: CallProceeding 事件暂时无需处理。 
		   	this.qPhone.RegistrarServer = accountInfo.cm_url;
		   	
		   	/**
		   	 * 
			判断当前是 webrtc，则获取 配置里的 webrtc的设置，并进行相应的处理。
			主要就是 qPhone.RegistrarServer 以及 qPhone.StunServer 的设置
			StunServer
		   	 */
		    if (this.accountInfo 
		      && this.accountInfo.service 
		      && this.webrtc ) {
		        
		       if (this.accountInfo.service.webrtc_register_server) {
		           this.qPhone.RegistrarServer = this.accountInfo.service.webrtc_register_server;
		       } 
		       
		       if (this.accountInfo.service.webrtc_stun_server) {
		           this.qPhone.StunServer = this.accountInfo.service.webrtc_stun_server;
		       } 
		        
		    }
		   	
		   	this.qPhone.AuthName = accountInfo.ln;
		   	this.qPhone.AuthPassword = accountInfo.lp;
		   	this.qPhone.PhoneNumber = accountInfo.ln;
		   	
		  	// NOTE: 客户端在10000至 10100间随机选择一个端口进行连接	   	   		  
		   	this.qPhone.BasePort = 10000 + parseInt(Math.random()*100);
		   	
		   	if (accountInfo.q) {
		   		this.qPhone.UserAgentSuffix = 'I1 NID:' + accountInfo.q 
					+ " RID:" + (window.SXC ? SXC._buildResource() : "default_rid");
		   	}

			this.qPhone.Initialize();
			
		}
		catch (e) {
			if (QPhoneTool.OnException) {
				QPhoneTool.OnException(e);
			}
		}
		
	}
	
	
}  