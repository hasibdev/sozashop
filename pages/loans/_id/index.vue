<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="loan">
      <!-- Header Part -->
      <template #header>
        <h3 class="font-weight-normal">
          {{ $t("loans.title.details") }}
        </h3>

        <action-dropdown iconVariant="light" :split="false" variant="primary">
          <b-dropdown-item @click="openPayModal($route.params.id)" v-if="loan.status !== 'draft' && loan.totalDue > 0">
            <i class="mr-2 fas fa-money-check text-success"></i>
            Pay Now
          </b-dropdown-item>

          <b-dropdown-item v-if="
              hasPagePermission('loan.edit-loan') &&
                (hasPermission('update-loans') || hasRole('Admin'))
            " :to="localePath(`/loans/${loan.id}/edit`)">
            <i class="far fa-edit text-primary mr-2"></i> Edit
          </b-dropdown-item>
          <b-dropdown-item v-if="hasPermission('delete-loans') || hasRole('Admin')" @click="remove()">
            <i class="far fa-trash-alt text-danger mr-2"></i> Delete
          </b-dropdown-item>
        </action-dropdown>
      </template>

      <!-- Details -->
      <template>
        <card>
          <!-- Name -->
          <input-detail :label="$t('fields.loaner')" :value="loan.loaner.name" v-if="hasFieldPermission('loan.loan-details.loaner')"></input-detail>
          <!-- Email -->
          <input-detail :label="$t('fields.email')" :value="loan.loaner.email" v-if="hasFieldPermission('loan.loan-details.email')"></input-detail>
          <!-- Address -->
          <input-detail :label="$t('fields.address')" :value="loan.loaner.address" v-if="hasFieldPermission('loan.loan-details.address')"></input-detail>
          <!-- Amount -->
          <input-detail :label="$t('fields.amount')" :value="loan.amount" v-if="hasFieldPermission('loan.loan-details.amount')"></input-detail>
          <!-- Type -->
          <input-detail :label="$t('fields.type')" :value="loan.type" v-if="hasFieldPermission('loan.loan-details.type')"></input-detail>
          <!-- Total Paid -->
          <input-detail :label="$t('fields.totalPaid')" :value="loan.paidAmount" v-if="hasFieldPermission('loan.loan-details.total-paid')"></input-detail>
          <!-- Total Due -->
          <input-detail :label="$t('fields.totalDue')" :value="loan.totalDue" v-if="hasFieldPermission('loan.loan-details.total-due')"></input-detail>
          <!-- contractStartDate -->
          <input-detail :label="$t('fields.contractStartDate')" :value="loan.contractStartDate" v-if="hasFieldPermission('loan.loan-details.contract-start')"></input-detail>
          <!-- contractEndDate -->
          <input-detail :label="$t('fields.contractEndDate')" :value="loan.contractEndDate" v-if="hasFieldPermission('loan.loan-details.contract-end')"></input-detail>
          <!-- Status -->
          <input-detail :label="$t('fields.status')" v-if="hasFieldPermission('loan.loan-details.status')">
            <badge :value="loan.status"></badge>
          </input-detail>
        </card>

        <!-- //////////////////////////////// -->
        <!-- Payment Modal -->
        <modal-control @hide="closePaymentModal" title="Add Payment" v-model="openPaymentModal">
          <template #body>
            <form @submit.prevent="savePayment">
              <!-- Payment Select -->
              <select-control track="value" :label="$t('fields.paymentMethod')" :options="paymentMethods || []" v-model="paymentForm.method" :error="validationErrors.method">
              </select-control>
              <input-control focus label="Paid Amount" v-model="paymentForm.amount" :error="validationErrors.amount"></input-control>
            </form>
          </template>
          <!-- Action Buttons -->
          <template #footer="{ hide }">
            <button @click="hide()" class="btn btn-secondary">Close</button>
            <btn-primary :loading="savingState" @click="savePayment" class="btn btn-primary">Save</btn-primary>
          </template>
        </modal-control>
      </template>
    </detail-view>

    <!-- Payment History -->
    <div>
      <h3 class="font-weight-normal">
        {{ $t("headings.payments") }}
      </h3>

      <div class="d-flex justify-content-between">
        <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      </div>
    </div>
    <data-table :key="tableKey" :columns="columns" url="/payments" :showIndex="true" :filters="filters">
      <template #method="{col}">
        {{ col | capitalize }}
      </template>
      <!-- Filter slot -->
      <template #filter>
        <page-filter v-model="filters.perPage"></page-filter>

      </template>
    </data-table>
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
  name: "loan-details",
  mixins: [validation],
  meta: {
    permission: "view-loans",
  },
  data() {
    return {
      tableKey: 1,
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
      openPaymentModal: false,
      paymentForm: {
        method: "cash",
        amount: "",
        paymentableId: null,
      },
      savingState: false,
    };
  },
  computed: {
    ...mapGetters({
      paymentMethods: "config/getPaymentMethods",
    }),
  },
  methods: {
    async savePayment() {
      this.savingState = true;
      try {
        await this.$axios.post(
          `/loans/${this.paymentForm.paymentableId}/payments`,
          this.paymentForm
        );

        this.$toast.success("Payment Added Succesfully.");
        this.closePaymentModal();
        await this.fetchLoan();

        this.tableKey++;
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    openPayModal(id) {
      this.paymentForm.paymentableId = id;
      this.openPaymentModal = true;
    },
    closePaymentModal() {
      this.openPaymentModal = false;
      this.paymentForm.amount = "";
      this.paymentForm.method = "";
      this.paymentForm.paymentableId = null;
    },
    remove() {
      this.removeResource({
        apiUrl: `/loans/${this.$route.params.id}`,
        redirectUrl: "/loans",
      });
    },
    //   Fetch Loan
    async fetchLoan() {
      const res = await this.$axios.$get(`/loans/${this.$route.params.id}`);
      this.loan = res.data;
    },
  },
  async fetch() {
    await this.fetchLoan();
  },
};
</script>

<style lang="scss" scoped></style>
