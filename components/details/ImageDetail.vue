<template>
  <div class="row py-3 detail-input">
    <div class="col-6 col-sm-2">
      <h6 class="text-gray">{{ label }}</h6>
    </div>
    <div class="col-6 col-sm-10">
      <slot :value="value">
        <a v-if="value" target="_blank" :href="value">
          <img style="max-width: 222px;" :src="value" :alt="altText" />
        </a>
        <span v-else>-</span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      require: true,
    },
    altText: {
      type: String,
    },
    value: {
      type: [String, Number, Boolean, Array],
      default: "",
    },
  },
};
</script>

<style lang="scss">
.detail-input:not(:last-child) {
  border-bottom: 1px solid var(--secondary);
}
</style>
