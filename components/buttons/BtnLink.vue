<template>
  <nuxt-link exact class="btn px-4" :to="localePath(to)">
    <slot></slot>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    to: {
      type: [Object, String],
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
