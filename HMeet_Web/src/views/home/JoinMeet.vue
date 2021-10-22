<template>
  <div class="popContainer">
    <div class="join auto flex flow-column">
      <el-form ref="form" :model="meet" label-width="80px" label-position="top">
        <el-form-item label="会议号">
          <el-input v-model="meet.number"></el-input>
        </el-form-item>
        <el-form-item label="您的名称">
          <el-input v-model="meet.name"></el-input>
        </el-form-item>
      </el-form>
      <div class="meetConfig">
        <div class="title">会议设置</div>
        <el-checkbox-group v-model="config" class="flow-column">
          <el-checkbox
            :label="config"
            v-for="(config, idx) in configList"
            :key="idx"
          ></el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button
        class="joinMeet auto"
        type="primary"
        :disabled="disabled"
        @click="join"
        >加入会议</el-button
      >
    </div>
  </div>
</template>

<script>
import { joinMeet } from "@/utils/getData.js";
export default {
  name: "JoinMeet",
  data() {
    return {
      disabled: true,
      meet: {
        number: 130124,
        name: "hxh",
        username:JSON.parse(localStorage.getItem('userInfo')).username
      },
      config: ["自动连接音频", "入会开启麦克风"],
      configList: [
        "自动连接音频",
        "入会开启摄像头",
        "入会开启麦克风",
        "入会开启美颜",
      ],
    };
  },
  watch: {
    // 当账号密码不为空时允许登录注册
    meet: {
      handler(newVal) {
        if (newVal.number && newVal.name) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    async join() {
      // 判断加入的房间号是否有效
      let res = await joinMeet(this.meet);
      if (res.status === 200) {
        // 创建连接消息的socket 而不是信令服务器
        this.$store.commit(
          "saveSocket",
          this.$io("https://localhost:3000/chat")
        );
        // 将自己的会议号和昵称发送到chat空间的对应房间
        this.$store.state.socket.emit("sendMeet", this.meet);
        // 保存会议号及昵称
        this.$store.commit("saveMeet", this.meet);
        this.$router.push("/home/meet");
        this.$message({
          type: "success",
          message: res.message,
        });
      } else {
        this.$message({
          type: "error",
          message: res.message,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.join {
  @media only screen and (max-width: 750px) {
    min-width: 90%;
    padding: 0 5%;
  }
  min-width: 20%;
  min-height: 85%;
  padding: 1.2% 2%;
  background: #fff;
  .meetConfig {
    .title {
      margin-top: 1%;
      margin-bottom: 3%;
    }
    .el-checkbox {
      margin: 5px 0;
    }
  }
  .joinMeet {
    width: 85%;
    position: fixed;
    top: 90%;
  }
}
</style>
