<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="invoice">
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("salesInvoice.title.details") }} : {{ invoice.customerName }}
        </h3>

        <action-dropdown iconVariant="light" v-if="invoice.status == 'draft'" :split="false" variant="primary">
          <!-- Edit -->
          <b-dropdown-item v-if="hasPagePermission('sales.edit-sales')" :to="localePath(`/sale-invoices/${invoice.id}/edit`)">
            <i class="far fa-edit text-primary mr-2"></i> Edit
          </b-dropdown-item>
          <!-- Delete -->
          <b-dropdown-item @click="remove()">
            <i class="far fa-trash-alt text-danger mr-2"></i> Delete
          </b-dropdown-item>
        </action-dropdown>
      </template>
      <template>
        <card>
          <!-- Date -->
          <input-detail :label="$t('fields.date')" :value="invoice.invoiceDateFormatted" v-if="hasFieldPermission('sales.sales-details.date')"></input-detail>

          <!-- Due Date -->
          <input-detail :label="$t('fields.dueDate')" :value="invoice.dueDateFormatted || '-'" v-if="hasFieldPermission('sales.sales-details.due-date')"></input-detail>

          <!-- Customer name -->
          <input-detail :label="$t('fields.customer')" :value="invoice.customer.name" v-if="hasFieldPermission('sales.sales-details.customer')"></input-detail>
          <!-- notes -->
          <input-detail :label="$t('fields.note')" :value="invoice.note || '-'" v-if="hasFieldPermission('sales.sales-details.note')"></input-detail>

          <!-- Status -->
          <input-detail :label="$t('fields.status')" :value="invoice.status" v-if="hasFieldPermission('sales.sales-details.status')">
            <template #default="{ value }">
              <badge :value="value"></badge>
            </template>
          </input-detail>

          <!-- Created At -->
          <input-detail :label="$t('fields.createdAt')" :value="invoice.createdAtFormatted" v-if="hasFieldPermission('sales.sales-details.created-at')"></input-detail>
          <!-- Updated At -->
          <input-detail :label="$t('fields.updatedAt')" :value="invoice.updatedAtFormatted" v-if="hasFieldPermission('sales.sales-details.updated-at')"></input-detail>

          <!-- Details Table -->
          <table class="table table-bordered mt-3">
            <thead>
              <th>{{ $t("fields.product") }}</th>
              <th>{{ $t("fields.rate") }}</th>
              <th>{{ $t("fields.quantity") }}</th>
              <th>{{ $t("fields.unit") }}</th>
              <th>{{ $t("fields.discount") }}</th>
              <th>{{ $t("fields.amount") }}</th>
            </thead>
            <tbody>
              <tr v-for="item in invoice.saleItems" :key="item.id">
                <td>{{ item.product.name }} {{ `(${item.batch.name})` }}</td>
                <!-- <td>{{ item.batch.name }}</td> -->
                <td>{{ item.rate }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.unit.name }}</td>
                <td>{{ item.discount }} {{ item.discountType }}</td>
                <td>{{ item.amount }}</td>
              </tr>
            </tbody>
            <tfoot>
              <!-- Charges -->
              <tr v-for="charge in invoice.charges" :key="charge.id">
                <td colspan="4" class="text-right font-weight-bold">
                  {{ charge.charge.name }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ charge.charge.type }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ charge.charge.amount }}
                </td>
              </tr>

              <!-- Total Discount -->
              <tr>
                <td colspan="5" class="text-right font-weight-bold">
                  {{ $t("fields.todalDiscount") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.totalDiscount }}
                </td>
              </tr>
              <!-- Grand Total -->
              <tr>
                <td colspan="5" class="text-right font-weight-bold">
                  {{ $t("fields.grandTotal") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.totalAmount }}
                </td>
              </tr>
              <!-- Paid Amount -->
              <tr>
                <td colspan="5" class="text-right font-weight-bold">
                  {{ $t("fields.totalPaid") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.paidAmount }}
                </td>
              </tr>
              <!-- Total Due -->
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
  name: "sale-invoice-details",
  meta: {
    permission: "view-sale-invoices",
  },
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
        paymentableType: "SaleInvoice",
      },
    };
  },
  methods: {
    remove() {
      this.removeResource({
        apiUrl: `/sale-invoices/${this.$route.params.id}`,
        redirectUrl: "/sale-invoices",
      });
    },
  },
  async fetch() {
    const resInvoice = await this.$axios.get(
      `/sale-invoices/${this.$route.params.id}`
    );

    this.invoice = resInvoice.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
