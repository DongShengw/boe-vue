<template>
  <div v-wechat-title="$route.meta.title" class="home" style="padding: 20px">
    <!--    功能-->
    <div style="margin: 10px 0">
      <el-select
          v-model="searchState"
          placeholder="公告状态"
          style="width: 20%; margin-right: 20px"
          clearable
      >
        <el-option
            v-for="item in state"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <el-button style="margin-left: 10px; margin-right: 10px" @click="reset"
      >重置</el-button
      >
      <el-button
          type="primary"
          style="margin-left: 5px; margin-right: 20px"
          @click="load"
      >搜索</el-button
      >
    </div>
    <div style="margin: 10px 0">
      <el-button type="primary" @click="add">新增公告</el-button>
      <el-button type="primary" :disabled="isAll" @click="Delete">批量删除</el-button>
    </div>

    <!--表格-->
    <el-table
        :data="tableData"
        stripe
        @selection-change="(selections)=>{handleSelectionChange(selections)}"
        style="width: 100%; text-align: center"
        border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="noticeContent" label="公告内容" sortable/>
      <el-table-column prop="noticeTime" label="播放时间"/>
      <el-table-column prop="noticeState" label="公告状态">
         <template #default="scope">
           <el-tag v-if="scope.row.noticeState==4" >发布中</el-tag>
           <el-tag v-if="scope.row.noticeState==3" type="success">待发布</el-tag>
           <el-tag v-if="scope.row.noticeState==2" type="warning">播放中</el-tag>
           <el-tag v-if="scope.row.noticeState==1" type="info">发布失败</el-tag>
           <el-tag v-if="scope.row.noticeState==0" type="danger">已结束</el-tag>
         </template>
      </el-table-column>
      <el-table-column prop="noticeAuthor" label="作者"/>
      <el-table-column prop="noticeStart" label="更新时间"/>

      <el-table-column label="操作" width="350">
        <template #default="scope">
          <el-button @click="details(scope.row)">详情</el-button>
          <el-button type="success" @click="handlePub(scope.row)">发布</el-button>
          <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.programId)">
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
          <el-form-item label="公告内容" disabled="true">
            <el-input v-model="form.noticeContent" style="width:80%"/>
          </el-form-item>
          <el-form-item label="播放时间">
            <el-col :span="11">
              <el-date-picker
                  v-model="form.noticeTime"
                  type="date"
                  placeholder="Pick a date"
                  style="width: 100%"
              />
            </el-col>
          </el-form-item>
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
  name: 'programList',
  components: {
    ArrowLeft
  },
  data() {
    return {
      searchName:'',
      searchResolving:'',
      searchState:'',
      edit:0,
      isAll:true,
      state: [
        {
          label: "发布中",
          value: "4",
        },
        {
          label: "待发布",
          value: "3",
        },
        {
          label: "播放中",
          value: "2",
        },
        {
          label: "发布失败",
          value: "1",
        },
        {
          label: "已结束",
          value: "0",
        },
      ],
      resolving: [
        {
          value: "1920*1080(横)",
        },
        {
          value: "1080*1920(竖)",
        },
        {
          value: "3840*2160(横)",
        },
        {
          value: "2160*3840(竖)",
        },
      ],
      currentPage4: 1,
      pageSize4: 10,
      total: 0,
      dialogVisible:false,
      checkList:[],
      form:{},
      tableData: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load(){
      request.get("/notice", {
        params:{
          pageNum:this.currentPage4,
          pageSize:this.pageSize4,
          state:this.searchState,
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    save(){
      if(this.edit){
        request.put("/notice",this.form).then(res => {
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
        request.post("/notice",this.form).then(res => {
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
    reset() {
      this.searchName = "";
      this.searchResolving = "";
      this.searchState = "";
      this.load()
    },
    add(){
      this.dialogVisible = true
      this.form = {}
      this.form.programState = 1
      this.form.programSize = "50.0kb"
      this.form.programAuthor = "yyx"
      // this.form.programAuthor = this.$cookies.get("data").userName
    },
    handleSelectionChange(selections){
      this.checkList = selections
      if(Object.keys(selections).length === 0){
        this.isAll = true
      }else {
        this.isAll = false
      }
      console.log(this.checkList)
    },
    Delete(){
      this.checkList.forEach(item => (
          this.handleDelete(item.programId)
      ))
    },
    pub(){

    },
    handlePub(id){

    },
    handleDelete(id) {
      console.log(id)
      request.delete("/program/" + id).then(res => {
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
