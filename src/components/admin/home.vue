<template>
  <div class="body">
    <div class="topChart">
      <div class="top">
        <img src="@/assets/img/equipment.png" />
        <div class="tr">
          <p>设备数量</p>
          <span>{{ count1 }}</span>
        </div>
      </div>
      <div class="top">
        <img src="@/assets/img/programme.png" />
        <div class="tr">
          <p>节目数量</p>
          <span>{{ count2 }}</span>
        </div>
      </div>
      <div class="top">
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
            <div class="demo-progress">
              <el-progress type="circle" :percentage="100">
                <span class="percentage-value">{{ count1 }}</span>
                <span class="percentage-label">台</span>
              </el-progress>
            </div>
            <div class="cardRight" @click="$router.push('/deviceList')">
              <ul>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(120, 128, 141)"
                  ></span
                  ><span>离线</span>
                  <span style="margin-left:20px">{{countLx}}台</span>
                </li>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(78, 203, 115)"
                  ></span
                  ><span>播放</span>
                  <span style="margin-left:20px">{{countBf}}台</span>
                </li>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(251, 212, 55)"
                  ></span
                  ><span>空闲</span>
                  <span style="margin-left:20px">{{countKx}}台</span>
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
            <div class="demo-progress">
              <el-progress type="circle" :percentage="100" color="#e2c244">
                <span class="percentage-value">5.03</span>
                <span class="percentage-label">MB</span>
              </el-progress>
            </div>
            <div class="cardRight" @click="$router.push('/deviceList')">
              <ul>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(251, 212, 55);"
                  ></span
                  ><span>图片</span>
                  <span style="margin-left:20px">5.03MB</span>
                </li>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(24, 144, 255);"
                  ></span
                  ><span>视频</span>
                  <span style="margin-left:20px">0B</span>
                </li>
                <li>
                  <span
                    class="cr"
                    style="background-color: rgb(151, 95, 229);"
                  ></span
                  ><span>音频</span>
                  <span style="margin-left:20px">0B</span>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      count1: 0,
      count2: 0,
      count3: 0,
      countLx: 0,
      countBf: 0,
      countKx: 0,
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      request.get("/device/sum", {}).then((res) => {
        console.log(res);
        this.count1 = res.data;
      });
      request.get("/program/sum", {}).then((res) => {
        console.log(res);
        this.count2 = res.data;
      });
      request.get("/schedule-list/sum", {}).then((res) => {
        console.log(res);
        this.count3 = res.data;
      });
      request.get("/device/statesum", {}).then((res) => {
        console.log(res);
        this.countLx = res.data[0];
        this.countKx = res.data[1];
        this.countBf = res.data[2];
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.body{
  background-color: rgb(248, 248, 248);
}
.topChart {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 130px;
  .top {
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
.mid{
  display: flex;
}

//设备状态表
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
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
.cardRight{
  margin-left: 30px;
  li{
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
  width: 370px;
}
</style>