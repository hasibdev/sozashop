<template>
  <index-view>
    <template #title> {{ $t("returnInvoices.title.manage") }} </template>

    <!-- Header -->
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <!-- Add button -->
      <btn-link v-if="hasPagePermission('sales.add-return-invoice')" class="btn-primary" to="/return-invoices/create">
        {{ $t("buttons.add") }} {{ $t("returnInvoices.label") }}
      </btn-link>
    </template>

    <!-- Data Table -->
    <template>
      <data-table :key="tableKey" @onCheck="onCheck" showIndex :columns="columns" url="/return-invoices" :filters="filters">

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
        <template #bulk-action="{ids}">
          <confirm-action @confirmed="tableKey++" url="return-invoices" :ids="ids" variant="dropdown"></confirm-action>
        </template>

        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <!-- Confirm -->
          <confirm-action @confirmed="tableKey++" url="return-invoices" :ids="[row.id]" v-if="row.status == 'draft'"></confirm-action>
          <action-dropdown>
            <!-- invoice  -->
            <b-dropdown-item :to="localePath(`/return-invoices/${row.id}/invoice`)" v-if="row.status !== 'draft'">
              <i class="mr-2 far fa-file-alt text-info"></i> Invoice
            </b-dropdown-item>
            <!-- Payment -->
            <b-dropdown-item @click="openPayModal(row)" v-if="row.status !== 'draft' && row.totalDue > 0">
              <i class="mr-2 fas fa-money-check text-success"></i>
              Pay Now
            </b-dropdown-item>
            <!-- Details -->
            <b-dropdown-item active v-if="hasPagePermission('sales.return-invoice-details')" :to="localePath(`/return-invoices/${row.id}`)">
              <i class="mr-2 far fa-share-square text-success"></i> Details
            </b-dropdown-item>

            <!-- Edit -->
            <b-dropdown-item :to="localePath(`/return-invoices/${row.id}/edit`)" v-if="
                row.status == 'draft' &&
                  hasPagePermission('sales.edit-return-invoice') &&
                  hasPagePermission('sales.edit-return-invoice')
              ">
              <i class="mr-2 far fa-edit text-primary"></i> Edit
            </b-dropdown-item>
            <!-- Delete -->
            <b-dropdown-item @click="remove(row.id, index)" v-if="row.status == 'draft'">
              <i class="mr-2 far fa-trash-alt text-danger"></i> Delete
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Filter slot -->
        <template #filter>
          <date-filter v-model="filters.dateRange"></date-filter>

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
  </index-view>
</template>

<script>
import { mapGetters } from "vuex";
import validation from "@/plugins/mixins/validation";
export default {
  name: "return-invoices",
  mixins: [validation],
  data() {
    return {
      tableKey: 1,
      columns: [
        // { field: "id", permission: true },
        {
          field: "invoiceNo",
          permission: "sales.manage-return-invoice.invoice-no",
        },
        {
          field: "saleInvoiceNo",
          permission: "sales.manage-return-invoice.sale-invoice-no",
        },
        {
          field: "invoiceDateFormatted",
          label: "date",
          permission: "sales.manage-return-invoice.date",
        },
        {
          field: "customerName",
          permission: "sales.manage-return-invoice.customer",
        },
        {
          field: "totalAmount",
          permission: "sales.manage-return-invoice.total-amount",
        },
        {
          field: "paidAmount",
          permission: "sales.manage-return-invoice.total-paid",
        },
        {
          field: "totalDue",
          permission: "sales.manage-return-invoice.total-due",
        },
        {
          field: "status",
          permission: "sales.manage-return-invoice.status",
        },
      ],
      filters: {
        search: "",
        perPage: 25,

        dateRange: "",
        status: "",
      },

      openPaymentModal: false,
      paymentForm: {
        method: "cash",
        amount: "",
        paymentableId: null,
      },
      totalDue: 0,
      grandTotal: 0,

      checkedList: [],
      calculateData: null,

      paySavingState: false,
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
      const url = `/reports/return-invoices/${name}?sort=id,des`;
      return `${url}&ids=${this.checkedList}`;
    },
    // Download PDF
    downloadPdf() {
      this.fileDownload({
        url: this.getDownloadUrl("pdf"),
        fileType: "application/pdf",
        fileName: "return-invoices-calculate.pdf",
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
        const res = await this.$axios.post("/return-invoices/calculate", {
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
      this.grandTotal = row.totalAmount;
      this.totalDue = row.totalDue;
      this.$refs["payment-modal"].show();
    },
    closePaymentModal() {
      this.$refs["payment-modal"].hide();
      this.paymentForm.amount = "";
      this.paymentForm.method = "cash";
      this.paymentForm.paymentableId = null;
    },
    async savePayment() {
      this.paySavingState = true;
      try {
        const resPayment = await this.$axios.post(
          `/return-invoices/${this.paymentForm.paymentableId}/payments`,
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
  },
};
</script>

<style lang="scss" scoped></style>
