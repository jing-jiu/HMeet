<template>
  <div class="popContainer">
    <div class="home auto flex flow-column">
      <!-- 个人信息 -->
      <div class="info flex a-center j-around">
        <div class="avator">
          <img :src="info.avator" alt="" v-if="info.avator" />
          <div class="img" v-else></div>
        </div>
        <div class="username">
          {{ info.nickname }}
        </div>
        <div class="setup" :class="isSetup ? 'rotate' : 'rotated'">
          <i class="el-icon-setting" @click="isSetup = !isSetup"></i>
          <div class="set" :class="!isSetup ? 'seting' : 'seted'">
            <div class="set-c flex" @click="$router.push('/home/info')">
              <i class="el-icon-user"></i>
              <div class="title">个人信息</div>
            </div>
            <div class="set-c flex" @click="logout">
              <i class="el-icon-switch-button"></i>
              <div class="title">退出登录</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 菜单 -->
      <div class="flex menu-c j-around">
        <div v-for="(menuConfig, idx) in menuConfigs" :key="idx">
          <MenuCard :menuConfig="menuConfig"></MenuCard>
        </div>
      </div>
      <!-- 历史会议 -->
      <div class="history flex a-center j-between" @click="$router.push('/home/history')">
        <div class="title">历史会议</div>
        <div class="logo"></div>
      </div>
      <!-- 当前会议 -->
      <div class="lists auto">暂无会议</div>
      <!-- 拖放组件 -->
    </div>
  </div>
</template>

<script>
import MenuCard from "@/components/MenuCard";
import Drag from "@/components/DragItDude";
export default {
  name: "Home",
  components: {
    MenuCard,
    Drag,
  },
  data() {
    return {
      info: JSON.parse(localStorage.getItem("userInfo")),
      menuConfigs: [
        {
          haveConfig: false,
          icon: "el-icon-circle-plus-outline",
          name: "加入会议",
          linkto: "/home/joinMeet",
          configs: [],
        },
        {
          haveConfig: true,
          name: "快速会议",
          icon: "el-icon-lightning",
          linkto: "/home/quicklyMeet",
          configs: ["开启视频", "使用个人会议号"],
        },
        {
          haveConfig: true,
          icon: "el-icon-time",
          name: "预定会议",
          linkto: "/home/reserveMeet",
          configs: ["特邀会议", "网络研讨会"],
        },
      ],
      isSetup: false,
    };
  },
  watch: {
    // 当账号密码不为空时允许登录注册
    info: {
      handler(newVal) {
        if (newVal.password && newVal.username) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    logout() {
      this.$confirm("确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sessionStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  @media only screen and (max-width: 750px) {
    min-width: 90%;
  }
  min-width: 22%;
  min-height: 86%;
  padding: 1% 1%;
  background: #fff;
  .info {
    .avator {
      .img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }
    .username {
      font-size: 25px;
      width: 60%;
    }
    .setup {
      font-size: 25px;
      transition: all 0.3s;
      cursor: pointer;
      position: relative;
      z-index: 9999;
      &.rotate {
        transform: rotate(0deg);
      }
      &.rotated {
        transform: rotate(90deg);
      }
      .set {
        overflow: hidden;
        transition: all 0.6s;
        position: absolute;
        left: 0;
        top: 130%;
        font-size: 15px;
        background: rgb(255, 255, 255);
        border-radius: 5px;
        .set-c {
          margin-top: 10px;
          .title {
            margin-left: 3%;
          }
        }
        &.seting {
          width: 0px;
          transform: rotate(360deg);
        }
        &.seted {
          width: 80px;
          padding: 5px;
          transform: rotate(0deg);
          box-shadow: 1px 1px 10px #aaa;
        }
      }
    }
  }
  .menu-c {
    margin-top: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #aaa;
  }
  .history {
    width: 60px;
    height: 20px;
    padding: 5px 8px;
    border-radius: 20px 0 0 20px;
    position: absolute;
    top: 34%;
    right: 0;
    font-size: 12px;
    color: #409eff;
    background: #d3e9ff;
    opacity: 0.9;
    cursor: pointer;
    .logo {
      width: 4px;
      height: 4px;
      border-top: 2px solid #409eff;
      border-right: 2px solid #409eff;
      transform: rotate(45deg);
    }
  }
}
</style>
