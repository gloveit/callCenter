/**
 * <p>Copyright: Copyright (c) 2011</p>
 * <p>Company: 杭州青芝网络有限公司</p>
 * <p>Hangzhou Qingzhi Technologies Inc. 
 * 	– Confidential and Proprietary</p>
 * 
 *  Emotions 管理器类。
 * 
 */

var emotions = null;

var js = document.scripts;
var _emotionsPath =js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/")+1);

function Emotions(){
	this.emotionMap = new Object();
	this.emotionHiddenMap = new Object();
}

/**
 * 表情初始化
 */
Emotions.prototype.initEmotions = function(){
	
	var rootPath = _emotionsPath + "../images";
	
	// NOTE: 带.png扩展名，是为了能让部分动态表情
	// 可以有不同的扩展名，比如 .gif。
	this.emotionMap["微笑"] = rootPath + "/emotions/gif/wei_xiao.gif";
	this.emotionMap["呲牙"] = rootPath + "/emotions/gif/ci_ya.gif";
	this.emotionMap["哈哈"] = rootPath + "/emotions/gif/ha_ha.gif";
	
	this.emotionMap["偷笑"] = rootPath + "/emotions/gif/tou_xiao.gif";
	this.emotionMap["可爱"] = rootPath + "/emotions/gif/ke_ai.gif";
	this.emotionMap["害羞"] = rootPath + "/emotions/gif/hai_xiu.gif";
	this.emotionMap["挤眼"] = rootPath + "/emotions/gif/ji_yan.gif";
	this.emotionMap["太开心"] = rootPath + "/emotions/gif/tai_kai_xin.gif";
	this.emotionMap["鼓掌"] = rootPath + "/emotions/gif/gu_zhang.gif";
	this.emotionMap["示爱"] = rootPath + "/emotions/gif/shi_ai.gif";
	this.emotionMap["酷"] = rootPath + "/emotions/gif/ku.gif";
	this.emotionMap["嘘"] = rootPath + "/emotions/gif/xu.gif";
	this.emotionMap["钱"] = rootPath + "/emotions/gif/qian.gif";
	
	this.emotionMap["惊讶"] = rootPath + "/emotions/gif/jing_ya.gif";
	this.emotionMap["难过"] = rootPath + "/emotions/gif/nan_guo.gif";
	this.emotionMap["冷汗"] = rootPath + "/emotions/gif/leng_han.gif";
	this.emotionMap["抓狂"] = rootPath + "/emotions/gif/zhua_kuang.gif";
	this.emotionMap["吐"] 	= rootPath + "/emotions/gif/tu.gif";
	this.emotionMap["傲慢"] = rootPath + "/emotions/gif/ao_man.gif";
	this.emotionMap["撇嘴"] = rootPath + "/emotions/gif/pie_zui.gif";
	this.emotionMap["色"] 	= rootPath + "/emotions/gif/se.gif";
	this.emotionMap["发呆"] = rootPath + "/emotions/gif/fa_dai.gif";
	this.emotionMap["哈欠"] = rootPath + "/emotions/gif/ha_qian.gif";
	this.emotionMap["困"] 	= rootPath + "/emotions/gif/kun.gif";
	this.emotionMap["疑问"] = rootPath + "/emotions/gif/yi_wen.gif";
	this.emotionMap["快哭了"] = rootPath + "/emotions/gif/kuai_ku_le.gif";
	this.emotionMap["流泪"] = rootPath + "/emotions/gif/liu_lei.gif";
	this.emotionMap["衰"] 	= rootPath + "/emotions/gif/shuai.gif";
	this.emotionMap["鄙视"] = rootPath + "/emotions/gif/bi_shi.gif";
	
	// 以下是比手机端更多一些的几个表情
	this.emotionMap["思考"] = rootPath + "/emotions/gif/si_kao.gif";
	this.emotionMap["委屈"] = rootPath + "/emotions/gif/wei_qu.gif";
	this.emotionMap["嘴馋"] = rootPath + "/emotions/gif/zui_chan.gif";
	this.emotionMap["再见"] = rootPath + "/emotions/gif/zai_jian.gif";
	
	// ----
	this.emotionMap["强"] 	= rootPath + "/emotions/gif/qiang.gif";
	this.emotionMap["胜利"] = rootPath + "/emotions/gif/sheng_li.gif";
	this.emotionMap["握手"] = rootPath + "/emotions/gif/wo_shou.gif";
	this.emotionMap["OK"] 	= rootPath + "/emotions/gif/OK.gif";
	this.emotionMap["V5"] = rootPath + "/emotions/gif/V5.gif";
	this.emotionMap["给力"] = rootPath + "/emotions/gif/gei_li.gif";
	this.emotionMap["心"] = rootPath + "/emotions/gif/xin.gif";
	// --- 
	
	this.emotionMap["围观"] = rootPath + "/emotions/gif/wei_guan.gif";
	this.emotionMap["神马"] = rootPath + "/emotions/gif/sheng_ma.gif";
	this.emotionMap["浮云"] = rootPath + "/emotions/gif/fu_yun.gif";
	this.emotionMap["猪头"] = rootPath + "/emotions/gif/zhu_tou.gif";
	this.emotionMap["囧"] = rootPath + "/emotions/gif/jiong.gif";
	this.emotionMap["蜡烛"] = rootPath + "/emotions/gif/la_zhu.gif";
	this.emotionMap["蛋糕"] = rootPath + "/emotions/gif/dan_gao.gif";
	this.emotionMap["礼物"] = rootPath + "/emotions/gif/li_wu.gif";
	
	this.emotionMap["调皮"] = rootPath + "/emotions/f002.png";
	this.emotionMap["睡"] 	= rootPath + "/emotions/f019.png";
	
	// 以下表情不提供选择，仅供显示。
	this.emotionMap["龇牙"] = rootPath + "/emotions/gif/zi_ya.gif";
	this.emotionMap["折磨"] = rootPath + "/emotions/f032.png";
	this.emotionMap["惊恐"] = rootPath + "/emotions/f024.png";
	this.emotionMap["骷髅"] = rootPath + "/emotions/f031.png";
	this.emotionMap["擦汗"] = rootPath + "/emotions/f017.png";
	
	this.emotionHiddenMap["龇牙"] = 1;
	this.emotionHiddenMap["折磨"] = 1;
	this.emotionHiddenMap["惊恐"] = 1;
	this.emotionHiddenMap["骷髅"] = 1;
	this.emotionHiddenMap["擦汗"] = 1;

}

/**
 * 文字表情转换
 */
Emotions.prototype.contentConvert = function(content){

	for(var emotionTitle in this.emotionMap){
		var key = "\\[" + emotionTitle + "\\]";
		content = content.replace(new RegExp(key,"gm"),
			this.getImgTag(emotionTitle, this.emotionMap[emotionTitle]));
	}
	return content; 
}

/**
 * 获取对应的Img对象标签
 */
Emotions.prototype.getImgTag = function(emotionTitle, imgFilename) {
	return "<img src='" + imgFilename + "' "
		+ " title='" + emotionTitle + "'"
		+ " />"; 
}

/**1
 * 取得单例对象
 */
Emotions.getInstance = function(){
	if(!emotions){
		emotions = new Emotions();
		emotions.initEmotions();
	}
	return emotions;
}

