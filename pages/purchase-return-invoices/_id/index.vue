<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="invoice">
      <!-- Header Part -->
      <template #header>
        <h3 class="font-weight-normal">
          {{ $t("invoice.title.details") }} : {{ invoice.supplierName }}
        </h3>

        <action-dropdown iconVariant="light" :split="false" variant="primary">
          <b-dropdown-item @click="remove()">
            <i class="far fa-trash-alt text-danger mr-2"></i> Delete
          </b-dropdown-item>
        </action-dropdown>
      </template>

      <!-- Details Content -->
      <template>
        <card>
          <!-- date -->
          <input-detail :label="$t('fields.date')" :value="invoice.invoiceDateFormatted" v-if="hasFieldPermission('sales.return-invoice-details.date')">
          </input-detail>
          <!-- invoiceNo -->
          <input-detail :label="$t('fields.invoiceNo')" :value="invoice.invoiceNo" v-if="hasFieldPermission('sales.return-invoice-details.invoice-no')">
          </input-detail>
          <!-- saleInvoiceNo -->
          <input-detail :label="$t('fields.purchaseInvoiceNo')" :value="invoice.purchaseInvoiceNo" v-if="hasFieldPermission('sales.return-invoice-details.sale-invoice-no')">
          </input-detail>
          <!-- Name -->
          <input-detail :label="$t('fields.supplier')" :value="invoice.supplierName" v-if="hasFieldPermission('sales.return-invoice-details.customer')">
          </input-detail>
          <!-- Status -->
          <input-detail :label="$t('fields.status')" :value="invoice.status" v-if="hasFieldPermission('sales.return-invoice-details.status')">
            <template #default="{ value }">
              <badge :value="value"></badge>
            </template>
          </input-detail>

          <!-- Details Table -->
          <table class="table table-bordered mt-3">
            <thead>
              <th>{{ $t("fields.product") }}</th>
              <!-- <th>{{ $t("fields.batch") }}</th> -->
              <th>{{ $t("fields.rate") }}</th>
              <th>{{ $t("fields.quantity") }}</th>
              <th>{{ $t("fields.unit") }}</th>
              <th>{{ $t("fields.discount") }}</th>
              <th>{{ $t("fields.amount") }}</th>
            </thead>
            <tbody>
              <tr v-for="item in invoice.returnItems" :key="item.id">
                <td>{{ item.product.name }} {{ `(${item.batch.name})` }} </td>
                <!-- <td>{{ item.batch.name }}</td> -->
                <td>{{ item.rate }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.unit.name }}</td>
                <td>{{ item.discount }}</td>
                <td>{{ item.amount }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" class="text-right font-weight-bold">
                  {{ $t("fields.grandTotal") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.totalAmount }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="text-right font-weight-bold">
                  {{ $t("fields.paidAmount") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.paidAmount }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="text-right font-weight-bold">
                  {{ $t("fields.totalDue") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.totalDue }}
                </td>
              </tr>
            </tfoot>
          </table>
        </card>
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

    <data-table :columns="columns" url="/payments" :showIndex="true" :filters="filters">
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
export default {
  name: "return-invoice-details",
  data() {
    return {
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
        paymentableType: "PurchaseReturnInvoice",
      },
    };
  },
  async fetch() {
    const resInvoice = await this.$axios.get(
      `/purchase-return-invoices/${this.$route.params.id}`
    );

    this.invoice = resInvoice.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
