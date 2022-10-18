<template>
  <button @click.prevent="$emit('click')" class="btn btn-danger px-4">
    <slot></slot>
  </button>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
</style>
