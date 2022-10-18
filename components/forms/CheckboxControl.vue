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
        type="checkbox"
        :checked="value"
        :readonly="readonly"
        @input="$emit('input', $event.target.checked)"
      />
      <span class="text-danger">{{ error[0] }}</span>
    </div>
  </div>
</template>

<script>
export default {
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
    }
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      required: false
    },
    error: {
      type: Array,
      default: () => []
    },
    name: {
      type: [String, Number],
      required: false
    },
    label: {
      type: String,
      require: true
    },

    // Stack label
    stack: {
      type: Boolean,
      default: false
    }
  },
};
</script>

<style lang="scss" scoped></style>
