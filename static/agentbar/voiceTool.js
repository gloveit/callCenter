/**
 * <p>Copyright: Copyright (c) 2011</p>
 * <p>Company: 杭州网梭科技有限公司</p>
 * <p>Hangzhou Onesoul Technologies Inc. 
 * 	– Confidential and Proprietary</p>
 * 
 * 功能说明： 声音工具(提供等待音的循环播放，给QPhone配套的)。
 * 
 * 1. 此模块与 qphoneTool.js 配套使用；
 * 2. 引入本 js 文件，还需引入 resource 下面的三个文件:
 *   1). playWaitForIE.html
 *   2). talking_stop.wav;
 *   3). wait.wav
 * 3. 主要功能：
 *    - 使用 createComponent 方法构建组件;
 *    - 提供用于电话呼入，呼出，摘机时的 声音播放方法；
 * 4. 主要思路：
 * 	  - 当电话来电或呼出时，播放等待音乐或回铃音，然后当呼叫终止或通话开始时，停止放音。这里涉及到几个 wav文件也要引入。 
 *    - 具体做法：由 qphoneTool 负责构建 qphone 组件，然后接管qphone的电话事件，并在呼叫事件里 调用 VoiceTool 里相关音乐播放和停止播放的方法。
 * 
 **/
 
 var VoiceTool = {
 	
 	dealTalkingAmount: 0,
	timerVoiceCheck: null,
	timerDealTalkingCheck: null,
	
	qPhone: null, // 指向 QPhone 组件对象。
	
    voiceHtml: ' <div class="_voice_tool_" style="height:0px;"> '
		+ '<OBJECT style="height:0px;" ID="qzPhone_WaitAudioObject" CLASSID="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6"> '
		+ '	<PARAM NAME="AutoStart" VALUE="False"/> '
		+ ' </OBJECT> '
		+ ' <OBJECT style="height:0px;" ID="qzPhone_StopAudioObject" CLASSID="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6"> '
		+ '	<PARAM NAME="AutoStart" VALUE="False"/>'
		+ '</OBJECT>'
    	+ '</div> ',
    
    // 这是用来在 IE 下循环播放 等待音的 IFrame。	
    autoReplayForIEHtml: '<iframe class="_voice_tool_" id="playWaitForIE" width="0px" height="0px" name="playWaitForIE" src="about:blank">', 	
    
    errorInfo: null,
    
    resourcePath: null,
    
    componentCreated: false,
    
    /**
     * 创建组件。一次生命周期只要创建一次就够。
     * 
     */ 
	createComponent: function(resourcePath, qPhone) {	
		
		if (!qPhone) {
			return;
		}
		
		if (this.componentCreated && window.$) {
		    $("._voice_tool_").remove();
		}
		
		var html;
		
		if (SimpleXCrossBrowser.getBroswerType() == SimpleXCrossBrowser.MSIE) {
			html = VoiceTool.qPhoneHtmlForIe;
		}
		else {
			html = VoiceTool.qPhoneHtmlForOther;
		}
		
		$("body").append(html);
		
		VoiceTool.qPhone = qPhone;
		VoiceTool.resourcePath = resourcePath;
		
		// 添加两个语音的voice节
		if (!SimpleXCrossBrowser.isMSIE) {
			VoiceTool.autoReplayForIEHtml = "";
		}
		
		// 若为 IE，则需要添加 专门的重复播放的脚本
		$("body").append(VoiceTool.voiceHtml + VoiceTool.autoReplayForIEHtml);
		
		this.componentCreated = true;
	},
	
	/** 
	 * 播放等待音乐
	 * NOTE: 循环播放
	 */
	playWaitMusic : function() {

    // var waitSrc = VoiceTool.resourcePath + "/wait.wav";
    var waitSrc = "static/resource" + "/wait.wav";

		if (SimpleXCrossBrowser.isMSIE) {
			/**
			 * NOTE by James: 由于IE 11下无法直接实现循环播放，因此这里使用 IFrame 来曲线救国。 
			 */
			$("#playWaitForIE").attr("src", "static/resource" + "/playWaitForIE.html");
		} else {
			
			if (!VoiceTool.waitAudio) {
				VoiceTool.waitAudio = new Audio(waitSrc);
			}else{
				if (VoiceTool.waitAudio.readyState == 4) {
					VoiceTool.waitAudio.currentTime = 0;
				}
			}
			
			VoiceTool.waitAudio.loop = true;
			
			VoiceTool.waitAudio.play();
		}
		
		// NOTE: 
		// 由于通话开始的声音可能比信令提早到达，因此这里的 waitMusic 需要专门利用定时器检测
		// 以确保当通话真正开始时，尽快将等待音停止。
		if (VoiceTool.timerVoiceCheck) {
			QzTimerMgr.clearInterval(VoiceTool.timerVoiceCheck);
			VoiceTool.timerVoiceCheck = null;
		}
		
		/* 
		 * 音量检测处理
		 */
		VoiceTool.timerVoiceCheck = QzTimerMgr.setInterval(function() {	
				if (!VoiceTool.qPhone.currentCall) {
					return;
				}
				if(VoiceTool.qPhone.currentCall.RemoteVoiceEnergy > 0){
					// 里面会一并将定时器对象清除的
					VoiceTool.stopWaitMusic();
				}		
			}, 100, "VoiceTool.prototype.playWaitMusic-timerVoiceCheck");	
				
	

	},

	/** 
	 * 停止等待音乐
	 */
	stopWaitMusic: function() {

		try {
			if(SimpleXCrossBrowser.isMSIE){
				
				$("#playWaitForIE").attr("src", "about:blank");
				
			} else {
				if(VoiceTool.waitAudio != null){
					VoiceTool.waitAudio.pause();
				}
			}
		}catch (ex) {
			//
		}
		
		// 尝试将音量检测器关闭	
		if (VoiceTool.timerVoiceCheck) {
			QzTimerMgr.clearInterval(VoiceTool.timerVoiceCheck);
			VoiceTool.timerVoiceCheck = null;
		}
	 			
	},  
	
	/** 
 * 播放结束通话的音乐(单次播放)
 */
	playTalkingStopMusic : function() {
		
		try {
      // var hangupSrc = VoiceTool.resourcePath + "/talking_stop.wav";
      var hangupSrc = "static/resource" + "/talking_stop.wav";

			if(SimpleXCrossBrowser.isMSIE) {
				var mpl=new MediaPlayer();  //创建一个MediaPlayer
		        mpl.BindID("qzPhone_StopAudioObject");
		        mpl.setVolume(100);  //设置音量
		        mpl.setMode(MediaPlayer.uiMode.Invisible); //设置显示模式
		        
		        mpl.OpenUrl(hangupSrc);
		        
		        mpl.Play();
		        VoiceTool.hangupAudio = mpl;
			} else {
				
				if (!VoiceTool.hangupAudio) {
					VoiceTool.hangupAudio = new Audio(hangupSrc);
				}
				
				VoiceTool.hangupAudio.addEventListener("canplay", function() { 
					if (VoiceTool.waitAudio.readyState == 4) {
						VoiceTool.hangupAudio.currentTime = 0;
					}
				});
				VoiceTool.hangupAudio.play();
			}
		} catch (ex) {
			//
		}
		
	},
	
	OnCallIncoming: function() {
   		// 进行呼入音的播放
		VoiceTool.playWaitMusic();
		
	},
	
	OnCallTerminated: function() {
	    try {
	    
    		// 因为是挂机，所以要停止等待音乐
    		VoiceTool.stopWaitMusic();
    		
    		// 另外，也要播放一个挂机的提示音
    		VoiceTool.playTalkingStopMusic();	   		
	    }
	    finally {
	         // NOTE: 及时释放资源
			if (VoiceTool.timerDealTalkingCheck) {
				QzTimerMgr.clearInterval(VoiceTool.timerDealTalkingCheck);
				VoiceTool.timerDealTalkingCheck = null;
			}
	    }
	},
	
	OnCallConnected: function() {
	   		// NOTE: 对僵死通话进行检测
			if (VoiceTool.timerDealTalkingCheck) {
				QzTimerMgr.clearInterval(VoiceTool.timerDealTalkingCheck);
				VoiceTool.timerDealTalkingCheck = null;
			}
			
			// 确保计数器得到初始化
			VoiceTool.dealTalkingAmount = 0;
			
			/* 
			 * 僵死通话的检测
			 * NOTE: 若通话过程中，因对方网络的原因，导致对方不送语音报文过来，而通话未挂断的情况，称为僵死的通话。
			 * 这里的过程就是检测到这类情况，并自动将其挂断的处理
			 */
			VoiceTool.timerDealTalkingCheck = QzTimerMgr.setInterval(function() 
				{
					if(!VoiceTool.qPhone.currentCall){
						VoiceTool.dealTalkingAmount = 0;
						return;
					}
					
					if (VoiceTool.qPhone.currentCall && VoiceTool.qPhone.currentCall.NetworkStatus == 0) {
						VoiceTool.dealTalkingAmount += VoiceTool.DEAD_CHECK_INTERVAL_MILI_SECOND;
						// NOTE: 超过20秒
						if (VoiceTool.dealTalkingAmount >= (20*1000)) {
							
							// 超过20秒，仍没有声音，则挂机
							VoiceTool.qPhone.currentCall.Hangup();
							
							// 清除检测器
							QzTimerMgr.clearInterval(VoiceTool.timerDealTalkingCheck);
							VoiceTool.timerDealTalkingCheck = null;
						}
						
					}
					else {
						VoiceTool.dealTalkingAmount = 0;
					}
				}, VoiceTool.DEAD_CHECK_INTERVAL_MILI_SECOND, "VoiceTool.timerDealTalkingCheck");
			
			
			// 通话开始，或挂机，都要停止对等待音乐的相关处理
			VoiceTool.stopWaitMusic();
		
	}
 	
 };  
