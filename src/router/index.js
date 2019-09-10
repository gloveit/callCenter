import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import("@/components/index.vue"),
      redirect:"/login",
      children:[
        {
          path:"home",
          name:"home",
          component:() => import("@/components/home.vue"),
          meta:{keepAlive:false}
        },
        {
          path:"callRecords",
          name:"callRecords",
          component:() => import("@/components/callRecords.vue")
        },
        {
          path:"/workOrder",
          name:"workOrder",
          component:() => import("@/components/workOrder.vue"),
          redirect:"/workOrder/knowledgeBase",
          children:[
            {
              path:"knowledgeBase",
              name:"workOrder_knowledgeBase",
              meta:{one:"/workOrder"},
              component:() => import("@/components/knowledgeBase.vue")
            },
            {
              path:"articleDetail",
              name:"workOrder_articleDetail",
              component:() => import("@/components/articleDetail.vue")
            },
            {
              path:"changeArticle",
              name:"workOrder_changeArticle",
              component:() => import("@/components/changeArticle.vue")
            },
            {
              path:"addArticle",
              name:"workOrder_addArticle",
              component:() => import("@/components/addArticle.vue")
            },
          ]
        },
        {
          path:"/workOrder1",
          name:"workOrder1",
          component:() => import("@/components/workOrder1.vue"),
          redirect:"/workOrder1/knowledgeBase",
          children:[
            {
              path:"knowledgeBase",
              name:"workOrder1_knowledgeBase",
              meta:{one:"/workOrder1"},
              component:() => import("@/components/knowledgeBase.vue")
            },
            {
              path:"articleDetail",
              name:"workOrder1_articleDetail",
              component:() => import("@/components/articleDetail.vue")
            },
            {
              path:"changeArticle",
              name:"workOrder1_changeArticle",
              component:() => import("@/components/changeArticle.vue")
            },
            {
              path:"addArticle",
              name:"workOrder1_addArticle",
              component:() => import("@/components/addArticle.vue")
            },
          ]
        },
        {
          path:"/workOrderList",
          name:"workOrderList",
          component:() => import("@/components/workOrderList.vue")
        },
        {
          path:"usermanage",
          name:"userManage",
          component:() => import("@/components/userManage.vue")
        },
        {
          path:"menumanage",
          name:"menuManage",
          component:() => import("@/components/menuManage.vue")
        },
        {
          path:"rolemanage",
          name:"roleManage",
          component:() => import("@/components/roleManage.vue")
        },
        {
          path:"/messageRecord",
          name:"messageRecord",
          component:() => import("@/components/messageRecord.vue")
        },
        {
          path:"/agentMonitoring",
          name:"agentMonitoring",
          component:() => import("@/components/agentMonitoring.vue"),
        },
        {
          path:"/weChat",
          name:"weChat",
          component:() => import("@/components/blank.vue"),
        },
        {
          path:"/knowledgeBase",
          name:"knowledgeBase",
          component:() => import("@/components/knowledgeBase.vue"),
          meta:{one:""},
        },
        {
          path:"/articleDetail",
          name:"articleDetail",
          component:() => import("@/components/articleDetail.vue")
        },
        {
          path:"/addArticle",
          name:"addArticle",
          component:() => import("@/components/addArticle.vue")
        },
        {
          path:"/changeArticle",
          name:"changeArticle",
          component:() => import("@/components/changeArticle.vue")
        },
        {
          path:"/satisfyReport",
          name:"satisfyReport",
          component:() => import("@/components/reports/satisfyReport.vue")
        },
        {
          path:"/piece",
          name:"piece",
          component:() => import("@/components/reports/piece.vue")
        },
        {
          path:"/complaint",
          name:"complaint",
          component:() => import("@/components/reports/complaint.vue")
        },
        {
          path:"/work",
          name:"work",
          component:() => import("@/components/reports/work.vue")
        },
        {
          path:"/hotIssues",
          name:"hotIssues",
          component:() => import("@/components/reports/hotIssues.vue")
        },
        {
          path:"/warranty",
          name:"warranty",
          component:() => import("@/components/reports/warranty.vue")
        },
        {
          path:"/order",
          name:"order",
          component:() => import("@/components/reports/order.vue")
        },
        {
          path:"/trafficDis",
          name:"trafficDis",
          component:() => import("@/components/reports/trafficDis.vue")
        },
        {
          path:"/statisticsM",
          name:"statisticsM",
          component:() => import("@/components/reports/statisticsM.vue")
        },
        {
          path:"/trafficAna",
          name:"trafficAna",
          component:() => import("@/components/reports/trafficAna.vue")
        },
        {
          path:"/satisfactionEva",
          name:"satisfactionEva",
          component:() => import("@/components/reports/satisfactionEva.vue")
        },
        {
          path:"/workTypeR",
          name:"workTypeR",
          component:() => import("@/components/reports/workTypeR.vue")
        },
        {
          path:"/phoneReport",
          name:"phoneReport",
          component:() => import("@/components/reports/phoneReport.vue")
        },
        {
          path:"/analysisReport",
          name:"analysisReport",
          component:() => import("@/components/reports/analysisReport.vue")
        },
        {
          path:"/serviceRes",
          name:"serviceRes",
          component:() => import("@/components/reports/serviceRes.vue")
        },
        {
          path:"/lineUp",
          name:"lineUp",
          component:() => import("@/components/reports/lineUp.vue")
        },
        {
          path:"/seatWork",
          name:"seatWork",
          component:() => import("@/components/reports/seatWork.vue")
        },
        {
          path:"/workOrderType",
          name:"workOrderType",
          component:() => import("@/components/reports/workOrderType.vue")
        },
        {
          path:"/userInteractive",
          name:"userInteractive",
          component:() => import("@/components/userInteractive.vue")
        },
        {
          path:"/msgAddList",
          name:"msgAddList",
          component:() => import("@/components/reports/msgAddList.vue")
        },
        {
          path:"/seatCall",
          name:"seatCall",
          component:() => import("@/components/reports/seatCall.vue")
        },
      ]
    },
    {
      path:"/login",
      name:"login",
      component:() => import("@/components/login.vue")
    },
    {
      path:"/articleDetail_yun",
      name:"articleDetail_yun",
      component:() => import("@/components/articleDetail_yun.vue")
    },
  ]
})
