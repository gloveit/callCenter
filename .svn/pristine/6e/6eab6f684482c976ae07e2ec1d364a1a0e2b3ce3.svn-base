/**
 * <p>Copyright: Copyright (c) 2015</p>
 * <p>Company: 杭州网梭科技有限公司</p>
 * <p>Hangzhou Onesoul Technologies Inc. 
 * 	– Confidential and Proprietary</p>
 * 
 * 功能说明： 对 对讲相关展现组件的简单封装。
 * 
 * 配套代码: talkieTool.css  
 * 依赖于：  
 *      1. jquery
 *      2. jquery.jplayer.min.js
 * 
 * 使用方法：
 *     1. 源码中引入 talkie 目录，并引入 .js 以及 css;
 *     2. TalkieTool.init 进行初始化；
 *     3. 每次渲染完成消息内容时，调用 TalkieTool.registerEvents 绑定事件; 
 *     4. 默认显示文本转语音内容，若不需要显示，请设置 TalkieTool.options.asr = false;
 * 
  * TalkieTool 语音对讲类负责 语音对讲的播放的工作。
  * 对于 UI 展现有约定，参见以下模版：
  * 
  * 	<div title="点击播放" name="talkie_div" status="stop" sound="{{fileInfo.url_mp3}}" style="height:21px;margin-top:1px;cursor:pointer;">
		    <div class="talkie sound_stop" direction="received" style="width: 27px; height: 21px; float: left; " ></div>
		    <div name="sound_len" style="float:left;color:gray;">{{TalkieTool.caculateSoundLength(fileInfo.length}}</div>
		</div>
 * 
 **/
 
 /**
  */
 
 ( function() { 
     
    
    var h5PlayerId = "talkie_jquery_jplayer";
    var notH5PlayerId = "talkie_not_h5_player";
     
    function getBrowserType() {
        
        if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
            return "ie";
        } else if (navigator.userAgent.indexOf('Firefox') >= 0){
            return "ff";
        } else if (navigator.userAgent.indexOf('Opera') >= 0){
            return "opera";
        } else if (navigator.userAgent.indexOf('Chrome') >= 0){
            return "chrome";
        }
        
        return "other";
        
    }     
    
    function isIE() {
        return getBrowserType() == "ie";
    }
     
    function soundPlay(player, soundUrl){
    	if (isIE()){
    		player.URL = soundUrl;
            player.controls.play();
    	}else{
    	 player.jPlayer("setMedia", {
    				mp3 : soundUrl
    			}).jPlayer("play");
    	}		
    }
    
    function soundStop(player, node){
        
    	if(isIE()){
    		player.controls.stop();
    	}else{
    		player.jPlayer("stop");
    	}
    	
    	node.find(".talkie").removeClass("sound_playing_left");
    	node.find(".talkie").removeClass("sound_playing_right");
    	node.find(".talkie").removeClass("sound_playing_history");
    	node.find(".talkie").addClass("sound_stop");
    	
    	node.attr("status", "stop");
    	node.attr("title", "点击播放");
    }
    
    function stop(player, nodes){
    	for(var i = 0; i < nodes.length; i++){
    		soundStop(player, $(nodes[i]));
    	}
    }
    
    function bindSoundEvent(player){
    	
    	$("div[name='talkie_div']").unbind("click").bind("click", function(event){
    		
    		var $talkie = $(this).find(".talkie");
    		
    		var status = $(this).attr("status");
    		if(status == "play"){
    			
    			soundStop(player, $(this));
    			
    		}else{
    			var playNodes = $("div[name='talkie_div'][status='play']");
    			stop(player, playNodes);
    			
    			var direction = $talkie.attr("direction");
    			var sound = $(this).attr("sound");
    			
    			if(!!sound && "null" !== sound) {
    				
    				$(this).attr("status", "play");
    				$(this).attr("title", "点击结束");
    				
    				$talkie.removeClass("sound_stop");
    				
    				if (direction == "received"){
    				    $talkie.addClass("sound_playing_left");
    				}else if(direction == "send"){
    				    $talkie.addClass("sound_playing_right");
    				}else{
    				    $talkie.addClass("sound_playing_history");
    				}
    				soundPlay(player ,sound);	
    				
    				if (_tool.options && _tool.options.asr) {
    				    $talkie.next().next().show();
    				}
    				
    			} else {
    			    alert("对不起，该语音来自低版本的客户端，无法播放该语音。");
    			}
    		}
    		if(event){
                if (event && event.stopPropagation) {
            		event.stopPropagation();
            	} else {
            		window.event.cancelBubble = true;
            	}
    		}
    		
    	});
    	
    	if(isIE()){
    		$("div[name='talkie_div']").each(function (){ 
    			$(this).width($(this).find("div[name='sound_len']").width() + $(this).find("div[class='talkie']").width() + 15 + "px");
    		});
    	}
    }
    
    function playerInit(player){
    	 player.jPlayer({
    		ready: function () {
    			$(this).jPlayer("setMedia", {
    			});
    		},
    		supplied: "mp3",
    		ended: function(){
    			var playNodes = $("div[name='talkie_div'][status='play']");			
    			stop(player, playNodes);
    		}
    	});
    
    } 	

	function getComponentHtml() {
	   
	   return "<div id='" + h5PlayerId + "' style='display:none;'></div>"
	     + "<object id='" + notH5PlayerId + "' width='0' style='display:none;' height='0' classid='CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6'></object>"; 
	     
	}
 	
 	var _tool = {
 		
 		/**
 		 * 设置服务地址，这个会导致实际连接的地址由 这个来决定了。
 		 */
 		"caculateSoundLength": function(length) {
        	
        	if (!length) {
        	   return "0 秒";
        	}
        	
        	if (length > 60) {
        		return parseInt(length / 60) + "分" + length % 60 + "秒";
        	}
        	
        	return length + " 秒";
        },
 		
 		"options": {
 		   "asr": true  
 		},
 		
 		"init": function() {
 		    $("body").append(getComponentHtml()); 
 		     
 		    playerInit($("#" + h5PlayerId));	
 		},
 		
 		"registerEvents": function() {
 		    
 		    if (isIE()) {
        		bindSoundEvent(document.getElementById(notH5PlayerId));
        	}else{
        		bindSoundEvent($("#" + h5PlayerId));
        	}   
 		    
 		}
 		
 	};
 	
 	window.TalkieTool = _tool;
 	  
 })(); 
 
		