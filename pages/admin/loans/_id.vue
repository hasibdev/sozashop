<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="loan">
      <!-- Header Part -->
      <template #header>
        <h3 class="font-weight-normal">
          {{ $t("loans.title.details") }}
        </h3>
      </template>

      <!-- Details -->
      <template>
        <card>
          <!-- Name -->
          <input-detail :label="$t('fields.loaner')" :value="loan.loaner.name"></input-detail>
          <!-- Email -->
          <input-detail :label="$t('fields.email')" :value="loan.loaner.email"></input-detail>
          <!-- Address -->
          <input-detail :label="$t('fields.address')" :value="loan.loaner.address"></input-detail>
          <!-- Amount -->
          <input-detail :label="$t('fields.amount')" :value="loan.amount"></input-detail>
          <!-- interest -->
          <input-detail :label="$t('fields.interest')" :value="loan.interest"></input-detail>
          <!-- contractStartDate -->
          <input-detail :label="$t('fields.contractStartDate')" :value="loan.contractStartDate"></input-detail>
          <!-- contractEndDate -->
          <input-detail :label="$t('fields.contractEndDate')" :value="loan.contractEndDate"></input-detail>
          <!-- Status -->
          <input-detail :label="$t('fields.status')">
            <badge :value="loan.status"></badge>
          </input-detail>
        </card>
      </template>
    </detail-view>

  </loading-view>
</template>

<script>
export default {
  name: "loan-details",
  layout: "admin",
  data() {
    return {
      loan: null,
      columns: [
        "paymentAt",
        "amount",
        {
          field: "method",
          label: "paymentMethod",
          permission: true,
          sortable: false,
        },
      ],
      filters: {
        search: "",
        perPage: 25,

        paymentableId: this.$route.params.id,
        paymentableType: "Loan",
      },
    };
  },

  async fetch() {
    //   Fetch Customer
    const res = await this.$axios.$get(`/admin/loans/${this.$route.params.id}`);
    this.loan = res.data;
  },
};
</script>

<style lang="scss" scoped></style>
