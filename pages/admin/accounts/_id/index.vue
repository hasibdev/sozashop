<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="account">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("accounts.title.details") }} : {{ account.accountHolderName }}
        </h3>
        <div>
          <action-dropdown iconVariant="light" variant="primary">
            <b-dropdown-item v-if="!isVerified" @click="veriryAccount"><i class="mr-1 fas fa-user-check text-primary"></i>
              Verify</b-dropdown-item>
            <b-dropdown-item v-else @click="unVerifyAccount">
              <i class="fas fa-skull-crossbones text-danger mr-1"></i>
              Unverify
            </b-dropdown-item>
          </action-dropdown>
        </div>
      </template>

      <template>
        <card>
          <!-- Account Photo -->
          <image-detail :label="$t('fields.photo')" :value="account.accountHolderPhotoUrl"></image-detail>
          <!-- Holder Name -->
          <input-detail :label="$t('fields.accountHolderName')" :value="account.accountHolderName"></input-detail>
          <!-- Account type -->
          <input-detail :label="$t('fields.accountType')" :value="account.accountType"></input-detail>
          <!-- Account No -->
          <input-detail :label="$t('fields.accountNo')" :value="account.accountNo"></input-detail>
          <!-- accountMobile -->
          <input-detail :label="$t('fields.accountMobile')" :value="account.accountMobile"></input-detail>
          <!-- accountEmail -->
          <input-detail :label="$t('fields.accountEmail')" :value="account.accountEmail"></input-detail>
          <!-- bankName -->
          <input-detail :label="$t('fields.bankName')" :value="account.bankName"></input-detail>
          <!-- branchName -->
          <input-detail :label="$t('fields.branchName')" :value="account.branchName"></input-detail>
          <!-- routingNo -->
          <input-detail :label="$t('fields.routingNo')" :value="account.routingNo"></input-detail>

          <!-- NID front -->
          <image-detail :label="$t('fields.nidFront')" :value="account.client.nidFrontUrl"></image-detail>
          <!-- NID back -->
          <image-detail :label="$t('fields.nidBack')" :value="account.client.nidBackUrl"></image-detail>
          <!-- statement -->
          <input-detail :label="$t('fields.statement')" :value="account.statementUrl">
            <template #default="{ value }">
              <a target="_blank" v-if="value" :href="value">{{
                getStatementName
              }}</a>
              <span v-else>--</span>
            </template>
          </input-detail>

          <!-- status -->
          <input-detail :label="$t('fields.status')" :value="account.status">
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
  layout: "admin",
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
    isVerified() {
      return this.account.status == "verified";
    },
  },
  methods: {
    async veriryAccount() {
      try {
        const res = await this.$axios.post(
          `admin/accounts/${this.$route.params.id}/update-status`,
          {
            status: "verified",
          }
        );

        this.account.status = "verified";
        this.$toast.success("Account Verified successfully.");
      } catch (error) {
        console.log(error);
      }
    },
    async unVerifyAccount() {
      try {
        const res = await this.$axios.post(
          `admin/accounts/${this.$route.params.id}/update-status`,
          {
            status: "unverified",
          }
        );

        this.account.status = "unverified";
        this.$toast.success("Account Unverified successfully.");
      } catch (error) {
        console.log(error);
      }
    },
  },
  async fetch() {
    const response = await this.$axios.get(
      `/admin/accounts/${this.$route.params.id}`
    );
    this.account = response.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
