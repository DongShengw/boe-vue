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
          title:'Stars管理员管理'
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
        path: '/adminExamManage',
        name: 'adminExamManage',
        component: () => import("@/components/admin/AdminExamManage"),
        meta:{
          title:'Stars考试管理'
        }
      },
      {
        path: '/teacherManage',
        name: 'teacherManage',
        component: () => import("@/components/admin/TeacherManage"),
        meta:{
          title:'Stars教师管理'
        }

      },
      {
        path: '/adminStudentManage',
        name: 'adminStudentManage',
        component: () => import("@/components/admin/AdminStudentManage"),
        meta:{
          title:'Stars学生管理'
        }
      },
      {
        path: '/adminAddQuestions',
        name: 'adminAddQuestions',
        component: () => import("@/components/admin/adminAddQuestions"),
        meta:{
          title:'Stars添加题库'
        }
      },
      {
        path: '/adminExamFunction',
        name: 'adminExamFunction',
        component: () => import("@/components/admin/AdminExamFunction"),
        meta:{
          title:'Stars考试功能介绍'
        }
      },
      {
        path: '/adminExamManage',
        name: 'adminExamManage',
        component: () => import("@/components/admin/AdminExamManage"),
        meta:{
          title:'Stars考试管理'
        }
      },
      {
        path: '/adminPaperManage',
        name: 'adminPaperManage',
        component: () => import("@/components/admin/AdminPaperManage"),
        meta:{
          title:'Stars试卷管理'
        }
      },
      {
        path: '/adminScore',
        name: 'adminScore',
        component: () => import("@/components/admin/AdminScore"),
        meta:{
          title:'Stars学生成绩'
        }
      },
      {
        path: '/adminScoreOne',
        name: 'adminScoreOne',
        component: () => import("@/components/admin/AdminScoreOne"),
        meta:{
          title:'Stars学生成绩'
        }
      },
      {
        path: '/adminScorePartOne',
        name: 'adminScorePartOne',
        component: () => import("@/components/admin/AdminScorePartOne"),
        meta:{
          title:'Stars科目成绩'
        }
      },
      {
        path: '/adminScorePart',
        name: 'adminScorePart',
        component: () => import("@/components/admin/AdminScorePart"),
        meta:{
          title:'Stars科目成绩'
        }

      },
      {
        path: '/adminSetPaper',
        name: 'adminSetPaper',
        component: () => import("@/components/admin/AdminSetPaper"),
        meta:{
          title:'Stars查看试卷'
        }
      },
      {
        path: '/adminJudgeQuestion',
        name: 'adminJudgeQuestion',
        component: () => import("@/components/admin/AdminJudgeQuestion"),
        meta:{
          title:'Stars判断题题库'
        }
      },
      {
        path: '/adminMultiQuestion',
        name: 'adminMultiQuestion',
        component: () => import("@/components/admin/AdminMultiQuestion"),
        meta:{
          title:'Stars选择题题库'
        }
      },
      {
        path: '/adminFillQuestion',
        name: 'adminFillQuestion',
        component: () => import("@/components/admin/AdminFillQuestion"),
        meta:{
          title:'Stars填空题题库'
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
