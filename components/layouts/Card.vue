<template>
  <div class="card shadow-sm">
    <div class="card-title">
      <slot name="header"></slot>
    </div>
    <div class="card-body px-3 py-2">
      <slot></slot>
    </div>
    <div class="card-footer" v-if="this.$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="scss" scoped>

</style>
