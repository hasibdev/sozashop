<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="invoice">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("expenseInvoices.title.details") }}
        </h3>

        <action-dropdown iconVariant="light" :split="false" variant="primary">
          <!-- Invoice -->
          <b-dropdown-item :to="localePath(`/expense-invoices/${invoice.id}/invoice`)" v-if="invoice.status !== 'draft'">
            <i class="far fa-file-alt text-info mr-2"></i> Invoice
          </b-dropdown-item>
          <!-- Edit -->
          <b-dropdown-item :to="localePath(`/expense-invoices/${invoice.id}/edit`)" v-if="
              invoice.status == 'draft' &&
                hasPagePermission('expenses.edit-expenses-invoice') &&
                (hasPermission('update-expense-invoices') || hasRole('Admin'))
            ">
            <i class="far fa-edit text-primary mr-2"></i> Edit
          </b-dropdown-item>
          <!-- Delete -->
          <b-dropdown-item @click="remove()" v-if="
              (invoice.status == 'draft' &&
                hasPermission('delete-expense-invoices')) ||
                hasRole('Admin')
            ">
            <i class="far fa-trash-alt text-danger mr-2"></i> Delete
          </b-dropdown-item>
        </action-dropdown>
      </template>
      <template>
        <card>
          <!-- Invoice No -->
          <input-detail :label="$t('fields.invoiceNo')" :value="invoice.invoiceNo || '-'" v-if="
              hasFieldPermission('expenses.expenses-invoice-details.invoice-no')
            "></input-detail>
          <!-- Date -->
          <input-detail :label="$t('fields.date')" :value="invoice.invoiceDateFormatted" v-if="hasFieldPermission('expenses.expenses-invoice-details.date')"></input-detail>
          <!-- Category -->
          <input-detail :label="$t('fields.expenseType')" :value="invoice.category.name" v-if="hasFieldPermission('expenses.expenses-invoice-details.expense-type')"></input-detail>
          <!-- Status -->
          <input-detail :label="$t('fields.status')" :value="invoice.status" v-if="
              hasFieldPermission('expenses.expenses-invoice-details.status')
            ">
            <template #default="{ value }">
              <badge :value="value"></badge>
            </template>
          </input-detail>

          <!-- Created At -->
          <input-detail :label="$t('fields.createdAt')" :value="invoice.createdAtFormatted" v-if="hasFieldPermission('expenses.expenses-invoice-details.created-at')"></input-detail>
          <!-- Updated At -->
          <input-detail :label="$t('fields.updatedAt')" :value="invoice.updatedAtFormatted" v-if="hasFieldPermission('expenses.expenses-invoice-details.updated-at')"></input-detail>

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
              <tr>
                <td class="text-right font-weight-bold">
                  {{ $t("fields.total") }}
                </td>
                <td class="font-weight-bold">{{ invoice.totalAmount }}</td>
              </tr>
              <tr>
                <td class="text-right font-weight-bold">
                  {{ $t("fields.totalPaid") }}
                </td>
                <td class="font-weight-bold">{{ invoice.paidAmount }}</td>
              </tr>
              <tr>
                <td class="text-right font-weight-bold">
                  {{ $t("fields.totalDue") }}
                </td>
                <td class="font-weight-bold">{{ invoice.totalDue }}</td>
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
      <!-- Filter slot -->
      <template #filter>
        <page-filter v-model="filters.perPage"></page-filter>

      </template>
    </data-table>
  </loading-view>
</template>

<script>
import ActionDropdown from "~/components/utils/ActionDropdown.vue";
export default {
  components: { ActionDropdown },
  name: "expence-details",
  meta: {
    permission: "view-expense-invoices",
  },
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
  methods: {
    remove() {
      this.removeResource({
        apiUrl: `/expense-invoices/${this.$route.params.id}`,
        redirectUrl: "/expense-invoices",
      });
    },
  },
  async fetch() {
    const resInvoice = await this.$axios.get(
      `/expense-invoices/${this.$route.params.id}`
    );

    this.invoice = resInvoice.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
