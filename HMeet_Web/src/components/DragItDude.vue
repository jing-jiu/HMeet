<template>
  <div id="range" ref="main" @mousemove="mousemove" @mouseup="mouseup">
    <div id="icon" ref="icon" @mousedown="mousedown">
      <slot></slot>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "Drag",
  data() {
    return {
      move: false,
      deltaLeft: 0,
      deltaTop: 0,
    };
  },
  methods: {
    mousemove(e) {
      if (this.move) {
        const cx = e.clientX;
        const cy = e.clientY;
        /** 相减即可得到相对于父元素移动的位置 */
        let dx = cx - this.deltaLeft;
        let dy = cy - this.deltaTop;

        /** 防止超出父元素范围 */
        if (dx < 0) dx = 0;
        if (dy < 0) dy = 0;
        if (dx > 500) dx = 500;
        if (dy > 300) dy = 300;
        this.$refs.icon.setAttribute("style", `left:${dx}px;top:${dy}px`);
      }
    },
    mouseup(e) {
      this.move = false;
      console.log("mouseup");
    },
    mousedown(e) {
      this.deltaLeft = e.clientX - e.target.offsetLeft;
      this.deltaTop = e.clientY - e.target.offsetTop;
      this.move = true;
    },
  },
};
</script>
 
<style lang="scss" scoped>
#range {
  position: relative;
  width: 100%;
  height: 100%;
  #icon {
    width: 200px;
    height: 200px;
    position: absolute;
    cursor: move;
    user-select: none;
  }
}
</style>