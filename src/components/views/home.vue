<template>
  <div class="body">
    <div class="top">
      <div class="topChart">
        <img src="@/assets/img/equipment.png" />
        <div class="tr">
          <p>设备数量</p>
          <span>{{ count1 }}</span>
        </div>
      </div>
      <div class="topChart">
        <img src="@/assets/img/programme.png" />
        <div class="tr">
          <p>节目数量</p>
          <span>{{ count2 }}</span>
        </div>
      </div>
      <div class="topChart">
        <img src="@/assets/img/plan.png" />
        <div class="tr">
          <p>计划数量</p>
          <span>{{ count3 }}</span>
        </div>
      </div>
    </div>
    <div class="mid">
      <div class="midLeft">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>设备状态</span>
            </div>
          </template>
          <div class="card-body">
            <div class="demo-progress" style="margin-left: 20px">
              <el-progress type="circle" :percentage="100">
                <span class="percentage-value">{{ count1 }}</span>
                <span class="percentage-label">台</span>
              </el-progress>
            </div>
            <div
              class="cardRight"
              @click="$router.push('/deviceList')"
              style="margin-left: 55px"
            >
              <ul>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(120, 128, 141)"
                  ></span
                  ><span>离线</span>
                  <span style="margin-left: 20px">{{ countLx }}台</span>
                </li>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(78, 203, 115)"
                  ></span
                  ><span>播放</span>
                  <span style="margin-left: 20px">{{ countBf }}台</span>
                </li>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(251, 212, 55)"
                  ></span
                  ><span>空闲</span>
                  <span style="margin-left: 20px">{{ countKx }}台</span>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </div>
      <div class="midCenter">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>素材资源</span>
            </div>
          </template>
          <div class="card-body">
            <div class="demo-progress" style="margin-left: 20px">
              <el-progress type="circle" :percentage="100" color="#e2c244">
                <span class="percentage-value">5.03</span>
                <span class="percentage-label">MB</span>
              </el-progress>
            </div>
            <div
              class="cardRight"
              @click="$router.push('/deviceList')"
              style="margin-left: 55px"
            >
              <ul>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(251, 212, 55)"
                  ></span
                  ><span>图片</span>
                  <span style="margin-left: 20px">5.03MB</span>
                </li>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(24, 144, 255)"
                  ></span
                  ><span>视频</span>
                  <span style="margin-left: 20px">0B</span>
                </li>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(151, 95, 229)"
                  ></span
                  ><span>音频</span>
                  <span style="margin-left: 20px">0B</span>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </div>
      <div class="midRight">
        <el-card class="box-card1">
          <template #header>
            <div class="card-header">
              <span>设备分布</span>
              <el-select
                v-model="selection"
                placeholder="设备分布"
                style="width: 30%"
                clearable
                @change="initChart()"
              >
                <el-option
                  v-for="item in select"
                  :key="item.value"
                  :value="item.value"
                />
              </el-select>
            </div>
          </template>
          <div class="card-body" @click="$router.push('/deviceList')">
            <div class="echart" id="mychart" :style="myChartStyle"></div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="bottom">
      <div class="bottomLeft">
        <el-card class="box-card2">
          <template #header>
            <div class="card-header">
              <span>计划列表</span>
            </div>
          </template>
          <div class="card-body">
            <el-table :data="tableData" max-height="200" style="width: 100%">
              <el-table-column fixed type="index" label="序号" width="100" />
              <el-table-column prop="name" label="计划名称" width="180" />
              <el-table-column prop="state" label="计划状态" width="150">
                <template #default="scope">
                  <el-tag v-if="scope.row.state == 5" type="danger"
                    >待发布</el-tag
                  >
                  <el-tag v-if="scope.row.state == 4" type="warning"
                    >发布中</el-tag
                  >
                  <el-tag v-if="scope.row.state == 3" type="success"
                    >发布成功</el-tag
                  >
                  <el-tag v-if="scope.row.state == 2" type="danger"
                    >发布失败</el-tag
                  >
                  <el-tag v-if="scope.row.state == 1" type="info"
                    >已结束</el-tag
                  >
                  <el-tag v-if="scope.row.state == 0">审核中</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="提交时间" width="230" />
              <el-table-column prop="person" label="提交人" />
            </el-table>
          </div>
        </el-card>
      </div>
      <div class="bottomRight">
        <el-card class="box-card3">
          <template #header>
            <div class="card-header">
              <span>事件记录</span>
            </div>
          </template>
          <div class="card-body">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :hollow="activity.hollow"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import * as echarts from "echarts";
import { MoreFilled } from "@element-plus/icons-vue";

