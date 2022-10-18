<template>
  <b-modal :size="size" v-model="innerValue" @hidden="resetModal" hide-footer :title="title">
    <!-- Modal Content -->
    <slot name="body" />

    <!-- Modal Footer -->
    <div class="modal-footer mt-3 d-flex justify-content-end">
      <slot name="footer" :hide="hide" />
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "ModalControl",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: { type: String },
    size: {
      type: String,
      default: "md",
    },
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  methods: {
    resetModal() {
      this.hide();
    },
    hide() {
      this.$store.dispatch("validation/clearErrors");

      this.$emit("input", false);
      this.$emit("hide");
    },
  },
  watch: {
    value(newVal) {
      this.innerValue = newVal;
      if (newVal) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  background: rgba(0, 0, 0, 0.6);
  .modal-dialog {
    // margin-top: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
@media (min-width: 576px) {
  .modal-dialog {
    max-width: 565px;
  }
}
@media (min-width: 992px) {
  .modal-dialog {
    max-width: 800px;
  }
}
</style>
