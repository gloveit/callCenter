
/**
 * <p>Copyright: Copyright (c) 2011</p>
 * <p>Company: 杭州网梭科技有限公司</p>
 * <p>Hangzhou Onesoul Technologies Inc. 
 * 	– Confidential and Proprietary</p>
 */

String.prototype.trim = function(){   
	return this.replace(/(^\s*)|(\s*$)/g, "");   
}   

var chatContainerId = null;
var templateId = null;

var tplMsgs = null;

var fileUploadDisplayAreaId = null;
var textAreaId = null;

var isShowSimple = false;

var SIM;
var SAM;
var SimpleAgentMgr;

/**
 * 实际是限制 5K，为了测试大包放宽到 100KB
 */
var MAX_BODY_LENGTH = 1024 * 100;

var currentChatNodeId = null;

try {
	SIM = window.parent.SIM;
	SAM = window.parent.SAM;
	SimpleAgentMgr = window.parent.SimpleAgentMgr;
	
	if (SimpleAgentMgr == null) {
		alert("无法获取 SimpleAgentMgr，请确保不要跨域使用。");
	}
}
catch (e) {
	alert("无法获取 SimpleAgentMgr，请确保部署到web端再使用。");
}

$(document).ready(function() {
	init();
	
	setInterval(function() {
		/**
		 * 若 opener 被关闭或者刷新了，则自身也关闭。
		 */
		 if (window.parent == null) {
		 	alert("父窗口已经关闭或者刷新，请重新打开本窗口。");
		 	closeWindow();	
		 }
	}, 1000);
});

function closeWindow() {
    
    window.parent.closeChatWindow(currentChatNodeId);
    
}

function getFileName(filePath) {
	
	var pos = filePath.lastIndexOf("/");
	if(pos == -1){
	   pos = filePath.lastIndexOf("\\")
	}
	var filename = filePath.substr(pos +1);
	return filename;
}

function showSendOptionDiv(){
		
	sendOpt.style.display='block';
	_isAutoHide = false;
	
	setTimeout(startAutoHide, 0);
	
}	

/**
 *  "access_code": "7655bf84-c6c6-4387-8616-3bef9755c04a.ini",
    "business_data": "",
    "creator": null,
    "creator_id": 10001,
    "creator_name": "",
    "enable_thumb": 0,
    "enterprise_id": 1,
    "file_name": "desktop.ini",
    "height": 0,
    "id": 203,
    "length": 0,
    "md5": "9e36cc3537ee9ee1e3b10fa4e761045b",
    "memo": "",
    "mime_type": "application/octet-stream",
    "page_index": 0,
    "pages_bundle_access_code": "",
    "pages_bundle_id": 0,
    "pages_count": 0,
    "size": 282,
    "storage_id": 203,
    "time": "2016-04-07 17:04:53",
    "width": 0
 */

function getFileInfoFromResponse(attach) {
	
	attach.name = attach.file_name;
	attach.type = attach.mime_type;
	attach.mode = "attach";
	attach.lq_res = "unsupport";
	attach.fileId = "unsupport";
	
	attach.url = window.parent.serviceUrl + "/ucm/api/attach/download/" + attach.file_name + "?attach_id=" + attach.id
			+ "&access_code=" + attach.access_code;
	

	return attach;
	
}

function updateChatTitle(target) {
	document.title = "与 " + target + " 的对话";
}

