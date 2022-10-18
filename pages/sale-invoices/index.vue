<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("sales.title.manage") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="
          hasPagePermission('sales.new-sales') &&
            (hasPermission('create-sale-invoices') || hasRole('Admin'))
        " class="btn-primary" to="/sale-invoices/create">
        {{ $t("buttons.add") }} {{ $t("sales.label") }}
      </btn-link>
    </template>

    <template>
      <data-table :key="tableKey" @onCheck="onCheck" :columns="columns" url="/sale-invoices" :filters="filters">
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

        <!-- Table Rows -->
        <template #table-rows="{row, index, availableColumns, getLabel, getField, remove}">
          <tr :key="index" :class="{'text-danger': row.returnInvoicesCount > 0}">
            <!-- Chack box -->
            <td>
              <!-- <input v-model="checkedList" :value="row.id" type="checkbox" autocomplete="off" @change="onCheck" role="button" /> -->
              <custom-check :id="`check_id_${index}`" v-model="checkedList" :value="row.id" @change="onCheck"></custom-check>
            </td>
            <!-- Column -->
            <td class="px-3" v-for="(col, index) in availableColumns" :key="index" style="vertical-align: middle" :title="$t(`fields.${getLabel(col)}`)">
              <!-- Status Column -->
              <!-- <span>{{ getField(col.field) == 'status' }}</span> -->
              <badge v-if="getField(col.field) == 'status'" :value="row[getField(col)]"></badge>
              <span v-else>{{ row[getField(col)]  || '-' }}</span>
            </td>

            <!-- Actions -->
            <td align="right">
              <!-- Action Column Slot -->
              <div class="d-flex justify-content-end align-items-center">
                <!-- Confirm -->
                <confirm-action @confirmed="tableKey++" url="sale-invoices" :ids="[row.id]" v-if="row.status == 'draft'"></confirm-action>

                <!-- Action Dropdown -->
                <action-dropdown>
                  <!-- invoice  -->
                  <b-dropdown-item :to="localePath(`/sale-invoices/${row.id}/invoice`)" v-if="row.status !== 'draft'">
                    <i class="mr-2 far fa-file-alt text-info"></i> Invoice
                  </b-dropdown-item>
                  <!-- Share  -->
                  <b-dropdown-item v-if="hasActionPermission('sales.manage-sales.share-button') && row.status !== 'draft'" @click="handleShare(row.id)">
                    <i class="mr-2 far fa-check-square text-info"></i> Share
                  </b-dropdown-item>

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
                  <!-- Edit -->
                  <b-dropdown-item :to="localePath(`/sale-invoices/${row.id}/edit`)" v-if="
                row.status == 'draft' &&
                  hasPagePermission('sales.edit-sales') &&
                  (hasPermission('update-sale-invoices') || hasRole('Admin'))
              ">
                    <i class="mr-2 far fa-edit text-primary"></i> Edit
                  </b-dropdown-item>

                  <!-- Return -->
                  <b-dropdown-item v-if="hasPagePermission('sales.add-return-invoice') && (row.status == 'confirmed' || row.status == 'paid' || row.status == 'partial' || row.status == 'return') && row.totalSaleItemQuantity > row.totalReturnItemQuantity && row.totalCost > 0" :to="localePath(`/return-invoices/create?invoiceId=${row.id}`)">
                    <i class="fas mr-1 fa-undo text-dark"></i>
                    Return
                  </b-dropdown-item>

                  <!-- Delete -->
                  <b-dropdown-item @click="remove(row.id, index)" v-if="
                  (row.status == 'draft') && (hasPermission('delete-sale-invoices') || hasRole('Admin')) ">
                    <i class="mr-2 far fa-trash-alt text-danger"></i> Delete
                  </b-dropdown-item>
                </action-dropdown>
              </div>
            </td>
          </tr>
        </template>

        <!-- Filter slot -->
        <template #filter>
          <date-filter v-model="filters.dateRange"></date-filter>
          <page-filter v-model="filters.perPage"></page-filter>

          <invoice-status-filter v-model="filters.status"></invoice-status-filter>
        </template>

      </data-table>
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

      <!-- Share Modal -->
      <b-modal ref="share-modal" hide-footer title="Share Invoice">
        <!-- Modal Content -->
        <div v-if="!shareLink" class="d-flex justify-content-center">
          <b-spinner variant="primary" label="Spinning"></b-spinner>
        </div>
        <div v-else class="d-flex justify-content-between">
          <a style="word-break: break-all;" :href="shareLink" target="_blank">{{
                shareLink
              }}</a>
          <copy-to-clipboard :text="shareLink" @copy="copyTooltipText = 'Copid To clipboard'">
            <button v-b-tooltip.hover :title="copyTooltipText" :disabled="!shareLink" class="btn btn-primary ml-4">
              Copy
            </button>
          </copy-to-clipboard>
        </div>

        <div class="mt-4 d-flex">
          <ShareNetwork network="facebook" :url="shareLink" title="Sale Invoice" description="Sale Invoice" quote="" hashtags="sozashop">
            <i class="fab fa-lg fa-facebook-f share-icon"></i>
          </ShareNetwork>

          <ShareNetwork network="twitter" :url="shareLink" title="Sale Invoice" description="Sale Invoice" quote="" hashtags="sozashop">
            <i class="fab fa-lg fa-twitter share-icon ml-2"></i>
          </ShareNetwork>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer mt-2">
          <button @click="$refs['share-modal'].hide()" class="btn btn-secondary">Close</button>
        </div>
      </b-modal>

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
  <!-- End Page-content -->
