<template>
  <div class="popContainer">
    <div class="userInfo auto flex flow-column">
      <div class="logo">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <el-form label-position="right" label-width="100px" :model="info">
        <el-form-item label="修改头像:">
          <el-upload
            class="avatar-uploader"
            :action="'https://localhost:3000' + '/upload'"
            :headers="getAuthor()"
            :show-file-list="false"
            :on-success="success"
          >
            <img v-if="info.avator" :src="info.avator" class="avatar" />
            <i class="el-icon-plus uploader" v-else></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="修改昵称:">
          <el-input v-model="info.nickname"></el-input>
        </el-form-item>
        <el-form-item label="修改密码:">
          <el-input
            @keyup.enter.native="modify"
            v-model="info.password"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button class="x-auto button" type="primary" @click.prevent="modify"
        >修改信息</el-button
      >
    </div>
  </div>
</template>

<script>
import { modify } from "@/utils/getData.js";
export default {
  name: "UserInfo",
  data() {
    return {
      info: JSON.parse(localStorage.getItem("userInfo")),
    };
  },
  methods: {
    async modify() {
      let res = await modify(this.info);
      console.log(res);
      if (res.status == 200) {
        this.$message({
          type: "success",
          message: res.data.message,
        });
        this.$router.push("/");
      } else {
        this.$message({
          type: "error",
          message: res.data.message,
        });
      }
    },
    success(res) {
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        userInfo.avator = res.imgUrl
        localStorage.setItem('userInfo',JSON.stringify(userInfo))
        this.info.avator = res.imgUrl
        this.$store.commit("saveUserInfo",userInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-upload {
  .avatar {
    width: 60px;
    border-radius: 50%;
    transform: translateX(50%);
  }
  .uploader {
    font-size: 60px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    transform: translateX(50%);
    border: 1px dashed rgb(158, 156, 156);
    text-align: center;
  }
  .uploader:hover {
    border: 1px dashed rgb(1, 183, 255);
  }
}
.userInfo {
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
}
</style>
