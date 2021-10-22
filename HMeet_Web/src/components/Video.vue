<template>
  <div class="video flex" ref="video">
    <!-- 本地 -->
    <video
      class="myVideo localVideo"
      ref="localVideo"
      autoplay
      v-if="isVideo || isShare"
    ></video>
    <audio
      class="myAudio localAudio"
      ref="localAudio"
      autoplay
      v-if="isAudio"
    ></audio>
    <!-- 远端 -->
    <video
      class="myVideo remoteVideo"
      ref="remoteVideo"
      autoplay
      v-if="isVideo"
    ></video>
    <audio
      class="myAudio remoteAudio"
      ref="remoteAudio"
      autoplay
      v-if="isAudio"
    ></audio>
    <!-- 默认显示 -->
    <div class="init flex auto j-around" v-if="!isVideo && !isShare">
      <div class="user" v-for="(user, idx) in meetUsers">
        <div class="avator">
          <img :src="user.avator" />
        </div>
        <div class="username">
          {{ user.user }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video {
  width: 100%;
  height: 85%;
  position: absolute;
  top: 0;
  justify-content: space-around;
  align-items: center;
  .myVideo {
    width: 50%;
    object-fit: fill;
  }
  .init {
    width: 80%;
    flex-wrap: wrap;
    .avator {
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }
    .username {
      margin-top: 5px;
      font-size: 20px;
      width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }
}
</style>

<script>
import * as webrtc from "@/utils/webrtc";
export default {
  name: "VideoCard",
  props: ["isAudio", "isVideo", "isShare"],
  created() {
    this.$store.state.socket.on("connect", () => {
      console.log("连接成功");
    });
    this.$store.state.socket.on("receiveMeet", (data) => {
      this.meetUsers = data;
    });
  },
  beforeDestroy() {
    this.$store.state.socket.on("disconnect", function () {
      this.$store.state.socket.emit("user_leave", this.$store.state.meet.name);
    });
  },
  data() {
    return {
      constraints: {
        video: null,
        audio: null,
      },
      video: {
        width: 600,
        height: 350,
        frameRate: 60,
      },
      meetUsers: [],
    };
  },
  watch: {
    isAudio: {
      handler(newVal) {
        this.close();
        if (!newVal && !this.isVideo) {
          this.close();
          return;
        }
        this.constraints.audio = newVal;
        webrtc.start(this, this.constraints);
      },
    },
    isVideo: {
      handler(newVal) {
        this.close();
        if (!newVal && !this.isAudio) {
          this.close();
          return;
        }
        if (newVal) {
          this.constraints.video = this.video;
        } else {
          this.constraints.video = newVal;
        }
        this.constraints.audio = this.isAudio;
        webrtc.start(this, this.constraints);
      },
    },
    isShare: {
      handler(newVal) {
        this.close();
        if (!newVal && !this.isAudio) {
          this.close();
          return;
        }
        if (newVal) {
          this.constraints.video = this.video;
        } else {
          this.constraints.video = newVal;
        }
        this.constraints.audio = this.isAudio;
        webrtc.share(this, this.constraints);
      },
    },
  },
  methods: {
    close() {
      if (webrtc.socket) {
        webrtc.socket.emit("leave", this.$store.state.meet.number);
      }
      // 释放资源
      webrtc.closePeerConnection();
      webrtc.closeLocalMedia();
    },
  },
};
</script>