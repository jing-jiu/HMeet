<template>
  <div class="popContainer">
    <div class="home auto flex flow-column">
      <div class="title">
        历史会议
      </div>
       <div class="historyList x-auto">
         <div class="history" v-for="(data,idx) in list">
           {{data}}
         </div>
       </div>
    </div>
  </div>
</template>

<script>
import {getHistory} from '@/utils/getData'
export default {
  name: "History",
  data() {
    return {
      info: JSON.parse(localStorage.getItem("userInfo")),
      list:[]
    };
  },
  created() {
    this.getHistory()
  },
  methods: {
    async getHistory(){
      let res = await getHistory(this.info)
      this.list = res
      console.log(this.list);
    }
  },
};
</script>

<style lang="scss" scoped>
.home {
  @media only screen and (max-width: 750px) {
    min-width: 90%;
  }
  .title{
    font-size: 30px;
  }
  .historyList{
    margin-top: 30px;
  }
  min-width: 22%;
  min-height: 86%;
  padding: 1% 1%;
  background: #fff;
}
</style>
