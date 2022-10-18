<template>
  <date-range v-model="dateRange" @input="handleInput" opens="left" label="Select Date" stack></date-range>
</template>

<script>
export default {
  data() {
    return {
      dateRange: {},
    };
  },
  methods: {
    handleInput(value) {
      this.$emit("input", value);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