function init() {
    
    currentChatNodeId = $.query.get("node_id");
	
	updateChatTitle(currentChatNodeId);
	
	SimpleAgentMgr.addEventListener(dealOnAgentEvent, "simple chat .onEvent");
	
	window.onbeforeunload = function() {
	
		if (window.parent && window.parent.SAM) {
			window.parent.SAM.removeEventListener(dealOnAgentEvent);
		}
		
	};
	
	dealWithPasteImage();

	chatContainerId = "#jdres_chat_content";
	templateId = "#jdres_chat_content_template";
	
	fileUploadDisplayAreaId = "#jdres_file-uploader-area";
	textAreaId = "#jdres_msgArea";
	
	$("#main-win").show();
	$("#mainArea").hide();
	$("#emotions").css("bottom", "207px");
	$("#emotions").css("left", "19px");
	
	$("#sendOpt").css("right", "296px");
	$("#sendOpt").css("bottom", "59px");

	tplMsgs = TplTool($(templateId).html(),
		{
		"el": chatContainerId
		}
	);
	
	$("#sendOptBtn").unbind("click").bind("click", showSendOptionDiv);
	$("#changeKeyOption").unbind("click").bind("click", showSendOptionDiv);
	
	initEmotions();

	$("#talk_c").unbind("click").bind("click", function() {
		tryCloseChatWindow();
	});
	
	$("#expressionButton").unbind("click").bind("click", function(){
		$("#emotions").hide();
		$("input[name='file']").attr("accept", "*/*");
		$("#file-uploader-button-area input").trigger("click");
	});
	
	var realm = window.parent.SXC.getAccountInfo().r;
	var gt = window.parent.SXC.getAccountInfo().gt;
	var un = window.parent.SXC.getAccountInfo().un;
	
	var upload_url = window.parent.serviceUrl + "/ucm/api/attach/upload?object_id=8888&object_type=wchat_" + realm + "." + un + "&r=" + realm
		+ "&gt=" + gt;
		
	FileUploadTool.createFileUploader(upload_url, fileUploadDisplayAreaId, function(attach) {
		
		var fileInfo = getFileInfoFromResponse(attach); 
	
		sendMsg("", fileInfo);
			
	});

	$("#fileUploaderBtn").unbind("click").bind("click", function(){
		$("#emotions").hide();
		$("input[name='file']").attr("accept", "");
		$("#file-uploader-button-area input").trigger("click");
	});	
	
	$("#imgUploaderBtn").unbind("click").bind("click", function(){
		$("#emotions").hide();
		$("input[name='file']").attr("accept", "*/*");
		$("#file-uploader-button-area input").trigger("click");
	});	
	
	$(textAreaId).unbind("click").bind("click", function() {
		textArea_click();
	});
	
	$(window).unbind("click").bind("click", function(){
		hideAllPopup();
	});
	$(window.document).unbind("click").bind("click", function(){
		hideAllPopup();
	});
	$(window).resize(function(){
		hideAllPopup();
	});

	$("#closeTip").unbind("click").bind("click", function() {
		$("#sysTip").hide();
	});
	
	if (typeof (Debugger) == 'function') {
		oDbg = new Debugger(2, WebChatFlag);
		oDbg.start();
	} else {
		// if you're using firebug or safari, use this for debugging
		//oDbg = new JSJaCConsoleLogger(2);
		// comment in above and remove comments below if you don't need debugging
		oDbg = function() {
		};
		oDbg.log = function() {
		};
	}
	
	$(chatContainerId).unbind("click").bind("click", function() {
		$("#emotions").hide();
	});
	
	$("#top_close").unbind("click").bind("click", function() {
		
		tryCloseChatWindow();
		
	});
	
	$("#_top_close").unbind("click").bind("click", function() {
		
		tryCloseChatWindow();
		
	});
	
	$("#emotionSpan").unbind("click").bind("click", emotion_click);
	$("#j_emotions").unbind("click").bind("click", emotion_click);	
	
	loadKeyOption();
	
	dealOnSize();
	
	$(window).resize(dealOnSize);

	$("#jdres_msgArea").focus();
	
	if (window.parent.eventStack && window.parent.eventStack[currentChatNodeId] ) {
	    
	    var eventObject = window.parent.eventStack[currentChatNodeId];
	    window.parent.eventStack[currentChatNodeId] = null;
	    
	    dealOnAgentEvent(eventObject);
	}
	
	TalkieTool.init();
	
}


function dealWithPasteImage() {
    
	$("textarea").unbind("paste").bind("paste", pasteEvent);
	    
}

function isImg(type) {
	
	if (type && type.search("image/") >= 0 ){
	 	return true;
	}
	return false;
}


