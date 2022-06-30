<template>

  <div style="padding: 30px;flex: 1">
    <div style="width: auto;">
      <el-card style="height: 70px">
        <div style="margin: auto 0">
          <el-input
              v-model="searchName"
              placeholder="素材名称"
              style="width: 20%; margin-right: 20px"
              clearable
          ></el-input>
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

      </el-card>
    </div>
    <div style="width: auto;;margin-top: 20px">
      <el-card style="height:75vh">
        <el-upload
            v-model:file-list="fileList"
            action="http://localhost:8081/img/UploadPic"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

      </el-card>
    </div>
  </div>

  <el-dialog v-model="dialogVisible"  style="height: auto;width: 700px">
    <img style="width: 800px; height: auto" fit="contain" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script>

import request from "@/utils/request";
import { ArrowLeft } from '@element-plus/icons-vue'
import {ref} from "@vue/reactivity";
export default {
  name: 'programList',
  components: {
    ArrowLeft
  },
  data() {
    return {
      fileList:[],
      searchName:'',
      dialogImageUrl:'',
      dialogVisible:false,
      disabled:false,
    }
  },
  created() {
    this.load()
  },
  methods: {
    load(){
      request.get("/img", {
        params:{
          name:this.searchName,
        }
      }).then(res => {
        console.log(res)
        this.fileList = res.data.records
      })
    },
    handlePictureCardPreview(uploadFile){
      this.dialogImageUrl = uploadFile.url
      this.dialogVisible = true
    },
    handleRemove(uploadFile){

    }
  }
}
</script>
