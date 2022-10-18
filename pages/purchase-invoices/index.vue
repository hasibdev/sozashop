<template>
  <index-view>
    <template #title> {{ $t("invoice.title.manage") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
    </template>

    <!-- Place for Data Table -->
    <template>
      <data-table :key="tableKey" @onCheck="onCheck" :columns="columns" url="/purchase-invoices" :filters="filters">
        <!-- Lense -->
        <template #lens>
          <b-dropdown class="mx-2" v-if="checkedList.length" variant="secondary" text="Lens" right>
            <!-- Calculate -->
            <b-dropdown-item v-if="checkedList.length" @click="openCalculateModal">
              Calculate
            </b-dropdown-item>
          </b-dropdown>
        </template>
        <template #bulk-action="{ ids }">
          <confirm-action @confirmed="tableKey++" url="purchase-invoices" :ids="ids" variant="dropdown"></confirm-action>
        </template>

        <!-- Buttons -->
        <!-- <template #buttons>
					<button v-if="checkedList.length" @click="openCalculateModal" class="btn btn-success mx-2">Calculate</button>
				</template> -->

        <!-- Status -->
        <template #status="{col}">
          <badge :value="col"></badge>
        </template>

        <!-- Actions -->
        <template #action="{row, remove, index}">
          <!-- Confirm -->
          <confirm-action @confirmed="tableKey++" url="purchase-invoices" :ids="[row.id]" v-if="row.status == 'draft'"></confirm-action>

          <!-- Action Dropdown -->
          <action-dropdown>
            <!-- Details -->
            <b-dropdown-item v-if="hasPagePermission('suppliers.purchase-invoice-details')" :to="localePath(`/purchase-invoices/${row.id}`)">
              <i class="far mr-1 fa-share-square text-success"></i>
              Details
            </b-dropdown-item>
            <!-- Edit -->
            <b-dropdown-item :to="localePath(`/purchase-invoices/${row.id}/edit`)" v-if="
                row.status == 'draft' &&
                  hasPagePermission('suppliers.edit-purchase-invoice')
              "><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <!-- Payment -->
            <b-dropdown-item @click="openPayModal(row)" v-if="row.status !== 'draft' && row.totalDue > 0">
              <i class="mr-1 fas fa-money-check text-success"></i>
              Pay Now
            </b-dropdown-item>
            <!-- Invoice -->
            <b-dropdown-item :to="localePath(`/purchase-invoices/${row.id}/invoice`)" v-if="row.status !== 'draft'">
              <i class="far mr-1 fa-file-alt text-success"></i>
              Invoice
            </b-dropdown-item>

            <!-- Return -->
            <b-dropdown-item :to="localePath(`/purchase-return-invoices/create?invoiceId=${row.id}`)" v-if="(row.status == 'confirmed' || row.status == 'paid' || row.status == 'partial' || row.status =='return') && row.totalPurchaseItemQuantity > row.totalReturnItemQuantity">
              <i class="fas mr-1 fa-undo text-dark"></i>
              Return
            </b-dropdown-item>

            <!-- Delete -->
            <b-dropdown-item v-if="row.status == 'draft'" @click="remove(row.id, index)">
              <i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Filter slot -->
        <template #filter>
          <date-filter v-model="filters.dateRange"></date-filter>
          <page-filter v-model="filters.perPage"></page-filter>

          <invoice-status-filter v-model="filters.status"></invoice-status-filter>
        </template>

      </data-table>

      <!-- Payment Modal -->
      <modal-control title="Add Payment" v-model="openPaymentModal">
        <template #title> </template>
        <template #body>
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
        </template>
        <!-- Action Buttons -->
        <template #footer="{ hide }">
          <button @click="hide()" class="btn btn-danger"> <i class="fas fa-window-close"></i> Close</button>
          <btn-primary v-shortkey="['enter']" @shortkey.native="savePayment($event,true)" @click="savePayment($event, true)" :loading="payingState" class="btn btn-success"><i class="fas fa-check"></i> Submit</btn-primary>
        </template>
      </modal-control>

      <!-- //////////////////////////// -->
      <!-- Calculate Modal -->
      <b-modal ref="calculate-modal" hide-footer title="Calculate">
        <div v-if="calculateData">
          <input-detail inModal :label="$t('fields.totalAmount')" :value="calculateData.total_amount"></input-detail>
          <input-detail inModal :label="$t('fields.totalPaid')" :value="calculateData.total_paid"></input-detail>
          <input-detail inModal :label="$t('fields.totalDue')" :value="calculateData.total_due"></input-detail>
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
  name: "purchase-invoices",
  mixins: [validation],
  data() {
    return {
      tableKey: 1,
      columns: [
        {
          field: "id",
          permission: "suppliers.manage-purchase-invoice.id",
        },
        {
          field: "invoiceNo",
          permission: "suppliers.manage-purchase-invoice.invoice-no",
        },
        {
          field: "date",
          permission: "suppliers.manage-purchase-invoice.date",
        },
        {
          field: "creator",
          permission: "suppliers.manage-purchase-invoice.creator",
        },
        {
          field: "supplierName",
          permission: "suppliers.manage-purchase-invoice.supplier-name",
        },
        {
          field: "totalAmount",
          permission: "suppliers.manage-purchase-invoice.total-amount",
        },
        {
          field: "paidAmount",
          permission: "suppliers.manage-purchase-invoice.total-paid",
        },
        {
          field: "totalDue",
          permission: "suppliers.manage-purchase-invoice.total-due",
        },
        {
          field: "totalSellingAmount",
          permission: "suppliers.manage-purchase-invoice.total-selling-amount",
        },
        {
          field: "profit",
          permission: "suppliers.manage-purchase-invoice.profit",
        },
        {
          field: "status",
          permission: "suppliers.manage-purchase-invoice.status",
        },
      ],
      filters: {
        search: "",
        perPage: 25,
        dateRange: "",
        trashed: "",
      },
      openPaymentModal: false,
      paymentForm: {
        method: "cash",
        amount: "",
        paymentableId: null,
      },
      checkedList: [],
      calculateData: null,

      payingState: false,
      totalDue: 0,
      grandTotal: 0,
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
      const url = `/reports/purchase-invoices/${name}?sort=id,des`;
      return `${url}&ids=${this.checkedList}`;
    },
    // Download PDF
    downloadPdf() {
      this.fileDownload({
        url: this.getDownloadUrl("pdf"),
        fileType: "application/pdf",
        fileName: "purchase-invoices-calculate.pdf",
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
        const res = await this.$axios.post("/purchase-invoices/calculate", {
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

    openPayModal(row) {
      this.paymentForm.paymentableId = row.id;
      this.grandTotal = row.totalAmount;
      this.totalDue = row.totalDue;
      this.openPaymentModal = true;
    },
    async savePayment() {
      this.payingState = true;
      try {
        await this.$axios.post(
          `/purchase-invoices/${this.paymentForm.paymentableId}/payments`,
          this.paymentForm
        );

        this.$toast.success("Payment Added Succesfully.");
        this.closePaymentModal();

        this.tableKey++;
      } catch (error) {
        console.log(error);
      } finally {
        this.payingState = false;
      }
    },
    closePaymentModal() {
      this.openPaymentModal = false;
      this.paymentForm.amount = "";
      this.paymentForm.method = "cash";
      this.paymentForm.paymentableId = null;
    },
  },
};
</script>

<style lang="scss" scoped></style>
