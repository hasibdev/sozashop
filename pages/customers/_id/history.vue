<template>
  <loading-view :loading="isLoading">
    <detail-view v-if="customer">
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal">
          {{ $t("customers.title.details") }} : {{ customer.name }}
        </h3>
      </template>
    </detail-view>
    <div>
      <h3 class="font-weight-normal">
        {{ $t("headings.customerHistory") }}
      </h3>

      <div class="d-flex justify-content-between">
        <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      </div>
    </div>

    <data-table :columns="columns" :url="`/customers/${$route.params.id}/history`" :showIndex="true" :disableCheck="true" :filters="filters">
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
      customer: null,
      columns: ["date","productName","batchName", "status", "quantity"],
      filters: {
        search: "",
        perPage: 25,

        customerId: this.$route.params.id,
      },
    };
  },

  async fetch() {
    //   Fetch Customer
    const res = await this.$axios.$get(`/customers/${this.$route.params.id}`);
    this.customer = res.data;
    // disable loading
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped></style>
