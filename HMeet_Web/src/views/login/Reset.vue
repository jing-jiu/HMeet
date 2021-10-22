<template>
  <div class="popContainer">
    <div class="login auto flex flow-column">
      <div class="logo">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <el-form label-position="top" label-width="80px" :model="info">
        <el-form-item label="账号:">
          <el-input v-model="info.username"></el-input>
        </el-form-item>
        <el-form-item label="输入新的密码:">
          <el-input
            @keyup.enter.native="reset"
            v-model="info.password"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        :disabled="disabled"
        class="x-auto button"
        type="primary"
        @click.prevent="reset"
        >登录</el-button
      >
    </div>
  </div>
</template>

<script>
import { reset } from "@/utils/getData.js";
export default {
  name: "Login",
  data() {
    return {
      disabled: true,
      info: {
        username: "123",
        password: "123",
      },
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
    async reset() {
      let res = await reset(this.info);
      const token = res.token;
      if (token) {
        this.$message({
          type: "success",
          message: res.data.message,
        });
        this.$store.commit("saveUserInfo", res.data);
        console.log(this.$store.state.userInfo);
        sessionStorage.token = token;
        this.$router.push("/");
      } else {
        this.$message({
          type: "error",
          message: res.data.message,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  @media only screen and (max-width: 750px) {
    min-width: 90%;
  }
  min-width: 20%;
  min-height: 90%;
  padding: 0 2%;
  background: #fff;
  .logo {
    margin: 0 auto;
    img {
      width: 300px;
    }
  }
  .button {
    margin-top: 15% !important;
  }
  .forget {
    position: absolute;
    bottom: 5%;
    right: 5%;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
