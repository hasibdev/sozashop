<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="charge">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("charges.title.details") }} : {{ charge.name }}
        </h3>
        <div>
          <action-dropdown iconVariant="light" variant="primary">

            <b-dropdown-item :to="localePath(`/charges/${charge.id}/history`)">
              <i class="far fa-eye text-info mr-2"></i> History
            </b-dropdown-item>

            <b-dropdown-item v-if="hasPagePermission('settings.edit-charges')" :to="localePath(`/charges/${charge.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>

            <b-dropdown-item @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </div>
      </template>

      <template>
        <card>
          <input-detail v-if="hasFieldPermission('settings.charges-details.name')" :label="$t('fields.name')" :value="charge.name"></input-detail>
          <input-detail v-if="hasFieldPermission('settings.charges-details.charged-by')" :label="$t('fields.chargedBy')" :value="charge.chargedBy | capitalize"></input-detail>
          <input-detail v-if="hasFieldPermission('settings.charges-details.amount')" :label="$t('fields.amount')" :value="charge.amount"></input-detail>
          <input-detail v-if="hasFieldPermission('settings.charges-details.type')" :label="$t('fields.type')" :value="charge.type | capitalize"></input-detail>
          <input-detail v-if="hasFieldPermission('settings.charges-details.total-amount')" :label="$t('fields.totalAmount')" :value="charge.totalAmount"></input-detail>
          <input-detail v-if="hasFieldPermission('settings.charges-details.total_paid')" :label="$t('fields.totalPaid')" :value="charge.totalPaid"></input-detail>
          <input-detail v-if="hasFieldPermission('settings.charges-details.total_due')" :label="$t('fields.totalDue')" :value="charge.totalDue"></input-detail>
          <input-detail v-if="hasFieldPermission('settings.charges-details.total-invoice')" :label="$t('fields.totalInvoice')" :value="charge.totalInvoice"></input-detail>
          <input-detail v-if="hasFieldPermission('settings.charges-details.profitable')" :label="$t('fields.profitable')" :value="charge.profitable"></input-detail>
        </card>
      </template>
    </detail-view>
  </loading-view>
</template>

<script>
export default {
  name: "charge-details",
  data() {
    return {
      charge: null,
    };
  },
  methods: {
    remove() {
      // Global Mixins ( removeResource )
      this.removeResource({
        apiUrl: `/charges/${this.$route.params.id}`,
        redirectUrl: "/charges",
      });
    },
  },
  async fetch() {
    const res = await this.$axios.get(`/charges/${this.$route.params.id}`);
    this.charge = res.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
