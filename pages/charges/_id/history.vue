<template>
  <loading-view :loading="isLoading">
    <detail-view>
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal">
          {{ $t("charges.title.details") }} : {{ charge.name }}
        </h3>
      </template>
    </detail-view>
    <div>
      <h3 class="font-weight-normal">
        {{ $t("headings.chargeHistory") }}
      </h3>

      <div class="d-flex justify-content-between">
        <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      </div>
    </div>

    <data-table :columns="columns" :url="`/charges/${$route.params.id}/history`" :showIndex="true" :disableCheck="true" :filters="filters">
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
      charge: null,
      columns: ["date", "amount"],
      filters: {
        search: "",
        perPage: 25,

        customerId: this.$route.params.id,
      },
    };
  },

  async fetch() {
    //   Fetch Customer
    const res = await this.$axios.$get(`/charges/${this.$route.params.id}`);
    this.charge = res.data;
    // disable loading
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped></style>
