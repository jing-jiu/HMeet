<template>
  <div class="popContainer">
    <div class="meet auto flex flow-column">
      <VideoCard
        :isAudio="isAudio"
        :isVideo="isVideo"
        :isShare="isShare"
      ></VideoCard>
      <div class="menus flex j-around">
        <div class="i text-center" @click="audio">
          <i class="el-icon-microphone"></i>
          <div class="title" ref="aTitle">开启语音</div>
        </div>
        <div class="i text-center" @click="video">
          <i class="el-icon-video-camera"></i>
          <div class="title" ref="vTitle">开启视频</div>
        </div>
        <div class="i text-center" @click="share">
          <i class="el-icon-monitor"></i>
          <div class="title" ref="sTitle">共享屏幕</div>
        </div>
        <div class="i text-center" @click="upload">
          <i class="el-icon-upload"></i>
          <div class="title" ref="uTitle">上传文件</div>
        </div>
      </div>
      <el-button @click="outMeet" type="primary" v-if="!isRoot">退出会议</el-button>
      <el-button @click="closeMeet" type="primary" v-else>结束会议</el-button>
    </div>
  </div>
</template>

<script>
import VideoCard from "@/components/Video.vue";
import { outMeet,closeMeet } from "@/utils/getData";
export default {
  name: "Meet",
  components: {
    VideoCard,
  },
  created() {
    this.$message({
      type: "success",
      message: "进入会议",
    });
    this.$store.state.socket.on('root',(data)=>{
      if(data.name == this.$store.state.meet.name){
        this.isRoot = true
      }
    })
  },
  data() {
    return {
      isAudio: false,
      isVideo: false,
      isShare: false,
      localStream: "",
      meet: this.$store.state.meet,
      isRoot:null
    };
  },
  methods: {
    audio() {
      this.isAudio = !this.isAudio;
      if (this.isAudio) {
        this.$refs.aTitle.innerHTML = "关闭语音";
      } else {
        this.$refs.aTitle.innerHTML = "开启语音";
      }
    },
    video() {
      this.isVideo = !this.isVideo;
      if (this.isVideo) {
        this.$refs.vTitle.innerHTML = "关闭视频";
      } else {
        this.$refs.vTitle.innerHTML = "开启视频";
      }
    },
    upload() {
      console.log(123);
    },
    share() {
      this.isShare = !this.isShare;
      if (this.isShare) {
        this.$refs.sTitle.innerHTML = "关闭共享";
      } else {
        this.$refs.sTitle.innerHTML = "开启共享";
      }
    },
    async outMeet() {
      let res = await outMeet(this.meet);
      if (res.status === 200) {
        this.$message({
          type: "success",
          message: res.message,
        });
        this.$router.push('/home/joinMeet')
      } else {
        this.$message({
          type: "error",
          message: res.message,
        });
      }
    },
    async closeMeet() {
      let res = await closeMeet(this.meet);
      if (res.status === 200) {
        this.$message({
          type: "success",
          message: res.message,
        });
        this.$router.push('/home/joinMeet')
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
.meet {
  min-width: 65%;
  min-height: 90%;
  background: #fff;
  @media only screen and (max-width: 750px) {
    min-width: 90%;
  }
  .menus {
    width: 100%;
    position: absolute;
    bottom: 3%;
    .i {
      cursor: pointer;
      font-size: 30px;
      .title {
        margin-top: 5px;
        font-size: 12px;
      }
    }
  }
  .el-button {
    position: absolute;
    top: 1%;
    right: 1%;
    width: 100px;
  }
}
</style>
