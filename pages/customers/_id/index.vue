<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="customer">
      <!-- Header Part -->
      <template #header>
        <h3 class="font-weight-normal">
          {{ $t("customers.title.details") }} : {{ customer.name }}
        </h3>

        <action-dropdown iconVariant="light" :split="false" variant="primary">
          <b-dropdown-item v-if="hasActionPermission('customers.customer-details.history')" :to="localePath(`/customers/${customer.id}/history`)">
            <i class="far fa-eye text-info mr-2"></i> History
          </b-dropdown-item>
          <!-- Edit -->
          <b-dropdown-item v-if="
              hasPagePermission('customers.edit-customer') &&
                (hasPermission('update-customers') || hasRole('Admin'))
            " :to="localePath(`/customers/${customer.id}/edit`)">
            <i class="far fa-edit text-primary mr-2"></i> Edit
          </b-dropdown-item>
          <!-- Delete -->
          <b-dropdown-item v-if="hasPermission('delete-customers') || hasRole('Admin')" @click="remove()">
            <i class="far fa-trash-alt text-danger mr-2"></i> Delete
          </b-dropdown-item>
        </action-dropdown>
      </template>

      <!-- Details -->
      <template>
        <card>
          <!-- Name -->
          <input-detail :label="$t('fields.name')" :value="customer.name" v-if="hasFieldPermission('customers.customer-details.name')"> </input-detail>
          <!-- Mobile -->
          <input-detail :label="$t('fields.mobile')" :value="customer.mobile" v-if="hasFieldPermission('customers.customer-details.mobile')"> </input-detail>
          <!-- email -->
          <input-detail :label="$t('fields.email')" :value="customer.email" v-if="hasFieldPermission('customers.customer-details.email')"> </input-detail>
          <!-- Address -->
          <input-detail :label="$t('fields.address')" :value="customer.address" v-if="hasFieldPermission('customers.customer-details.address')"> </input-detail>

          <!-- Total Invoice -->
          <input-detail :label="$t('fields.totalInvoice')" :value="customer.saleInvoicesCount" v-if="hasFieldPermission('customers.customer-details.total-invoice')"> </input-detail>
          <!-- Total Return -->
          <input-detail :label="$t('fields.totalReturn')" :value="customer.returnInvoicesCount" v-if="hasFieldPermission('customers.customer-details.total-return')"> </input-detail>
          <!-- Total Amount -->
          <input-detail :label="$t('fields.totalAmount')" :value="customer.totalAmount" v-if="hasFieldPermission('customers.customer-details.total-amount')"> </input-detail>
          <!-- Total Due -->
          <input-detail :label="$t('fields.totalDue')" :value="customer.totalDue" v-if="hasFieldPermission('customers.customer-details.total-due')"> </input-detail>
          <!-- Total paid -->
          <input-detail :label="$t('fields.totalPaid')" :value="customer.totalPaid" v-if="hasFieldPermission('customers.customer-details.total-paid')"> </input-detail>
          <!-- Total paid -->
          <input-detail :label="$t('fields.openingBalance')" :value="customer.openingBalance"> </input-detail>

          <!-- Status -->
          <input-detail :label="$t('fields.status')" v-if="hasFieldPermission('customers.customer-details.status')">
            <badge :value="customer.status"></badge>
          </input-detail>
        </card>

        <!-- /////////////////////////////////////// -->
        <!-- Invoices data Table -->
        <h3>Invoices</h3>
        <data-table :key="tableKey" @onCheck="onCheck" :url="`sale-invoices/customer/${$route.params.id}`" :columns="columns" :filters="filters">
          <!-- Lense -->
          <template #lens>
            <b-dropdown class="mx-2" v-if="checkedList.length" variant="secondary" text="Lens" right>
              <!-- Calculate -->
              <b-dropdown-item v-if="checkedList.length" @click="openCalculateModal">
                Calculate
              </b-dropdown-item>
            </b-dropdown>
          </template>

          <!-- Bulk Action Slot -->
          <template #bulk-action="{ ids }">
            <confirm-action @confirmed="tableKey++" url="sale-invoices" :ids="ids" variant="dropdown"></confirm-action>
          </template>

          <!-- Status Column -->
          <template v-slot:status="{ col }">
            <badge :value="col"></badge>
          </template>

          <!-- Action Slot -->
          <template v-slot:action="{ row }">
            <!-- Confirm -->
            <confirm-action @confirmed="tableKey++" url="sale-invoices" :ids="[row.id]" v-if="row.status == 'draft'"></confirm-action>

            <!-- Action Dropdown -->
            <action-dropdown>
              <!-- Details -->
              <b-dropdown-item v-if="
                hasPagePermission('sales.sales-details') &&
                  (hasPermission('view-sale-invoices') || hasRole('Admin'))
              " :to="localePath(`/sale-invoices/${row.id}`)">
                <i class="mr-2 far fa-share-square text-success"></i> Details
              </b-dropdown-item>
              <!-- Payment -->
              <b-dropdown-item @click="openPayModal(row)" v-if="row.status !== 'draft' && row.totalDue > 0">
                <i class="mr-2 fas fa-money-check text-success"></i>
                Pay Now
              </b-dropdown-item>
            </action-dropdown>
          </template>

          <!-- Filter slot -->
          <template #filter>
            <page-filter v-model="filters.perPage"></page-filter>

            <invoice-status-filter v-model="filters.status"></invoice-status-filter>
          </template>
        </data-table>

        <!-- ////////////////////////////// -->
        <!-- Payment Modal -->
        <b-modal @hidden="closePaymentModal" ref="payment-modal" hide-footer title="Add Payment">
          <!-- Modal Content -->
          <div>
            <form @submit.prevent="savePayment">
              <div class="row">
                <div class="col-md-6">
                  <input-control stack label="Total Amount" :readonly="true" v-model="grandTotal"></input-control>
                </div>
                <div class="col-md-6">
                  <input-control stack label="Due Amount" :readonly="true" v-model="totalDue"></input-control>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <select-control stack track="value" :label="$t('fields.paymentMethod')" :options="paymentMethods || []" v-model="paymentForm.method" :error="validationErrors.method">
                  </select-control>
                </div>
                <div class="col-md-6">
                  <input-control stack focus label="Paid Amount" v-model="paymentForm.amount" :error="validationErrors.amount"></input-control>
                </div>
              </div>
            </form>
          </div>
          <!-- Modal Footer -->
          <div class="modal-footer mt-2">
            <button @click="$refs['payment-modal'].hide()" class="btn btn-danger"> <i class="fas fa-window-close"></i> Close</button>
            <btn-primary v-shortkey="['enter']" @shortkey.native="savePayment($event,true)" @click="savePayment($event, true)" :loading="paySavingState" class="btn btn-success"><i class="fas fa-check"></i> Submit</btn-primary>
          </div>
        </b-modal>

        <!-- //////////////////////////// -->
        <!-- Calculate Modal -->
        <b-modal ref="calculate-modal" hide-footer title="Calculate">
          <div v-if="calculateData">
            <input-detail inModal :label="$t('fields.totalItems')" :value="calculateData.total_items"></input-detail>
            <input-detail inModal :label="$t('fields.grandTotal')" :value="calculateData.grand_total"></input-detail>
          </div>
          <!-- Loading -->
          <div v-else class="d-flex justify-content-center">
            <b-spinner variant="primary" label="Spinning"></b-spinner>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer mt-3">
            <btn-primary :disabled="!calculateData" @click="downloadCalculate">Download</btn-primary>
          </div>
        </b-modal>

      </template>
    </detail-view>
  </loading-view>