</template>

<script>
import { mapGetters } from "vuex";
import validation from "@/plugins/mixins/validation";
export default {
  name: "sale-invoice",
  mixins: [validation],
  meta: {
    permission: "view-any-sale-invoices",
  },
  data() {
    return {
      tableKey: 1,
      columns: [
        {
          field: "invoiceNo",
          permission: "sales.manage-sales.invoice-no",
        },
        {
          field: "invoiceDateFormatted",
          label: "date",
          permission: "sales.manage-sales.date",
        },
        {
          field: "dueDateFormatted",
          label: "dueDate",
          permission: "sales.manage-sales.due-date",
        },
        {
          field: "creator",
          permission: "sales.manage-sales.creator",
        },
        {
          field: "customerName",
          permission: "sales.manage-sales.customer",
        },
        {
          field: "grandTotal",
          permission: "sales.manage-sales.total-amount",
        },
        {
          field: "totalCharge",
          permission: "sales.manage-sales.total-charge",
        },
        {
          field: "totalDiscount",
          permission: "sales.manage-sales.total-discount",
        },
        {
          field: "totalCost",
          permission: "sales.manage-sales.total-cost",
        },
        {
          field: "paidAmount",
          permission: "sales.manage-sales.total-paid",
        },
        {
          field: "totalDue",
          permission: "sales.manage-sales.total-due",
          sortable: false,
        },
        {
          field: "status",
          permission: "sales.manage-sales.status",
          sortable: false,
        },
      ],
      filters: {
        search: "",
        perPage: 25,

        dateRange: "",
        status: "",
      },
      openPaymentModal: false,
      openShareModal: false,
      copyTooltipText: null,
      shareLink: null,
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
    // Handle Share
    async handleShare(id) {
      this.shareLink = null;
      // this.openShareModal = true;
      this.$refs["share-modal"].show();
      this.copyTooltipText = "Copy Link";

      const res = await this.$axios.get(`/shareable-link/${id}/sale-invoices`);
      this.shareLink = res.data.data.url;
    },
  },
  async fetch() {
    // const res = await this.$axios.get("/sale-invoices");
    // console.log(res);
  },
};
</script>

<style lang="scss" scoped>
.share-icon {
  // padding: 10px;
  border-radius: 3px;
  color: white;
  width: 35px;
  height: 35px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  &.fa-facebook-f {
    background-color: #4267b2;
  }
  &.fa-twitter {
    background-color: #26bff7;
  }
}
</style>
