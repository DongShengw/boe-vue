<template>
  <div v-wechat-title="$route.meta.title" class="home" style="padding: 10px">
    <!--      1、  -->
    <div style="margin: 20px 0 ; margin-left: 20px">
      <span>计划名称：</span>
      <el-input
          v-model="planName"
          placeholder="请输入计划名称"
          style="width: 20%; margin-right: 20px"
          clearable
      ></el-input>
      <span style="margin-left: 70px">计划状态：</span>
      <el-select
          v-model="planState"
          placeholder="请选择"
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

      <el-button style="margin-left: 180px; margin-right: 10px" @click="reset"
      >重置</el-button
      >
      <el-button
          type="primary"
          style="margin-left: 5px; margin-right: 20px"
          @click="load"
      >搜索</el-button
      >
    </div>
    <!--        新建计划、批量删除-->
    <div style="margin: 10px 0;">
      <el-button type="primary" @click="add">新增计划</el-button>
      <el-button type="primary" :disabled="isAll" @click="Delete">批量删除</el-button>
    </div>
    <!--        表单-->
    <el-table
        :data="tableData"
        stripe
        style="width: 100%; text-align: center"
        @selection-change="(selections)=>{handleSelectionChange(selections)}"
        border
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="缩略图" width="130">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-image :src="scope.row.listImg"  @click="handlePictureCardPreview(scope.row.listImg)"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="listName" label="计划名称" sortable />
      <el-table-column prop="listState" label="计划状态" >
        <template #default="scope">
          <el-tag v-if="scope.row.listState==5" type="danger">待发布</el-tag>
          <el-tag v-if="scope.row.listState==4" type="warning">发布中</el-tag>
          <el-tag v-if="scope.row.listState==3" type="success">发布成功</el-tag>
          <el-tag v-if="scope.row.listState==2" type="danger">发布失败</el-tag>
          <el-tag v-if="scope.row.listState==1" type="info">已结束</el-tag>
          <el-tag v-if="scope.row.listState==0" >审核中</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="playPattern" label="播放模式" />
      <el-table-column prop="playTime" label="播放日期" />
      <el-table-column prop="listAuthor" label="作者" />
      <el-table-column prop="listReviewer" label="审核人" />
      <el-table-column prop="listUpdate" label="更新时间" />
      <el-table-column label="操作" width="350">
        <template #default="scope">
          <el-button @click="details(scope.row)">详情</el-button>
          <el-button @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm
              title="确认删除?"
              @confirm="handleDelete(scope.row.listId)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button @click="handlePub(scope.row)">发布</el-button>
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
      <!--            计划详情-->
      <el-dialog v-model="pl1" title="" width="80%">
        <el-form :model="form" label-width="800px">
          <el-tabs type="border-card">
            <el-tab-pane label="计划详情">

                <el-descriptions title="">
                  <el-descriptions-item label="计划名称">{{ form.listName }}</el-descriptions-item>
                  <el-descriptions-item label="播放日期">{{ form.playTime }}</el-descriptions-item>
                  <el-descriptions-item label="发布状态">
                    <template #default="scope">
                      <el-tag v-if="form.listState==5" type="danger">待发布</el-tag>
                      <el-tag v-if="form.listState==4" type="warning">发布中</el-tag>
                      <el-tag v-if="form.listState==3" type="success">发布成功</el-tag>
                      <el-tag v-if="form.listState==2" type="danger">发布失败</el-tag>
                      <el-tag v-if="form.listState==1" type="info">已结束</el-tag>
                      <el-tag v-if="form.listState==0" >审核中</el-tag>
                    </template>
                  </el-descriptions-item>
                  <el-descriptions-item label="更新日期">{{ form.listUpdate }}</el-descriptions-item>
                  <el-descriptions-item label="播放模式">
                    {{ form.playPattern }}
                  </el-descriptions-item>
                </el-descriptions>
              <el-image :src="form.listImg" style="width: auto;height: 60%"/>

            </el-tab-pane>

            <el-tab-pane label="设备详情">
              <el-table
                  :data="deviceData"
                  stripe
                  style="width: 100%; text-align: center"
                  border
              >
                <el-table-column prop="deviceName" label="设备名称" sortable />
                <el-table-column prop="macAddress" label="MAC地址" />
                <el-table-column prop="resolvingPower" label="分辨率" />
                <el-table-column prop="deviceMechanism" label="所属机构" />
                <el-table-column prop="deviceSchedule" label="当前计划" />
                <el-table-column prop="deviceState" label="设备状态">
                  <template #default="scope">
                    <el-tag v-if="scope.row.deviceState==1" type="success">空闲</el-tag>
                    <el-tag v-if="scope.row.deviceState==2">播放</el-tag>
                    <el-tag v-if="scope.row.deviceState==0" type="danger">离线</el-tag>
                  </template>
                </el-table-column>

              </el-table>
              <el-pagination
                  v-model:currentPage="currentPage4"
                  v-model:page-size="pageSize4"
                  :page-sizes="[5, 10, 15, 20]"
                  :small="small"
                  :disabled="disabled"
                  :background="background"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalD"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"/>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="pl1 = false">返回</el-button>
                    </span>
        </template>
      </el-dialog>

      <!--新建-->
      <el-dialog v-model="dialogVisible" title="新建计划" width="30%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="计划名称">
            <el-input v-model="form.listName" />
          </el-form-item>

          <el-form-item label="播放模式">
            <el-radio-group v-model="form.playPattern">
              <el-radio label="时段播放" />
              <el-radio label="持续播放" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="播放时段">
            <el-col :span="11">
              <el-date-picker
                  v-model="form.playTime"
                  type="date"
                  placeholder="Pick a date"
                  style="width: 100%"
              />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-date-picker
                  v-model="form.playTime"
                  placeholder="Pick a date"
                  style="width: 100%"
              />
            </el-col>
          </el-form-item>

          <el-form-item label="节目">
            <el-image v-if="selectPicUrl" :src="selectPicUrl" style="margin-bottom: 10px"/>
            <el-button @click="selectProgram" type="primary">选择节目</el-button>
          </el-form-item>

        </el-form>
        <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="save">确认</el-button>
                    </span>
        </template>
      </el-dialog>
      <el-dialog v-model="picListDialogVisible" title="节目选择" width="40%">
        <el-table
                :data="ProData"
                stripe
                highlight-current-row
                @current-change="handleSelectChange"
                style="width: 100%; text-align: center"
                border>
          <el-table-column type="index" width="55" />
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
      planName:'',
      planState:'',
      picDialogVisible:false,
      edit:0,
      isAll:true,
      state: [
        {
          value:"5",
          label:"待发布"
        },
        {
          value:"4",
          label:"发布中"
        },
        {
          value:"3",
          label:"发布成功"
        },
        {
          value:"2",
          label:"发布失败"
        },
        {
          value:"1",
          label:"已结束"
        },
        {
          value:"0",
          label:"审核中"
        }
      ],
      currentPage4: 1,
      pageSize4: 10,
      total: 0,
      totalD:0,
      dialogVisible:false,
      checkList:[],
      form:{},
      tableData: [],
      ProData:[],
      deviceData:[],
      pl1:false,
      fileList:[],
      picListDialogVisible:false,
    }
  },
  created() {
    this.load()
  },
  methods: {
    load(){
      request.get("/schedule-list", {
        params:{
          pageNum:this.currentPage4,
          pageSize:this.pageSize4,
          name:this.planName,
          state:this.planState,
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    loadDevice(){
      request.get("/device", {
        params:{
          pageNum:this.currentPage4,
          pageSize:this.pageSize4,
        }
      }).then(res => {
        console.log(res)
        this.deviceData = res.data.records
        this.total = res.data.total
      })
    },
    save(){
      this.form.listImg = this.selectPicUrl
      if(this.edit){
        request.put("/schedule-list",this.form).then(res => {
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
          this.selectPicUrl=''
          this.load()//刷新表格的数据
          this.dialogVisible = false  //关闭弹窗
        })
      }
      else{
        request.post("/schedule-list",this.form).then(res => {
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
    handlePictureCardPreview(url){
      this.dialogImageUrl = url
      this.picDialogVisible = true
    },
    handleSelectChange(currentRow){
      this.selectPicUrl = currentRow.programImg
      console.log(currentRow)
    },
    loadPro(){
      request.get("/program", {
        params:{
          pageNum:this.currentPage4,
          pageSize:this.pageSize4,
        }
      }).then(res => {
        console.log(res)
        this.ProData = res.data.records
        this.total = res.data.total
      })

    },
    selectPic(){
      request.get("/img").then(res => {
        console.log(res)
        this.fileList = res.data.records
      })
      this.picListDialogVisible = true
    },
    selectProgram(){
      this.loadPro()
      request.get("/img").then(res => {
        console.log(res)
        this.fileList = res.data.records
      })
      this.picListDialogVisible = true
    },
    details(row){
      this.loadDevice()
      this.form=JSON.parse(JSON.stringify(row));
      this.pl1=true;
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.selectPicUrl = this.form.listImg

      this.edit = 1
    },
    reset() {
      this.planName = "";
      this.planState = "";
      this.load()
    },
    add(){
      this.dialogVisible = true
      this.form = {}
      this.selectPicUrl = ''
      this.form.listState = 5
      this.form.listAuthor = this.$cookies.get("data").username
      this.form.listReviewer = this.$cookies.get("data").username
    },
    handlePub(row){
      let pic = {}
      pic.pubProgramImg = JSON.parse(JSON.stringify(row)).listImg
      request.post("/pub-program",pic).then(res => {
        console.log(res)
        if(res.code === 200){
          this.$message({
            type:"success",
            message:"发布成功"
          })
          request.put("/program/state",JSON.parse(JSON.stringify(row)).programId).then(res => {
            if(res.code === 200){
            }else{
              this.$message({
                type:"error",
                message:res.msg
              })
            }
            this.load()//刷新表格的数剧
          })
        }else{
          this.$message({
            type:"error",
            message:res.msg
          })
        }
        this.load()//刷新表格的数据
      })
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
          this.handleDelete(item.listId)
      ))
    },
    pub(){

    },
    handleDelete(id) {
      console.log(id)
      request.delete("/schedule-list/" + id).then(res => {
        // console.log(res)
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
