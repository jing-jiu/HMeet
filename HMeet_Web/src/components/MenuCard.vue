<template>
  <div class="menu j-around">
    <div class="icon" v-if="menuConfig.icon == ''" @click="$router.push(menuConfig.linkto)"></div>
    <div class="icon" v-else @click="$router.push(menuConfig.linkto)">
      <i :class="menuConfig.icon" class="i"></i>
    </div>
    <div class="title text-center">{{ menuConfig.name }}</div>
    <div
      :class="isDown ? 'btn_down' : 'btn_up'"
      class="btn"
      @click="isDown = !isDown"
      v-if="menuConfig.haveConfig"
    ></div>
    <div :class="isDown ? 'configs_hidden' : 'configs_show'" class="configs">
      <el-checkbox-group v-model="configState" class="config flow-column">
        <el-checkbox
          :label="item"
          v-for="(item, idx) in menuConfig.configs" :key="idx"
        ></el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  z-index: 999;
  position: relative;
  cursor: pointer;
  .icon {
    width: 70px;
    height: 70px;
    background: #409eff;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 40px;
  }
  .title {
    font-size: 13px;
    margin-top: 10%;
    font-weight: 900;
  }
  .btn {
    width: 5px;
    height: 5px;
    border-top: 3px solid #aaa;
    border-right: 3px solid #aaa;
    position: absolute;
    bottom: 8%;
    right: -5%;
    transition: all 0.3s;
  }
  .btn_down {
    transform: rotate(135deg);
  }
  .btn_up {
    transform: rotate(315deg);
  }
  .configs {
    font-size: 10px;
    position: absolute;
    border: #aaa 1px solid;
    transform: translateX(20%);
    transition: all 0.3s;
    background: #fff;
    .config {
      padding: 5px 10px;
    }
  }
  .configs_hidden {
    height: 0;
    overflow: hidden;
    border: none;
  }
  .configs_show {
    height: 60px;
  }
}
</style>

<script>
export default {
  name: "MenuCard",
  props: ["menuConfig"],
  data() {
    return {
      isDown: true,
      configState:[]
    };
  },
};
</script>