</template>

<script>
import { mapGetters } from "vuex";
import validation from "@/plugins/mixins/validation";
export default {
  name: "customer-details",
  mixins: [validation],
  meta: {
    permission: "view-customers",
  },
  data() {
    return {
      customer: null,
      tableKey: 1,
      paymentForm: {
        method: "cash",
        amount: "",
        paymentableId: null,
      },
      paySavingState: false,

      checkedList: [],
      calculateData: null,
      totalDue: 0,
      grandTotal: 0,

      columns: [
        {
          field: "invoiceNo",
          permission: this.hasFieldPermission("sales.manage-sales.invoice-no"),
        },
        {
          field: "invoiceDateFormatted",
          label: "date",
          permission: this.hasFieldPermission("sales.manage-sales.date"),
        },
        {
          field: "customerName",
          permission: this.hasFieldPermission("sales.manage-sales.customer"),
        },
        {
          field: "totalAmount",
          permission: this.hasFieldPermission(
            "sales.manage-sales.total-amount"
          ),
        },
        {
          field: "paidAmount",
          permission: this.hasFieldPermission("sales.manage-sales.total-paid"),
        },
        {
          field: "totalDue",
          permission: this.hasFieldPermission("sales.manage-sales.total-due"),
          sortable: false,
        },
        {
          field: "status",
          permission: this.hasFieldPermission("sales.manage-sales.status"),
          sortable: false,
        },
      ],
      filters: {
        search: "",
        perPage: 25,

        customerId: this.$route.params.id,
      },
    };
  },
  computed: {
    ...mapGetters({
      status: "config/getEnumsInvoiceStatus",
      paymentMethods: "config/getPaymentMethods",
    }),
  },
  methods: {
    // Generate Download URL
    getDownloadUrl(name) {
      const url = `/reports/sale-invoices/${name}?sort=id,des`;
      return `${url}&ids=${this.checkedList}`;
    },
    // Download PDF
    downloadPdf() {
      this.fileDownload({
        url: this.getDownloadUrl("pdf"),
        fileType: "application/pdf",
        fileName: "sale-invoices-calculate.pdf",
      });
    },
    // Download from calculate modal
    async downloadCalculate() {
      this.downloadPdf();
      this.$refs["calculate-modal"].hide();
    },
    // Open Calculate Modal
    async openCalculateModal() {
      this.$refs["calculate-modal"].show();
      this.calculateData = null;

      try {
        const res = await this.$axios.post("/sale-invoices/calculate", {
          ids: this.checkedList,
        });
        this.calculateData = res.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    // Tigger when select or checked any data
    onCheck(val) {
      this.checkedList = val;
    },
    // Open Payment Modal
    openPayModal(row) {
      this.paymentForm.paymentableId = row.id;
      this.grandTotal = row.grandTotal;
      this.totalDue = row.totalDue;
      // this.openPaymentModal = true;
      this.$refs["payment-modal"].show();
    },
    closePaymentModal() {
      // this.openPaymentModal = false;
      this.$refs["payment-modal"].hide();
      this.paymentForm.amount = "";
      this.paymentForm.method = "cash";
      this.paymentForm.paymentableId = null;
    },
    async savePayment() {
      this.paySavingState = true;
      try {
        const resPayment = await this.$axios.post(
          `/sale-invoices/${this.paymentForm.paymentableId}/payments`,
          this.paymentForm
        );

        this.$toast.success("Payment Added Succesfully.");
        this.closePaymentModal();

        this.tableKey++;
      } catch (error) {
        console.log(error);
      } finally {
        this.paySavingState = false;
      }
    },
    remove() {
      this.removeResource({
        apiUrl: `/customers/${this.$route.params.id}`,
        redirectUrl: "/customers",
      });
    },
  },
  async fetch() {
    //   Fetch Customer
    const res = await this.$axios.$get(`/customers/${this.$route.params.id}`);
    this.customer = res.data;
  },
};
</script>

<style lang="scss" scoped></style>