function pasteEvent() {
    
	var theClipboardData  = event.clipboardData ;
	
	if (theClipboardData) {
		
		var text = theClipboardData.getData('text/plain');
		if (text) {
			// 如果剪贴板里有文本，那么就不处理图片了。
			return;
		}
		
		var items = theClipboardData.items;  
        for (var i = 0; i < items.length; ++i) {  
            var item = theClipboardData.items[i];  
            if (items[i].kind == 'file' && isImg(items[i].type)) { 
                
            	var fileReader = new FileReader();  
            	
            	fileReader.onloadend = function () {  
                    var d = this.result.substr(this.result.indexOf(',') + 1);  
                    var img = new Image(); 
                    var src = "data:image/png;base64," + d;        
                    
                    if(blob && blob.size > 0){
						// 增加这个标记，以确保立即发送出去。
						blob.isDropToSend = true;
						
	                  	FileUploadTool.fileUpLoader._uploadFile(blob, true);
	                }    
                    
                };  
                fileReader.readAsDataURL(item.getAsFile()); 
             
                blob = item.getAsFile();
                blob.name = "截图"  + new Date().Format("yyyyMMddHHmmss") + ".png";
               	
            }
       } 
        
       
	}    
}


function tryCloseChatWindow() {
	if (confirm("您确定要结束对话吗？")) {
		
		sendMsg("欢迎下次光临，再见。", null, true);
		
		setTimeout(function() {
        	closeWindow();	 
		}, 600);
		
	}
}

var _isAutoHide = false;

function startAutoHide() {
	_isAutoHide = true;
}

function hideAllPopup() {
	
	if (_isAutoHide) {
		_isAutoHide = false;
		//$("#emotions").hide();
		$("#sendOpt").hide();	
		
	}
}

var displayMaxImageWidth = 200;

function getThumbImageSize(fileInfo) {
	
	var maxWidth = displayMaxImageWidth;
	
	if (fileInfo.width < maxWidth) {
		return {
			width: fileInfo.width,
			height: fileInfo.height
		};
	}
	
	/**
	 * 按比例缩放高度 newHeight = oldHeight * (maxWidth/realWidth);
	 */
	return {
		width: maxWidth,
		height: maxWidth * fileInfo.height / fileInfo.width
	};
	
}

function buildAttachHtml(fileInfo) {
	
	if (fileInfo.type && fileInfo.type.indexOf("image") >= 0) {
	
		/**
		 * 显示的宽度不超过最大宽度
		 */
		var sizeObj = getThumbImageSize(fileInfo);
		
		fileInfo.showWidth = sizeObj.width;
		fileInfo.showHeight = sizeObj.height;
		
		fileInfo.bigCursor = sizeObj.width > displayMaxImageWidth ? "bigcur" : "";
		
	}
	
	if (fileInfo.url.indexOf("EFSPortal") >= 0 && fileInfo.efs_relative_url) {
	    fileInfo.url = window.parent.serviceUrl + "/EFSPortal" + fileInfo.efs_relative_url;
	}
	
	return TplTool($("#attachTemplate").html(), {
		key: "fileInfo"
	}).render(fileInfo);	
}

//========================显示信息start==========================
function contentShowConvert(content){
	content = content.replace(/\</g, "&lt;");	
	content = content.replace(/\>/g,"&gt;");
	content = content.replace(/\n/g,"<br>");	
	return content;
}

function scrollIntoViewLastMsg() {
	$chatContainer = $(chatContainerId);
	if ($chatContainer.length > 0) {
		$chatContainer[0].scrollTop = $chatContainer[0].scrollHeight;
	}
}

function displayMessage(style, name, body, timeStamp, msgId) {
	
	// 对消息内容格式进行转换，包括表情，字符等
	var html = Emotions.getInstance().contentConvert(body);

	var msg = {
		style: style,
		talker: name,
		talk_time: timeStamp,
		talk_html: html,
		msg_id: msgId
	};
	
	tplMsgs.append(msg);
	
	setTimeout(function() {
		scrollIntoViewLastMsg();
		TalkieTool.registerEvents();
	}, 0);	
	
}

function displaySendMessage(name, body, timeStamp, msgId) {
	
	displayMessage("talk_right", name, body, timeStamp, msgId);
	
}

function displayRecvMessage(name, body, timeStamp) {
	
	displayMessage("talk_left", name, body, timeStamp);

}

