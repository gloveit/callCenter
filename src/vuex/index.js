import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
function isJson(str) {
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
const state = {
  //标签列表
  tabViews:window.getSession('tabViews') && isJson(window.getSession('tabViews'))?JSON.parse(window.getSession('tabViews')):[],
  //左侧二级菜单激活标题
  menu2Active:window.getSession('menu2Active')?window.getSession('menu2Active'):-1,
  //tabView激活标题
  tabViewActive:window.getSession('tabViewActive')?window.getSession('tabViewActive'):-1,
  homeAuth:false,
  //左侧菜单列表
  menuList:window.getSession('menuList') && isJson(window.getSession('menuList'))?JSON.parse(window.getSession('menuList')):[],
  //路由权限列表
  authList: window.getSession('authList') && isJson(window.getSession('authList'))?JSON.parse(window.getSession('authList')): {
    index: true,
    login: true,
    home: true,
    callRecords: false,
  },
  //坐席信息
  agentInfo:window.getSession('agentInfo') && isJson(window.getSession('agentInfo'))?JSON.parse(window.getSession('agentInfo')):{},
  agentButton:window.getSession('agentButton') && isJson(window.getSession('agentButton'))?JSON.parse(window.getSession('agentButton')):{callPhone:true,callAgent:true,invitePhone:true,inviteAgent:true,transferAgent:true},
  keepComs:["workOrder1","weChat","knowledgeBase","workOrder_k"],
  //呼叫
  callShow:false,
  phone:{
    title:"正在呼出",num:""
  },
  //电话工单是否可关闭
  callOrder:false,
  //微信聊天开关
  weChatOn:false,
  //存放微信右侧工单信息数据
  usersInfo:{},
  //微信聊天右侧工单信息激活标记
  chatIdAc:"default",
  //互联网聊天红点标记
  chatAlarm:false,
  //来电时挂断1，通话时挂断2，呼叫时挂断3,
  callOffIf:2,
  goRoute:()=>{},
  //关闭标签的方法
  closeTab:()=>{},
  //客户信息请求参数
  userInter:{
    TJ:"",
    YHLY:1,
    TJLX:4,
  },
  //工单信息保存数据
  gdData:{
    SJH:"",
    GDNR:"",
  },
  //工单信息来源
  //0:其它 1:电话 2:微信 3:APP 4:WEB
  gdSource:0,
  //部门列表
  departList:window.sessionStorage.getItem('departList') && isJson(window.sessionStorage.getItem('departList'))?JSON.parse(window.sessionStorage.getItem('departList')):[],
  //部门id
  departmentId:'',
  // 知识库文章id
  articleId:"",
  // 知识库文章类型id
  articleStatus:{
    kindid:"",
    istop:""
  },
  //知识库显示页面
  knowledgePage:0,
  // 文章添加成功状态 0失败 1成功
  addarticleStatus:0,
  //管理站列表
  glzList:[
    "建设路站",
    "大营盘站",
    "新建路站",
    "迎新街站",
    "河西站",
    "迎新街站",
    "和平北站",
    "工营事团",
    "管线所",
  ],
}
const mutations = {
  changeTabViews(state,n){
    state.tabViews = n;
  },
  cmenu2Active(state,n){
    state.menu2Active = n;
  },
  ctabViewActive(state,n){
    state.tabViewActive = n;
  },
  ccallShow(state,n){
    state.callShow = n;
  },
  chomeAuth(state,n){
    state.homeAuth = n;
  },
  getDepartList (state,n){
    state.departList = n;
    window.sessionStorage.setItem('departList',JSON.stringify(n));
  },
  getDepartmentId (state,n) {
    state.departmentId = n
  },
  getArticleId (state,n){
    state.articleId = n
  },
  getArticleStatus (state,n){
    state.articleStatus.kindid = n.kindid;
    state.articleStatus.istop = n.istop;
  },
  getStatus (state,n) {
    state.knowledgePage = n
  },
  getaddarticleStatus(state,n){
    state.addarticleStatus = n
  },
  cusersInfo(state,n){
    state.usersInfo = n;
  },
  cchatAlarm(state,n){
    state.chatAlarm = n;
  },
  //修改电话呼入/呼出的标题和号码
  cphone(state,obj){
    state.phone = obj;
  },
  ckeepComs(state,coms){
    state.keepComs = coms;
  },
}

const store = new Vuex.Store({
  state,
  mutations,
});

export default store
