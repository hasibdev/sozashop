<template>
  <index-view>
    <template #title> {{ $t("suppliers.label") }} </template>

    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="
          hasPagePermission('suppliers.add-suppliers') &&
            (hasPermission('create-suppliers') || hasRole('Admin'))
        " class="btn-primary" to="/suppliers/create">
        {{ $t("buttons.add") }} {{ $t("suppliers.label") }}
      </btn-link>
    </template>

    <template>
      <data-table :key="tableKey" @onCheck="onCheck" :columns="columns" url="/suppliers" :filters="filters">
        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
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

        <!-- Actions -->
        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <b-dropdown-item v-if="
                hasPagePermission('suppliers.suppliers-details') &&
                  (hasPermission('view-suppliers') || hasRole('Admin'))
              " :to="localePath(`/suppliers/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
            <b-dropdown-item v-if="
                hasPagePermission('suppliers.edit-suppliers') &&
                  (hasPermission('update-suppliers') || hasRole('Admin'))
              " :to="localePath(`/suppliers/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <!-- <b-dropdown-item @click="openPaymentModal(row.id)">
              <i class="fas mr-1 fa-file-invoice-dollar text-info"></i>
              Pay Now
            </b-dropdown-item> -->
            <b-dropdown-item v-if="hasPermission('delete-suppliers') || hasRole('Admin')" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>

      <!-- Payment Modal -->
      <!-- <modal-control @hide="closePaymentModal" title="Add Payment" v-model="isPaymentOpen">

        <template #body>
          <form @submit.prevent="savePayment">
            
            <select-control track="value" :label="$t('fields.paymentMethod')" :options="paymentMethods || []" v-model="paymentForm.method" :error="validationErrors.method">
            </select-control>
            <input-control focus label="Paid Amount" v-model="paymentForm.amount" :error="validationErrors.amount"></input-control>
          </form>
        </template>
        
        <template #footer="{ hide }">
          <button @click="hide()" class="btn btn-secondary">Close</button>
          <btn-primary type="submit" :loading="paySavingState" @click="savePayment" class="btn btn-primary">Save</btn-primary>
        </template>
      </modal-control> -->

      <!-- //////////////////////////// -->
      <!-- Calculate Modal -->
      <b-modal ref="calculate-modal" hide-footer title="Calculate">
        <div v-if="calculateData">
          <input-detail inModal :label="$t('fields.totalInvoice')" :value="calculateData.totalInvoice"></input-detail>
          <input-detail inModal :label="$t('fields.totalAmount')" :value="calculateData.totalAmount"></input-detail>
          <input-detail inModal :label="$t('fields.paidAmount')" :value="calculateData.paidAmount"></input-detail>
          <input-detail inModal :label="$t('fields.totalDue')" :value="calculateData.totalDue"></input-detail>
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
  name: "manage-suppliers",
  mixins: [validation],
  meta: {
    permission: "view-any-suppliers",
  },
  data() {
    return {
      tableKey: 1,
      columns: [
        {
          field: "id",
          permission: "suppliers.manage-suppliers.id",
        },
        {
          field: "name",
          permission: "suppliers.manage-suppliers.name",
        },
        {
          field: "mobile",
          permission: "suppliers.manage-suppliers.mobile",
        },
        {
          field: "telephone",
          permission: "suppliers.manage-suppliers.telephone",
        },
        {
          field: "fax",
          permission: "suppliers.manage-suppliers.fax",
        },
        {
          field: "email",
          permission: "suppliers.manage-suppliers.email",
        },
        {
          field: "vatNumber",
          permission: "suppliers.manage-suppliers.vat-number",
        },
        {
          field: "openingBalance",
          permission: "suppliers.manage-suppliers.opening-balance",
        },
        {
          field: "totalInvoice",
          permission: "suppliers.manage-suppliers.total-invoice",
        },
        {
          field: "totalAmount",
          permission: "suppliers.manage-suppliers.total-amount",
        },
        {
          field: "paidAmount",
          permission: "suppliers.manage-suppliers.total-paid",
        },
        {
          field: "totalDue",
          permission: "suppliers.manage-suppliers.total-due",
        },
        {
          field: "status",
          permission: "suppliers.manage-suppliers.status",
        },
      ],

      filters: {
        search: "",
        perPage: 25,
      },
      isPaymentOpen: false,
      paymentForm: {
        method: "cash",
        amount: "",
        paymentableId: null,
      },
      checkedList: [],
      calculateData: null,
      paySavingState: false,
    };
  },
  computed: {
    ...mapGetters({
      paymentMethods: "config/getPaymentMethods",
      paymentable: "config/getPaymentable",
    }),
  },
  methods: {
    // Generate Download URL
    getDownloadUrl(name) {
      const url = `/reports/suppliers/${name}?sort=id,des`;
      return `${url}&ids=${this.checkedList}`;
    },
    // Download PDF
    downloadPdf() {
      this.fileDownload({
        url: this.getDownloadUrl("pdf"),
        fileType: "application/pdf",
        fileName: "suppliers-calculate.pdf",
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
        const res = await this.$axios.post("/suppliers/calculate", {
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
    openPaymentModal(id) {
      this.paymentForm.paymentableId = id;
      this.isPaymentOpen = true;
    },
    async savePayment() {
      this.paySavingState = true;
      try {
        await this.$axios.post("/payments", {
          ...this.paymentForm,
          paymentableType: this.paymentable?.SUPPLIER,
        });

        this.$toast.success("Payment Added Succesfully.");
        this.closePaymentModal();

        this.tableKey++;
      } catch (error) {
        console.log(error);
      } finally {
        this.paySavingState = false;
      }
    },
    closePaymentModal() {
      this.isPaymentOpen = false;
      this.paymentForm.amount = "";
      this.paymentForm.method = "";
      this.paymentForm.paymentableId = null;
    },
  },
};
</script>

<style lang="scss" scoped></style>
