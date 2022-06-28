<template>
  <div v-wechat-title="$route.meta.title" class="home" style="padding: 20px">
    <!--    功能-->

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
      ></el-select>
      <el-select
        v-model="searchGroup"
        placeholder="所属分组"
        style="width: 20%; margin-right: 20px"
        clearable
      ></el-select>
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
      ></el-select>
      <el-select
        v-model="searchState"
        placeholder="设备状态"
        style="width: 20%; margin-right: 20px"
        clearable
      ></el-select>
      <el-select
        v-model="searchSystem"
        placeholder="系统版本"
        style="width: 20%; margin-right: 20px"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="searchSchedule"
        placeholder="当前计划"
        style="width: 20%; margin-right: 20px"
        clearable
      ></el-select>
      <el-button style="margin-left: 10px; margin-right: 10px" @click="load"
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
      <el-table-column prop="deviceState" label="设备状态" />
      <el-table-column prop="institute" label="系统升级" />
      <el-table-column prop="deviceSchedule" label="当前计划" />

      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="details">详情</el-button>
          <el-button @click="handleEdit(scope.row)">控制</el-button>
          <el-button @click="handleEdit(scope.row)">刷新</el-button>
          <el-button @click="edit">编辑</el-button>
          <el-popconfirm
            title="确认删除?"
            @confirm="handleDelete(scope.row.studentId)"
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
            <el-input v-model="form.sex" style="width: 80%" />
          </el-form-item>
          <el-form-item label="所属分组">
            <el-input v-model="form.email" style="width: 80%" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dv1 = false">取消</el-button>
            <el-button type="primary" @click="save">确认</el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog v-model="dv2" title="编辑设备" width="30%">
        <el-form :model="form" label-width="120px">
          <el-tabs type="border-card">
            <el-tab-pane label="设备信息">User</el-tab-pane>
            <el-tab-pane label="安装信息">Config</el-tab-pane>
            <el-tab-pane label="状态信息">Role</el-tab-pane>
          </el-tabs>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dv2 = false">取消</el-button>
            <el-button type="primary" @click="save">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>


<script>
// @ is an alias to /src
import { ref } from "vue";

import request from "@/utils/request";

export default {
  name: "deviceList",
  components: {},
  data() {
    return {
      searchName:'',
      searchMechanism:'',
      searchGroup:'',
      searchMAC:'',
      searchResolving:'',
      searchState:'',
      searchSchedule:'',
      searchSystem:'',
      currentPage4: 1,
      pageSize4: 10,
      total: 0,
      dv1: false,
      dv2: false,
      form: {},
      tableData: [],
      options: [
        {
          value: "Option1",
          label: "全部",
        },
        {
          value: "Option2",
          label: "已是最新",
        },
        {
          value: "Option3",
          label: "升级",
        },
        {
          value: "Option4",
          label: "有新版本",
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
            group:this.searchGroup,
            mac:this.searchMAC,
            resolving:this.searchResolving,
            state:this.searchState,
            schedule:this.searchSchedule,
            system:this.searchSystem
          },
        })
        .then((res) => {
          console.log(res);
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    edit() {
      this.dv1 = true;
      this.form = {};
    },
    details() {
      this.dv2 = true;
      this.form = {};
    },
    save() {
      if (this.form.studentId) {
        request.put("/student", this.form).then((res) => {
          console.log(res);
          if (res.code === "0") {
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
      } else {
        request.post("/student", this.form).then((res) => {
          console.log(res);
          if (res.code === "0") {
            this.$message({
              type: "success",
              message: "新增成功",
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
      }
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dv1 = true;
    },
    handleDelete(id) {
      console.log(id);
      request.delete("/student/" + id).then((res) => {
        console.log(res);
        if (res.code === "0") {
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
