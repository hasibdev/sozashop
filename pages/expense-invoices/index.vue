<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("expenseInvoices.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="
          hasPagePermission('expenses.add-expenses-invoice') &&
            (hasPermission('create-expense-invoices') || hasRole('Admin'))
        " class="btn-primary" to="/expense-invoices/create">
        {{ $t("buttons.add") }} {{ $t("expenseInvoices.label") }}
      </btn-link>
    </template>

    <template>
      <data-table :key="tableKey" @onCheck="onCheck" :columns="columns" url="/expense-invoices" :filters="filters" :showIndex="true">
        <!-- Lense -->
        <template #lens>
          <b-dropdown class="mx-2" v-if="checkedList.length" variant="secondary" text="Lens" right>
            <!-- Calculate -->
            <b-dropdown-item v-if="checkedList.length" @click="openCalculateModal">
              Calculate
            </b-dropdown-item>
          </b-dropdown>
        </template>

        <!-- Buttons -->
        <!-- <template #buttons>
					<button v-if="checkedList.length" @click="openCalculateModal" class="btn btn-success mx-2">Calculate</button>
				</template> -->
        <!-- Bulk Action Slot -->
        <template #bulk-action="{ ids }">
          <confirm-action @confirmed="tableKey++" url="expense-invoices" :ids="ids" variant="dropdown"></confirm-action>
        </template>

        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <!-- Confirm -->
          <confirm-action @confirmed="tableKey++" url="expense-invoices" :ids="[row.id]" v-if="row.status == 'draft'"></confirm-action>

          <action-dropdown>
            <!-- invoice  -->
            <b-dropdown-item :to="localePath(`/expense-invoices/${row.id}/invoice`)" v-if="row.status !== 'draft'">
              <i class="mr-2 far fa-file-alt text-info"></i> Invoice
            </b-dropdown-item>
            <!-- Details -->
            <b-dropdown-item v-if="
                hasPagePermission('expenses.expenses-invoice-details') &&
                  (hasPermission('view-expense-invoices') || hasRole('Admin'))
              " :to="localePath(`/expense-invoices/${row.id}`)">
              <i class="mr-2 far fa-share-square text-success"></i> Details
            </b-dropdown-item>
            <!-- Payment -->
            <b-dropdown-item @click="openPayModal(row)" v-if="row.status !== 'draft' && row.totalDue > 0">
              <i class="mr-2 fas fa-money-check text-success"></i>
              Pay Now
            </b-dropdown-item>
            <!-- Edit -->
            <b-dropdown-item :to="localePath(`/expense-invoices/${row.id}/edit`)" v-if="
                row.status == 'draft' &&
                  hasPagePermission('expenses.edit-expenses-invoice') &&
                  (hasPermission('update-expense-invoices') || hasRole('Admin'))
              ">
              <i class="mr-2 far fa-edit text-primary"></i> Edit
            </b-dropdown-item>
            <!-- Delete -->
            <b-dropdown-item @click="remove(row.id, index)" v-if="
                (row.status == 'draft' &&
                  hasPermission('delete-expense-invoices')) ||
                  hasRole('Admin')
              ">
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

      <!-- Payment Modal -->
      <modal-control title="Add Payment" v-model="openPaymentModal">

        <template #body>

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
        </template>
        <!-- Action Buttons -->
        <template #footer="{ hide }">

          <button @click="hide()" class="btn btn-danger"> <i class="fas fa-window-close"></i> Close</button>
          <btn-primary v-shortkey="['enter']" @shortkey.native="savePayment($event,true)" @click="savePayment($event, true)" :loading="paySavingState" class="btn btn-success"><i class="fas fa-check"></i> Submit</btn-primary>

        </template>
      </modal-control>

      <!-- //////////////////////////// -->
      <!-- Calculate Modal -->
      <b-modal ref="calculate-modal" hide-footer title="Calculate">
        <div v-if="calculateData">
          <input-detail inModal :label="$t('fields.totalItems')" :value="calculateData.total_amount"></input-detail>
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
  <!-- End Page-content -->
</template>

<script>
import { mapGetters } from "vuex";
import validation from "@/plugins/mixins/validation";
export default {
  name: "expense-invoice",
  mixins: [validation],
  meta: {
    permission: "view-any-expense-invoices",
  },
  data() {
    return {
      tableKey: 1,
      columns: [
        {
          field: "invoiceNo",
          permission: "expenses.manage-expenses-invoice.invoice-number",
        },
        {
          field: "invoiceDateFormatted",
          label: "date",
          permission: "expenses.manage-expenses-invoice.date",
        },
        {
          field: "creator",
          permission: "expenses.manage-expenses-invoice.creator",
        },
        {
          field: "categoryName",
          label: "expenseType",
          permission: "expenses.manage-expenses-invoice.category",
        },
        {
          field: "totalAmount",
          permission: "expenses.manage-expenses-invoice.total-amount",
        },
        {
          field: "paidAmount",
          permission: "expenses.manage-expenses-invoice.paid-amount",
        },
        {
          field: "totalDue",
          permission: "expenses.manage-expenses-invoice.total-due",
          sortable: false,
        },
        {
          field: "status",
          permission: "expenses.manage-expenses-invoice.status",
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

      checkedList: [],
      calculateData: null,
      totalDue: 0,
      grandTotal: 0,
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
      const url = `/reports/expense-invoices/${name}?sort=id,des`;
      return `${url}&ids=${this.checkedList}`;
    },
    // Download PDF
    downloadPdf() {
      this.fileDownload({
        url: this.getDownloadUrl("pdf"),
        fileType: "application/pdf",
        fileName: "expense-invoices-calculate.pdf",
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
        const res = await this.$axios.post("/expense-invoices/calculate", {
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
      this.paySavingState= true;
      try {
        this.paySavingState= true;
        await this.$axios.post(
          `/expense-invoices/${this.paymentForm.paymentableId}/payments`,
          this.paymentForm
        );

        this.$toast.success("Payment Added Succesfully.");
        this.closePaymentModal();

        this.tableKey++;
      } catch (error) {
        console.log(error);
      }finally {
        this.paySavingState = false;
      }
    },
    closePaymentModal() {
      this.openPaymentModal = false;
      this.paymentForm.amount = "";
      this.paymentForm.method = "";
      this.paymentForm.paymentableId = null;
    },
  },
};
</script>

<style lang="scss" scoped></style>
