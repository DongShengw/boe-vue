<template>
  <div v-wechat-title="$route.meta.title" class="home" style="padding: 20px">
    <!--    功能-->
    <div style="margin: 10px 0">
      <el-input
          v-model="searchName"
          placeholder="节目名称"
          style="width: 20%; margin-right: 20px"
          clearable
      ></el-input>
      <el-select
          v-model="searchResolving"
          placeholder="分辨率"
          style="width: 20%; margin-right: 20px"
          clearable
      >
        <el-option
            v-for="item in resolving"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <el-select
          v-model="searchState"
          placeholder="节目状态"
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
      <el-button type="primary" @click="add">新增节目</el-button>
      <el-button type="primary" :disabled="isAll" @click="pub">批量发布</el-button>
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
      <el-table-column prop="programImg" label="缩略图" width="130">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-image :src="scope.row.programImg" @click="handlePictureCardPreview(scope.row.programImg)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="programName" label="节目名称" sortable/>
      <el-table-column prop="resolvingPower" label="分辨率"/>
      <el-table-column prop="programTime" label="节目时长"/>
      <el-table-column prop="programSize" label="节目大小"/>
      <el-table-column prop="programState" label="节目状态">
         <template #default="scope">
           <el-tag v-if="scope.row.programState==2" type="success">使用中</el-tag>
           <el-tag v-if="scope.row.programState==1" type="info">未使用</el-tag>
           <el-tag v-if="scope.row.programState==0" type="danger">已失效</el-tag>
         </template>
      </el-table-column>
      <el-table-column prop="programAuthor" label="作者"/>
      <el-table-column prop="programUpdate" label="更新时间"/>


      <el-table-column label="操作" width="250">
        <template #default="scope">
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
          <el-form-item label="节目名称" disabled="true">
            <el-input v-model="form.programName" style="width:80%"/>
          </el-form-item>
          <el-form-item label="分辨率">
            <el-select
                v-model="form.resolvingPower"
                placeholder="分辨率"
            >
              <el-option
                  v-for="item in resolving"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="节目时长">
            <el-select v-model="form.programTime" placeholder="">
              <el-option label="5s" value="5s" />
              <el-option label="10s" value="10s" />
            </el-select>
          </el-form-item>
          <el-form-item label="图片">
              <el-image v-if="selectPicUrl" :src="selectPicUrl" style="margin-bottom: 10px"/>
              <el-button  @click="selectPic" type="primary">选择图片</el-button>
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </span>
        </template>
      </el-dialog>

      <el-dialog v-model="picListDialogVisible" title="图片选择" width="40%">
        <el-table
            :data="fileList"
            stripe
            highlight-current-row
            @current-change="handleSelectChange"
            style="width: 100%; text-align: center"
            border
        >
          <el-table-column type="index" width="55" />
          <el-table-column prop="url" label="缩略图" width="130">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-image :src="scope.row.url" @click="handlePictureCardPreview(scope.row.url)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="节目名称"/>
        </el-table>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="picListDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="picListDialogVisible = false">确认</el-button>
      </span>
        </template>
      </el-dialog>

      <el-dialog v-model="picDialogVisible"  style="height: auto;width: auto">
        <img style="width: 100%; height: auto" fit="contain" :src="dialogImageUrl" alt="Preview Image" />
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
      selectPicUrl:'',
      dialogImageUrl:'',
      searchName:'',
      searchResolving:'',
      searchState:'',
      edit:0,
      fileList:[],
      isAll:true,
      state: [
        {
          label: "使用中",
          value: "2",
        },
        {
          label: "未使用",
          value: "1",
        },
        {
          label: "已失效",
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
      picDialogVisible:false,
      picListDialogVisible:false,
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
      request.get("/program", {
        params:{
          pageNum:this.currentPage4,
          pageSize:this.pageSize4,
          name:this.searchName,
          resolving:this.searchResolving,
          state:this.searchState,
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    save(){
      this.form.programImg = this.selectPicUrl
      if(this.edit){
        console.log(this.form)
        request.put("/program",this.form).then(res => {
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
        request.post("/program",this.form).then(res => {
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
      this.selectPicUrl =''
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.selectPicUrl = this.form.programImg
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
      this.selectPicUrl =''
      this.form.programState = 1
      this.form.programSize = "50.0kb"
      this.form.programAuthor = this.$cookies.get("data").username
      // this.form.programAuthor = this.$cookies.get("data").userName
    },
    selectPic(){
      request.get("/img").then(res => {
        console.log(res)
        this.fileList = res.data.records
      })
      this.picListDialogVisible = true
    },
    handleSelectChange(currentRow){
      this.selectPicUrl = currentRow.url
      console.log(currentRow)
    },
    handlePictureCardPreview(url){
      this.dialogImageUrl = url
      this.picDialogVisible = true
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
<style scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>
