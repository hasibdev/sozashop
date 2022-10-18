<template>
  <!-- Action Button -->
  <button @click.prevent="$emit('click')" class="btn btn-sm btn-primary mr-2">
    <slot>

    </slot>
  </button>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
