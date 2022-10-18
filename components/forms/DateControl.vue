<template>
  <div class="form-group row align-items-center">
    <label
      class="mb-0"
      :class="[label && stack === false ? 'col-sm-2' : 'col-sm-12']"
      v-if="label"
      >{{ label }}</label
    >
    <div :class="[label && stack === false ? 'col-sm-10' : 'col-sm-12']">
      <flat-pickr
        v-model="date"
        :config="dateConfig"
        class="form-control"
        placeholder="Select date"
        name="date"
      >
      </flat-pickr>
      <p class="text-muted mb-0"><slot name="help"></slot></p>
      <span>
        <slot name="action"></slot>
      </span>
      <span class="text-danger">{{ error[0] }}</span>
    </div>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
export default {
  name: "DateControl",
  components: {
    flatPickr,
  },
  data() {
    return {
      date: this.value,

      dateConfig: {
        altFormat: "M j, Y",
        altInput: true,
        dateFormat: "Y-m-d",
        allowInput: true,
        ...this.config,
      },
    };
  },
  watch: {
    date() {
      this.$emit("input", this.date);
    },
    value(newValue, oldValue) {
      if (newValue !== oldValue) this.date = newValue;
    },
  },
  props: {
    label: {
      type: String,
    },
    value: {
      type: [String, Number, Date],
      default: () => "",
    },
    config: {
      type: Array,
      default: () => {},
    },
    // Validation error
    error: {
      type: Array,
      default: () => [],
    },
    // Stack label
    stack: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped></style>
