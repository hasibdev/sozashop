<template>
  <div class="form-group row align-items-center">
    <label
      :for="getName"
      class="mb-0"
      :class="[label && stack === false ? 'col-sm-2' : 'col-sm-12']"
      v-if="label"
      >{{ label }}</label
    >
    <div :class="[label && stack === false ? 'col-sm-10' : 'col-sm-12']">
      <input
        :id="getName"
        class="form-control"
        type="email"
        :value="value"
        :placeholder="placeholder"
        @input="$emit('input', $event.target.value)"
      />
      <p class="text-muted mb-0"><slot name="help"></slot></p>
      <span>
        <slot name="action"></slot>
      </span>
      <span class="text-danger">{{ error[0] }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
    },
    error: {
      type: Array,
      default: () => [],
    },
    name: {
      type: [String, Number],
      required: false,
    },
    label: {
      type: String,
      require: true,
    },
    placeholder: {
      type: String,
      required: false,
    },

    // Stack label
    stack: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    getName() {
      if (this.label) {
        return this.name
          ? this.name
          : this.label
              .replace(/([a-z])([A-Z])/g, "$1-$2")
              .replace(/\s+/g, "-")
              .toLowerCase();
      }
    },
  },
  watch: {
    /**
     * Watch for value change
     */
    value() {
      this.$emit("change", this.value);
    },
  },
};
</script>

<style lang="scss" scoped></style>
