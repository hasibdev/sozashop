<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="invoice">
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("salesInvoice.title.details") }} : {{ invoice.customerName }}
        </h3>
      </template>
      <template>
        <card>
          <!-- Date -->
          <input-detail :label="$t('fields.date')" :value="formatDate(invoice.date)"></input-detail>

          <!-- Due Date -->
          <input-detail :label="$t('fields.dueDate')" :value="formatDate(invoice.dueDate) || '-'"></input-detail>

          <!-- Customer name -->
          <input-detail :label="$t('fields.customer')" :value="invoice.customer.name"></input-detail>

          <!-- Payment Method -->
          <input-detail :label="$t('fields.paymentMethod')" :value="invoice.paymentMethod"></input-detail>

          <!-- Status -->
          <input-detail :label="$t('fields.status')" :value="invoice.status">
            <template #default="{ value }">
              <badge :value="value"></badge>
            </template>
          </input-detail>

          <!-- Details Table -->
          <table class="table table-bordered mt-3">
            <thead>
              <th>{{ $t("fields.product") }}</th>
              <th>{{ $t("fields.batch") }}</th>
              <th>{{ $t("fields.rate") }}</th>
              <th>{{ $t("fields.quantity") }}</th>
              <th>{{ $t("fields.unit") }}</th>
              <th>{{ $t("fields.discount") }}</th>
              <th>{{ $t("fields.amount") }}</th>
            </thead>
            <tbody>
              <tr v-for="item in invoice.saleItems" :key="item.id">
                <td>{{ item.product.name }}</td>
                <td><span v-if="item.batch">{{ item.batch.name }}</span></td>
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
                <td colspan="5" class="text-right font-weight-bold">
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
                <td colspan="6" class="text-right font-weight-bold">
                  {{ $t("fields.todalDiscount") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.totalDiscount }}
                </td>
              </tr>
              <!-- Grand Total -->
              <tr>
                <td colspan="6" class="text-right font-weight-bold">
                  {{ $t("fields.grandTotal") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.totalAmount }}
                </td>
              </tr>
              <!-- Paid Amount -->
              <tr>
                <td colspan="6" class="text-right font-weight-bold">
                  {{ $t("fields.totalPaid") }}
                </td>
                <td class="font-weight-bold text-left">
                  {{ invoice.paidAmount }}
                </td>
              </tr>
              <!-- Total Due -->
              <tr>
                <td colspan="6" class="text-right font-weight-bold">
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
  </loading-view>
</template>

<script>
export default {
  name: "sale-invoice-details",
  layout: "admin",
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
        trashed: "",
      },
    };
  },
  async fetch() {
    const resInvoice = await this.$axios.get(
      `/admin/sale-invoices/${this.$route.params.id}`
    );

    this.invoice = resInvoice.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
