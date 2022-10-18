<template>
  <div>
    <p class="mb-0">{{ date }}</p>
    <p class="mb-1">{{ time }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: "",
      date: "",

      timerID: null,
    };
  },
  mounted() {
    this.timerID = setInterval(this.updateTime, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timerID);
  },
  methods: {
    updateTime() {
      const cd = new Date();
      this.date = this.$moment(cd).format("LL");
      this.time = this.$moment(cd).add(3, "days").calendar();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
