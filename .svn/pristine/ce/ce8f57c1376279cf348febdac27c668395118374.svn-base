/**
 * 通用的js方法
 * @author Clark
 */


/**
 * 获取浏览器事件
 * 同时兼容ie和ff的写法
 * @return {TypeName} 
 */
function getEvent() {
	if (document.all) {
		return window.event;
	}
	func = getEvent.caller;            
	while (func != null) {    
		var arg0 = func.arguments[0];
		if (arg0) {
			if ((arg0.constructor == Event || arg0.constructor ==MouseEvent)
					|| (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)) {    
				return arg0;
			}
		}
		func=func.caller;
	}
	return null;
}

// div层拖动
var x = 0, y = 0, x1 = 0, y1 = 0, index = 10000; 
var moveable = false;

// 开始拖动   
function startDrag(obj, evt) {
    e = evt ? evt : window.event;
    if (true) {
        if (!window.captureEvents) {
            obj.setCapture();
        } else {
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }
        // 取得父窗体
        var win = obj.parentNode;
        // 设置父窗体的Z轴值
        win.style.zIndex = ++index;
        // 取得当前鼠标的X坐标
        x = e.clientX;
        // 取得当前鼠标的Y坐标
        y = e.clientY;
        // 将父窗体的距浏览器左边界的距离转换为NUMBER
        x1 = parseInt(win.style.left);
        // 将父窗体的距浏览器上边界的距离转换为NUMBE
        y1 = parseInt(win.style.top);
        moveable = true;
    }
}
function drag(obj, evt) {
    e = evt ? evt : window.event;
    if (moveable) {
    	// 取得父节点 
        var win = obj.parentNode;
        win.style.left = (x1 + e.clientX - x) + 'px';
        win.style.top = (y1 + e.clientY - y) + 'px';
    }
}
// 停止拖动
function stopDrag(obj) {
    if (moveable) {
        if (!window.captureEvents) {
            obj.releaseCapture();
        } else {
            window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }
        moveable = false;
    }
}

// 获取当前的时间，时分秒格式
function currentTime() {
	var now = new Date();
	var mtime = (now.getHours() < 10) ? "0" + now.getHours() : now.getHours();
	mtime += ":";
	mtime += (now.getMinutes() < 10) ? "0" + now.getMinutes() : now.getMinutes();
	mtime += ":";
	mtime += (now.getSeconds() < 10) ? "0" + now.getSeconds() : now.getSeconds();
	return mtime;
}

function createXMLHttpRequest() {
	try {
		return new ActiveXObject('Msxml2.XMLHTTP');
	} catch(e) {}
	try {
		return new ActiveXObject('Microsoft.XMLHTTP');
	} catch(e) {}
	try {
		return new XMLHttpRequest();
	} catch(e) {}
	
	return null;
}

/*判断是否IE浏览器*/
function isIE() {
	return navigator.appVersion.indexOf("MSIE") >= 0;
}

/**
  * 提取URL中的参数
  */
function getURLArgs() {
	//加上substring的意义是去掉查询字符串中的？号。
	//var query = window.location.search.substring(1);
   
	//定义一个数组，用于存放取出来的字符串参数。
	var argsArr = new Object();
   
   	//获取URL中的查询字符串参数
   	var query = window.location.search;
   	query = query.substring(1);
   
   	//这里的pairs是一个字符串数组
   	var pairs = query.split("&");//name=myname&password=1234&sex=male&address=nanjing
   
   	for (var i=0; i<pairs.length; i++) {
		var sign = pairs[i].indexOf("="); 
		//如果没有找到=号，那么就跳过，跳到下一个字符串（下一个循环）。
		if(sign == -1) {
			continue; 
		}
		
		var aKey = pairs[i].substring(0, sign);
		var aValue = pairs[i].substring(sign + 1);     
		argsArr[aKey] = aValue;
	}

	return argsArr;
}

// 加载xml文档
function loadXML(xmlText) {
	var xmlDoc;
	try {
		xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
		xmlDoc.async = false;
		xmlDoc.loadXML(xmlText);
	} catch(e) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(xmlText, 'text/xml');
	}
	return xmlDoc;
}

