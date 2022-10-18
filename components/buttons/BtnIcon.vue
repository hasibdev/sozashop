<template>
  <button @click.prevent="$emit('click')" class="border-0 bg-transparent">
    <slot></slot>
  </button>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
