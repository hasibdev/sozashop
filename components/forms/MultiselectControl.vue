<template>
  <div class="form-group row align-items-center">
    <label :for="getName" class="mb-0" :class="[label && stack === false ? 'col-sm-2' : 'col-sm-12']" v-if="label">{{ label }}</label>
    <div :class="[label && stack === false ? 'col-sm-10' : 'col-sm-12']">
      <multiselect tag-placeholder="Add this as new tag" :placeholder="placeholder" :label="title" :track-by="track" :options="options" :multiple="true" :taggable="true" v-model="innerValue" @input="handleInput" :disabled="readonly"></multiselect>
      <p class="text-muted mb-0">
        <slot name="help"></slot>
      </p>
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
    // Select options
    options: {
      type: [Array, Object],
      required: true,
    },

    // Input Label
    label: {
      type: String,
      required: false,
    },

    // Option title to show
    title: {
      type: String,
      default: "name",
    },

    // Return value for v-model
    track: {
      type: String,
      default: "id",
    },

    // Validation error
    error: {
      type: Array,
      default: () => [],
    },

    // Use for id and tag
    name: {
      type: [String, Number],
      required: false,
    },

    // Select placeholder
    placeholder: {
      type: String,
      default: "Choose Options",
    },

    // Default selected value
    value: {
      default: "",
    },

    // Control select placeholder
    showPlaceholder: {
      type: Boolean,
      default: true,
    },

    // Stack label
    stack: {
      type: Boolean,
      default: false,
    },

    // Make the controll disable
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      innerValue: this.value,
    };
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
  methods: {
    handleInput(innerValue) {
      const values = innerValue.map((value) => value[this.track]);
      if (values.includes("all")) {
        this.innerValue = [innerValue.find((value) => value.id === "all")];
        this.$emit("input", ["all"]);
      } else {
        this.$emit("input", values);
      }
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (!value?.length) {
          this.innerValue = [];
        }
      },
    },
  },
};
</script>

<style lang="scss">
.form-group {
  label {
    align-self: start;
  }
}
</style>
