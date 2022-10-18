<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="invoice">
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("invoice.title.details") }} : {{ invoice.invoiceNo }}
        </h3>

        <action-dropdown iconVariant="light" :split="false" variant="primary">
          <!-- Edit -->
          <b-dropdown-item v-if="
              hasPagePermission('suppliers.edit-purchase-invoice') &&
                (hasPermission('update-purchase-invoices') || hasRole('Admin'))
            " :to="localePath(`/purchase-invoices/${invoice.id}/edit`)">
            <i class="far fa-edit text-primary mr-2"></i> Edit
          </b-dropdown-item>
          <!-- Payment -->
          <b-dropdown-item @click="openPayModal(invoice.id)" v-if="invoice.status !== 'draft' && invoice.totalDue > 0">
            <i class="mr-1 fas fa-money-check text-success"></i>
            Pay Now
          </b-dropdown-item>
          <!-- Delete -->
          <b-dropdown-item @click="remove()" v-if="hasPermission('delete-purchase-invoices') || hasRole('Admin')">
            <i class="far fa-trash-alt text-danger mr-2"></i> Delete
          </b-dropdown-item>
        </action-dropdown>
      </template>

      <!-- Default slot -->
      <template>
        <card>
          <!-- Invoice No -->
          <input-detail :label="$t('fields.invoiceNo')" :value="invoice.invoiceNo" v-if="hasFieldPermission('suppliers.purchase-invoice-details.invoice-no')"></input-detail>
          <!-- Date -->
          <input-detail :label="$t('fields.date')" :value="invoice.date" v-if="hasFieldPermission('suppliers.purchase-invoice-details.date')"></input-detail>
          <!-- creator -->
          <input-detail :label="$t('fields.creator')" :value="invoice.creator" v-if="hasFieldPermission('suppliers.purchase-invoice-details.creator')"></input-detail>
          <!-- Supplier Name -->
          <input-detail :label="$t('fields.supplierName')" :value="invoice.supplierName" v-if="hasFieldPermission('suppliers.purchase-invoice-details.supplier-name')"></input-detail>
          <!-- Total Selling Amount -->
          <input-detail :label="$t('fields.totalSellingAmount')" :value="invoice.totalSellingAmount" v-if="hasFieldPermission('suppliers.purchase-invoice-details.total-selling-amount')"></input-detail>
          <!-- Profit -->
          <input-detail :label="$t('fields.profit')" :value="invoice.profit" v-if="hasFieldPermission('suppliers.purchase-invoice-details.profit')"></input-detail>
          <!-- Status -->
          <input-detail :label="$t('fields.status')" v-if="hasFieldPermission('suppliers.purchase-invoice-details.status')">
            <badge :value="invoice.status"></badge>
          </input-detail>

          <!-- Details Table -->
          <table class="table table-bordered mt-3">
            <thead>
              <th>{{ $t("fields.product") }}</th>
              <th>{{ $t("fields.quantity") }}</th>
              <th>{{ $t("fields.rate") }}</th>
              <th>{{ $t("fields.unit") }}</th>
              <th>{{ $t("fields.amount") }}</th>
            </thead>
            <tbody>
              <tr v-for="item in invoice.purchaseItems" :key="item.id">
                <td>{{ item.productName }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.rate }}</td>
                <td>{{ item.unitCode }}</td>
                <td>{{ item.amount }}</td>
              </tr>
            </tbody>

            <tfoot>
              <!-- Total Payment -->
              <tr>
                <td colspan="4" class="text-right font-weight-bold">
                  {{ $t("fields.totalPayment") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.paidAmount }}
                </td>
              </tr>
              <!-- Total Due -->
              <tr>
                <td colspan="4" class="text-right font-weight-bold">
                  {{ $t("fields.totalDue") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.totalDue }}
                </td>
              </tr>
            </tfoot>
          </table>

        </card>

        <!-- Payment Modal -->
        <modal-control title="Add Payment" v-model="openPaymentModal">
          <template #title> </template>
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
            <btn-primary :loading="payingState" @click="savePayment" class="btn btn-primary">Save</btn-primary>
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
import { mapGetters } from "vuex";
import validation from "@/plugins/mixins/validation";
export default {
  name: "InvoiceDetails",
  mixins: [validation],
  data() {
    return {
      tableKey: 1,
      invoice: null,
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
        paymentableType: "PurchaseInvoice",
      },

      openPaymentModal: false,
      payingState: false,
      paymentForm: {
        method: "cash",
        amount: "",
        paymentableId: null,
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
    remove() {
      this.removeResource({
        apiUrl: `/purchase-invoices/${this.$route.params.id}`,
        redirectUrl: `/purchase-invoices`,
      });
    },

    openPayModal(id) {
      this.paymentForm.paymentableId = id;
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
        this.fetchPruchaseInvoice();

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

    async fetchPruchaseInvoice() {
      try {
        const resInvoice = await this.$axios.get(
          `/purchase-invoices/${this.$route.params.id}`
        );

        this.invoice = resInvoice.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  async fetch() {
    await this.fetchPruchaseInvoice();
  },
};
</script>

<style lang="scss" scoped></style>
