<template>
  <div class="body">
    <div class="left">
      <div class="screen">
        <div class="screenWarp">
          <div
            class="background"
            :style="{
              backgroundColor: this.color2,
              height: this.value2 + 'px',
              marginTop: this.value3 + 'px',
            }"
          >
            <div class="text">
              <marquee
                behavior="scroll"
                direction="left"
                :scrollamount = this.value
              >
                <p
                  :style="{
                    color: this.color1,
                    fontSize: this.value1 * 2 + 'px',
                  }"
                >
                  {{ this.input }}
                </p>
              </marquee>
            </div>
          </div>
        </div>
      </div>
      <div class="input">
        <el-input
          v-model="input"
          placeholder="请输入公告内容"
          type="textarea"
          clearable
          show-word-limit
          style="background-color: #292d3e; font-size: 16px"
          maxlength="300"
          :autosize="{ minRows: 6 }"
        />
      </div>
    </div>
    <div class="right">
      <div class="item">
        <div class="textControl">
          <div class="cc">
            <span class="demonstration">文字颜色:</span>
            <el-color-picker v-model="color1" />
          </div>
          <div class="cs">
            <span class="demonstration">文字字号:</span>
            <el-slider
              v-model="value1"
              show-input
              :min="3"
              :max="140"
              size="small"
            />
          </div>
        </div>
        <div class="bgControl">
          <div class="cc">
            <span class="demonstration">背景颜色:</span>
            <el-color-picker v-model="color2" />
          </div>
          <div class="cs">
            <span class="demonstration">背景高度:</span>
            <el-slider v-model="value2" show-input :max="421" size="small" />
          </div>
        </div>
        <div class="control">
          <div class="cs">
            <span class="demonstration">文字位置:</span>
            <el-slider v-model="value3" show-input :max="400" size="small" />
          </div>
          <div class="cs">
            <span class="demonstration">播放速度:</span>
            <el-select v-model="value">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      color1: "#000000",
      color2: "#ffffff",
      value: "6",
      value1: 3,
      value2: 20,
      value3: 0,
      options: [
        {
          value: "12",
          label: "快",
        },
        {
          value: "6",
          label: "中",
        },
        {
          value: "1",
          label: "慢",
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.body {
  display: flex;
}
.left {
  width: 66%;
  .screen {
    width: 100%;
    height: 500px;
    background: url("/src/assets/img/screen.png");
    background-size: cover;
    overflow: hidden;
    padding-bottom: 42px;
    .screenWarp {
      padding-left: 20px;
      padding-top: 40px;
      overflow: hidden;
      height: 100%;
      width: 100%;
      .background {
        width: 920px;
        margin-top: 40px;
        margin-left: 18px;
        z-index: 1000;
        .text {
          width: 920px;
          z-index: 1001;
          p {
            word-wrap: break-word;
          }
        }
      }
    }
  }
  .input {
    margin: 15px;
    width: 970px;
  }
}
.right {
  width: 33%;
  .item {
    .textControl {
      display: flex;
      flex-direction: column;
    }
    .cc {
      display: flex;
      align-items: center;
      margin-top: 30px;
      margin-right: 20px;
      .demonstration {
        margin-right: 20px;
      }
    }
    .cs {
      display: flex;
      align-items: center;
      margin-top: 30px;
      margin-right: 20px;
      .demonstration {
        width: 100px;
        margin-right: 20px;
      }
    }
  }
}
</style>