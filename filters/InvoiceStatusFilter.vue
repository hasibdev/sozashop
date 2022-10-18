<template>
  <select-control
    :options="getStatus"
    :value="value"
    @input="handleInput"
    track="value"
    title="name"
    name="invoice-status"
    :stack="true"
    label="Status"
  ></select-control>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    /**
     * Default selected value
     */
    value: {
      default: "",
    },
  },
  computed: {
    ...mapGetters({
      getStatus: "config/getInvoiceStatus",
    }),
  },

  methods: {
    handleInput(value) {
      // console.log(value);
      this.$emit("input", value);
    },
  },
};
</script>

<style lang="scss" scoped></style>
