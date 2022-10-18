<template>
  <div>
    <Nuxt />
  </div>
</template>

<script>
export default {
  name: "print-layout",
  fetch() {
    this.$store.dispatch("config/setConfig", { url: "/users/config" });
  },
};
</script>

<style lang="scss" scoped></style>
