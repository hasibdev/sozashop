<template>
   <loading-view :loading="isLoading">
      <detail-view v-if="product">
         <!-- Header -->
         <template #header>
            <h3 class="font-weight-normal mb-3">
               {{ $t("products.title.productName") }} : {{ product.name }}
            </h3>
         </template>
      </detail-view>
      <div>
         <h3 class="font-weight-normal">
            {{ $t("headings.productHistory") }}
         </h3>

         <div class="d-flex justify-content-between">
            <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
         </div>
      </div>

      <data-table :columns="columns" :url="`/products/${$route.params.id}/history`" :showIndex="true" :disableCheck="true" :filters="filters">
         <!-- Filter slot -->
         <template #filter>
            <page-filter v-model="filters.perPage"></page-filter>
         </template>
      </data-table>
   </loading-view>
</template>

<script>
export default {
   name: "History",
   meta: {
      permission: "view-products",
   },
   data() {
      return {
         product: null,
         columns: ["date", "status", "quantity"],
         filters: {
            search: "",
            perPage: 25,

            product: this.$route.params.id,
         },
      }
   },

   async fetch() {
      const resProduct = await this.$axios.get(
         `/products/${this.$route.params.id}`
      )
      this.product = resProduct.data.data
      // disable loading
      this.isLoading = false
   },
};
</script>

<style lang="scss" scoped></style>
