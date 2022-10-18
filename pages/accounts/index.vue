<template>
  <index-view>
    <template #title> {{ $t("accounts.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-primary class="btn-primary" @click="onAccountModal" v-if="hasPagePermission('finance.add-account') &&
            (hasPermission('create-accounts') || hasRole('Admin'))">
        {{ $t("buttons.add") }} {{ $t("accounts.label") }}
      </btn-primary>
    </template>

    <template>
      <data-table :key="tableKey" :columns="columns" url="/accounts" :filters="filters">
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

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>
        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>

      <!-- Add Acount Modal -->
      <modal-control title="Add Account" v-model="openAccountModal">
        <!-- Modal Body Content -->
        <template #body>
          <template v-if="activeStep == 1">
            <!-- <pre>{{$v}}</pre> -->
            <!-- Account Type -->
            <validated-select-field @input="accountTypeChange" :validation="$v.accountForm.accountType" imedieate :label="$t('fields.accountType')" v-model="accountForm.accountType" track="value" :options="accountOptions || []" :error="validationErrors.accountType"></validated-select-field>
            <!-- Account No -->
            <validated-input focus :validation="$v.accountForm.accountNo" v-model="accountForm.accountNo" :label="$t('fields.accountNo')" :error="validationErrors.accountNo"></validated-input>
            <!-- <input-control v-model="accountForm.accountNo" :label="$t('fields.accountNo')" :error="validationErrors.accountNo"></input-control> -->
            <!-- Account Holder Name -->
            <validated-input :validation="$v.accountForm.accountHolderName" v-model="accountForm.accountHolderName" :label="$t('fields.accountHolderName')" :error="validationErrors.accountHolderName"></validated-input>
            <!-- Account Mobile -->
            <validated-input :validation="$v.accountForm.accountMobile" v-if="accountForm.accountType == 'mobile_banking'" v-model="accountForm.accountMobile" :label="$t('fields.accountMobile')" :error="validationErrors.accountMobile" type="tel"></validated-input>
            <!-- Account Email -->
            <validated-input :validation="$v.accountForm.accountEmail" v-model="accountForm.accountEmail" :label="$t('fields.accountEmail')" :error="validationErrors.accountEmail" type="email"></validated-input>
            <!-- Bank Id -->
            <validated-select-field :validation="$v.accountForm.mobileBankId" v-if="accountForm.accountType == 'bank'" :label="$t('fields.bank')" v-model="accountForm.bankId" :options="banks || []" :error="validationErrors.accountType"></validated-select-field>
            <!-- Mobile Bank Id -->
            <validated-select-field :validation="$v.accountForm.mobileBankId" v-if="accountForm.accountType == 'mobile_banking'" :label="$t('fields.mobileBank')" v-model="accountForm.mobileBankId" :options="banks || []" :error="validationErrors.mobileBankId"></validated-select-field>
            <!-- Branck Name -->
            <validated-input :validation="$v.accountForm.branchName" v-if="accountForm.accountType == 'bank'" v-model="accountForm.branchName" :label="$t('fields.branchName')" :error="validationErrors.branchName"></validated-input>
            <!-- Routing No -->
            <validated-input :validation="$v.accountForm.routingNo" v-if="accountForm.accountType == 'bank'" v-model="accountForm.routingNo" :label="$t('fields.routingNo')" :error="validationErrors.routingNo"></validated-input>
          </template>
          <template v-else>
            <!-- NID front -->
            <image-upload v-model="accountForm.nidFront" :error="validationErrors.nidFront" :label="$t('fields.nidFront')"></image-upload>
            <!-- NID back -->
            <image-upload v-model="accountForm.nidBack" :error="validationErrors.nidBack" :label="$t('fields.nidBack')"></image-upload>
            <!-- Statement -->
            <file-input v-if="hasFieldPermission('finance.add-account.statement')" placeholder="Choose a file..." v-model="accountForm.statement" :label="$t('fields.statement')" :error="validationErrors.statement"></file-input>
          </template>
        </template>
        <!-- Modal Footer Content -->
        <template #footer="{ hide }">
          <button @click="hide()" class="btn btn-secondary">Close</button>

          <button :disabled="$v.$invalid" v-if="activeStep == 1" @click="activeStep = 2" class="btn btn-primary">
            Next
          </button>
          <button v-if="activeStep == 2" @click="activeStep = 1" class="btn btn-info">
            Back
          </button>

          <button v-if="activeStep == 2" @click="saveAccountModal" class="btn btn-primary">
            Save
          </button>
        </template>
      </modal-control>
    </template>
  </index-view>
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
  name: "manage-accounts",
  meta: {
    permission: "view-any-accounts",
  },
  mixins: [validation],
  data() {
    return {
      tableKey: 1,
      columns: [
        { field: "id", permission: true },
        { field: "accountNo", permission: true },
        { field: "accountType", permission: true },
        { field: "accountHolderName", permission: true },
        { field: "accountEmail", permission: true },
        { field: "status", permission: true },
      ],
      filters: {
        search: "",
        perPage: 25,
      },
      openAccountModal: false,
      activeStep: 1,
      banks: [],
      accountForm: {
        accountType: "bank",
        accountNo: "",
        accountHolderName: "",
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

      initialData: null,
    };
  },

  validations: {
    accountForm: {
      accountHolderName: { required },
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
  computed: {
    ...mapGetters({
      accountOptions: "config/getAccountTypes",
    }),
  },
  methods: {
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

      // Saving Data
      try {
        await this.$axios.post("/accounts", formData);
        this.$toast.success("Account created successfully.");

        this.tableKey++;

        this.reset();
        this.openAccountModal = false;
        this.activeStep = 1;
      } catch (err) {
        console.log(err);
      }
    },
    accountTypeChange(val) {
      if (val == "bank") this.fetchBanks();
      if (val == "mobile_banking") this.fetchMobileBanks();
    },
    onAccountModal() {
      this.openAccountModal = true;

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
};
</script>

<style lang="scss" scoped></style>
