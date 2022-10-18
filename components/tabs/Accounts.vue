<template>
  <b-tab :title="$t('fields.accounts')">
    <data-table :key="tableKey" cardclass="mt-0" :columns="columns" url="/accounts" :filters="filters">
      <!-- Add Button -->
      <template #buttons>
        <button @click="onAccountModal" class="btn btn-info btn-sm">Add Account</button>
      </template>

      <!-- Action Slot -->
      <template v-slot:action="{ row, remove, index }">
        <action-dropdown>
          <b-dropdown-item v-if="
          hasPagePermission('finance.account-details') &&
                (hasPermission('view-accounts') || hasRole('Admin'))
          " :to="localePath(`/accounts/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
            Details</b-dropdown-item>
          <b-dropdown-item v-if="hasPermission('delete-accounts') || hasRole('Admin')" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
            Delete</b-dropdown-item>
        </action-dropdown>
      </template>

      <!-- Statement Column -->
      <template v-slot:statementUrl="{ col }">
        <a target="_blank" v-if="col" :href="col">{{  getStatementName(col) }}</a>
        <span v-else>-</span>
      </template>
      <!-- Status Column -->
      <template v-slot:status="{ col }">
        <badge :value="col"></badge>
      </template>

      <!-- Filter slot -->
      <template #filter>
        <page-filter v-model="filters.perPage"></page-filter>
      </template>
    </data-table>

    <b-modal @hidden="reset" size="lg" ref="account-modal" hide-footer title="Add Account">
      <div>
        <template v-if="activeStep == 1">
          <image-upload :key="1" inModal v-model="accountForm.accountHolderPhoto" :label="$t('fields.photo')" :error="validationErrors.accountHolderPhoto"></image-upload>
          <!-- Account Type -->
          <validated-select-field inModal @input="accountTypeChange" :validation="$v.accountForm.accountType" imedieate :label="$t('fields.accountType')" v-model="accountForm.accountType" track="value" :options="accountOptions || []" :error="validationErrors.accountType"></validated-select-field>
          <!-- Account No -->
          <validated-input inModal focus :validation="$v.accountForm.accountNo" v-model="accountForm.accountNo" :label="$t('fields.accountNo')" :error="validationErrors.accountNo"></validated-input>
          <!-- Account Holder Name -->
          <validated-input inModal :validation="$v.accountForm.accountHolderName" v-model="accountForm.accountHolderName" :label="$t('fields.accountHolderName')" :error="validationErrors.accountHolderName"></validated-input>
          <!-- City -->
          <validated-input inModal :validation="$v.accountForm.city" v-model="accountForm.city" :label="$t('fields.city')" :error="validationErrors.city"></validated-input>
          <!-- Account Mobile -->
          <validated-input inModal :validation="$v.accountForm.accountMobile" v-if="accountForm.accountType == 'mobile_banking'" v-model="accountForm.accountMobile" :label="$t('fields.accountMobile')" :error="validationErrors.accountMobile" type="tel"></validated-input>
          <!-- Account Email -->
          <validated-input inModal :validation="$v.accountForm.accountEmail" v-model="accountForm.accountEmail" :label="$t('fields.accountEmail')" :error="validationErrors.accountEmail" type="email"></validated-input>
          <!-- Bank Id -->
          <validated-select-field inModal :validation="$v.accountForm.mobileBankId" v-if="accountForm.accountType == 'bank'" :label="$t('fields.bank')" v-model="accountForm.bankId" :options="banks || []" :error="validationErrors.accountType"></validated-select-field>
          <!-- Mobile Bank Id -->
          <validated-select-field inModal :validation="$v.accountForm.mobileBankId" v-if="accountForm.accountType == 'mobile_banking'" :label="$t('fields.mobileBank')" v-model="accountForm.mobileBankId" :options="banks || []" :error="validationErrors.mobileBankId"></validated-select-field>
          <!-- Branck Name -->
          <validated-input inModal :validation="$v.accountForm.branchName" v-if="accountForm.accountType == 'bank'" v-model="accountForm.branchName" :label="$t('fields.branchName')" :error="validationErrors.branchName"></validated-input>
          <!-- Routing No -->
          <validated-input inModal :validation="$v.accountForm.routingNo" v-if="accountForm.accountType == 'bank'" v-model="accountForm.routingNo" :label="$t('fields.routingNo')" :error="validationErrors.routingNo"></validated-input>
        </template>
        <template v-else>
          <!-- NID front -->
          <image-upload :key="2" v-model="accountForm.nidFront" :error="validationErrors.nidFront" :label="$t('fields.nidFront')"></image-upload>
          <!-- NID back -->
          <image-upload v-model="accountForm.nidBack" :error="validationErrors.nidBack" :label="$t('fields.nidBack')"></image-upload>
          <!-- Statement -->
          <file-input v-if="hasFieldPermission('finance.add-account.statement')" placeholder="Choose a file..." v-model="accountForm.statement" :label="$t('fields.statement')" :error="validationErrors.statement"></file-input>
        </template>
      </div>
      <!-- Modal Footer -->
      <div class="modal-footer">
        <button @click="$refs['account-modal'].hide()" class="btn btn-secondary">Close</button>
        <button :disabled="$v.$invalid" v-if="activeStep == 1" @click="activeStep = 2" class="btn btn-primary">
          Next
        </button>
        <button v-if="activeStep == 2" @click="activeStep = 1" class="btn btn-info">
          Back
        </button>

        <btn-primary :loading="savingState" v-if="activeStep == 2" @click="saveAccountModal">
          Save
        </btn-primary>
      </div>
    </b-modal>

  </b-tab>
</template>

<script>
import { mapGetters } from "vuex";
import validation from "@/plugins/mixins/validation";
import {
  required,
  requiredIf,
  maxLength,
  email,
} from "vuelidate/lib/validators";
export default {
  name: "account-tab",
  mixins: [validation],
  data() {
    return {
      tableKey: 1,
      columns: [
        {
          field: "id",
          permission: "finance.manage-accounts.id",
        },
        {
          field: "accountNo",
          permission: "finance.manage-accounts.account-no",
        },
        {
          field: "accountType",
          permission: "finance.manage-accounts.account-type",
        },
        {
          field: "accountHolderName",
          permission: "finance.manage-accounts.account-holder-name",
        },
        {
          field: "accountMobile",
          permission: "finance.manage-accounts.account-mobile",
        },
        {
          field: "accountEmail",
          permission: "finance.manage-accounts.account-email",
        },
        {
          field: "bankName",
          permission: "finance.manage-accounts.bank-name",
        },
        {
          field: "branchName",
          permission: "finance.manage-accounts.branch-name",
        },
        {
          field: "statementUrl",
          label: "statement",
          permission: "finance.manage-accounts.statement",
        },
        {
          field: "status",
          permission: "finance.manage-accounts.status",
        },
      ],
      filters: {
        search: "",
        perPage: 25,
      },

      activeStep: 1,
      banks: [],

      accountForm: {
        accountHolderPhoto: null,
        accountType: "bank",
        accountNo: "",
        accountHolderName: "",
        city: "",
        accountMobile: "",
        accountEmail: "",
        bankId: "",
        mobileBankId: "",
        branchName: "",
        routingNo: "",
        nidFront: "",
        nidBack: "",
        statement: null,
      },
      savingState: false,
    };
  },
  computed: {
    ...mapGetters({
      accountOptions: "config/getAccountTypes",
    }),
  },
  methods: {
    getStatementName(statement) {
      return statement.split("/").pop();
    },
    onAccountModal() {
      this.$refs["account-modal"].show();
      if (this.accountForm.accountType == "bank") this.fetchBanks();
      if (this.accountForm.accountType == "mobile_banking")
        this.fetchMobileBanks();
    },
    async saveAccountModal() {
      // Delete unused fields
      if (this.accountForm.accountType == "bank") {
        delete this.accountForm.accountMobile;
        delete this.accountForm.mobileBankId;
      } else if (this.accountForm.accountType == "mobile_banking") {
        delete this.accountForm.bankId;
        delete this.accountForm.branchName;
        delete this.accountForm.routingNo;
      }

      // Preparing Files NIDs and Statement
      const formData = new FormData();

      for (let key of Object.keys(this.accountForm)) {
        formData.append(key, this.accountForm[key]);
      }

      this.savingState = true;
      // Saving Data
      try {
        await this.$axios.post("/accounts", formData);
        this.$toast.success("Account created successfully.");

        this.tableKey++;

        this.reset();
        this.$refs["account-modal"].hide();
        this.activeStep = 1;
      } catch (err) {
        console.log(err);
      } finally {
        this.savingState = false;
      }
    },
    accountTypeChange(val) {
      if (val == "bank") this.fetchBanks();
      if (val == "mobile_banking") this.fetchMobileBanks();
    },
    onAccountModal() {
      this.$refs["account-modal"].show();

      if (this.accountForm.accountType == "bank") this.fetchBanks();
      if (this.accountForm.accountType == "mobile_banking")
        this.fetchMobileBanks();
    },
    async fetchBanks() {
      const countryId = this.$auth.user.client.module.countryId;
      const resBanks = await this.$axios.get(
        `/ajax/banks?country=${countryId}`
      );

      this.banks = resBanks.data.data;
    },
    async fetchMobileBanks() {
      const countryId = this.$auth.user.client.module.countryId;
      const resMobileBanks = await this.$axios.get(
        `/ajax/mobile-banks?country=${countryId}`
      );

      this.banks = resMobileBanks.data.data;
    },

    reset() {
      this.accountForm = { ...this.initialData };
    },
  },
  created() {
    this.initialData = { ...this.accountForm };
  },
  validations: {
    accountForm: {
      accountHolderName: { required },
      city: { required },
      accountType: { required },
      accountNo: { required },
      bankId: {
        required: requiredIf(function () {
          return this.accountForm.accountType == "bank";
        }),
      },
      mobileBankId: {
        required: requiredIf(function () {
          return this.accountForm.accountType == "mobile_banking";
        }),
      },
      accountMobile: {
        required: requiredIf(function () {
          return this.accountForm.accountType == "mobile_banking";
        }),
        maxLength: maxLength(15),
      },
      accountEmail: { required, email },
      branchName: {
        required: requiredIf(function () {
          return this.accountForm.accountType == "bank";
        }),
      },
      routingNo: {
        required: requiredIf(function () {
          return this.accountForm.accountType == "bank";
        }),
      },
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
