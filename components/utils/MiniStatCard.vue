<template>
  <div class="card mini-stat bg-primary text-white">
    <div class="card-body">
      <div class="mb-4">
        <div class="float-left mini-stat-img mr-4">
          <img :src="img" alt />
        </div>
        <h5 class="font-size-16 text-uppercase mt-0 text-white-50">
          {{ title }}
        </h5>
        <h4 class="font-weight-medium font-size-24">
          {{ amount }}
          <!-- <i class="mdi mdi-arrow-up text-success ml-2"></i> -->
        </h4>
      </div>
      <div class="pt-2" role="button">
        <div class="float-right">
          <a href="#" class="text-white-50">
            <i class="mdi mdi-arrow-right h5"></i>
          </a>
        </div>

        <p class="text-white-50 mb-0 mt-1">More Details</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "amount", "img"],
};
</script>

<style lang="scss" scoped>
</style>