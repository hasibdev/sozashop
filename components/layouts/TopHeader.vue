<template>
  <div class="bg-primary px-5" id="top-header" v-if="show">
    <div class="d-flex align-items-center">
      <div class="flex-grow-1 text-center">
        <span class="text-white">Please check you email and verify.</span>
        <a href="" @click.prevent="resendEmail" class="resend-link"
          >Resend Email</a
        >
      </div>
      <button @click="show = false" class="bg-transparent btn text-white">&#10006;</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
    };
  },
  methods: {
    async resendEmail() {
      const res = await this.$axios.$get('/email/resend');
      this.$toast.success(res.message)
    },
  },
};
</script>

<style lang="scss">
#top-header {
  position: absolute;
  width: 100%;
  z-index: 1000;

  .resend-link {
    color: #fff;
    text-decoration: underline !important;
  }
}
</style>