//计算时间差
 function timeLag(time1, time2){
   var arr2=time2.split(":");
   var arr1=time1.split(":");
   var arr3=new Array();
   arr3[0] = parseInt(arr2[0])- parseInt(arr1[0]);
   arr3[1] = parseInt(arr2[1])- parseInt(arr1[1]);
   if(arr3[1] < 0){
	   arr3[0] = arr3[0] - 1;
	   arr3[1] = arr3[1] + 60;
   }
   
   arr3[2]= parseInt(arr2[2])- parseInt(arr1[2]);
   if(arr3[2] < 0){
	   arr3[1] = arr3[1] - 1;
	   arr3[2] = arr3[2] + 60;
   }
   
   arr3[0] = (arr3[0] < 10) ? "0"+arr3[0] : arr3[0];
   arr3[1] = (arr3[1] < 10) ? "0"+arr3[1] : arr3[1];
   arr3[2] = (arr3[2] < 10) ? "0"+arr3[2] : arr3[2];
      
   return arr3[0]+":"+arr3[1]+":"+arr3[2];
  }

function getArgs(){
  passedArgs=new Array();
  search = self.location.href;
  search = search.split('?');
  if(search.length>1){
    argList = search[1];
    argList = argList.split('&');
    for(var i=0; i<argList.length; i++){
      newArg = argList[i];
      newArg = argList[i].split('=');
      passedArgs[unescape(newArg[0])] = unescape(newArg[1]);
    }
  }
}

function cutResource(aJID) { // removes resource from a given jid
  if (typeof(aJID) == 'undefined' || !aJID)
    return;
  var retval = aJID;
  if (retval.indexOf("/") != -1)
    retval = retval.substring(0,retval.indexOf("/"));
  return retval;
}

