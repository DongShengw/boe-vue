<template>
  <el-upload action="#" list-type="picture-card" :auto-upload="false">
    <el-icon><Plus /></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script>
import { ref } from 'vue';
export default {
  name: "itemList",
  data(){
    return{
      dialogImageUrl:ref(''),
      dialogVisible:ref(false),
      disabled:ref(false),
    }
  },
  method:{
    handleRemove(file){
      console.log(file)
    },
    handlePictureCardPreview(file){
      this.dialogImageUrl.value = file.url,
      this.dialogVisible.value = true
    },
    handleDownload(file){
      console.log(file)
    }
  }
}
</script>

<style scoped>

</style>
