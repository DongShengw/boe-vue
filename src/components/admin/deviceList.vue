<template>
  <div v-wechat-title="$route.meta.title" class="home" style="padding: 20px">

    <!--    搜索-->
    <div style="margin: 10px 0">
      <el-input
        v-model="searchName"
        placeholder="设备名称"
        style="width: 20%; margin-right: 20px"
        clearable
      ></el-input>
      <el-select
        v-model="searchMechanism"
        placeholder="所属机构"
        style="width: 20%; margin-right: 20px"
        clearable
      >
      <el-option
          v-for="item in mechanism"
          :key="item.value"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="searchGroup"
        placeholder="所属分组"
        style="width: 20%; margin-right: 20px"
        clearable
      >
      <el-option
          v-for="item in group"
          :key="item.value"
          :value="item.value"
        /></el-select>
      <el-input
        v-model="searchMAC"
        placeholder="MAC地址"
        style="width: 20%; margin-right: 20px"
        clearable
      ></el-input>
    </div>
    <div style="margin: 10px 0">
      <el-select
        v-model="searchResolving"
        placeholder="分辨率"
        style="width: 20%; margin-right: 20px"
        clearable
      ><el-option
          v-for="item in resolving"
          :key="item.value"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="searchState"
        placeholder="设备状态"
        style="width: 20%; margin-right: 20px"
        clearable
      ><el-option
          v-for="item in state"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        /></el-select>
      <el-select
        v-model="searchSystem"
        placeholder="系统版本"
        style="width: 20%; margin-right: 20px"
        clearable
      >
        <el-option
          v-for="item in system"
          :key="item.value"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="searchSchedule"
        placeholder="当前计划"
        style="width: 20%; margin-right: 20px"
        clearable
        ><el-option
          v-for="item in schedule"
          :key="item.value"
          :value="item.value"
      /></el-select>
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
    <!--表格-->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%; text-align: center"
      border
    >
      <el-table-column prop="deviceName" label="设备名称" sortable />
      <el-table-column prop="deviceMechanism" label="所属机构" />
      <el-table-column prop="deviceGroup" label="所属分组" />
      <el-table-column prop="macAddress" label="MAC地址" />
      <el-table-column prop="resolvingPower" label="分辨率" />
      <el-table-column prop="deviceState" label="设备状态">
        <template #default="scope">
          <el-tag v-if="scope.row.deviceState==1" type="success">空闲</el-tag>
          <el-tag v-if="scope.row.deviceState==2">播放</el-tag>
          <el-tag v-if="scope.row.deviceState==0" type="danger">离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deviceSystem" label="系统升级" />
      <el-table-column prop="deviceSchedule" label="当前计划" />

    <!--    功能-->
      <el-table-column label="操作"  width="400">
        <template #default="scope">
          <el-button @click="details">详情</el-button>
          <el-button @click="handleEdit(scope.row)">控制</el-button>
          <el-button @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm
            title="确认删除?"
            @confirm="handleDelete(scope.row.deviceId)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 10px 0">
      <!--分页-->
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
        @current-change="handleCurrentChange"
      />
      <!--弹窗-->
      <el-dialog v-model="dv1" title="编辑设备" width="30%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="设备名称">
            <el-input v-model="form.deviceName" style="width: 80%" />
          </el-form-item>
          <el-form-item label="所属分组">
            <el-input v-model="form.deviceGroup" style="width: 80%" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dv1 = false">取消</el-button>
            <el-button type="primary" @click="save">确认</el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog v-model="dv2" title="设备详情" width="30%">
        <el-form :model="form1" label-width="120px">
          <el-tabs type="border-card">
            <el-tab-pane label="设备信息">
              设备型号：HiDPTAndroid Hi3751V553<br>
              系统版本：BOE_iGallery32_V13103_V5.2.0<br>
              设备IP:192.168.53.212<br>
              信发版本：1.3.1<br>
              有线MAC地址：A0BB3ED3861D<br>
              无线MAC地址：A0BB3ED2F376<br>
              运行内存：0.96 GB<br>
              SN：T232BS200721000123<br>
              存储空间： 4.65 GB可用（共 5.39 GB）<br>
              激活时间：2022-06-23 10:40:12<br>
            </el-tab-pane>
            <el-tab-pane label="安装信息">
              设备名称：测试误删<br>
              注册时间：2022-06-27 14:31:14<br>
              所属分组：11111<br>
              分辨率：1920x1080<br>
              所属机构：城院罗老师测试<br>
              屏显方式：横屏<br>
              安装位置：中国浙江省杭州市拱墅区上塘街道东教路<br>
            </el-tab-pane>
            <el-tab-pane label="状态信息">
              设备状态：离线<br>
              当前计划：--<br>
              设备运行时长：1 天 11 分钟<br>
              最后心跳时间：2022-06-27 16:01:20<br>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dv2 = false">取消</el-button>
            <el-button type="primary" @click="save1">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>


