<template>
  <div class="form-group row align-items-center">
    <label class="mb-0" :class="[label && stack === false ? 'col-sm-2' : 'col-sm-12']" v-if="label">{{ label }}</label>
    <div :class="[label && stack === false ? 'col-sm-10' : 'col-sm-12']">
      <date-range-picker v-model="dateRange" single-date-picker="range" @toggle="toggle" class="d-block" :locale-data="dateLocalData" :opens="opens"> </date-range-picker>
    </div>
  </div>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  data() {
    return {
      dateRange: {},
      dateLocalData: {
        direction: "ltr",
        applyLabel: "Submit",
        format: "dd/mm/yyyy",
      },
    };
  },
  components: {
    DateRangePicker,
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
    toggle(value) {
      this.$emit("toggle", value);
    },
  },
  watch: {
    /**
     * Watch for Date change
     */
    dateRange(value) {
      const dateAsString = `${this.formatDate(
        value.startDate
      )},${this.formatDate(value.endDate)}`;
      this.$emit("input", dateAsString);
    },
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      required: true,
      default: null,
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
    type: {
      type: String,
      default: "text",
      validator: (val) =>
        val == "text" ||
        val == "number" ||
        val == "password" ||
        val == "tel" ||
        val == "email",
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
    opens: {
      type: String,
      default: "center",
    },
  },
};
</script>

<style lang="scss">
.form-group .calendars {
  flex-wrap: nowrap !important;
}
.daterangepicker.show-ranges .ranges {
  width: auto !important;
}
// .daterangepicker.show-ranges .ranges ul {
//   display: flex !important;
//   flex-wrap: wrap !important;
//   width: auto !important;
//   border-bottom: 1px solid #ddd;
// }
</style>
