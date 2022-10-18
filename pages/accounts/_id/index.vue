<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="account">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("accounts.title.details") }} : {{ account.accountHolderName }}
        </h3>
        <div>
          <action-dropdown iconVariant="light" variant="primary">
            <!-- <b-dropdown-item :to="localePath(`/accounts/${account.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item> -->
            <b-dropdown-item @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </div>
      </template>

      <template>
        <card>
          <!-- Account Photo -->
          <image-detail v-if="hasFieldPermission('finance.account-details.account-photo')" :label="$t('fields.photo')" :value="account.accountHolderPhotoUrl"></image-detail>
          <!-- Holder Name -->
          <input-detail v-if="hasFieldPermission('finance.account-details.account-holder-name')" :label="$t('fields.accountHolderName')" :value="account.accountHolderName"></input-detail>
          <!-- City -->
          <input-detail v-if="hasFieldPermission('finance.account-details.city')" :label="$t('fields.city')" :value="account.city"></input-detail>
          <!-- Account type -->
          <input-detail v-if="hasFieldPermission('finance.account-details.account-type')" :label="$t('fields.accountType')" :value="account.accountType"></input-detail>
          <!-- Account No -->
          <input-detail v-if="hasFieldPermission('finance.account-details.account-no')" :label="$t('fields.accountNo')" :value="account.accountNo"></input-detail>
          <!-- accountMobile -->
          <input-detail v-if="hasFieldPermission('finance.account-details.account-mobile')" :label="$t('fields.accountMobile')" :value="account.accountMobile"></input-detail>
          <!-- accountEmail -->
          <input-detail v-if="hasFieldPermission('finance.account-details.account-email')" :label="$t('fields.accountEmail')" :value="account.accountEmail"></input-detail>
          <!-- bankName -->
          <input-detail v-if="hasFieldPermission('finance.account-details.bank-name')" :label="$t('fields.bankName')" :value="account.bankName"></input-detail>
          <!-- branchName -->
          <input-detail v-if="hasFieldPermission('finance.account-details.branch-name')" :label="$t('fields.branchName')" :value="account.branchName"></input-detail>
          <!-- routingNo -->
          <input-detail v-if="hasFieldPermission('finance.account-details.routing-no')" :label="$t('fields.routingNo')" :value="account.routingNo"></input-detail>

          <!-- NID front -->
          <image-detail v-if="hasFieldPermission('finance.account-details.nid-front')" :label="$t('fields.nidFront')" :value="account.client.nidFrontUrl"></image-detail>
          <!-- NID back -->
          <image-detail v-if="hasFieldPermission('finance.account-details.nid-back')" :label="$t('fields.nidBack')" :value="account.client.nidBackUrl"></image-detail>
          <!-- statement -->
          <input-detail v-if="hasFieldPermission('finance.account-details.statement')" :label="$t('fields.statement')" :value="account.statementUrl">
            <template #default="{ value }">
              <a target="_blank" v-if="value" :href="value">{{
                getStatementName
              }}</a>
              <span v-else>-</span>
            </template>
          </input-detail>

          <!-- status -->
          <input-detail v-if="hasFieldPermission('finance.account-details.status')" :label="$t('fields.status')" :value="account.status">
            <template #default="{ value }">
              <badge :value="value" />
            </template>
          </input-detail>
        </card>
      </template>
    </detail-view>
  </loading-view>
</template>

<script>
export default {
  name: "account-details",
  meta: {
    permission: "view-accounts",
  },
  data() {
    return {
      account: null,
    };
  },
  computed: {
    getStatementName() {
      return this.account.statementUrl.split("/").pop();
    },
  },
  methods: {
    remove() {
      // Global Mixins ( removeResource )
      this.removeResource({
        apiUrl: `/accounts/${this.$route.params.id}`,
        redirectUrl: "/accounts",
      });
    },
  },
  async fetch() {
    const response = await this.$axios.get(
      `/accounts/${this.$route.params.id}`
    );
    this.account = response.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
