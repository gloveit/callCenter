export default {
  install(Vue)  {
    Vue.prototype.printH = function(title,callback){
      if(title && typeof title == "string"){
        let oldTitle = $("head title").html()
        $("head title").html(title)
        $(".conAll").hide();
        $(".all").hide();
        $(".c").hide();
        $(".box .head").hide();
        $(".fenye").hide();
        $(".contentAll>.box").addClass("printCss")
        window.print();
        $(".conAll").show();
        $(".all").show();
        $(".c").show();
        $(".box .head").show();
        $(".fenye").show();
        $("head title").html(oldTitle)
        $(".contentAll>.box").removeClass("printCss")
      }
      // if(callback && typeof callback == "function"){
      //   callback();
      // }
    }
  }
}
