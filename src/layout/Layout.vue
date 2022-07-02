<template>
  <div>
    <!--    头部-->
    <AdminHeader />
    <!--    主体-->
    <div style="display: flex">
      <!--      侧边栏-->
      <AdminAside />
      <!--      内容区域home-->
      <router-view style="flex: 1"/>
    </div>
  </div>
</template>

<script>

import AdminHeader from "@/components/header/Header";
import AdminAside from "@/components/aside/Aside";

export default {
  name: "AdminLayout",
  components:{
    AdminAside,
    AdminHeader
  }
}
</script>

<style scoped>

</style>
