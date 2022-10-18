<template>
  <div class="row py-3 detail-input">
    <div :class="`col-6 ${getLabelclass}`">
      <h6 class="text-gray">{{ label }}</h6>
    </div>
    <div :class="`col-6 ${getFieldclass}`">
      <slot :value="value">{{ getOutputValue() }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    getLabelclass() {
      return this.label && this.stack === false
        ? this.inModal
          ? "col-sm-4"
          : "col-sm-2"
        : "col-sm-12";
    },
    getFieldclass() {
      return this.label && this.stack === false
        ? this.inModal
          ? "col-sm-8"
          : "col-sm-10"
        : "col-sm-12";
    },
  },
  props: {
    label: {
      type: String,
      require: true,
    },
    value: {
      type: [String, Number, Boolean, Array],
      default: "",
    },
    // Stack label
    stack: {
      type: Boolean,
      default: false,
    },
    // update column for modal use
    inModal: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getOutputValue() {
      return this.value ?? "-";
    },
  },
};
</script>

<style lang="scss">
.detail-input:not(:last-child) {
  border-bottom: 1px solid var(--secondary);
}
</style>
