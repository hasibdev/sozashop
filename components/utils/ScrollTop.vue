<template>
  <div v-if="isVisible" @click.prevent="scrollTop" class="back-to-top">
    <i class="fas fa-angle-double-up back-to-top__icon"></i>
    <span class="back-to-top__text">TOP</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    scrollTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    observeSection() {
      // console.log(window.scrollY);
      if (window.scrollY > 700) this.isVisible = true;
      else this.isVisible = false;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.observeSection);
  },
  destroyed() {
    window.removeEventListener("scroll", this.observeSection);
  },
};
</script>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  z-index: 99;
  bottom: 50px;
  right: 50px;
  width: 55px;
  height: 55px;
  color: #000;
  border-radius: 50%;
  border: 2px solid #edf3ff;
  background-color: #edf3ff;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  padding-top: 8px;
  //   display: none;
  box-shadow: 0 15px 16px -5px #0000002b;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: #d7deee;
    border-color: #d7deee;
  }
}
.back-to-top__icon {
  display: block;
  font-size: 24px;
  color: #555;
  margin-bottom: 3px;
}
.back-to-top__text {
  display: block;
  font-size: 12px;
  line-height: 12px;
  margin-top: -2px;
}
</style>