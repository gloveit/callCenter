
/**
 * FileUpLoadTool 针对 FileUpload 组件的易用性封装。
 * @author James
 */

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var js = document.scripts;
var _fileIconRootUrl =js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/")+1);

function getFileExt(filename) {
	if(!filename){
		return "";
	}
	return ext = (-1 !== filename.indexOf('.')) ? filename.replace(/.*[.]/, '').toLowerCase() : '';
}

function getFileBigIconByFileName(filename) {
	return getFileIconByFileName(filename, true);
}

function getFileIconByFileName(filename, isBig){
	
	var fileExt = getFileExt(filename);
	
	var filename = "";
	
	if (fileExt == "doc" || fileExt == "docx") {
		filename = "doc.png";
	}
	else if (fileExt == "ppt" || fileExt == "ppts" || fileExt == "pptx" ) {
		filename = "ppt.png";
	}
	else if (fileExt == "csv" ) {
		filename = "csv.png";
	}
	else if (fileExt == "pdf" ) {
		filename = "pdf.png";
	}
	else if (fileExt == "xls" || fileExt == "xlsx" ) {
		filename = "xls.png";
	}
	else if (fileExt == "crx" ) {
		filename = "crx.png";
	}
	else if (fileExt == "ipa" ) {
		filename = "ipa.png";
	}
	else if (fileExt == "apk" ) {
		filename = "apk.png";
	}
	else if (fileExt == "zip" || fileExt == "rar" || fileExt == "gz" ) {
		filename = "rar.png";
	}	
	else if (fileExt == "mp3" || fileExt== "wmv" || fileExt == "wav" ) {
		filename = "mp3.png";
	}
	else if (fileExt == "mp4" || fileExt== "avi" || fileExt== "mov" ) {
		filename = "video.png";
	}
	else if (fileExt == "txt" || fileExt == "log" ) {
		filename = "txt.png";
	}
	else if (fileExt == "jpg" || fileExt == "jpeg" || fileExt == "png" || fileExt == "bmp" || fileExt == "gif" || fileExt == "ico") {
		filename = "photo.png";
	}
	else {
		filename = "unknow.png";
	}
	
	if (isBig) {
		filename = "big_" + filename;
	}
	
	return _fileIconRootUrl + "../images/files/" + filename;
}

function isImgByFileName(fileName){
	var fileExt = getFileExt(fileName);
	if (fileExt == "jpg" || fileExt == "jpeg" || fileExt == "png" || fileExt == "bmp" || fileExt == "gif" || fileExt == "ico") {
		return true;
	}
	return false;
}

function convertSize(size){
	var s = size / 1024 / 1024 / 1024 ;
	if(s >= 1){
		return changeTwoDecimal_f(s) + " GB";
	}else if(size / 1024 / 1024 >= 1){		
		return changeTwoDecimal_f(size / 1024 / 1024) + " MB";
	}else if(size / 1024 >= 1){
		return changeTwoDecimal_f(size / 1024) + " KB";
	}else{
		return size + " B";
	} 
}

function changeTwoDecimal_f(x){
	var f_x = parseFloat(x); 
	if (isNaN(f_x)) 
	{ 
		return false; 
	} 
	var f_x = Math.round(x*100)/100; 
	var s_x = f_x.toString(); 
	var pos_decimal = s_x.indexOf('.'); 
	if (pos_decimal < 0) 
	{ 
		pos_decimal = s_x.length; 
		s_x += '.'; 
	} 
	while (s_x.length <= pos_decimal + 2) 
	{ 
		s_x += '0'; 
	} 
	return s_x; 
}

var FileUploadTool = {};

FileUploadTool.CONTENT_EMPTY_SHOW = "内容为空";

//单个文件发送区域高度
FileUploadTool.SINGLE_FILE_SENDING_ARER_HEIGHT = 50;
FileUploadTool.global_attach_img_container_width = 75;
FileUploadTool.global_attach_img_container_height = 75;
FileUploadTool.margin_height = 2;
FileUploadTool.margin_width = 2;
FileUploadTool.SINGLE_COMMENT_MAX_ATTACH = 100;
FileUploadTool.SINGLE_BILL_MAX_ATTACHES_NUM = 300;
FileUploadTool.attach_max_size_limit = 1024 * 1024 * 10;
FileUploadTool.global_bill_owner_user_id ;

FileUploadTool.MAX_FOLLOWED_SHOW = 9;

FileUploadTool.createFileUploader = function(url, fileUploadDisplayAreaId, successCallBack) {  
 
    FileUploadTool.fileUpLoader = new qq.FileUploader({
        element: document.getElementById("file-uploader-button-area"),
        listElement: $(fileUploadDisplayAreaId)[0],
        debug: false,
        sizeLimit : FileUploadTool.attach_max_size_limit,
        
        action: url,
        onCompleteDelay : true,
        onSubmit: function(id, fileName, file) {
        	
        	log.debug("onSubmit, id:" + id + ", fileName:" + fileName);
           	var count = FileUploadTool.fileUpLoader.getInProgress() + 1;

            $(fileUploadDisplayAreaId).show();
            $(fileUploadDisplayAreaId).height(count * FileUploadTool.SINGLE_FILE_SENDING_ARER_HEIGHT);

			dealOnSize();
            
        	return true;
        },
        
        onCancel: function(id, fileName){
        	
        },
        
        onCancelCallback : function() {
        	
        	FileUploadTool.recalculateBillFileUploadAreaHeight();
        	dealOnSize();
        	
        },
        
        // 上传结束。可能成功或失败，需要专门进行判断。 
        onComplete: function(id, file, responseJSON) {
        	
        	// NOTE: responseJSON 符合以下格式。http://zhidao.baidu.com/question/539803196.html
        	// @responseJSON {success: true/false, xhr_status: 200, xhr_responseText: xxxxx }
        	
        	if (responseJSON.success) {  
        		successCallBack(responseJSON.attach);
        	} 
        	else {
        		
        		FileUploadTool.showUploadAttachFail(responseJSON);
        	}
        	
        }
    });           
    
}

FileUploadTool.showUploadAttachFail = function(responseJSON){
	
	 if (responseJSON.error_code == 40105){
     	displaySysMsg("无上传权限。错误码：" + responseJSON.error_code);
     } 
     else
	 if (responseJSON.error_code == 40036){
     	displaySysMsg("单个" + BillUIMgr.showUIByBillType(window.globalBillType) + "附件数量已超出最大限制 " + FileUploadTool.SINGLE_BILL_MAX_ATTACHES_NUM + " 个");
     } 
     else
	 if (responseJSON.error_code == 40034){
     	displaySysMsg("附件过大，不支持上传。错误码：" + responseJSON.error_code);
     } 
     else if(responseJSON.error_code == 40108 || responseJSON.error_code == 40033) {
     	displaySysMsg("附件超出总容量限制，请联系管理员扩容。 ");
     }
     else{
     	displaySysMsg("附件上传失败。" + (responseJSON.error_message == null ? "" : "错误信息:" + responseJSON.error_message) );
     }
}


FileUploadTool.recalculateBillFileUploadAreaHeight = function(){

	$(fileUploadDisplayAreaId).height(FileUploadTool.fileUpLoader.getInProgress() * FileUploadTool.SINGLE_FILE_SENDING_ARER_HEIGHT);	
	
	dealOnSize();
}