export default {
  data() {
    return {
      count1: 0,
      count2: 0,
      count3: 0,
      countLx: 0,
      countBf: 0,
      countKx: 0,
      selection: "分组",
      select: [
        {
          value: "分组",
        },
        {
          value: "机构",
        },
      ],
      xData: ["Mon", "Tue"], //横坐标
      yData: [2, 3], //数据
      myChartStyle: { float: "left", width: "300%", height: "230px" }, //图表样式

      tableData: [
        {
          id: "2016-05-03",
          name: "Tom",
          state: "No. 189, Grove St, Los Angeles",
          time: "2020/12/12",
          person: "yyx",
        },
      ],
      activities: [
        {
          content: "[计划]9868676计划被拒绝",
          timestamp: "2022-06-28 10:50:22",
          size: "large",
          type: "primary",
          icon: MoreFilled,
        },
        {
          content: "[计划]12312312dad计划发布成功",
          timestamp: "2022-06-27 15:50:46",
          size: "large",
          type: "primary",
          icon: MoreFilled,
        },
        {
          content: "[设备]测试误删设备已上线",
          timestamp: "2022-06-27 15:50:24",
          size: "large",
          type: "primary",
          icon: MoreFilled,
        },
        {
          content: "[设备]测试误删设备注册成功",
          timestamp: "2022-06-27 14:31:14",
          size: "large",
          type: "primary",
          icon: MoreFilled,
        },
      ],
    };
  },
  mounted() {},
  created() {
    this.load();
  },
  methods: {
    load() {
      request.get("/device/sum", {}).then((res) => {
        //console.log(res);
        this.count1 = res.data;
      });
      request.get("/program/sum", {}).then((res) => {
        //console.log(res);
        this.count2 = res.data;
      });
      request.get("/schedule-list/sum", {}).then((res) => {
        //console.log(res);
        this.count3 = res.data;
      });
      request.get("/device/statesum", {}).then((res) => {
        //console.log(res);
        this.countLx = res.data[0];
        this.countKx = res.data[1];
        this.countBf = res.data[2];
      });
      request.get("/grouping/group", {}).then((res) => {
        // console.log(res);
        //console.log(this.yData);
        this.xData = [];
        this.yData = [];
        for (let i = 0; i < res.data.length; i++) {
          this.xData.push(res.data[i].groupingName);
          this.yData.push(res.data[i].groupingDevicecount);
        }
        //console.log(this.xData);
        this.initEcharts();
      });
      request.get("/schedule-list/schedule", {}).then((res) => {
        console.log(res);
        this.tableData = [];
        for (let i = 0; i < res.data.length; i++) {
          var obj = {};
          obj.id = res.data[i].listId;
          obj.name = res.data[i].listName;
          obj.state = res.data[i].listState;
          obj.time = res.data[i].listUpdate;
          obj.person = res.data[i].listAuthor;
          this.tableData.push(obj);
        }
      });
    },
    initChart() {
      if (this.selection == "分组") {
        request.get("/grouping/group", {}).then((res) => {
          //console.log(res);
          this.xData = [];
          this.yData = [];
          for (let i = 0; i < res.data.length; i++) {
            this.xData.push(res.data[i].groupingName);
            this.yData.push(res.data[i].groupingDevicecount);
          }
          //console.log(this.xData);
          this.initEcharts();
        });
      } else if (this.selection == "机构") {
        request.get("/grouping/mechanism", {}).then((res) => {
          //console.log(res);
          this.xData = [];
          this.yData = [];
          for (let i = 0; i < res.data.length; i++) {
            this.xData.push(res.data[i].groupingMechanism);
            this.yData.push(res.data[i].groupingDevicecount);
          }
          //console.log(this.xData);
          //console.log(this.yData);
          this.initEcharts();
        });
      }
    },
    initEcharts() {
      // 基本柱状图

      const option = {
        xAxis: {
          data: this.xData,
        },
        yAxis: { minInterval: 1 },
        series: [
          {
            type: "bar", //形状为柱状图
            data: this.yData,
            itemStyle: {
              color: "#1890ff",
            },
          },
        ],
      };
      const myChart = echarts.init(document.getElementById("mychart"));
      myChart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.body {
  background-color: rgb(248, 248, 248);
}
.top {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 130px;
  .topChart {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    margin-left: 30px;
    width: 30%;
    height: 70px;
    background-color: #fff;
    box-shadow: 3px 3px 3px #e6e6e6;
    img {
      margin: 10px;
      margin-top: 12px;
      width: 45px;
      height: 45px;
    }
    .tr {
      display: flex;
      flex-direction: column;
      margin-top: 6px;
      span {
        font-size: 25px;
        font-weight: 600;
      }
    }
  }
}
.mid {
  margin-top: 15px;
  display: flex;
  .midRight {
    .echart {
      margin-top: -50px;
    }
  }
}
.bottom {
  display: flex;
  margin-top: 30px;
}
//设备状态表
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 32px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 18px;
}
//卡片
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-body {
  display: flex;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.cardRight {
  margin-left: 30px;
  li {
    list-style-type: none;
    margin-top: 15px;
  }
  .cr {
    position: relative;
    top: -1px;
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 8px;
    border-radius: 8px;
  }
}
.box-card {
  margin-left: 30px;
  width: 400px;
}
.box-card1 {
  height: 240px;
  margin-left: 30px;
  width: 540px;
}
.box-card2 {
  height: 320px;
  margin-left: 30px;
  width: 830px;
}
.box-card3 {
  height: 310px;
  margin-left: 30px;
  width: 540px;
}
</style>
