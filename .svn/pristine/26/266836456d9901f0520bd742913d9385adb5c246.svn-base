window.API = {
  host:"http://10.30.2.140:8089/"
}

//sessionStorage操作
window.setSession = function(key, value){
  window.sessionStorage.setItem(key, value);
}
window.getSession = function(key, defaultValue){
  var ret = defaultValue;
  if (window.sessionStorage.getItem(key) != undefined && window.sessionStorage.getItem(key) != null) {
    ret = window.sessionStorage.getItem(key);
  }
  return ret;
}
window.clearSession = function(key){
  if(window.sessionStorage.getItem(key)){
    window.sessionStorage.removeItem(key);
  }
}
//判断是不是json对象
window.isJson = function(str) {
  if (typeof str == 'string') {
    try {
      var obj=JSON.parse(str);
      if(typeof obj == 'object' && obj ){
        return true;
      }else{
        return false;
      }
    } catch(e) {
      console.log('error：'+str+'!!!'+e);
      return false;
    }
  }else{
    return false;
  }
}
//获取当前日期和前一年的日期，s代表分隔符，yP代表前一年时为-1
window.getNowFormatDate = (s,yP) => {
  var date = new Date();
  var seperator1 = "";
  if(s){seperator1=s}
  var year = date.getFullYear();
  if(yP){year=year+yP}
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