function displaySysMsg(body) {
	
	displayMessage("text", "系统", body, currentTime());
	
}
//========================显示信息end===========================


//========================表情start===========================
function initEmotions(){
	$emotionsDiv = $("#emotions");
	
	var emotionMap = Emotions.getInstance().emotionMap;
	var emotionHiddenMap = Emotions.getInstance().emotionHiddenMap;
	
	for(var emotionKey in emotionMap){
		
		if (emotionHiddenMap[emotionKey]) {
			continue;
		}
				
		var html = "<span class='emotion_select_top' onmouseover='emotion_over(this);' onmouseout='emotion_out(this);'>"
			+ "<img width='22px' height='22px' "
			+ "  onclick=\"emotion_select('[" + emotionKey + "]')\" " 
			+ " src=\"" + emotionMap[emotionKey] + "\" />"
			+ " </span>";
				
		$emotionsDiv.append(html);
		
	}
}

function emotion_over(anObj) {
	anObj.className = "emotion_over"
}

function emotion_out(anObj) {
	anObj.className = "emotion_select_top";
}

function emotion_select(emotionText) {
	var e = getEvent();
	var myField = $(textAreaId)[0];
	
	//在TextArea中的光标位置插入表情
	insertAtCursor(myField,emotionText);
	
	if (isShowSimple) {
		$("#emotions").hide();
	}
	
	if (!isShowSimple) {
		$(textAreaId).focus();
	}

}

function emotion_click() {
	$("#emotions").show().focus();
	_isAutoHide = false;
	
	setTimeout(function() {
		startAutoHide()
	}, 0);
}
		
		
//========================表情end===========================




//========================发送消息start===========================
function sendFormMsg() {
	
	if (!SAM.isConnected()) {
		displaySysMsg("尚未连接，无法发送消息。");
		return;
	}
	
	var text = $(textAreaId).val().trim();
	
	if (text == '') {
		displaySysMsg("消息不能为空");
		return false;
	} else if(text.length > MAX_BODY_LENGTH){
		displaySysMsg("发送消息内容超长，请分条发送。");
		return false;
	}
	
	try {
		$(textAreaId).val("");
		
		sendMsg(text);
				
		if (!isShowSimple) {
			$(textAreaId).focus();
		}
		
	} catch (e) {
		displaySysMsg("异常出错:" + e);
	} finally {
		return false;
	}
}

function sendMsg(body, fileInfo, sessionStop) {
	
	var msg = {
		to: currentChatNodeId,
		body: body
	}
	
	if (sessionStop) {
		msg.session_stop = true;
	}
	
	if (fileInfo) {
		msg.fileList = [fileInfo];
		if (fileInfo.type.indexOf("image") > 0) {
			msg.body = "[图片]";
		}
		else {
			msg.body = "[文件]";
		}
	}
	
	var msgId = SAM.sendMsg(msg, function(event) {
		
		/**
		 * msg_id
		 * server_id
		 * server_time
		 */
		 var s = "已发送";
		 $("#" + event.msg_id).text(s);
		 
		 setTimeout(function() {
		 		$("#" + event.msg_id).text(event.server_time);
		 	}, 300);
		
		}, function(event) {
			
			/**
			 * msg_id
			 */
			$("#" + event.msg_id).text("发送失败");
		
		}
	);
	
	var html = replaceTextToHref(body);
	html = html.replace(/\n/g,"<br>");
	
	if (fileInfo) {
		html = buildAttachHtml(fileInfo);
	}
	
	displaySendMessage("我", html, "发送中", msgId);
	
}

function sendOptMouseOver(anObj) {
	anObj.style.backgroundColor='#b4dcef'
	anObj.style.cursor = "pointer";
}

function sendOptMouseOut(anObj) {
	anObj.style.backgroundColor=''
}

function defaultSendOpt(e) {
	e = e || window.event;
	if ((e.ctrlKey && e.keyCode) || (e.shiftKey && e.keyCode == 13)) {
		$(textAreaId)[0].value += "\r\n";
		return false;
	}
	if (e.keyCode==13) {
		return sendFormMsg();
	}
}

