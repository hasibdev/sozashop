<template>
  <select-control :options="perPageOptions" :value="value" @input="handleInput" :showPlaceholder="false" track="value" title="label" :stack="true" label="Per Page"></select-control>
</template>

<script>
export default {
  props: {
    /**
     * Default selected value
     */
    value: {
      default: 25,
    },
  },
  data() {
    return {
      perPageOptions: [
        { value: 25, label: "25 Per Page" },
        { value: 50, label: "50 Per Page" },
        { value: 100, label: "100 Per Page" },
        { value: 500, label: "500 Per Page" },
        { value: 1000, label: "1000 Per Page" },
      ],
    };
  },

  methods: {
    handleInput(value) {
      // console.log(value);
      this.$emit("input", value);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
