<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="settings">
      <template #header>
        <h3 class="font-weight-normal">{{ $t("settings.title.details") }}</h3>
        <action-dropdown iconVariant="light" :split="false" variant="primary">
          <b-dropdown-item :to="localePath(`/settings/application/edit`)">
            <i class="far fa-edit text-primary mr-2"></i> Edit
          </b-dropdown-item>
          <b-dropdown-item :to="localePath(`/settings/${settings.id}/primary-media`)">
            <i class="fas fa-puzzle-piece text-success"></i> Change Logo
          </b-dropdown-item>
        </action-dropdown>
      </template>
      <template>
        <card>
          <image-detail :label="$t('fields.logo')" :value="settings.primaryMediaUrl" v-if="hasFieldPermission('settings.general-settings.logo')"></image-detail>
          <input-detail :label="$t('fields.name')" :value="settings.data.name || '-'" v-if="hasFieldPermission('settings.general-settings.name')"></input-detail>
          <input-detail :label="$t('fields.address')" :value="settings.data.address || '-'" v-if="hasFieldPermission('settings.general-settings.address')"></input-detail>
          <input-detail :label="$t('fields.city')" :value="settings.data.city || '-'" v-if="hasFieldPermission('settings.general-settings.city') && settings.data.city"></input-detail>
          <input-detail :label="$t('fields.country')" :value="settings.data.country || '-'" v-if="hasFieldPermission('settings.general-settings.country')"></input-detail>
          <input-detail :label="$t('fields.industry')" :value="$auth.user.client.industryName || '-'" v-if="hasFieldPermission('settings.general-settings.industry')"></input-detail>
          <input-detail :label="$t('fields.phone')" :value="settings.data.phone || '-'" v-if="hasFieldPermission('settings.general-settings.phone')"></input-detail>
          <input-detail :label="$t('fields.website')" :value="settings.data.website || '-'" v-if="hasFieldPermission('settings.general-settings.website')"></input-detail>
          <input-detail :label="$t('fields.defaultCustomer')" :value="settings.customer.name || '-'" v-if="settings.customer && hasFieldPermission('settings.general-settings.default-customer')"></input-detail>
          <input-detail :label="$t('fields.invoiceFooter')" :value="settings.data.invoiceFooter || '-'" v-if="hasFieldPermission('settings.general-settings.invoice-footer')"></input-detail>
          <input-detail :label="$t('fields.resetAccount')" v-if="hasFieldPermission('settings.general-settings.reset-account')">
            <btn-danger @click="resetAccount">Reset Account</btn-danger>
          </input-detail>
        </card>
      </template>
    </detail-view>
  </loading-view>
</template>

<script>
export default {
  name: "setting",
  data() {
    return {
      settings: null,
    };
  },
  methods: {
    resetAccount() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          confirmButtonColor: "var(--danger)",
          cancelButtonColor: "var(--primary)",
          showCancelButton: true,
          confirmButtonText: "Yes, Reset Account!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$axios.post(
                `/clients/${this.$auth.user.clientId}/reset`
              );
              await this.$axios.$delete("/user/notifications");
              this.$toast.success("Account Reset Successfully");
              this.$router.push(this.localePath("/dashboard"));
            } catch (error) {
              const message = { ...error }.response.data.message;
              this.$toast.error("Reset not completed");
            }
          }
        });
    },
  },

  async fetch() {
    const resSettings = await this.$axios.$get(
      `/client-settings?type=application`
    );
    this.settings = resSettings;
  },
};
</script>

<style lang="scss" scoped></style>
