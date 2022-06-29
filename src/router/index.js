import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from "@/layout/AdminLayout";


const routes = [
  {
    path: '/',
    redirect:"/login",
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect:"/itemList",
    children: [
      {
        path: '/adminManage',
        name: 'adminManage',
        component: () => import("@/components/admin/AdminManage"),
        meta:{
          title:'用户管理'
        }
      },
      {
        path: '/itemList',
        name: 'itemList',
        component: () => import("@/components/admin/itemList"),
        meta:{
          title:'素材管理'
        }
      },
      {
        path: '/deviceList',
        name: 'deviceList',
        component: () => import("@/components/admin/deviceList"),
        meta:{
          title:'设备管理'
        }
      },
      {
        path: '/programList',
        name: 'programList',
        component: () => import("@/components/admin/programList"),
        meta:{
          title:'节目列表'
        }
      },
      {
        path: '/home',
        name: 'home',
        component: () => import("@/components/admin/home"),
        meta:{
          title:'首页概览'
        }
      },
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
