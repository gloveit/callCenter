/**
 * <p>Copyright: Copyright (c) 2015</p>
 * <p>Company: 杭州网梭科技有限公司</p>
 * 
 * SimpleBarUI。
 * 
 * 主要是对于 SimpleAgentUIComponent 的功能继续进行增强。为兼容起见，未直接在 SimpleAgentUIComponent 的基础上进行更改。
 * 
 * 本组件的主要功能包括：
 * 1. 自动在 body 下构建 座席列表的 div；
 * 2. 自动加载 QPhoneTool 的相关组件，并接管 QPhone 事件;
 * 3. 根据来去电事件进行界面弹屏，并允许进行接听、拒绝、拒绝并置忙等操作;
 * 4. 实现各类高级话务操作，比如呼叫，转接，邀请等座席协作的功能；
 * 5. 实现座席监控列表的功能；
 * 
 * 此脚本依赖于以下组件：
 * 1. 依赖于 jquery.js ;
 * 2. agentbar.min.js ;
 * 3. qphoneTool.js;
 * 4. jssip-3.0.0.js 以及 QPhoneH5-1.0.1.41.js
 * 5. voiceTool.js
 * 6. layer.js
 * 
 *  
 */
 
var js = document.scripts;
let supera = null;

var _SimpleBarBaseJsPath = js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/")+1); 
 
 ( function() {  
     
     function filterAgentRow($row) {
         
         var filterText = $("#agentFilter").val();
         
         var agentName = $row.find(".for_agent_name").text();
         var agentLoginName = $row.find(".for_agent_login_name").text();
         var agentContact = $row.find(".for_agent_contact").text();
         var agentStatus = $row.find(".for_agent_status").text();
         
         if (agentName.indexOf(filterText) >= 0
           || agentLoginName.indexOf(filterText) >= 0
           || agentStatus.indexOf(filterText) >= 0
           || agentContact.indexOf(filterText) >= 0 ) {
             $row.show();    
         }
         else {
             $row.hide();
         }         
         
     }
     
     function filterAgentList() {
             
         var filterText = $("#agentFilter").val();
         
         if (filterText == "") {
            $(".agent_row").show();
         }
         else {
         
             $(".agent_row").each(function(index) {
                 filterAgentRow($(this));
             });
         
         }
         
     }
     
     function createAgentListUI() {
    
        var html = '' 
    	   + '<div class="agentMonitorDiv" style="display:none;width: 750px; height: 400px; max-height: 500px;background: rgb(255, 255, 255);" align="center">'
    	   + ' <div style="padding:0px 20px;" class="page" align="left">'
           + ' <div style="margin-top:5px;margin-bottom:5px;float:left;margin-left:0px;">'
    	   + ' 		<label style="font-size:13px;margin-right:5px;">关键字: </button>'
    	   + '		<input id="agentFilter" type="text" style="width:100px;margin-left:5px;text-indent:3px;"  >'
    	   + '	</div>'
           + ' <div id="agentExtendBtnDiv" style="margin-top:5px;margin-bottom:5px;float:right;margin-right:40px;">'
    	   + ' 		<button style="width:60px;" id="answerForBtn" action="answerFor" title="接听对方正在振铃的电话">代答</button>'
    	   + '		<button style="width:60px;" id="monitorBtn" action="monitor" title="监听对方当前的通话" >监听</button>'
    	   + '		<button style="width:60px;" id="chimeInBtn" action="chimeIn" title="进入对方当前的通话，形成会议" >插话</button>'
    	   + '		<button style="width:60px;" id="kickOutBtn" action="kickOut" title="打断对方当前的通话" >打断</button>'
    	   + '		<button style="width:60px;" id="takeOverBtn" action="takeOver" title="接管对方当前的通话，取而代之">接管</button>'
    	   + '		<button style="width:60px;" id="lockBtn" action="lock" title="锁定对方使之无法操作座席工具条" >锁定</button>'
    	   + '	    <button style="width:60px;" id="unlockBtn" action="unlock" >解锁</button>'
    	   + '		<button style="width:60px;" id="forceIdleBtn" action="forceIdle" title="强制就绪，以便对方接听系统分配的电话" >强闲</button>'
    	   + '		<button style="width:60px;" id="forceBusyBtn" action="forceBusy" title="强制置忙，以便对方不再接听系统分配的电话" >强忙</button>'
    	   + '		<button style="width:60px;" id="forceLogoutBtn" action="forceLogout" title="强制签退对方" >强退</button>'
    	   + '	</div>'
    	   + '</div>'
    	   + '<div style=";padding:15px 10px 10px 10px;min-height:339px;" align="center">'
    	   + '	<table id="agentList" border="0" cellpadding="0" cellspacing="2" width="100%" rules="rows">'
    	   + '		<tbody>'
    	   + '			<tr id="agentMonitorRowHeader" style="font-weight:bold;background: url(images/gray-bg.gif) repeat-x scroll;">'
    	   + '				<td name="agentName" width="40px;" height="30" style="text-align: center; word-break: break-all; font-size: 12px;">姓名</td>'
    	   + '				<td name="agentLoginName" width="40px;" height="30" style="text-align: center; word-break: break-all; font-size: 12px;">工号</td>'
    	   + '				<td name="agentStatus" width="40px;" height="30" style="text-align: center; word-break: break-all; font-size: 12px;">状态</td>'
    	   + '				<td name="agentDuration" width="80px;" height="30" style="text-align: center; word-break: break-all; font-size: 12px;">持续时间</td>'
    	   + '				<td name="agentContact" width="80px;" height="30" style="text-align: center; word-break: break-all; font-size: 12px;">联系方式</td>'
    	   + '				<td name="agentSelection" width="40px;" height="30" style="text-align: center; word-break: break-all; font-size: 12px;">选择</td>'
    	   + '			</tr>'
    	   + '		</tbody>'
    	   + '	</table>'
    	   + '	<table class="agentUITemplate" style="display:none;">'
    	   + '		<tr agent_id="#agentId#" qz_id="#qz_id#" row_type="data" class="agent_row" style="border-bottom: 1px dashed #8288A2;height:30px;">'
    	   + '			<td name="agentName" class="for_agent_name" align="center" style="word-break: break-all; font-size: 12px;"></td>'
    	   + '			<td name="agentLoginName" class="for_agent_login_name" align="center" style="word-break: break-all; font-size: 12px;"></td>'
    	   + '			<td name="agentStatus" class="for_agent_status" align="center" style="word-break: break-all; font-size: 12px;"></td>'
    	   + '			<td name="agentDuration" align="center" style="word-break: break-all; font-size: 12px;"></td>'
    	   + '			<td name="agentContact" class="for_agent_contact" align="center" style="word-break: break-all; font-size: 12px;"></td>'
    	   + '			<td name="agentSelection" align="center" style="word-break: break-all; font-size: 12px;">'
    	   + '				<input name="agentSelected" style="cursor:pointer;" type="radio" >'
    	   + '			</td>'
    	   + '		</tr>'
    	   + '	</table>'
    	   + '  </div>'
    	   + ' <div style="margin-top:-10px;" align="center">'
    	   + '   <button id="agentMonitorActionBtn" style="display:none;width:70px;margin-right:10px;" class="el-button el-button--primary el-button--small">操作名称/button>'
    	   + '   <button id="agentMonitorCancelBtn" style="width:70px;" class="el-button el-button--default el-button--small">关闭</button>'
    	   + ' </div>'
    	   + '</div>'		    
         
         $("body").append(html);
         
         if ($("#agentFilter").live) {
          
             $("#agentFilter").live('input on', function() {
                
                /**
                 * 根据当前的取值，过滤当前的座席数据。
                 */ 
                 filterAgentList();
                 
             });
         }
         else if ($(document).on) {
             
             $(document).on("input on", "#agentFilter", function() {
                 
                 filterAgentList();
                 
             }); 
             
         }
         
     }
     
     /**
     * 打开座席列表
     * @mode : {
     * 		title: 标题
     *      action: 操作按钮的名称
     *      callback: function(agentMonitor) {
     *          agentMonitor 的属性包括：agent.id, agent.loginName, 等等。
     * 
     * 			选中的那个座席。
     *      }
     * }
     */
    function showAgentMonitorDiv(mode) {
    
    	$(".agentMonitorDiv").show();
    	
        layer.open({
          type: 1,
          shade: 0.5,
          title: mode && mode.title ? mode.title : "座席列表",
          area: 'auto;',
          content: $('.agentMonitorDiv'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
          cancel: function(){
              layer.closeAll();
          },
          end: function() {
              $(".agentMonitorDiv").hide();
          }
        });	
    	
    	$(".agentMonitorDiv").find("#agentMonitorCloseButton").unbind("click").bind("click", function() {
    		closeAgentMonitorDiv();
    	});
    	
    	$(".agentMonitorDiv").find("#agentMonitorCancelBtn").unbind("click").bind("click", function() {
    		closeAgentMonitorDiv();
    	});	
    	
    	if (mode) {
    		// 隐藏上面的一排按钮
    		$(".agentMonitorDiv").find("#agentMonitorActionBtn").text(mode.action);
    		$(".agentMonitorDiv").find("#agentMonitorTitle").text(mode.title);
    
    		$(".agentMonitorDiv").find("#agentExtendBtnDiv").hide();
    		$(".agentMonitorDiv").find("#agentMonitorActionBtn").show();
    		
    		$(".agentMonitorDiv").find("#agentMonitorCancelBtn").find("span").text("取消");
    		
    		$(".agentMonitorDiv").find("#agentMonitorActionBtn").unbind("click").bind("click", function() {
    			
    			// 若选中了，则 关闭界面，并触发回调。
    			// 否则 提示要进行选择。
    			
    			var $selected = $(".agentMonitorDiv").find('input[name="agentSelected"]:checked');
    			if ($selected.length <= 0) {
    				layer.msg("没有可操作的座席");
    			}
    			else {
    				closeAgentMonitorDiv();
    				var agentId = $selected.attr("agent_id");
    				
    				var agentItem = SimpleAgentMgr.getMonitorAgentById(agentId);
    				if (agentItem) {
    					mode.callback(agentItem);
    				}
    				else {
    					layer.msg("座席已经离线，无法操作。");
    				}
    			}
    			
    		});
    		
    	}
    	else {
    		
    		/**
    		 * 座席的相关按钮。
    		 * 
    		 * NOTE: 以下这些按钮是 普通座席能用的：answerForBtn, monitorBtn, chimeInBtn
    		 *  其余是只有 班长座席 才能用的按钮。
    		 * 
    		 * <button id="answerForBtn" style=";" title="接听对方正在振铃的电话">代答</button>
    	        			<button id="monitorBtn" style=";" title="监听对方当前的通话" >监听</button>
    	        			<button id="chimeInBtn" style=";" title="进入对方当前的通话，形成会议" >插话</button>
    	        			<button id="kickOutBtn" style=";" title="打断对方当前的通话" >打断</button>
    	        			<button id="takeOverBtn" style=";" title="接管对方当前的通话，取而代之">接管</button>
    	        			<button id="lockBtn" style=";" title="锁定对方使之无法进行各项话务操作" >锁定</button>
    	        			<button id="unlockBtn" style=";" >解锁</button>
    	        			<button id="forceIdleBtn" style=";" title="强制就绪，以便系统向其分配电话" >强闲</button>
    	        			<button id="forceBusyBtn" style=";" title="强制置忙，以便系统不再向其分配电话" >强忙</button>
    	        			<button id="forceLogoutBtn" style=";" title="强制签退对方" >强退</button>
    		 * 
    		 */		
    		
    			
    		/**
    		 * 根据座席的角色，对相应按钮进行点亮。
    		 */	
    
    		var agentPower = SimpleAgentMgr.getAgentPower(); 
    		if (agentPower.leader || agentPower.manager) {
    			 $(".agentMonitorDiv").find("#agentExtendBtnDiv>button").show();
    		}
    		else {
    			$(".agentMonitorDiv").find("#agentExtendBtnDiv>button").hide();
    			$(".agentMonitorDiv").find("#answerForBtn").show();
    			$(".agentMonitorDiv").find("#monitorBtn").show();
    			$(".agentMonitorDiv").find("#chimeInBtn").show();
    			
    		}
    		
    		/**
    		 * 打断和接管，是在 监听之后，针对会话里的成员做的操作。
    		 * 此功能暂不支持。故先隐藏。
    		 */
    		 $(".agentMonitorDiv").find("#kickOutBtn").hide();
    		 $(".agentMonitorDiv").find("#takeOverBtn").hide();
    		 
    		$(".agentMonitorDiv").find("#agentExtendBtnDiv>button").unbind("click").bind("click", function() {
    			var $this = $(this);
    			var id = $this.attr("id");
    			
    			var $selected = $(".agentMonitorDiv").find('input[name="agentSelected"]:checked');
    			if ($selected.length <= 0) {
    				layer.msg("没有可操作的座席");
    			}
    			else {
    				var action = $this.attr("action");
    				
    				var enableActions = SimpleAgentMgr.getAvailableActions();
    				
    				if (!enableActions[action]) {
    					layer.msg("当前状态无法进行此项操作。");
    					return;
    				}
    				
    				var agentId = $selected.attr("agent_id");
    				var agentItem = SimpleAgentMgr.getMonitorAgentById(agentId);
    				if (agentItem) {
    					
    					var nick = agentItem.name;
    					
    					if (action == "kickOut"
    						|| action == "takeOver"
    						|| action == "lock"
    						|| action == "forceLogout") {
    						
    						var actionMap = {
    							"kickOut": "打断 " + agentItem.name + " 的通话吗？",
    							"takeOver": "接管 " + agentItem.name + " 的通话吗？",
    							"lock": "锁定 " + agentItem.name + " 吗？",
    							"forceLogout": "强制签退 " + agentItem.name + " 吗？"
    						}
    						
    						var hint = "确认要" + actionMap[action];
    						var index = layer.confirm(hint, {
    						     "btn": ["是", "否"]  
    						  },
    						 function() {
    						     layer.close(index);
                                 doAdminActionToAgent(agentId, action);
                             }
                            );
    						
    					}
    					else {
    						doAdminActionToAgent(agentId, action);
    					}
    					
    				}
    				else {
    					layer.msg("座席已经离线，无法操作。");
    				}
    			}
    		
    		});
    		
    		
    		$(".agentMonitorDiv").find("#agentExtendBtnDiv").show();
    		$(".agentMonitorDiv").find("#agentMonitorActionBtn").hide();
    		$(".agentMonitorDiv").find("#agentMonitorTitle").text("座席列表");
    		
    		$(".agentMonitorDiv").find("#agentMonitorCancelBtn").find("span").text("关闭");
    		
    	}
    	
    	// 启用监听。
    	agentMonitorTool.startListen();
    	
    	$("#agentFilter").focus();
    	
    }
    
    
    function closeAgentMonitorDiv(){
    	
    	agentMonitorTool.stopListen();
    	
    	layer.closeAll();
    	
    	$(".agentMonitorDiv").hide();
    
    }
    
    var imUIObject = null;
    var imCallback = null;
    var currentImAgentAction = "ready";
    
    function initIMStatus(options) {
        
         /**
    	 * jquery 对象。
    	 */
    	imUIObject = options.imUIObject;
    	imCallback = options.onStatusCallback; 
    	
    	var imOption = SimpleAgentUIComponent.onConnectParams() ? SimpleAgentUIComponent.onConnectParams().imOption : null;
        
        if (imOption == null) {
           return;    
        }
    	
    	currentImAgentAction = imOption.status;
    	
    	if (currentImAgentAction != "ready") {
    	    currentImAgentAction = "busy";
    	}
    	
    }
    
	function enableIMStatus() {
	    
    	if (!imUIObject) {
    	    return;
    	}
	    
	    imUIObject.css("cursor", "pointer");
	    
		imUIObject.unbind("click").click(function() {
			
			var currentText = imUIObject.text();
			if (currentText == "已禁用" || currentText == "--") {
				currentImAgentAction = "ready";
			}
			else {
				currentImAgentAction = "busy";
			}
			
			if (SXC.isConnected() 
				&& SAM.isAcdOnline) {
				applyCurrentIMAgentAction({
					"showTip": "show",
					"action": currentImAgentAction
				});
			}
			else {
				layer.msg("操作将随后自动执行");
			}

		});	
	}    

    function iMAgentEventDealer(eventObject) {
    	
    	function disableIMStatus() {
    	    
    	  if (!imUIObject) {
    	      return;
    	  }
    	
    	  imUIObject.text("--");
    	  imUIObject.css("cursor", "default");
    	  imUIObject.unbind("click");
    		
    	}
    	
    	if (SAM.isConnected()) {
    	    enableIMStatus();	
    	}
    	else {
    		disableIMStatus();
    	}
    	
    	if (eventObject.eventType == "onLoginSuccess"
    		|| eventObject.eventType == "onAcdOnline") {
    	    //chenhua
    	    // applyCurrentIMAgentAction(
    			// 	{
    			// 	    "showTip": "show",
    			// 		"action": currentImAgentAction
    			// 	}
    			// );
    		
    	}
    	else if (eventObject.eventType == "onXmppDisconnect"
    		|| eventObject.eventType == "onAcdOffline"
    		|| eventObject.eventType == "onLoginFailed" ) {
    		disableIMStatus();
    		
    		var message = eventObject.eventType == "onXmppDisconnect" ?
    		   "通讯断开" : (eventObject.eventType == "onAcdOffline" ? "服务不可用" : "登录失败");
    		
    		triggerEvent({
    			    "type": "onError",
    			    "status": "--",
    			    "message": message,
    			    "reason": eventObject.eventType
    			});
    	}

    	
    }    
    
    function triggerEvent(event) {
        
         if (!imCallback) {
             return;
         }   
         
         try {
             imCallback(event);
         }
         catch (e) {
             setTimeout(function(){
                 throw e;
             }, 0);
         }
    }
    
    function applyCurrentIMAgentAction(options) {
    	var showTip = options.showTip;
    	var action = options.action;
    	
    	if (action == "ready") {
    		
    		var imOption = SimpleAgentUIComponent.onConnectParams() ? SimpleAgentUIComponent.onConnectParams().imOption : null;
    		
    		if (!imOption || !SXC._lastAccountInfo) {
    		    return;
    		}
    		
    		SAM.imReady(SXC._lastAccountInfo.q,  imOption.nick ? imOption.nick : "默认昵称", imOption.ability > 0 ? imOption.ability : 1, 
    		  function() {
    			
    			/**
    			 * 显示当前已经 启用成功。
    			 * 表明接下去的动作是 禁用
    			 */
    			showReadyIMAgentUI();
    			
    			triggerEvent({
    			    "type": "onReady",
    			    "status": "ready",
    			    "message": "启用互联网座席成功",
    			    "reason": ""
    			});
    			
    		}, function(iq) {
    			if (showTip == "show") {
    				layer.msg("启用互联网座席失败");
    			}	
    			
    			triggerEvent({
    			    "type": "onError",
    			    "status": "--",
    			    "message": "启用互联网座席失败",
    			    "reason": iq.errorReason
    			});
    			
    		})
    		
    		
    	}
    	else {
    	    if (!SXC._lastAccountInfo) {
    	        return;
    	    }
    					
    		SAM.imBusy(SXC._lastAccountInfo.q, function() {
    			
    			showBusyIMAgentUI();
    			
    			triggerEvent({
    			    "type": "onBusy",
    			    "status": "busy",
    			    "message": "禁用互联网座席成功",
    			    "reason": ""
    			});
    			
    		}, function(iq) {
    			if (showTip == "show") {
    				layer.msg("禁用互联网座席失败");
    			}
    			
    			triggerEvent({
    			    "type": "onError",
    			    "status": "--",
    			    "message": "禁用互联网座席失败",
    			    "reason": iq.errorReason
    			});
    		})
    					
    	}
    	
    }    
    
    function showReadyIMAgentUI() {
    	
    	imUIObject.text("已启用");
    	enableIMStatus();
    	
    }
    
    function showBusyIMAgentUI() {
    
    	imUIObject.text("已禁用");
    	enableIMStatus();
    
    }    
     
     
     /**
     * 针对指定的座席，执行相应的辅助话务命令，比如 代答，插话 等。
     */
    function doAdminActionToAgent(agentId, action) {
    	
    	if (action == "answerFor") {
    		
    		layer.msg("开始代答操作，请准备接听来电");
    		closeAgentMonitorDiv();
    		
    		// 设置标志，以便自动接听。
    		isCurrentAnswerForAgent = true;
    		
    		SimpleAgentMgr.answerForAgent(agentId, function() {
    			
    			isCurrentAnswerForAgent = false;
    		}, function() {
    			
    			isCurrentAnswerForAgent = false;
    			layer.msg("代答操作失败。");
    		});
    	}
    	else if (action == "monitor") {
    		layer.msg("开始监听操作，请准备接听来电");
    		closeAgentMonitorDiv();
    		
    		// 设置标志，以便自动接听。
    		isCurrentMonitorAgent = true;
    		
    		SimpleAgentMgr.monitorAgent(agentId, function() {
    			
    			isCurrentMonitorAgent = false;
    			
    		}, function() {
    			
    			isCurrentMonitorAgent = false;
    			
    			layer.msg("监听操作失败。");
    		});
    	}
    	else if (action == "chimeIn") {
    		layer.msg("开始插话操作，请准备接听来电");
    		closeAgentMonitorDiv();
    		
    		// 设置标志，以便自动接听。
    		isCurrentChimeInAgent = true;
    		
    		SimpleAgentMgr.chimeInAgent(agentId, function() {
    			
    			isCurrentChimeInAgent = false;
    		}, function() {
    			
    			isCurrentChimeInAgent = false;
    			layer.msg("插话操作失败。");
    		});		
    	}
    	else if (action == "kickOut") {
    		SimpleAgentMgr.kickOutAgent(agentId, null, function() {
    			layer.msg("打断操作失败。");
    		});			
    	}
    	else if (action == "takeOver") {
    		layer.msg("开始接管操作，请准备接听来电");
    		closeAgentMonitorDiv();
    		
    		SimpleAgentMgr.takeOverAgent(agentId, null, function() {
    			layer.msg("接管操作失败。");
    		});			
    	}
    	else if (action == "lock") {
    		SimpleAgentMgr.lockAgent(agentId, null, function() {
    			layer.msg("锁定操作失败。");
    		});			
    	}
    	else if (action == "unlock") {
    		SimpleAgentMgr.unlockAgent(agentId, null, function() {
    			layer.msg("解锁操作失败。");
    		});			
    	}
    	else if (action == "forceIdle") {
    		SimpleAgentMgr.forceIdleAgent(agentId, null, function() {
    			layer.msg("强制就绪操作失败。");
    		});				
    	}
    	else if (action == "forceBusy") {
    		SimpleAgentMgr.forceBusyAgent(agentId, null, function() {
    			layer.msg("强制置忙操作失败。");
    		});				
    	}
    	else if (action == "forceLogout") {
    		SimpleAgentMgr.forceLogoutAgent(agentId, null, function() {
    			layer.msg("强制签出操作失败。");
    		});				
    	}
    	else {
    		layer.msg("不支持的座席动作:" + action);
    	}
    	
    }
    
    /**
     * 关于座席监控列表的显示
     * 
     * 1. 数据的来源，包括：
     *   - 向 acd 发送 iq 进行查询；
     *   - 向 acd 发送订阅报文，进行订阅；
     * 
     * 2. 为了能正确地显示座席的数据，需要进行相应的处理：
     *   - Agent 上线时：
     *     - 清空本地之前的 座席列表；
     *     - 向ACD 进行订阅；
     * 	   - 向ACD 发送一次查询座席列表的请求；
     *   - 座席列表请求应答事件的处理：
     *     - 针对每一项，判断 本地对象是否存在，若有，则丢弃；
     *      若没有，则 新增并更新；
     *   - 座席状态改变事件的处理：
     *     - 判断本地对象是否有，若有则更新，没有则添加；
     *   
     * 
     */
    var agentMonitorTool = {
    	
    	_timer: null,
    	
    	/**
    	 * 开始监听。打开座席监视界面时，调用一次即可。
    	 */
    	startListen: function() {
    		
    		// 先清除此前的数据。
    		$(".agentMonitorDiv").find("#agentList>tbody").find("tr[row_type='data']").remove();
    		
    		/**
    		 * 要完成以下事件：
    		 * 1. 接管 agentMgr login 成功的事件 (包括断开后，自动重连成功的事件);
    		 * 2. 接管 agentMgr 状态改变事件；
    		 * 3. 接管 agentMgr 查询座席列表请求的应答事件;
    		 * 4. 进行座席列表的查询； 
    		 */
    		SimpleAgentMgr.addEventListener(this._onAgentEventDealer, "agentMonitorTool._onAgentEventDealer");
    
    		SimpleAgentMgr.startAgentMonitor();
    		
    		/**
    		 * 启动定时器。
    		 */
    		if (this._timer) {
    			clearInterval(this._timer);
    			this._timer = null;
    		}
    		
    		this._timer = setInterval(this._refreshAllRows, 1000); 
    		
    	},
    	
    	_onAgentEventDealer: function(eventObject) {
    	
    		if (eventObject.eventType == SimpleAgentMgr.EVENT_PARTNER_AGENT_STATUS_CHANGE) {
    			
    			var agentId = eventObject.agentId;
    			
    			var monitorAgent = SimpleAgentMgr.getMonitorAgentById(agentId);
    			
    			if (monitorAgent == null) {
    				throw new Error("agent of:" + agentId + " is NULL.");
    			}
    			
    			agentMonitorTool.saveAgentItem(monitorAgent);
    			
    		}
    		
    		
    	},
    	
    	/**
    	 * 停止监视。关闭座席界面时调用。
    	 */
    	stopListen: function() {
    		
    		SimpleAgentMgr.stopAgentMonitor();
    		
    		SimpleAgentMgr.removeEventListener(this._onAgentEventDealer);
    		
    		if (this._timer) {
    			clearInterval(this._timer);
    			this._timer = null;
    		}
    	},
    	
    	/**
    	 * 保存一条座席信息。
    	 */
    	saveAgentItem: function(agent) {
    		
    		/**
    		 * 先尝试更新，否则添加。
    		 */
    		 var updated = this._updateAgentItem(agent);
    		 if (!updated) {
    		 	this._appendAgentItem(agent);
    		 }
    		
    	},
    	
    	/**
    	 * 每隔一秒，更新所有行的数据
    	 */
    	_refreshAllRows: function() {
    		
    		var $rows = $(".agentMonitorDiv").find("#agentList").find("tr");
    		
    		for (var i=0; i<$rows.length; i++) {
    			
    			var $row = $($rows[i]);
    			var agentId = $row.attr("agent_id");
    			
    			if (!agentId) {
    				// 没有该属性，说明不是数据行，跳过即可。
    				continue;
    			}
    			
    			var agent = SimpleAgentMgr.getMonitorAgentById(agentId);
    			
    			if (agent != null) {
    				agentMonitorTool._updateAgentRow($row, agent);
    			}
    			else {
    				// 若找不到这个座席了，则应该删除。
    				$row.remove();
    			}
    			
    		}
    		
    	},
    	
    	_updateAgentRow: function($row, agent) {
    
    		$row.find("td[name='agentLoginName']").text(agent.loginName);
    		
    		if (agent.id == SimpleAgentMgr.getCurrentAgentId()) {
    			$row.css("font-weight", "bold");
    		}
    		
    		$row.find("td[name='agentName']").text(agent.name);		 	
    	 	$row.find("td[name='agentStatus']").text(agent.displayStatus);
    	 	$row.find("td[name='agentDuration']").text(agent.displayDuration);
    	 	$row.find("td[name='agentContact']").text(agent.contact);
    	 	
    	 	$row.find("td[name='agentSelection']").find("input").attr("agent_id", agent.id);
    	 	
    	 	
    	 	/**
    	 	 * 若为当前座席，则使之不可选中。
    	 	 */
    	 	if (agent.id == SimpleAgentMgr.getCurrentAgentId()) {
    	 		$row.find("td[name='agentSelection']").html("");
    	 	}
    	 	
    	 	filterAgentRow($row);
    		
    	},
    	
    	_updateAgentItem: function(agent) {
    		var $rows = $(".agentMonitorDiv").find("#agentList").find("tr[agent_id='" + agent.id + "']");
    		 if ($rows.length > 0) {
    		 	
    			agentMonitorTool._updateAgentRow($rows, agent);
    		 	 
    		 	return true;
    		 } 
    		 else {
    		 	return false;
    		 }
    	},
    	
    	_appendAgentItem: function (agent) {
    		
    			var UITemplate = $(".agentUITemplate tbody");
    			var htmlTemplate = UITemplate.html();
    			
    			var rowHtml = htmlTemplate;
    			
    			// 更改ID
    			rowHtml = rowHtml.replace("#agentId#", agent.id);
    			
    			rowHtml = rowHtml.replace("#qz_id#", agent.qz_id);
    			
    			$(".agentMonitorDiv").find("#agentList>tbody").append(rowHtml);
    			
        		$(".agentMonitorDiv").find("#agentList tr").unbind("click").bind("click", function () {
        			var ra = $(this).find("input[name='agentSelected']");
        			if (ra.length > 0) {
        				ra.attr("checked", "checked");
        				$("#agentList tr").css("background-color", "white");
        				$(this).css("background-color", "rgb(198, 233, 250)");
        				
        			}
        		});    			
    			
    			agentMonitorTool._updateAgentItem(agent);
    		
    	}	
    	
    }
    
    function _log(s) {
        var nowDate = dateFormat2(new Date(), "YYYY-MM-dd hh:mm:ss");
    	
    	if (window.console && window.console.log) {
    	  window.console.log(nowDate + " " + s);
    	}
    }
    
    /**
     * 记录日志
     */
    function recordLog(eventObject, methodName) {
    	
    	var line = (methodName ? methodName : eventObject.eventType) + " ";
    	line += " " + JSON.stringify(eventObject);
    	
    	_log(line);
    	
    }    
    
    var lastCallWindowIndex = null;
    
    /**
     * 处理座席组件事件
     */
    function dealOnAgentEvent(eventObject) {
    	
    	var eventType = eventObject.eventType;
    	var data = eventObject.data;
    	
    	recordLog(eventObject);	
    	
    	if (eventType == "onLogout") {
    	    layer.closeAll();
    	    closeNotification();
    	}
    	
    	/**
    	 * 身份校验成功事件。
    	 */
    	if (eventObject.eventType == "onVerifySuccess") {
    		
    		var accountInfo = eventObject.data;
    		
    		/**
    		 * q 属性是自身的 消息通道的标识，其他座席往这个地址发送消息，自己就能收到。
    		 */
    		debugInfo.selfNodeId = accountInfo.q;
    		
    		_log("self node id:" + accountInfo.q);
    		
    		
    	}
    	else if (eventType == "call_start") {
    	    
    	    var phoneNumber = eventObject.caller;
    	    var displayName = eventObject.username;
    	    
    	    var title = "内部呼叫";
    	    var content = "";
    	    
        	if (displayName) {
        		content = "来自座席: " + displayName;
        	}
        	else {
        	    content = "来自电话： " + phoneNumber;
        	}
        	
          tryShowCallingNotify(title + ", " + content);	
        	
          lastCallWindowIndex = layer.open({
              type: 1 //Page层类型
              ,area: ['350px', '180px']
              ,title: title
              ,shade: 0 //遮罩透明度
              ,content: '<div style="padding:20px;text-align:left;">' + content + '</div>'
              ,btn: ["接听", "拒绝"]
              ,closeBtn: 0
              , yes: function(index) {
                    
                    qphonePickup(); 
                    
                    setTimeout(function() {
    					qphonePickup(); 
    				}, 500);
    				
    				setTimeout(function() {
    					qphonePickup(); 
    				}, 1500);
                  
                  layer.close(index);
                 }
              , btn2: function(index, layero) {
                  SimpleAgentMgr.reject();
                  
                  layer.close(index);
                }  
              }
           );         	
    	    
    	}
    	else if (eventType == "call_end") {
    	    /**
    	     * 这里处理的有些粗暴，
    	     */
    	    if (lastCallWindowIndex) {
    	       layer.close(lastCallWindowIndex);
    	    }
    	    
    	    closeNotification();
    	    
    	    lastCallWindowIndex = null;
    	}
    	else if (eventType == "onKickOtherSession") {
    	    layer.msg("您已经将座席的其他会话强制终止。");
    	}
    	else if (eventType == "onButtonClicked") {
    	
    		// 座席组件点击事件
    		if (eventObject.buttonId == "imgOutbound") {
    			makeCall();
    		}
    		else if (eventObject.buttonId == "imgAgentMonitor") {
    			/**
    			 * NOTE： 此函数在文件  agentMonitorDemo.js 中提供。
    			 */ 
    			showAgentMonitorDiv();
    		}
    		else if (eventObject.buttonId == "imgInviteOutbound") {
    			// 邀请号码
    			inviteOutbound();
    		}
    		else if (eventObject.buttonId == "imgTransferOutbound") {
    			transferOutbound();
    		}
    		else if (eventObject.buttonId == "imgCallAgent") {
    			callAgent();
    		}
    		else if (eventObject.buttonId == "imgInvite") {
    			inviteAgent();
    		}
    		else if (eventObject.buttonId == "imgTransfer") {
    			transferAgent();
    		}
    		else if (eventObject.buttonId == "imgSetup") {
    		    showDebugInfo();
    		}
    		else if (eventObject.buttonId == "imgRest") {
    		    startRest();
    		}
    
    	}
    	else if (eventObject.isServiceEvent) {
    		 
    		if (eventType == SimpleAgentMgr.EVENT_SERVICE_START) {
    				return;//ch:屏蔽，使用自定义的接听事件
    				/**
    				 * 根据呼叫类别，取对应的号码
    				 */ 
    				var direction = "";
    				var phoneNumber = "";
    				var title = "";
    				var content = "";
    				
    				if (SimpleAgentMgr.getACDEvent().acdCall.isOutBound) {
    					// 取 callee
    					phoneNumber = SimpleAgentMgr.getACDEvent().acdCall.callee;
    					direction = "呼出";
    					
    					title = "正在呼出";
    					
    					if (_simple.options && _simple.options.onPhoneNumberDisplay) {
    						phoneNumber = _simple.options.onPhoneNumberDisplay(phoneNumber); 
    					}
    					
    					content = "号码: " + phoneNumber;
    					
    					$("#pickUpButton").text("接听电话");
    					
    					/**
    					 * 因为电话和 服务事件可能会有滞后，因此这里稍后做一些尝试。
    					 */
    					setTimeout(function() {
    						qphonePickup(); 
    					}, 500);
    					
    					setTimeout(function() {
    						qphonePickup(); 
    					}, 1500);
    					
    					setTimeout(function() {
    						qphonePickup(); 
    					}, 2500);
    
    					setTimeout(function() {
    						qphonePickup(); 
    					}, 3500);
    					
    					/**
    					 * 显示号码非空，才显示相关界面。
    					 */
    					if (phoneNumber) {
                layer.open({
                  type: 1 //Page层类型
                  ,area: ['350px', '180px']
                  ,title: title
                  ,shade: 0 //遮罩透明度
                  ,content: '<div style="padding:20px;text-align:left;">' + content + '</div>'
                  ,btn: ["取消呼出"]
                  ,closeBtn: 0
                  ,end: function() {
                       cancelAction();
                     }
                  }, function() {
                      cancelAction();
                  });
    					}
    					
    				}
    				else {
    					// 取主叫
    					phoneNumber = SimpleAgentMgr.getACDEvent().acdCall.caller;
    					direction = "呼入";
    					
    					var pickTip = "";
    					
    					if (SAM.getACDEvent().acdCall.isVideo ) {
    					    title = "视频呼入";
    					    content = "来自：" + phoneNumber;
    					    pickTip = "接听视频电话";
    					}
    					else {
    					    title = "电话呼入";
    					    content = "来自： " + phoneNumber;
    					    pickTip = "接听电话";
    					}
    					
    					tryShowCallingNotify(title + "," + content);
    					
    					layer.open({
                          type: 1 //Page层类型
                          ,area: ['350px', '180px']
                          ,title: title
                          ,shade: 0 //遮罩透明度
                          ,btn: [pickTip, "拒绝", "拒绝并置忙"]
                          ,content: '<div style="padding:20px;text-align:left;">' + content + '</div>'
                          ,closeBtn: 0
                          ,yes: function(index) {
                               // 接听
                            qphonePickup();
                            layer.close(index);
                          }
                          ,btn2 : function(index) {
                              /**
                    		 * 若 acd 呼入，则拒绝
                    		 * 否则，挂机
                    		 */
                    		if (SimpleAgentMgr.getACDEvent() 
                    			&& SimpleAgentMgr.getACDEvent().acdCall
                    			&& SimpleAgentMgr.getACDEvent().acdCall.isOutBound) {
                    			SimpleAgentMgr.hangup();
                    		}
                    		else {
                    			SimpleAgentMgr.reject();
                    		}
                    		
                            // 话机上拒绝
                            qphoneHangup();
                            layer.close(index);
                          }
                          ,btn3: function(index) {
                              SimpleAgentMgr.busy();
                    		SimpleAgentMgr.reject();
                    		
                    		// 话机上拒绝
                            qphoneHangup();
                            
                            layer.close(index);
                          }
                        }); 
    					
    				}
    			
    		}
    		else if (eventType == SimpleAgentMgr.EVENT_SERVICE_PICKUP) {
    			
    			_log("呼叫标识(callId):" + SimpleAgentMgr.getACDEvent().acdCall.callId
    				+ ", 服务标识(uid):" + SimpleAgentMgr.getACDEvent().acdService.uid);
    			
    		}


            if (eventType == "service_end" || eventType == "service_pickup" ) {
                layer.closeAll();
                closeNotification();
            }
    		
    		if (SimpleAgentMgr.getACDEvent()) {
    			recordLog(SimpleAgentMgr.getACDEvent(), "SimpleAgentMgr.getACDEvent()");	
    		}
    
    	}
    	else if (eventType == "want_resting") {
    		
    		var hint = "座席(" + eventObject.agentId + ") 发起了小休理由为:[" + eventObject.reason + "], 确认要批准吗？";
            var index = layer.confirm(hint, {
                 "btn": ["是", "否"]  
              },
             function() {
                 layer.close(index);
                 SAM.grantResting(eventObject.agentId);			
             }
            );		
    		
    	}
    	
    	/**
    	 * 其他处理
    	 */
    	 iMAgentEventDealer(eventObject);
    	
    } 
    
    
    function startRest() {
        layer.prompt({title: '请输入申请小休的理由'}, function(value, index){
		    
             layer.close(index);
 
             SAM.wantResting(value, function() {
    			layer.msg("操作成功.");	
    		}, function(iqResult) {
    			layer.msg("申请小休操作失败:" + iqResult.errorReason);
    		});
 
        });
    }
    
    /**
     * 呼叫座席
     */
    function callAgent() {
    	
    	var actionMap = SimpleAgentMgr.getAvailableActions();
    	if (actionMap.outbound) {
    		var mode = {
    			title: "呼叫座席",
    			action: "呼叫",
    			// 在选座席界面选择一个座席并点击呼叫按钮后的回调
    			callback: function(agentItem) {
    				
    				var actionMap = SimpleAgentMgr.getAvailableActions();
    				if (actionMap.outbound) {
    
    					var actionId = SimpleAgentMgr.makeCallToAgent(agentItem.id, function(iqResponse) {
    						
    						layer.closeAll();
    						
    						cancelActionId = null;
    						// makeCall 对方接听后的回调
    						layer.msg("呼叫座席成功。");
    					}, function(iqResponse) {
    						cancelActionId = null;
    						
    						layer.closeAll();
    						
    						layer.msg("呼叫座席失败:" + iqResponse.errorReason);
    					});
    					
    					cancelActionId = actionId;
    					
    					var content = "正在呼叫座席: " + agentItem.id;
    					
    					/**
    					 * 因为电话和 服务事件可能会有滞后，因此这里稍后做一些尝试。
    					 */
    					setTimeout(function() {
    						qphonePickup(); 
    					}, 500);
    					
    					setTimeout(function() {
    						qphonePickup(); 
    					}, 1500);
    					
    					setTimeout(function() {
    						qphonePickup(); 
    					}, 2500);
    
    					setTimeout(function() {
    						qphonePickup(); 
    					}, 3500);
    					
        				layer.open({
                          type: 1 //Page层类型
                          ,area: ['350px', '180px']
                          ,title: "呼叫座席"
                          ,shade: 0 //遮罩透明度
                          ,content: '<div style="padding:20px;text-align:left;">' + content + '</div>'
                          ,btn: ["取消呼出"]
                          ,closeBtn: 0
                          ,end: function() {
                               cancelAction();
                             }
                          }, function() {
                              cancelAction();
                          });  
    					
    					
    				}
    				else {
    					layer.msg("当前无法进行呼叫。");
    				}
    			}
    		};
    		
    		showAgentMonitorDiv(mode);
    	}
    	else {
    		layer.msg("当前无法进行呼叫。");
    	}			
    }
    
    /**
     * 转接座席
     */
     function transferAgent() {
    	var actionMap = SimpleAgentMgr.getAvailableActions();
    	if (actionMap.transfer) {
    		
    		var transferTitle = "";
    		
    		var telOption = SimpleAgentUIComponent.onConnectParams().telOption;
    		
    		if (telOption.transferMode == "one_step") {
    			transferTitle = "转接电话(一步转)给座席";
    		}
    		else {
    			transferTitle = "转接电话(二步转)给座席";
    		}
    		
    		var mode = {
    			title: transferTitle,
    			action: "转接",
    			callback: function(agentItem) {
    				
    				var actionMap = SimpleAgentMgr.getAvailableActions();
    				if (actionMap.transfer) {
    					var actionId = SimpleAgentMgr.transferToAgent(agentItem.id, SAM.getTelOption().transferMode, function(iqResponse) {
    						cancelActionId = null;
    						layer.msg("转接操作成功。");
    					}, function(iqResponse) {
    						cancelActionId = null;
    						layer.msg("转接操作失败:" + iqResponse.errorReason);
    					});
    
    					cancelActionId = actionId;
    				}
    				else {
    					layer.msg("当前无法进行转接。");
    				}
    			}
    		};
    		
    		showAgentMonitorDiv(mode);		
    	}
    	else {
    		layer.msg("当前无法进行转接。");
    	}	 	
     }
     
     /**
      * 邀请座席
      */
     function inviteAgent() {
    	var actionMap = SimpleAgentMgr.getAvailableActions();
    	if (actionMap.invite) {
    		var mode = {
    			title: "邀请座席",
    			action: "邀请",
    			callback: function(agentItem) {
    				
    				var actionMap = SimpleAgentMgr.getAvailableActions();
    				if (actionMap.invite) {
    					var actionId = SimpleAgentMgr.inviteToAgent(agentItem.id, function(iqResponse) {
    					    cancelActionId = null;
    						layer.msg("邀请座席成功。");
    					}, function(iqResponse) {
    					    cancelActionId = null;
    						layer.msg("邀请座席失败：" + iqResponse.errorReason);
    					});
    
    					cancelActionId = actionId;
    					
    				}
    				else {
    					layer.msg("当前无法进行邀请。");
    				}
    			}
    		};
    		
    		showAgentMonitorDiv(mode);		
    	}
    	else {
    		layer.msg("当前无法进行邀请。");
    	}
    	 	
     }
    
    /**
     * 转接外部号码
     */
    function transferOutbound() {
    	/**
    	 * 仅在当前允许转接的情况下，发起转接。
    	 */
    	var actions = SimpleAgentMgr.getAvailableActions();
    	if (!actions.transfer) {
    		layer.msg("当前不允许转接");
    		return;
    	} 
    	
    	var transferTitle = "";
    		
		var telOption = SimpleAgentUIComponent.onConnectParams().telOption;
		
		if (telOption.transferMode == "one_step") {
			transferTitle = "请输入转接的号码(一步转)";
		}
		else {
			transferTitle = "请输入转接的号码(二步转)";
		}
    	
        layer.prompt({title: transferTitle}, function(value, index){
        		    
            layer.close(index);
        
            var phone = value;
        
        	if (phone) {
        		var actionId = SimpleAgentMgr.transferToPhone(phone, SAM.getTelOption().transferMode, function() {
        			
        			cancelActionId = null;
        			
        			layer.msg("转接成功");	
        		}, function(iqResponse) {
        			
        			cancelActionId = null;
        			
        			layer.msg("转接失败:" + iqResponse.errorReason);
        		});
        		
        		cancelActionId = actionId;
        		
        	}
        
        });		 
    	
    }
    
    /**
     * 邀请外线号码
     */
    function inviteOutbound() {
    	
    	/**
    	 * 仅在当前允许邀请的情况下，发起邀请。
    	 */
    	var actions = SimpleAgentMgr.getAvailableActions();
    	if (!actions.invite) {
    		layer.msg("当前不允许邀请");
    		return;
    	} 
    	 
        layer.prompt({title: '请输入邀请的号码'}, function(value, index){
        		    
            layer.close(index);
        
        	var phone = value; 
        	if (phone) {
        		var actionId = SimpleAgentMgr.inviteToPhone(phone, function() {
        			
        			cancelActionId = null;
        			
        			layer.msg("邀请成功");	
        		}, function(iqResponse) {
        			
        			cancelActionId = null;
        			
        			layer.msg("邀请失败:" + iqResponse.errorReason);
        		});
        		
        		cancelActionId = actionId;
        		
        	}
        
        });	
    	
    }
	

    /**
     * 邀请外线号码
     */
    function inviteOutbound() {
    	
    	/**
    	 * 仅在当前允许邀请的情况下，发起邀请。
    	 */
    	var actions = SimpleAgentMgr.getAvailableActions();
    	if (!actions.invite) {
    		layer.msg("当前不允许邀请");
    		return;
    	} 
    	 
        layer.prompt({title: '请输入邀请的号码'}, function(value, index){
        		    
            layer.close(index);
        
        	var phone = value; 
        	if (phone) {
        		var actionId = SimpleAgentMgr.inviteToPhone(phone, function() {
        			
        			cancelActionId = null;
        			
        			layer.msg("邀请成功");	
        		}, function(iqResponse) {
        			
        			cancelActionId = null;
        			
        			layer.msg("邀请失败:" + iqResponse.errorReason);
        		});
        		
        		cancelActionId = actionId;
        		
        	}
        
        });	
    	
    }
	    
    
    /**
     * 记录最近一次可以撤销的 actionId 
     */
    var cancelActionId = null;
    
    function cancelAction() {
        
		if (cancelActionId != null && cancelActionId != "") {
			SimpleAgentMgr.cancelAction(cancelActionId);
			cancelActionId = null;
		}

    }   

    /**
     * 呼叫外线号码
     */
    function makeCall() {
    	
    	/**
    	 * 仅在当前允许呼叫的情况下，发起呼叫。
    	 */
    	var actions = SimpleAgentMgr.getAvailableActions();
    	if (!actions.outbound) {
    		layer.msg("当前不允许呼出");
    		return;
    	} 
    	 
        layer.prompt({title: '请输入呼出号码'}, function(value, index){
        		    
            layer.close(index);
    
        	var phone = value; 
        	if (phone) {
        	    
        	    var phoneObject = {
            		"tel": phone 
            	}
            	
            	// 若当前座席配置了呼出显示号码，则使用该呼出显示号码。
            	if (SXC && SXC.getAccountInfo() && SXC.getAccountInfo().out_num) {
            		phoneObject.callerNumber = SXC.getAccountInfo().out_num;
            	}
        	    
        		var actionId = SimpleAgentMgr.makeCallToPhone(phoneObject, function() {
        			
        			cancelActionId = null;
        			
        			layer.msg("呼出成功");	
        		}, function(iqResponse) {
        			
        			cancelActionId = null;
        			
        			layer.msg("呼出失败(" + iqResponse.errorReason + ")");
        		});
        		
        		cancelActionId = actionId;
        		
        	}
        
        });	
    	
    }	
    
    function qphonePickup(showTip) {
        
    	if (!QPhoneTool.qPhone || !QPhoneTool.qPhone.currentCall) {
    	    
    	    if (showTip) {
    		     layer.msg("当前没有可接听的电话。");
    	    }
    	    
    		return;
    	}
    	
       if (SAM.getACDEvent() 
    		&& SAM.getACDEvent().acdCall 
    		&& SAM.getACDEvent().acdCall.isVideo) {
    		
    		var mode = QPhoneTool.webrtc ? "webrtc" : QPhoneTool.chrome ? "chrome" : "ie";
    		
    		if (lastVideoWindow) {
    			lastVideoWindow.onbeforeunload = null;
    			lastVideoWindow.onunload = null;
    			lastVideoWindow.close(); 
    		}
    		
    		lastVideoWindow  = openWindow("video/video.html?mode=" + mode + "&t=" + new Date().getTime(), "onesoulVideo", 700, 528);
    		
    	}
    	else {
    		 QPhoneTool.acceptCall();
    	}	
    	
    	return true;
    	
    }
    
    function openWindow(url, name, iWidth, iHeight) {
    	
    	var win = __openWindow("", name, iWidth, iHeight);
    	
    	if (win == null) {
    		layer.msg("弹出窗口被禁用，请先启用。");
    		return;
    	}
    	
    	if (win.location.href == "about:blank") {
    		win.location.href = url;
    	}
    	else if (win.location.href.indexOf(url) >= 0) {
    	    return win;
    	}
    	else {
    		win.close();
    		win = __openWindow(url, name, iWidth, iHeight);
    	}	
    	
    	return win;
    }
    
    function __openWindow(url, name, iWidth, iHeight) {
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;       //获得窗口的垂直位置;
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;           //获得窗口的水平位置;
        return window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
        
    }
    
    function openVideoClient() {
        
        var url = "video/qphoneClient.html?cm_host=" + SXC.getAccountInfo().service.cm_host
    			+ "&cm_port=" + SXC.getAccountInfo().service.cm_sip_port
    			+ "&t=" + new Date().getTime();
    	openWindow(url, "qphoneClient", 700, 528);
        
    }    
    
    function qphoneHangup() {
    	if (QPhoneTool.qPhone && QPhoneTool.qPhone.currentCall) {
    		QPhoneTool.qPhone.currentCall.Hangup();
    	}
    }    
 	    
    function loadQPhoneComponent(options) {
    	
     	try {
     		
     		QPhoneTool.init(options);
     		
     		/**
     		 * NOTE:若能 init 完成而没有异常，则QPhone 组件加载成功了。
     		 */ 
     		 
     		debugInfo.qphoneVersion = QPhoneTool.qPhone.PhoneVersion + " " + QPhoneTool.versionDetail;
    		// $("#qphoneVersion").text(debugInfo.qphoneVersion);
    	  console.log("QPhone版本:",debugInfo.qphoneVersion)
    		// 将相关组件显示出来
    		// $(".qphone").show();
    		
        QPhoneTool.OnRegisterSuccessful = function() {
          // $("#qphoneConnStatus").text("已连接");
          console.log("QPhone已连接")
          debugInfo.qphoneConnStatus = "已连接";
          refreshQPhoneParams();
        };
    	   	
        QPhoneTool.OnRegisterFailed = function() {
          // $("#qphoneConnStatus").text("注册失败");
          console.log("QPhone注册失败")
          debugInfo.qphoneConnStatus = "注册失败";
          refreshQPhoneParams();
        };
    		QPhoneTool.OnUnregistered = function() {
    			// $("#qphoneConnStatus").text("已断开");
          console.log("QPhone已断开")
    			debugInfo.qphoneConnStatus = "已断开";
    			refreshQPhoneParams();
    		};   
    		
        // 呼叫事件的接管
        QPhoneTool.OnCallIncoming = function(currentCall) {
          $("#qphoneLastEvent").text("电话正在呼入From:" + currentCall.FromNumber);
          debugInfo.qphoneLastEvent = "电话正在呼入From:" + currentCall.FromNumber;
        };
    	   
        QPhoneTool.OnCallTerminated = function(callHangUpObject) {
          // $("#qphoneLastEvent").text("呼叫已终止");
          console.log("QPhone状态-呼叫已终止")
          debugInfo.qphoneLastEvent = "呼叫已终止";
        };

        QPhoneTool.OnCallConnected = function(callStartedObject) {
          // $("#qphoneLastEvent").text("正在通话");
          console.log("QPhone状态-正在通话")
          debugInfo.qphoneLastEvent = "正在通话";
        };
    		
    		QPhoneTool.OnException = function(e) {
    	   	layer.msg("QPhone出错:" + e.message);
          debugInfo.qphoneLastEvent = "QPhone出错:" + e.message;
        };
    
     	}
     	catch (e) {
     		layer.msg(e.message);
    		// $("#qphoneLoad").show();
    		// $("#qphoneLoadStatus").text(e.message);
    		debugInfo.qphoneLoadStatus = "QPhone出错:" + e.message;
     	}	
    
    }
    
    function refreshQPhoneParams() {
        if (QPhoneTool.qPhone) {
            debugInfo.qphoneServer = QPhoneTool.qPhone.RegistrarServer;
            debugInfo.qphoneStunServer = QPhoneTool.qPhone.StunServer ? QPhoneTool.qPhone.StunServer : "";
            // $("#qphoneServerUrl").text(QPhoneTool.qPhone.RegistrarServer);
            console.log("QPhone.注册服务器地址:",QPhoneTool.qPhone.RegistrarServer)
            // $("#qphoneServerStunUrl").text(QPhoneTool.qPhone.StunServer ? QPhoneTool.qPhone.StunServer : "");
            console.log("QPhone.STUN服务器地址:",QPhoneTool.qPhone.StunServer)
        }
    }    
    
    var notificationHandle = null;
    
    function closeNotification() {
       if (notificationHandle) {
			notificationHandle.close();
			notificationHandle = null;
		}
    }
    
    function tryShowCallingNotify(title) {
          closeNotification();
    
        if (window.Notification && Notification.permission === "granted") {
       	
       		notificationHandle = new Notification("通知", 
       			{ body: title, "icon": _SimpleBarBaseJsPath + "../images/calling.png", "tag": "PhoneNotificationTag"} );
       		
       		notificationHandle.onclick = function(event) {
    		  event.preventDefault(); // prevent the browser from focusing the Notification's tab
    		  
    		  window.top.focus();
    		  
    		  notificationHandle.close();
    		  notificationHandle = null;
    		};	
       		
       }
       else {
           
           layer.msg("浏览器通知权限未开启，请手动开启。(" + title + ")");
       }
           
    }
    
    /**
     * 存放调试信息。
     */
    var debugInfo = {
        
    }
    
    function showDebugInfo() {
        
        if (QPhoneTool.qPhone) {
            debugInfo.qphoneAuthName = QPhoneTool.qPhone.AuthName;
            debugInfo.qphoneAuthPassword = QPhoneTool.qPhone.AuthPassword;
            debugInfo.qphonePhoneNumber = QPhoneTool.qPhone.PhoneNumber;
        }
        
        debugInfo.connectParams = SimpleAgentUIComponent.onConnectParams();
        
        //示范一个公告层
        layer.open({
          type: 1
          ,title: "调试信息" //不显示标题栏
          ,closeBtn: false
          ,area: ['500px;', '300px']
          ,shade: 0.0
          ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
          ,resize: false
          ,btn: ['确定']
          ,btnAlign: 'c'
          ,moveType: 1 //拖拽模式，0或者1
          ,content: '<div style="line-height: 22px;">' 
                  + JSON.stringify(debugInfo) + '</div>'
          
        });        
    }
    
    var _simple = {
        "init" : function(options) {
        	
        	if ($(".agentMonitorDiv").length <= 0) {
        		
        		_simple.options = options;
        		
                createAgentListUI();
                SimpleAgentMgr.addEventListener(dealOnAgentEvent, "SimpleAgentList.simpleAgentMgr.onEvent");

            	loadQPhoneComponent(options);
            	
            	initIMStatus(options);
            	
            	/**
            	 * 确保启用 IM
            	 */
            	SIM.start();
            	
            	/**
            	 * 确保 UI 组件创建后才隐藏相关 按钮。
            	 */
            	setTimeout(function() {
            	    $("#imgSetupText").text("调试信息");
            	    // SAU.hideSetup(); 
            	}, 0);
            	
            	SAM.beforeHangup = function(callback) {
                	var hint = "确认要挂机吗？";
					var index = layer.confirm(hint, {
					     "btn": ["是", "否"]  
					  },
					 function() {
					     layer.close(index);
					     
                         callback();
                     }
                    );
                }
            	
            }
        }
                
    }

      window.SimpleBarUI = _simple;
 	  supera = {
 	    transferAgent:transferAgent,
      applyCurrentIMAgentAction:applyCurrentIMAgentAction,
      currentImAgentAction:currentImAgentAction,
      cancelActionId:cancelActionId,
      inviteAgent:inviteAgent,
    };
 })();
 
 export default {
   transferAgent:supera.transferAgent,
   applyCurrentIMAgentAction:supera.applyCurrentIMAgentAction,
   currentImAgentAction:supera.currentImAgentAction,
   cancelActionId:supera.cancelActionId,
   inviteAgent:supera.inviteAgent,
 };

 //自己添加的代码搜索chenhua
 
