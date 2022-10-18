<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="invoice">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("expenseInvoices.title.details") }}
        </h3>
      </template>
      <template>
        <card>
          <!-- Invoice No -->
          <input-detail :label="$t('fields.invoiceNo')" :value="invoice.invoiceNo || '-'"></input-detail>
          <!-- Date -->
          <input-detail :label="$t('fields.date')" :value="invoice.date"></input-detail>
          <!-- Category -->
          <input-detail :label="$t('fields.category')" :value="invoice.category.name"></input-detail>
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
              <th style="vertical-align: middle">
                {{ $t("fields.description") }}
              </th>
              <th>{{ $t("fields.amount") }}</th>
            </thead>
            <tbody>
              <tr v-for="item in invoice.expenseItems" :key="item.id">
                <td>{{ item.description }}</td>
                <td>{{ item.amount }}</td>
              </tr>
            </tbody>
            <tfoot>
              <td class="text-center font-weight-bold">
                {{ $t("fields.total") }}
              </td>
              <td class="font-weight-bold">{{ invoice.totalAmount }}</td>
            </tfoot>
          </table>
        </card>
      </template>
    </detail-view>

  </loading-view>
</template>

<script>
import ActionDropdown from "~/components/utils/ActionDropdown.vue";
export default {
  components: { ActionDropdown },
  name: "expence-details",
  layout: "admin",
  data() {
    return {
      invoice: null,
      columns: [
        "paymentAt",
        "amount",
        { field: "method", label: "paymentMethod", permission: true },
      ],
      filters: {
        search: "",
        perPage: 25,

        paymentableId: this.$route.params.id,
        paymentableType: "ExpenseInvoice",
      },
    };
  },

  async fetch() {
    const resInvoice = await this.$axios.get(
      `/admin/expense-invoices/${this.$route.params.id}`
    );

    this.invoice = resInvoice.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
