<template xmlns:src="http://www.w3.org/1999/xhtml">
  <div style="height: 60px; line-height: 60px; border-bottom: 1px solid #ccc; display: flex">
    <img style="height: 50px;width: 50px;margin-top: 3px;margin-left: 50px" src="../../assets/img/stars.jpg">
    <div style="width: 200px; padding-left: 10px;font-size: 25px; font-weight: bold; color: dodgerblue">画布系统</div>
    <div style="flex: 1"></div>
    <div style="width: 100px;text-align: center; padding-top: 15px" >
      <el-dropdown>
      <span class="el-dropdown-link">
        {{  this.$cookies.get("data").username}}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
<!--          <el-dropdown-item>个人中心</el-dropdown-item>-->
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { ArrowDown } from '@element-plus/icons'
import request from "@/utils/request";
export default {
  name: "AdminHeader",
  components: {
    ArrowDown
  },
  methods:{
    logout(){
      request.post("/logout",  this.$cookies.get("data").id).then(res => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "登录成功"
          })
          this.$cookies.remove("data")
          this.$router.push("/login")
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })


    }
  }
}
</script>

<style scoped>

</style>
