<template>
  <loading-view :loading="isLoading">
    <detail-view v-if="supplier">
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal">
          {{ $t("suppliers.title.details") }} : {{ supplier.name }}
        </h3>
      </template>
    </detail-view>
    <div>
      <h3 class="font-weight-normal">
        {{ $t("headings.supplierHistory") }}
      </h3>

      <div class="d-flex justify-content-between">
        <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      </div>
    </div>

    <data-table :columns="columns" :url="`/suppliers/${$route.params.id}/history`" :showIndex="true" :disableCheck="true" :filters="filters">
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
      supplier: null,
      columns: ["date", "productName", "batchName","status", "quantity"],
      filters: {
        search: "",
        perPage: 25,

        supplierId: this.$route.params.id,
      },
    };
  },

  async fetch() {
    //   Fetch Supplier
    const resSupplier = await this.$axios.$get(
      `/suppliers/${this.$route.params.id}`
    );
    this.supplier = resSupplier.data;
    // disable loading
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped></style>
