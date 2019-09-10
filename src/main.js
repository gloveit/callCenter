import Vue from 'vue'
let VueApp = null;
import App from './App'
import router from './router'
import '@/assets/js/win.js'
import basejs from '@/assets/js/base.js'
Vue.use(basejs)
import '@/assets/css/style.css'
// import vuescroll from 'vuescroll/dist/vuescroll-native';
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
Vue.use(vuescroll);
import store from './vuex'
Vue.config.productionTip = false;

import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
Vue.use(VueQuillEditor)

//iview引用
// import {Input as InputI} from "iview"
// import {Button as ButtonI} from "iview"
// import {Table as TableI} from "iview"
// import {Page as PageI} from "iview"
// import {Modal as ModalI} from "iview"
// import {Form as FormI} from "iview"
// import {FormItem as FormItemI} from "iview"
// import {Message as MessageI} from "iview"
// import {Collapse as CollapseI} from "iview"
// import {Panel as PanelI} from "iview"
// import {Tree as TreeI} from "iview"
// import {Icon as IconI} from "iview"
// import {Select as SelectI} from "iview"
// import {Option as OptionI} from "iview"
// Vue.component('Input', InputI);
// Vue.component('Button', ButtonI);
// Vue.component('Table', TableI);
// Vue.component('Page', PageI);
// Vue.component('Modal', ModalI);
// Vue.component('Form', FormI);
// Vue.component('FormItem', FormItemI);
// Vue.component('Message', MessageI);
// Vue.component('Collapse', CollapseI)
// Vue.component('Panel', PanelI)
// Vue.component('Tree', TreeI)
// Vue.component('Icon', IconI)
// Vue.component('Select', SelectI)
// Vue.component('Option', OptionI)

// iview
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);
//Element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import qs from 'qs';
Vue.prototype.qs = qs;
router.beforeEach((to, from, next) => {
  let a = to.name;
  if(to.path == "/articleDetail_yun"){
    next();
  }else{
    document.title = "太原呼叫中心";
    if(store.state.authList[a]){
      next();
    }else{
      ElementUI.Message.info("您访问的页面不存在");
    }
  }
})

axios.interceptors.request.use(config => {
  return config;
}, err => {
  ElementUI.Message.error("连接失败！")
  return Promise.resolve(err);
})

axios.interceptors.response.use((response) => {
  if(response.data.msg == "未登陆!"){
    VueApp.$root.clearUser();
    router.push({path:"/login"});
    ElementUI.Message.info("登录已失效，请重新登录！");
  }else{
    return response;
  }
}, function (error) {
  if (401 === error.response.status) {
    // router.push({path:"/login"})
  }else {
    return Promise.reject(error);
  }
})

VueApp = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  methods:{
    clearUser(){
      this.$store.state.menuList = [];
      window.clearSession('menuList')
      this.$store.state.menu2Active = -1;
      window.clearSession('menu2Active')
      this.$store.state.tabViews = [];
      window.clearSession('tabViews');
      this.$store.state.tabViewActive = -1;
      window.clearSession('tabViewActive')
      this.$store.state.authList = {index:true, login:true, home:true,};
      window.clearSession('authList')
    }
  }
})
