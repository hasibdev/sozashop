<template>
  <detail-view v-if="user">
    <template #header>
      <h3 class="font-weight-normal mb-3">{{ $t("wallet.label") }} </h3>
    </template>

    <template>
      <card class="font-size-15">
        <div class="row">
          <div class="col-sm-4 text-primary">
            <p class="mb-0">Welcome</p>
            <p class="text-primary">{{ user.name }}</p>
          </div>
          <div class="col-sm-4">
            <Clock />
          </div>
          <div class="col-sm-4">{{clientBalance}} {{ currencyCode }}</div>
        </div>
        <div class="row mt-2 mb-2">
          <div class="  pt-1 col-sm-4">Customer ID: <span class="text-primary">{{ clientId }}</span></div>
          <div class="col-sm-4">Last Visit {{ user.userLastLogin }}</div>
          <div class="col-sm-4"> <button @click="openWithdrawModal" class="btn btn-primary">Withdraw</button> </div>
        </div>

      </card>

      <h3 class="my-3">Finance</h3>

      <b-tabs content-class="">
        <!-- Withdraws -->
        <!-- <withdraw-tab></withdraw-tab> -->

        <!-- Transitions -->
        <transitions :transitionKey="transitionKey"></transitions>

        <!-- Account Tab -->
        <accounts-tab></accounts-tab>
      </b-tabs>

      <!-- Withdraw Modal -->
      <b-modal ref="withdraw-modal" hide-footer title="New Withdraw">
        <div>
          <select-control v-model="withdrawForm.accountId" :options="accounts" title="accountNo" :label="$t('fields.account')" :error="validationErrors.accountId"></select-control>
          <!-- Amount -->
          <input-control focus type="number" v-model="withdrawForm.amount" :label="$t('fields.amount')" :error="validationErrors.amount"></input-control>
          <!-- Reason -->
          <text-control v-if="hasFieldPermission(
						`finance.add-withdraw.reason`
					)" v-model="withdrawForm.reason" :label="$t('fields.reason')" :error="validationErrors.reason"></text-control>
        </div>
        <div class="modal-footer">
          <button @click="$refs['withdraw-modal'].hide()" class="btn btn-secondary">Close</button>
          <btn-primary :loading="withdrawSavingState" @click="saveWithdraw" class="btn btn-primary">
            Save
          </btn-primary>
        </div>
      </b-modal>

    </template>
  </detail-view>
</template>

<script>
import AccountsTab from "@/components/tabs/Accounts.vue";
import WithdrawTab from "@/components/tabs/Withdraw.vue";
import Transitions from "@/components/tabs/Transitions.vue";
import Clock from "@/components/utils/Clock.vue";
import validation from "@/plugins/mixins/validation";
export default {
  name: "my-wallet",
  mixins: [validation],
  components: {
    AccountsTab,
    WithdrawTab,
    Transitions,
    Clock,
  },

  data() {
    return {
      transitionKey: 1,
      user: this.$auth.user,
      withdrawForm: {
        accountId: null,
        amount: "",
        reason: "",
      },
      accounts: [],
      currencySettings: null,
      withdrawSavingState: false,
    };
  },
  computed: {
    currencyCode() {
      return this.$store.getters["config/getCurrencySettings"]?.data
        ?.currency_code;
    },
    clientId() {
      return this.$auth.user?.client?.readableId;
    },
    clientBalance() {
      return this.$auth.user?.client?.balance;
    },
  },

  methods: {
    async saveWithdraw() {
      this.withdrawSavingState = true;
      try {
        const res = await this.$axios.post("/withdraws", this.withdrawForm);
        this.$toast.success("Withdraw created successfully.");
        this.$refs["withdraw-modal"].hide();
        this.withdrawForm.amount = "";
        this.withdrawForm.reason = "";
        this.withdrawForm.account = null;

        this.transitionKey++;
      } catch (error) {
        console.log(error);
      } finally {
        this.withdrawSavingState = false;
      }
    },
    openWithdrawModal() {
      if (this.clientBalance > 0) {
        this.fetchAccounts();
        this.$refs["withdraw-modal"].show();
      } else {
        this.$toast.error("You can't withdraw. Because balance zero.");
      }
    },
    async fetchAccounts() {
      const res = await this.$axios.get("/accounts/verified");
      this.accounts = res.data.data;
    },
  },
  created() {
    if (!this.hasPagePermission("wallets.show-wallet")) {
      this.$router.push(this.localePath("/dashboard"));
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
