<template>
  <!-- Confirm -->
  <span>
    <slot :ids="ids" :confirm="confirm">
      <button class="btn btn-sm btn-primary mr-2" @click="confirm(ids)" v-if="variant == 'button'">
        <slot name="action-icon"></slot> Confirm
      </button>
      <b-dropdown-item @click.prevent="confirm(ids)" v-if="variant == 'dropdown'">
        <slot name="action-icon">
          <i class="fas fa-check-square text-primary mr-1"></i>
        </slot> Confirm Invoice
      </b-dropdown-item>
    </slot>
  </span>
</template>

<script>
export default {
  props: {
    ids: {
      type: Array,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: "button",
    },
  },
  methods: {
    confirm(ids, url) {
      this.$swal
        .fire({
          title: "Are you sure want to confirm?",
          icon: "warning",
          confirmButtonColor: "var(--primary)",
          cancelButtonColor: "var(--danger)",
          showCancelButton: true,
          confirmButtonText: "Yes, confirm!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$axios.post(`actions/${this.url}/confirm`, {
                ids: ids,
              });

              this.$emit("confirmed");
              this.$toast.success("Confirmed successfully");
            } catch (error) {
              this.$toast.error("Something wend wrong!");
              console.error(error);
            }
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
