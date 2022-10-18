<template>
  <div class="card mini-stat text-black">
    <div class="card-body ">
      <slot name="title">
        <h5 class="font-size-12 mt-0 text-black-50">
          <template v-if="url">
            <router-link :to="url">
              {{ title }}
            </router-link>
          </template>
          <template v-else>
            {{ title }}
          </template>

        </h5>
      </slot>
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="font-weight-medium font-size-24 mt-3">
          {{ amount }}
        </h4>
        <div v-if="img" class="mini-stat-img ml-1">
          <img :src="img" alt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "amount", "img", "url"],
};
</script>

<style lang="scss" scoped>
.mini-stat {
  box-shadow: 0px 0px 18px #e7dfdf;
}
</style>
