<template>
  <div v-wechat-title="$route.meta.title">
    <el-menu
        style="width: 200px; height:calc(100vh - 50px)"
        router
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        class="el-menu-vertical-demo">
      <el-menu-item index="1">
        <template #title>
          <el-icon><notebook /></el-icon>
          <span>首页概览</span>
        </template>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><postcard /></el-icon>
          <span>素材管理</span>
        </template>
        <el-menu-item index="itemList">素材列表</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><location /></el-icon>
          <span>节目制作和发布</span>
        </template>
        <el-menu-item index="programList">发布节目</el-menu-item>
        <el-menu-item index="adminSetPaper">发布公告</el-menu-item>

        <!--        <el-menu-item index="addQuestions">添加题目</el-menu-item>-->
      </el-sub-menu>
      <el-sub-menu index="4" >
        <template #title>
          <el-icon><tickets /></el-icon>
          <span>计划管理</span>
        </template>
        <el-menu-item index="planList">计划列表</el-menu-item>
        <el-menu-item index="adminScorePart">计划审核</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="5">
        <template #title>
          <el-icon><user /></el-icon>
          <span>设备管理</span>
        </template>
        <el-menu-item index="deviceList">设备列表</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="6">
        <template #title>
          <el-icon><user-filled /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="adminManage">用户管理</el-menu-item>
      </el-sub-menu>

    </el-menu>
  </div>
</template>

<script>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
export default {
  name: "adminAside"
}
</script>

<style scoped>

</style>
