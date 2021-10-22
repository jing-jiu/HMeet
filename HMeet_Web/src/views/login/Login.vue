<template>
  <div class="popContainer">
    <div class="login auto flex flow-column">
      <div class="logo">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <div class="info">
        <div class="avator"></div>
        <input
          type="text"
          class="input" :class="focus === 1 ? 'active' : ''" @focus="focus = 1"
          v-model="info.username"
          placeholder="请输入您的账号"
        />
        <input
          type="password"
          class="input margin" :class="focus === 0 ? 'active' : ''" @focus="focus = 0"
          v-model="info.password"
          placeholder="请输入您的密码"
        />
         <button class="button" @click="submit">登录/注册</button>
        <div class="forget" @click="forget">
          忘记密码>>
        </div>
        <div class="container">
          <div class="water"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/utils/getData.js";
export default {
  name: "Login",
  data() {
    return {
      disabled: true,
      info: {
        username: "",
        password: "",
      },
      focus:null,
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
    async submit() {
      let res = await login(this.info);
      const token = res.token;
      if (token) {
        this.$message({
          type: "success",
          message: res.data.message,
        });
        this.$store.commit("saveUserInfo", res.data);
        sessionStorage.token = token;
        localStorage.userInfo = JSON.stringify(res.data);
        this.$router.push("/");
      } else {
        this.$message({
          type: "error",
          message: res.data.message,
        });
      }
    },
    forget() {
      this.$router.push("/forget");
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
  background: #eee;
  .logo {
    margin: 0 auto;
    img {
      width: 150px;
    }
  }
  .info {
    width: 300px;
    height: 300px;
    margin: 0 auto;
    margin-top: 50px;
    position: relative;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    background: transparent;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    .avator {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      background: rgb(215, 219, 218);
    }
    .input {
      z-index: 999;
      background-color: transparent;
      border: none;
      border-bottom: 2px solid #bbb;
      outline: none;
      text-align: center;
      width: 60%;
      font-size: 15px;
      font-weight: 100;
      transform: translateY(-50%);
      transition: all 1s;
    }
    .active{
      border-bottom: 2px solid #000;
    }
    .margin {
      margin-top: 50px;
    }
    .container {
      position: absolute;
      width: 300px;
      height: 300px;
      .water {
        position: absolute;
        bottom: 0;
        width: 100%;
        background-image: linear-gradient(
          0deg,
          rgba(9, 198, 245,.6),
          rgba(44, 243, 120,.7)
        );
        animation: rise 12s linear forwards;
        overflow: hidden;
      }
      @keyframes rise {
        0% {
          height: 50px;
        }

        100% {
          height: 109%;
          filter: hue-rotate(360deg);
        }
      }
      .water::after {
        content: "";
        position: absolute;
        top: -370px;
        left: -75px;
        width: 450px;
        height: 450px;
        border-radius: 40%;
        background: #eee;
        animation: move 5s linear infinite;
      }
      @keyframes move {
        100% {
          transform: rotate(360deg);
        }
      }
      .water::before {
        content: "";
        position: absolute;
        top: -400px;
        left: -75px;
        width: 500px;
        height: 500px;
        border-radius: 45%;
        background-color: rgba(255, 255, 255, 0.5);
        animation: move2 7s linear infinite;
      }
      @keyframes move2 {
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }
  .button {
    z-index: 999;
    border: none;
    width: 100px;
    height: 30px;
    border-radius: 15px;
    margin-top: 40px;
    color: white;
    background: linear-gradient(90deg,rgba(9, 198, 245,.6),rgba(44, 243, 120,.7));
    transition: all 0.5s;
    cursor: pointer;
    font-size: 10px;
  }
  .forget {
    position: absolute;
    bottom: 5%;
    right: 5%;
    text-decoration: underline;
    cursor: pointer;
    z-index: 999;
  }
}
</style>