function ctrlSendOpt(e) {
	e = e || window.event;
	// 在IE8下ctrl+enter组合后keyCode是10
	if ((e.ctrlKey && e.keyCode) || e.keyCode == 10) {
		return sendFormMsg();
	}
}


function changeSendOpt(option) {
	if (option == 'ctrl') {
		$(textAreaId).unbind("keypress").bind("keypress", ctrlSendOpt);
		document.getElementById("opt1").innerHTML = "";
		document.getElementById("opt2").innerHTML = "<font color=blue>√</font>";
	} else {
		$(textAreaId).unbind("keypress").bind("keypress", defaultSendOpt);
		document.getElementById("opt1").innerHTML = "<font color=blue>√</font>";
		document.getElementById("opt2").innerHTML = "";
	}
	sendOpt.style.display = "none";
	
	saveKeyOption(option);
}

function saveKeyOption(option) {
	if (window.localStorage) {
		window.localStorage["sendKeyOption"] = option;
	}	
}

function loadKeyOption() {
	$(textAreaId).unbind("keypress").bind("keypress", defaultSendOpt);

	if (window.localStorage) {
		var option = window.localStorage["sendKeyOption"];
		if (option) {
			changeSendOpt(option);
		}
	}
}

//========================发送消息end===========================


//========================输入框操作start===========================

function textArea_click() {
	hideAllPopup();
	$("#emotions").hide();
}

/**
 * 在TextArea中的光标位置插入内容的方法
 */
function insertAtCursor(myField, myValue) {

    if (document.selection) {
	    //IE support
	    if (!isShowSimple) {
        	myField.focus();
	    }
	    
        sel = document.selection.createRange();
        sel.text = myValue;
        sel.select();
    }
    else if (myField.selectionStart || myField.selectionStart == '0') {
	    //MOZILLA/NETSCAPE support
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;

        // save scrollTop before insert
        var restoreTop = myField.scrollTop;
        myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
        if (restoreTop > 0) {
            // restore previous scrollTop
            myField.scrollTop = restoreTop;
        }
        
        if (!isShowSimple) {
        	myField.focus();
        }
        
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
        
        if (!isShowSimple) {
        	myField.focus();
        }
    }

}
//========================输入框操作end===========================

var domainMap = {
	"qq": "QQ",
	"weixin": "微信",
	"webchat": "Web",
	"app": "APP"
}

function getDomainNick() {
	
}

var lastMsgId = null;

function dealOnAgentEvent(eventObject) {
	
	if (eventObject.eventType == "recv_msg") {
	    
		var msg = eventObject.msg;
		
		if (msg.from != currentChatNodeId) {
			/**
			 * 不是本窗口关心的，不必理会。
			 */
			return;
		}
		
		lastMsgId = msg.server_id;
		
		if (msg.nick_name) {
			updateChatTitle(msg.nick_name);
		}
		
		var html = "";
		
		var body = replaceTextToHref(msg.body);
		body = body.replace(/\n/g, "<br>");
		
		if (msg.fileList && msg.fileList.length > 0) {
			var htmlFile = "";
			for (var i=0; i<msg.fileList.length; i++) {
			    msg.fileList[i].body = msg.body;
				htmlFile += buildAttachHtml(msg.fileList[i]);
			}	
			
			if (htmlFile) {
				if (msg.withAttachMsg) {
					html = body + htmlFile;
				} 
				else {
					html = htmlFile;
				}
			}
			
		}
		else {
			html = body;
		}
		
		var fromNick = msg.nick_name ? msg.nick_name : domainMap[msg.domain] + ":未知用户";
		
		if (msg.inputingPreview) {
			
			if (msg.inputingPreview.stop) {
				// 这里可以显示停止输入的提示
				$("#inputingPreview").hide();	
			}
			else {
				$("#inputingPreview").show().text(msg.body ? "正在输入:" + msg.body : "正在输入...");
			}	
		}
		else {
			$("#inputingPreview").hide();
			
			displayRecvMessage(fromNick, html, msg.sendTime);
			showRecvNotifyMessage(fromNick, msg.body);
		}
		
	}
	
}


function dealOnSize() {
	
	_dealOnSize();
	
	setTimeout(_dealOnSize, 50);
	setTimeout(_dealOnSize, 100);
	setTimeout(_dealOnSize, 300);
	
}

