<template>
  <div v-wechat-title="$route.meta.title" class="home" style="padding: 20px">
    <!--    功能-->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="add">新增</el-button>
    </div>
    <!--    搜索-->
    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder="请输入关键字" style="width: 20%" clearable></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="load">搜索</el-button>
    </div>
    <!--表格-->
    <el-table
        :data="tableData"
        stripe
        style="width: 100%; text-align: center"
        border>
      <el-table-column prop="userName" label="用户ID" sortable/>
      <el-table-column prop="userMechanism" label="所属机构"/>
      <el-table-column prop="userRole" label="所属角色"/>
      <el-table-column prop="userState" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.userState==1" type="success">在线</el-tag>
          <el-tag v-if="scope.row.userState==0" type="danger">离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userRname" label="姓名"/>
      <el-table-column prop="userEmail" label="邮箱"/>
      <el-table-column prop="userUpdate" label="更新时间" sortable/>
      <el-table-column prop="userType" label="用户类型">
        <template #default="scope">
          <el-tag v-if="scope.row.userState==1">当前用户</el-tag>
          <el-tag v-if="scope.row.userType==1" type="warning">管理员</el-tag>
          <el-tag v-else type="info">其他用户</el-tag>
        </template>
      </el-table-column>


      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.userId)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 10px 0;">
      <!--      分页-->
      <el-pagination
          v-model:currentPage="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[5, 10, 15, 20]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      <!--弹窗-->
      <el-dialog v-model="dialogVisible" title="提示" width="30%">
        <el-form :model="form" label-width="120px">
<!--          <el-form-item label="管理员ID">-->
<!--            <el-input v-model="form.adminId" style="width:80%"/>-->
<!--          </el-form-item>-->
          <el-form-item label="用户ID" disabled="true">
            <el-input v-model="form.userName" style="width:80%"/>
          </el-form-item>
          <el-form-item label="所属机构">
            <el-select v-model="form.userMechanism" placeholder="">
              <el-option label="浙大城市学院" value="浙大城市学院" />
              <el-option label="浙江大学" value="浙江大学" />
            </el-select>          </el-form-item>
          <el-form-item label="所属角色">
            <el-select v-model="form.userRole" placeholder="">
              <el-option label="学生" value="学生" />
              <el-option label="老师" value="老师" />
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.userRname" style="width:80%"/>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.userEmail" style="width:80%"/>
          </el-form-item>
<!--          <el-form-item label="用户类型">-->
<!--            <el-select v-model="form.userType" placeholder="">-->
<!--              <el-option label="学生" value="shanghai" />-->
<!--              <el-option label="老师" value="beijing" />-->
<!--              <el-option label="管理员" value="beijing" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->

        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src


import request from "@/utils/request";
import { ArrowLeft } from '@element-plus/icons-vue'
export default {
  name: 'adminManage',
  components: {
    ArrowLeft
  },
  data() {
    return {
      search: '',
      edit:0,
      currentPage4: 1,
      pageSize4: 10,
      total: 0,
      dialogVisible:false,
      form:{},
      tableData: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load(){
      request.get("/user", {
        params:{
          pageNum:this.currentPage4,
          pageSize:this.pageSize4,
          search:this.search
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    save(){
      if(this.edit){
        request.put("/user",this.form).then(res => {
          console.log(res)
          if(res.code === 200){
            this.$message({
              type:"success",
              message:"更新成功"
            })
          }else{
            this.$message({
              type:"error",
              message:res.msg
            })
          }
          this.edit = 0
          this.load()//刷新表格的数据
          this.dialogVisible = false  //关闭弹窗
        })
      }
      else{
        request.post("/user",this.form).then(res => {
          console.log(res)
          if(res.code === 200){
            this.$message({
              type:"success",
              message:"新增成功"
            })
          }else{
            this.$message({
              type:"error",
              message:res.msg
            })
          }
          this.load()//刷新表格的数据
          this.dialogVisible = false  //关闭弹窗
        })
      }

    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.edit = 1
    },
    add(){
      this.dialogVisible = true
      this.form = {}
      this.form.userState = 0
      this.form.userType = 0
    },

    handleDelete(id) {
      console.log(id)
      request.delete("/user/" + id).then(res => {
        console.log(res)
        if(res.code === 200){
          this.$message({
            type:"success",
            message:"删除成功"
          })
        }else{
          this.$message({
            type:"error",
            message:res.msg
          })
        }
        this.load()//刷新表格的数剧
      })
    },
    handleSizeChange(pageSize) {//改变当前每页的个数
      this.pageSize4 = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {//改变当前页码
      this.currentPage4 = pageNum
      this.load()
    }

  }
}
</script>
