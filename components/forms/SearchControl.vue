<template>
  <input
    class="form-control"
    type="text"
    :style="{ width: width }"
    :value="value"
    :placeholder="placeholder"
    @input="debounceSearch"
  />
</template>

<script>
import _ from "lodash";
export default {
  props: {
    // Search default value
    value: {
      default: "",
    },

    // Set the width of search
    width: {
      type: String,
      default: "250px",
    },

    // Set search placeholder
    placeholder: {
      type: String,
      default: "Search...",
    },
  },

  methods: {
    // Don't use arrow function on _.debounce method
    debounceSearch: _.debounce(function (event) {
      this.$emit("input", event.target.value);
    }, 300),
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
