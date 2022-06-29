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
          v-model="planStates"
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
      >查询</el-button
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
            <el-image :preview-src-list="scope.row.programImg"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="listName" label="计划名称" sortable />
      <el-table-column prop="planStates" label="计划状态" />
      <el-table-column prop="planMode" label="播放模式" />
      <el-table-column prop="planTime" label="播放日期" />
      <el-table-column prop="planAuthor" label="作者" />
      <el-table-column prop="planConfirm" label="审核人" />
      <el-table-column prop="planNewtime" label="更新时间" />
      <el-table-column label="操作" width="350">
        <template #default="scope">
          <el-button @click="details">详情</el-button>
          <el-button @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm
              title="确认删除?"
              @confirm="handleDelete(scope.row.deviceId)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button @click="pushs">发布</el-button>
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
              <template>
                <el-descriptions title="">
                  <el-descriptions-item label="计划名称">plan0</el-descriptions-item>
                  <el-descriptions-item label="播放日期">2022-06-29</el-descriptions-item>
                  <el-descriptions-item label="发布状态">待发布</el-descriptions-item>
                  <el-descriptions-item label="创建时间">2022-06-29 09:24:26</el-descriptions-item>
                  <el-descriptions-item label="播放时段">
                    按时段播放<br>
                    循环类型:每天<br>
                    循环时间段:8:00-20:00
                  </el-descriptions-item>
                </el-descriptions>
              </template>
            </el-tab-pane>

            <el-tab-pane label="设备详情">
              <el-table
                  :data="tableData"
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
                  :total="total"
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
            <el-input v-model="form.planName" />
          </el-form-item>

          <el-form-item label="播放模式">
            <el-radio-group v-model="form.planMode">
              <el-radio label="时段播放" />
              <el-radio label="持续播放" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="播放时段">
            <el-col :span="11">
              <el-date-picker
                  v-model="form.planTime"
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
                  v-model="form.planTime"
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
          value: "1",
        },
        {
          label: "待发布",
          value: "2",
        },
        {
          label: "播放中",
          value: "3",
        },
        {
          label: "发布失败",
          value: "4",
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
      tableData: [],
      pl1:false,
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
    details(row){
      this.pl1=true;
      this.form=JSON.parse(JSON.stringify(row));
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
      request.delete("/schedule-list/" + id).then(res => {
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
