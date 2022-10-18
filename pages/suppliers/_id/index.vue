<template>
  <loading-view :loading="isLoading">
    <detail-view v-if="supplier">
      <!-- Header Part -->
      <template #header>
        <h3 class="font-weight-normal">
          {{ $t("suppliers.title.details") }} : {{ supplier.name }}
        </h3>
        <action-dropdown iconVariant="light" :split="false" variant="primary">
          <b-dropdown-item v-if="hasActionPermission('suppliers.suppliers-details.history')" :to="localePath(`/suppliers/${supplier.id}/history`)">
            <i class="far fa-eye text-info mr-2"></i> History
          </b-dropdown-item>
          <b-dropdown-item v-if="
              hasPagePermission('suppliers.edit-suppliers') &&
                (hasPermission('update-suppliers') || hasRole('Admin'))
            " :to="localePath(`/suppliers/${supplier.id}/edit`)">
            <i class="far fa-edit text-primary mr-2"></i> Edit
          </b-dropdown-item>
          <b-dropdown-item v-if="hasPermission('delete-suppliers') || hasRole('Admin')" @click="remove()">
            <i class="far fa-trash-alt text-danger mr-2"></i> Delete
          </b-dropdown-item>
        </action-dropdown>
      </template>

      <!-- Details -->
      <template>
        <card>
          <!-- Name -->
          <input-detail :label="$t('fields.name')" :value="supplier.name" v-if="hasFieldPermission('suppliers.suppliers-details.name')">
          </input-detail>
          <!-- Mobile -->
          <input-detail :label="$t('fields.mobile')" :value="supplier.mobile" v-if="hasFieldPermission('suppliers.suppliers-details.mobile')">
          </input-detail>
          <!-- telephone -->
          <input-detail :label="$t('fields.telephone')" :value="supplier.telephone" v-if="hasFieldPermission('suppliers.suppliers-details.telephone')">
          </input-detail>
          <!-- email -->
          <input-detail :label="$t('fields.email')" :value="supplier.email" v-if="hasFieldPermission('suppliers.suppliers-details.email')">
          </input-detail>
          <!-- fax -->
          <input-detail :label="$t('fields.fax')" :value="supplier.fax" v-if="hasFieldPermission('suppliers.suppliers-details.fax')">
          </input-detail>
          <!-- vatNumber -->
          <input-detail :label="$t('fields.vatNumber')" :value="supplier.vatNumber" v-if="hasFieldPermission('suppliers.suppliers-details.vat-number')">
          </input-detail>
          <!-- openingBalance -->
          <input-detail :label="$t('fields.openingBalance')" :value="supplier.openingBalance" v-if="hasFieldPermission('suppliers.suppliers-details.opening-balance')">
          </input-detail>
          <!-- totalInvoice -->
          <input-detail :label="$t('fields.totalInvoice')" :value="supplier.totalInvoice" v-if="hasFieldPermission('suppliers.suppliers-details.total-invoice')">
          </input-detail>
          <!-- totalAmount -->
          <input-detail :label="$t('fields.totalAmount')" :value="supplier.totalAmount" v-if="hasFieldPermission('suppliers.suppliers-details.total-amount')">
          </input-detail>
          <!-- totalPaid -->
          <input-detail :label="$t('fields.totalPaid')" :value="supplier.paidAmount" v-if="hasFieldPermission('suppliers.suppliers-details.total-paid')">
          </input-detail>
          <!-- totalDue -->
          <input-detail :label="$t('fields.totalDue')" :value="supplier.totalDue" v-if="hasFieldPermission('suppliers.suppliers-details.total-due')">
          </input-detail>

          <!-- Status -->
          <input-detail :label="$t('fields.status')" v-if="hasFieldPermission('suppliers.suppliers-details.status')">
            <badge :value="supplier.status"></badge>
          </input-detail>
        </card>

        <!-- Invoices -->
        <h3>Invoices</h3>

        <data-table :key="tableKey" @onCheck="onCheck" :columns="columns" :url="`purchase-invoices/supplier/${$route.params.id}`" :filters="filters">
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
              <b-dropdown-item v-if="
                row.status == 'draft' &&
                  hasPagePermission('suppliers.purchase-invoice-details')
              " :to="localePath(`/purchase-invoices/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
                Details</b-dropdown-item>
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
              <b-dropdown-item :to="localePath(`/purchase-invoices/${row.id}/invoice`)" v-if="row.status !== 'draft'"><i class="far mr-1 fa-file-alt text-success"></i>
                Invoice</b-dropdown-item>

              <!-- Delete -->
              <b-dropdown-item v-if="row.status == 'draft'" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
                Delete</b-dropdown-item>
            </action-dropdown>
          </template>
        </data-table>

        <!-- Payment Modal -->
        <modal-control title="Add Payment" v-model="openPaymentModal">
          <template #title> </template>
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
    </detail-view>
  </loading-view>
</template>

<script>
import { mapGetters } from "vuex";
import validation from "@/plugins/mixins/validation";
export default {
  name: "supplier-details",
  mixins: [validation],
  meta: {
    permission: "view-suppliers",
  },
  data() {
    return {
      supplier: null,
      tableKey: 1,

      columns: [
        { field: "invoiceNo", permission: true },
        { field: "supplierName", permission: true },
        { field: "totalAmount", permission: true },
        {
          field: "paidAmount",
          permission: true,
        },
        {
          field: "totalDue",
          permission: true,
        },
        { field: "status", permission: true },
      ],
      filters: {
        search: "",
        perPage: 25,
        trashed: "",
        supplierId: this.$route.params.id,
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
      this.paymentForm.method = "";
      this.paymentForm.paymentableId = null;
    },

    // Delete Supplier
    remove() {
      this.removeResource({
        apiUrl: `/suppliers/${this.$route.params.id}`,
        redirectUrl: "/suppliers",
      });
    },
  },
  async fetch() {
    //   Fetch Supplier
    const resSupplier = await this.$axios.$get(
      `/suppliers/${this.$route.params.id}`
    );
    this.supplier = resSupplier.data;
    //   Disable Loading
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped></style>
