<template>
  <index-view>
    <template #title> {{ $t("charges.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link class="btn-primary" to="/charges/create" v-if="hasPagePermission('settings.add-charges')">
        {{ $t("buttons.add") }} {{ $t("charges.label") }}
      </btn-link>
    </template>

    <template>
      <data-table @onCheck="onCheck" :columns="columns" url="/charges" :filters="filters">

        <template #chargedBy="{col}">
          {{col | capitalize}}
        </template>
        <template #type="{col}">
          {{col | capitalize}}
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

        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <b-dropdown-item v-if="hasPagePermission('settings.charges-details')" :to="localePath(`/charges/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
            <b-dropdown-item v-if="hasPagePermission('settings.edit-charges')" :to="localePath(`/charges/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>

            <!-- Payment -->
            <b-dropdown-item @click="openPayModal(row)" v-if="row.chargedBy == 'government' && row.totalDue > 0">
              <i class="mr-2 fas fa-money-check text-success"></i>
              Pay Now
            </b-dropdown-item>

            <b-dropdown-item @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
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
          <input-detail inModal :label="$t('fields.totalInvoice')" :value="calculateData.total_invoice"></input-detail>
          <input-detail inModal :label="$t('fields.totalAmount')" :value="calculateData.total_amount"></input-detail>
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
  name: "charges",
  mixins: [validation],
  data() {
    return {
      columns: [
        {
          field: "name",
          permission: this.hasFieldPermission("settings.manage-charges.name"),
        },
        {
          field: "chargedBy",
          permission: this.hasFieldPermission(
            "settings.manage-charges.charged-by"
          ),
        },
        {
          field: "amount",
          permission: this.hasFieldPermission("settings.manage-charges.amount"),
        },

        {
          field: "type",
          permission: this.hasFieldPermission("settings.manage-charges.type"),
        },
        {
          field: "totalAmount",
          permission: this.hasFieldPermission(
            "settings.manage-charges.total-amount"
          ),
        },

        {
          field: "totalPaid",
          permission: this.hasFieldPermission(
            "settings.manage-charges.total_paid"
          ),
        },
        {
          field: "totalDue",
          permission: this.hasFieldPermission(
            "settings.manage-charges.total_due"
          ),
        },

        {
          field: "totalInvoice",
          permission: this.hasFieldPermission(
            "settings.manage-charges.total-invoice"
          ),
        },
        {
          field: "profitable",
          permission: this.hasFieldPermission(
            "settings.manage-charges.profitable"
          ),
        },
      ],
      filters: {
        search: "",
        perPage: 25,
      },

      checkedList: [],
      calculateData: null,
      openPaymentModal: false,
      paymentForm: {
        method: "cash",
        amount: "",
        paymentableId: null,
      },

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
      const url = `/reports/charges/${name}?sort=id,des`;
      return `${url}&ids=${this.checkedList}`;
    },
    // Download PDF
    downloadPdf() {
      this.fileDownload({
        url: this.getDownloadUrl("pdf"),
        fileType: "application/pdf",
        fileName: "charges-calculate.pdf",
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
        const res = await this.$axios.post("/charges/calculate", {
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
          `/charges/${this.paymentForm.paymentableId}/payments`,
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