<script>
// @ is an alias to /src

import request from "@/utils/request";

export default {
  name: "deviceList",
  components: {},
  data() {
    return {
      searchName: "",
      searchMechanism: "",
      searchGroup: "",
      searchMAC: "",
      searchResolving: "",
      searchState: "",
      searchSchedule: "",
      searchSystem: "",
      currentPage4: 1,
      pageSize4: 10,
      total: 0,
      dv1: false,
      dv2: false,
      form: {},
      form1: {},
      tableData: [],
      schedule: [],
      group: [],
      state: [
        {
          label: "播放",
          value: "2",
        },
        {
          label: "空闲",
          value: "1",
        },
        {
          label: "离线",
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
      mechanism: [
        {
          value: "浙江大学",
        },
        {
          value: "浙大城市学院",
        },
      ],
      system: [
        {
          value: "已是最新",
        },
        {
          value: "升级",
        },
        {
          value: "有新版本",
        },
      ],
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      request 
        .get("/device", {
          params: {
            pageNum: this.currentPage4,
            pageSize: this.pageSize4,
            name: this.searchName,
            mechanism: this.searchMechanism,
            group: this.searchGroup,
            mac: this.searchMAC,
            resolving: this.searchResolving,
            state: this.searchState,
            schedule: this.searchSchedule,
            system: this.searchSystem,
          },
        })
        .then((res) => {
          console.log(res);
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
        request
        .get("/device/schedule", {
        })
        .then((res) => {
          console.log(res);
          this.schedule = []
          for (let i = 0; i < res.data.length; i++) {
            var obj ={}
            obj.value=res.data[i]
            this.schedule.push(obj)
          }
        });
        request
        .get("/device/group", {
        })
        .then((res) => {
          console.log(res);
          this.group = []
          for (let i = 0; i < res.data.length; i++) {
            var obj ={}
            obj.value=res.data[i]
            this.group.push(obj)
          }
        });
    },
    reset() {
      this.searchName = "";
      this.searchMechanism = "";
      this.searchGroup = "";
      this.searchMAC = "";
      this.searchResolving = "";
      this.searchState = "";
      this.searchSchedule = "";
      this.searchSystem = "";
    },
    details() {
      this.dv2 = true;
      this.form = {};
    },
    save1() {
      this.dv2 = false; //关闭弹窗
    },
    save() {
      console.log(this.form);
      request.put("/device", this.form).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "更新成功",
          });
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
        this.load(); //刷新表格的数据
        this.dv1 = false; //关闭弹窗
      });
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dv1 = true;
    },
    handleDelete(id) {
      console.log(id);
      request.delete("/device/" + id).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
        this.load(); //刷新表格的数剧
      });
    },
    handleSizeChange(pageSize) {
      //改变当前每页的个数
      this.pageSize4 = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      //改变当前页码
      this.currentPage4 = pageNum;
      this.load();
    },
  },
};
</script>
