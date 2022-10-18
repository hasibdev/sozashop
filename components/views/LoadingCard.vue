<template>
  <div class="relative" :class="{ 'overflow-hidden': loading }">
    <div v-if="loading" class="d-flex align-items-center justify-content-center p-5" style="height:330px">
      <loader></loader>
    </div>

    <slot v-else />
  </div>
</template>

<script>
import Loader from "@/components/icons/Loader";
export default {
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Loader,
  },
};
</script>