function _dealOnSize() {
	
	// =========== use jdres style
		
		var allHeight = $(window).height() - 10;
		var editAreaHeight = $("div .im-edit-area").outerHeight();
		var topHeadHeight = $("div .im-header").outerHeight();
		
		var bigHeight = Math.floor(allHeight - topHeadHeight) - 22;
	
		$("div .im-main-content").css("height", Math.floor(allHeight - topHeadHeight) - 10 + "px");
		$("div .im-content").css("height", Math.floor(allHeight - topHeadHeight) + "px");
		
		$("div .im-wrap").css("height", allHeight + 10 + "px");
		
		$("div .im-right-sidebar").css("height", bigHeight + 10 + "px");
		
		var smallHeight = Math.floor(allHeight - topHeadHeight - editAreaHeight
			- $("#jdres_file-uploader-area").outerHeight()) - 11;
		$("div .im-chat-list").css("height", smallHeight + "px");
		
	// ------------------------------------------------------------
	
	if (isShowSimple) {
		$("#chatTop").hide();
		$("#chat_content").css("margin-top", "5px");
		$("#textareaDiv").css("margin-top", "3px");
		$("#textareaDiv").css("height", "27px");
		$(textAreaId).css("font-size", "18px");
		$("#saveChatMsgBtn").hide();
		$("#satisfyBillBtn").hide();
		$("#sendOptBtn").hide();
		$("#sendBtn span").css("height", "29px");
		$("#sendBtn span").css("line-height", "29px");
		$("#sendBtn span").css("min-width", "50px");
		$("#sendSmallDiv").css("margin-top", "3px");
		$("#sendDiv").css("height", "auto");
		$("#satisfyPopDiv").hide();
		$("#emotions").css("bottom", "64px");
	}

	// 窗口大小调整时，应当自动调整当前各个组件的大小。
	// 1. 先整高度
	
	var usedHeight = 0;
	if (!isShowSimple) {
		usedHeight += $("#chatTop").outerHeight();
	}
	else {
		usedHeight += 5;
	}
	
	usedHeight += $("#chatBottom").outerHeight();
	
	var adjustHeight = $(window).height() - usedHeight - 15;
		
	$("#chat_content").css("height", adjustHeight);
	
	// 2. 调整宽度。
	
	var usedWidth = 0;
	usedWidth += $("#sendSmallDiv").width();
	
	var adjustWidth = $(window).width() - usedWidth - 21;
	
	if (isShowSimple) {
		adjustWidth += 4;
	}

	if (textAreaId == "#jdres_msgArea") {
		$(textAreaId).css("width", "100%");
	}
	else {
		$(textAreaId).css("width", adjustWidth);
	}
	
}




//========================chtsvr end===========================

function showRecvNotifyMessage(title, content) {
	var opt = {
		  type: "basic",
		  title: title,
		  message: content,
		  iconUrl: "jdres/img/user1.png", // 头像信息
	};	
	 
    if (window.webkitNotifications) {
        if (window.webkitNotifications.checkPermission() == 0) {
            var popup = window.webkitNotifications.createNotification(opt.iconUrl, opt.title, opt.message);
            popup.ondisplay = function (event) {
                setTimeout(function () {
                    event.currentTarget.cancel();
                }, 5 * 1000);
            }
            
            popup.onclick = function() {
            	this.cancel();
            	window.focus();
            	window.parent.focus();
            }
            
            popup.show();
        } else {
            window.webkitNotifications.requestPermission();
            return;
        }
    } 
    else if (window.Notification && Notification.permission === "granted") {
    
       	var notify = new Notification(opt.title, {
       		"body": opt.message,
       		"icon": opt.iconUrl
       	}); 
       	
       	notify.onshow = function() {
       		setTimeout(function(){
              notify.close();
          	}, 5 * 1000);
       	};
       	
       	notify.onclick = function(event) {
		  event.preventDefault(); // prevent the browser from focusing the Notification's tab
		  window.focus();
		  window.parent.focus();
		  notify.close();
		}
         		
    }
}

function showStopInfo(info) {

	dealOnSize();	
}



