<template>
  <select-control
    :options="options"
    :value="value"
    @input="handleInput"
    :showPlaceholder="false"
    track="value"
    title="label"
    :stack="true"
    label="Trashed"
  ></select-control>
</template>

<script>
export default {
  props: {
    /**
     * Default selected value
     */
    value: {
      default: ""
    }
  },
  data() {
    return {
      options: [
        { value: "", label: "Without Trashed" },
        { value: "with", label: "With Trashed" },
        { value: "only", label: "Only Trashed" }
      ]
    };
  },

  methods: {
    handleInput(value) {
      // console.log(value);
      this.$emit("input", value);
    }
  }
};
</script>

<style lang="scss" scoped></style>
