import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from "@/layout/Layout";


const routes = [
  {
    path: '/',
    redirect:"/login",
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect:"/home",
    children: [
      {
        path: '/adminManage',
        name: 'adminManage',
        component: () => import("@/components/views/userManage"),
        meta:{
          title:'用户管理'
        }
      },
      {
        path: '/itemList',
        name: 'itemList',
        component: () => import("@/components/views/itemList"),
        meta:{
          title:'素材管理'
        }
      },
      {
        path: '/deviceList',
        name: 'deviceList',
        component: () => import("@/components/views/deviceList"),
        meta:{
          title:'设备管理'
        }
      },
      {
        path: '/programList',
        name: 'programList',
        component: () => import("@/components/views/programList"),
        meta:{
          title:'节目列表'
        }
      },
      {
        path: '/noticeList',
        name: 'noticeList',
        component: () => import("@/components/views/noticeList"),
        meta:{
          title:'公告列表'
        }
      },
      {
        path: '/notice',
        name: 'notice',
        component: () => import("@/components/admin/notice"),
        meta:{  
          title:'公告列表'
        }
      },
      {
        path: '/home',
        name: 'home',
        component: () => import("@/components/views/home"),
        meta:{
          title:'首页概览'
        }
      },
      {
        path: '/planList',
        name: 'planList',
        component: () => import("@/components/views/planList"),
        meta:{
          title:'计划列表'
        }
      },
      {
        path: '/planExamine',
        name: 'planExamine',
        component: () => import("@/components/views/planExamine"),
        meta:{
          title:'计划审核'
        }
      }
    ]
  },

  {
    path: '/login',
    name: 'login',
    component: () => import("@/components/Login"),
    meta:{
      title:'欢迎登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import("@/components/Register"),
    meta:{
      title:'欢迎注册'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
