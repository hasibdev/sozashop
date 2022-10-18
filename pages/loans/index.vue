<template>
  <index-view>
    <template #title> {{ $t("loans.title.manage") }} </template>

    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="
          hasPagePermission('loan.add-loan') &&
            (hasPermission('create-loans') || hasRole('Admin'))
        " class="btn-primary" to="/loans/create">
        {{ $t("buttons.add") }} {{ $t("loans.label") }}
      </btn-link>
    </template>

    <template>
      <data-table :key="tableKey" @onCheck="onCheck" :columns="columns" url="/loans" :filters="filters">
        <!-- Bulk Action Slot -->
        <template #bulk-action="{ ids }">
          <confirm-action @confirmed="tableKey++" url="loans" :ids="ids" variant="dropdown"></confirm-action>
        </template>

        <!-- Lense -->
        <template #lens>
          <b-dropdown class="mx-2" v-if="checkedList.length" variant="secondary" text="Lens" right>
            <!-- Calculate -->
            <b-dropdown-item v-if="checkedList.length" @click="openCalculateModal">
              Calculate
            </b-dropdown-item>
          </b-dropdown>
        </template>

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Actions -->
        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <!-- Confirm -->
          <confirm-action @confirmed="tableKey++" url="loans" :ids="[row.id]" v-if="row.status == 'draft'"></confirm-action>
          <!-- Action Dropdown -->
          <action-dropdown>
            <!-- Details -->
            <b-dropdown-item v-if="
                hasPagePermission('loan.loan-details') &&
                  (hasPermission('view-loans') || hasRole('Admin'))
              " :to="localePath(`/loans/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
            <!-- Invoice -->
            <b-dropdown-item :to="localePath(`/loans/${row.id}/invoice`)" v-if="row.status !== 'draft'"><i class="far mr-1 fa-file-alt text-success"></i>
              Invoice</b-dropdown-item>
            <!-- Edit -->
            <b-dropdown-item :to="localePath(`/loans/${row.id}/edit`)" v-if="
                row.status == 'draft' &&
                  hasPagePermission('loan.edit-loan') &&
                  (hasPermission('update-loans') || hasRole('Admin'))
              "><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <!-- Payment -->
            <b-dropdown-item @click="openPayModal(row)" v-if="row.status !== 'draft' && row.totalDue > 0">
              <i class="mr-2 fas fa-money-check text-success"></i>
              Pay Now
            </b-dropdown-item>
            <!-- Delete -->
            <b-dropdown-item v-if="
                (row.status == 'draft' && hasPermission('delete-loans')) ||
                  hasRole('Admin')
              " @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>

      <!-- //////////////////////////////// -->
      <!-- Payment Modal -->
      <modal-control @hide="closePaymentModal" title="Add Payment" v-model="openPaymentModal">

        <template #body>
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
        </template>
        <!-- Action Buttons -->
        <template #footer="{ hide }">
         
          <button @click="hide()" class="btn btn-danger"> <i class="fas fa-window-close"></i> Close</button>
          <btn-primary v-shortkey="['enter']" @shortkey.native="savePayment($event,true)" @click="savePayment($event, true)" :loading="savingState" class="btn btn-success"><i class="fas fa-check"></i> Submit</btn-primary>
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
  name: "loans",
  mixins: [validation],
  meta: {
    permission: "view-any-loans",
  },
  data() {
    return {
      tableKey: 1,
      columns: [
        {
          field: "id",
          permission: "loan.manage-loan.id",
        },
        {
          field: "loanerName",
          label: "loaner",
          permission: "loan.manage-loan.loaner",
        },
        {
          field: "type",
          permission: "loan.manage-loan.type",
        },
        {
          field: "amount",
          permission: "loan.manage-loan.amount",
        },
        {
          field: "paidAmount",
          permission: "loan.manage-loan.total-paid",
        },
        {
          field: "totalDue",
          permission: "loan.manage-loan.total-due",
        },
        {
          field: "contractStartDate",
          permission: "loan.manage-loan.contract-start",
        },
        {
          field: "contractEndDate",
          permission: "loan.manage-loan.contract-end",
        },
        {
          field: "status",
          permission: "loan.manage-loan.status",
        },
      ],
      filters: {
        search: "",
        perPage: 25,
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

      savingState: false,
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
      const url = `/reports/loans/${name}?sort=id,des`;
      return `${url}&ids=${this.checkedList}`;
    },
    // Download PDF
    downloadPdf() {
      this.fileDownload({
        url: this.getDownloadUrl("pdf"),
        fileType: "application/pdf",
        fileName: "loans-calculate.pdf",
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
        const res = await this.$axios.post("/loans/calculate", {
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
      this.grandTotal = row.amount;
      this.totalDue = row.totalDue;
      this.openPaymentModal = true;
    },
    async savePayment() {
      this.savingState = true;
      try {
        await this.$axios.post(
          `/loans/${this.paymentForm.paymentableId}/payments`,
          this.paymentForm
        );

        this.$toast.success("Payment Added Succesfully.");
        this.closePaymentModal();

        this.tableKey++;
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
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
