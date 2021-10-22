<template>
  <div class="popContainer">
    <div class="login auto flex flow-column">
      <div class="logo">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <el-form label-position="top" label-width="80px" :model="info">
        <el-form-item label="请输入验证邮箱">
          <el-input v-model="info.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" :disabled="haveEmail" @click="forget"
            >发送验证码</el-button
          >
        </el-form-item>
        <el-form-item label="请输入验证码">
          <el-input v-model="info.checkCode"></el-input>
        </el-form-item>
      </el-form>
      <el-button
        :disabled="disabled"
        class="x-auto"
        type="primary"
        @click.prevent="submit"
        >找回密码</el-button
      >
    </div>
  </div>
</template>

<script>
import { forget, sendCode } from "@/utils/getData.js";
export default {
  name: "Login",
  data() {
    return {
      disabled: true,
      haveEmail: true,
      info: {
        email: "3183626261@.com",
        checkCode: "",
      },
    };
  },
  watch: {
    // 当账号密码不为空时允许登录注册
    info: {
      handler(newVal) {
        if (newVal.email && newVal.checkCode) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
        if (newVal.email) {
          this.haveEmail = false;
        } else {
          this.haveEmail = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    async forget() {
      let res = await sendCode(this.info);
      if (res.status === 200) {
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
    async submit() {
      let res = await forget(this.info);
      if (res.status === 200) {
        this.$message({
          type: "success",
          message: res.message,
        });
        this.$router.push("/reset");
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
.login {
  min-width: 20%;
  min-height: 90%;
  padding: 0 2%;
  background: #fff;
  @media only screen and (max-width: 750px) {
    min-width: 90%;
  }
  .logo {
    margin: 0 auto;
    img {
      width: 300px;
    }
  }
}
</style>