function msgEscape(msg) {
  if (typeof(msg) == 'undefined' || !msg || msg == '')
    return;

  msg = msg.replace(/%/g,"%25"); // must be done first

  msg = msg.replace(/\n/g,"%0A");
  msg = msg.replace(/\r/g,"%0D");
  msg = msg.replace(/ /g,"%20");
  msg = msg.replace(/\"/g,"%22");
  msg = msg.replace(/#/g,"%23");
  msg = msg.replace(/\$/g,"%24");
  msg = msg.replace(/&/g,"%26");
  msg = msg.replace(/\(/g,"%28");
  msg = msg.replace(/\)/g,"%29");
  msg = msg.replace(/\+/g,"%2B");
  msg = msg.replace(/,/g,"%2C");
  msg = msg.replace(/\//g,"%2F");
  msg = msg.replace(/\:/g,"%3A");
  msg = msg.replace(/\;/g,"%3B");
  msg = msg.replace(/</g,"%3C");
  msg = msg.replace(/=/g,"%3D");
  msg = msg.replace(/>/g,"%3E");
  msg = msg.replace(/@/g,"%40");

  return msg;
}

// fucking IE is too stupid for window names
function makeWindowName(wName) {
  wName = wName.replace(/@/,"at");
  wName = wName.replace(/\./g,"dot");
  wName = wName.replace(/\//g,"slash");
  wName = wName.replace(/&/g,"amp");
  wName = wName.replace(/\'/g,"tick");
  wName = wName.replace(/=/g,"equals");
  wName = wName.replace(/#/g,"pound");
  wName = wName.replace(/:/g,"colon");	
  wName = wName.replace(/%/g,"percent");
  wName = wName.replace(/-/g,"dash");
  wName = wName.replace(/ /g,"blank");
  wName = wName.replace(/\*/g,"asterix");
  return wName;
}

function htmlEnc(str) {
  if (!str)
    return '';

  str = str.replace(/&/g,"&amp;");
  str = str.replace(/</g,"&lt;");
  str = str.replace(/>/g,"&gt;");
  str = str.replace(/\"/g,"&quot;");
  str = str.replace(/\r\n/gi,"<br/>");
  str = str.replace(/\n/gi,"<br/>"); 
  str = str.replace(/\s/gi,"&nbsp;");

  return str;
}

function msgFormat(msg) { // replaces emoticons and urls in a message
  if (!msg)
    return null;

  // commeted by Clark
  //msg = htmlEnc(msg);

  msg = Emotions.getInstance().contentConvert(msg);
  
  // replace http://<url>
  msg = msg.replace(/(\s|^)(https?:\/\/\S+)/gi,"$1<a href=\"$2\" target=\"_blank\">$2</a>");
  
  // replace ftp://<url>
  msg = msg.replace(/(\s|^)(ftp:\/\/\S+)/gi,"$1<a href=\"$2\" target=\"_blank\">$2</a>");
  
  // replace mail-links
  msg = msg.replace(/(\s|^)(\w+\@\S+\.\S+)/g,"$1<a href=\"mailto:$2\">$2</a>");
  
  // replace *<pattern>*
  msg = msg.replace(/(\s|^)\*([^\*\r\n]+)\*/g,"$1<b>\$2\</b>");
  
  // replace _bla_ 
  msg = msg.replace(/(\s|^)\_([^\*\r\n]+)\_/g,"$1<u>$2</u>");

  msg = msg.replace(/\n/g,"<br>");
  
  return msg;
}

/* isValidJID
 * checks whether jid is valid
 */
var prohibited = ['"',' ','&','\'','/',':','<','>','@']; // invalid chars
function isValidJID(jid) {
  var nodeprep = jid.substring(0,jid.lastIndexOf('@')); // node name (string before the @)

  for (var i=0; i<prohibited.length; i++) {
    if (nodeprep.indexOf(prohibited[i]) != -1) {
      alert("Invalid JID\n'"+prohibited[i]+"' not allowed in JID.\nChoose another one!");
      return false;
    }
  }
  return true;
}

/* jab2date
 * converts from jabber timestamps to javascript date objects
 */
function jab2date(ts) {
  var date = new Date(Date.UTC(ts.substr(0,4),ts.substr(5,2)-1,ts.substr(8,2),ts.substr(11,2),ts.substr(14,2),ts.substr(17,2)));
  if (ts.substr(ts.length-6,1) != 'Z') { // there's an offset
    var offset = new Date();
    offset.setTime(0);
    offset.setUTCHours(ts.substr(ts.length-5,2));
    offset.setUTCMinutes(ts.substr(ts.length-2,2));
    if (ts.substr(ts.length-6,1) == '+')
      date.setTime(date.getTime() - offset.getTime());
		else if (ts.substr(ts.length-6,1) == '-')
		  date.setTime(date.getTime() + offset.getTime());
  }
  return date;
}

/* hrTime - human readable Time
 * takes a timestamp in the form of 2004-08-13T12:07:04±02:00 as argument
 * and converts it to some sort of humane readable format
 */
function hrTime(ts) {
  return jab2date(ts).toLocaleString();
}

/* jabberDate
 * somewhat opposit to hrTime (see above)
 * expects a javascript Date object as parameter and returns a jabber 
 * date string conforming to JEP-0082
 */
function jabberDate(date) {
  if (!date.getUTCFullYear)
    return;
  
  var jDate = date.getUTCFullYear() + "-";
  jDate += (((date.getUTCMonth()+1) < 10)? "0" : "") + (date.getUTCMonth()+1) + "-";
  jDate += ((date.getUTCDate() < 10)? "0" : "") + date.getUTCDate() + "T";
  
  jDate += ((date.getUTCHours()<10)? "0" : "") + date.getUTCHours() + ":";
  jDate += ((date.getUTCMinutes()<10)? "0" : "") + date.getUTCMinutes() + ":";
  jDate += ((date.getUTCSeconds()<10)? "0" : "") + date.getUTCSeconds() + "Z";
  
  return jDate;
}

/**
 * 以下内容摘录自 ucmweb 的 commonUtil.js 文件。
 */ 
 
/**
 * 工具类，采用二步方式来识别和替换 文本中链接的那些内容。
 * 
 * 将文本中的类似http:// https://的超链接文本替换成类似<a href="http*">*</a>的超链接
 * @param str
 * @returns
 * 
 * NOTE: 该函数会对文本进行转义，因此必须确保输入时，没有真正的html的内容。
 *  
 * 1. 输入：文本格式，例如：good  http://www.a.com?a=b&c=d good <br/> <b> good </b> You&Me    dd
 * 2. 输出：html 格式，即所有不适用的字符均被自动转义 
 */
function HttpLinkGenerator() {
	// do nothing.	
}

/**
 * 生成一个link转换的 packet 对象。
 * 可以在相关工作完成后再来调用 HttpLinkGenerator.endText2Link 方法
 */
HttpLinkGenerator.beginText2Link = function(str) {
	
	/**
	 * 存放被取代出来的链接数据
	 */
	var dict = new Array();
	
	/**
	 * 这个是随机串
	 */
	var splitter = "_abcde01234988723734072723" + Math.random();
	
	var re = /((http:\/\/)|(https:\/\/)|(www)){1}([^\^\*\\\{\}\[\]<>'"\'\"\r\n\s])*/gim;
		
	str = str.replace(re, function(hitItem) {
		var href = hitItem;
		
		if(!!hitItem & hitItem.indexOf("http") == -1) {
			href = "http://" + hitItem;
		}
		
		href = "<a target='_blank' style='color:#0082CB' href='" + href + "'>" + hitItem + "</a>";
		
		// 暂存起来，回头再替换
		dict.push(href);
		
		// 返回一个统一的替代符号
		return splitter;
	});
	
	/**
	 * 把这些原本的非链接的内容先替换掉
	 */
	str = html2TextWithoutCRLN(str);
	
	var packet = {
		result: str, // 替换后的文本内容
		splitter: splitter, // 分割器
		dict: dict // 真正链接的map数据
	}
	
	return packet;
	
}

/**
 * 第二步，将原先做了标记为link的，替换为真正的link。
 */
HttpLinkGenerator.endText2Link = function(str, packet) {
	/**
	 * 然后把刚才拼好的链接整回来
	 */
	
	var index = 0;
	
	var splitReg = new RegExp(packet.splitter, "gm");
	
	return str.replace(splitReg, function(hitItem) {
		
		var text = packet.dict[index];
		
		index++;
		
		return text;
				
	});
}

/**
 *  
 * 将文字中包含 www.xxx.xx 或者 http://xxx的识别为链接。
 * NOTE: 由于该函数会受后续的主题识别等干扰，因此要慎用。
 *  * NOTE: 该函数会对文本进行转义，因此必须确保输入时，没有真正的html的内容。
 *  
 * 1. 输入：文本格式，例如：good  http://www.a.com?a=b&c=d good <br/> <b> good </b> You&Me    dd
 * 2. 输出：html 格式，即所有不适用的字符均被自动转义 
 * 
 */
function replaceTextToHref(str) {
	
	var packet = HttpLinkGenerator.beginText2Link(str);
	
	return HttpLinkGenerator.endText2Link(packet.result, packet);
}

/**
 * 这个函数和 html2Text 是一样的，但是 T 是小写。
 */
function html2text(str) {
	return html2Text(str);
}

//将HTML内容转化为文本 
function html2Text(str)
{
 str = !!!str ? "" : str;
 str = html2TextWithoutCRLN(str);
 str = html2TextOnlyCRLN(str);
 return str;
}

//将HTML内容转化为文本，处理\n为空串
function html2TextWithinCRLN(str)
{
 str = html2TextWithoutCRLN(str);
 str = str.replace(/\n/g,"&nbsp;");
 return str;
}

//将HTML内容转化为文本（不处理\n） 
function html2TextWithoutCRLN(str)
{
 str = str.replace(/&/g, "&amp;");
 str = str.replace(/</g, "&lt;");
 str = str.replace(/>/g, "&gt;");
 str = str.replace(/ /g, "&nbsp;");
 str = str.replace(/'/g, "&apos;");
 str = str.replace(/"/g, "&quot;");
 return str;
}

function unHtml2TextWithoutCRLNSimple(str) {
 str = str.replace(/&amp;/g, "&");
 str = str.replace(/&lt;/g, "<");
 str = str.replace(/&gt;/g, ">");
 str = str.replace(/&nbsp;/g, " ");
 str = str.replace(/&quot;/g, "\"");
 str = str.replace(/&apos;/g, "\'");
 return str;	
}

//将HTML内容转化为文本（保留\n） ,将\n替换为br
function html2TextOnlyCRLN(str)
{
 str = str.replace(/\n/g,"<br>");
 return str;
}
 