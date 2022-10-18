<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("expenseInvoices.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

    </template>

    <template>
      <data-table :columns="columns" url="/admin/expense-invoices" :filters="filters" :showIndex="true">
        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>
        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>
          <trash-filter v-model="filters.trashed"></trash-filter>
          <invoice-status-filter v-model="filters.status"></invoice-status-filter>
        </template>
      </data-table>

    </template>
  </index-view>
  <!-- End Page-content -->
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
  name: "expense-invoice",
  mixins: [validation],
  layout: "admin",
  data() {
    return {
      columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        {
          field: "invoiceNo",
          permission: true,
        },
        { field: "invoiceDateFormatted", label: "date", permission: true },
        { field: "categoryName", permission: true },
        {
          field: "totalAmount",
          permission: true,
        },
        {
          field: "paidAmount",
          permission: true,
        },
        {
          field: "totalDue",
          permission: true,
          sortable: false,
        },
        {
          field: "status",
          permission: true,
        },
      ],
      filters: {
        search: "",
        perPage: 25,
        trashed: "",
        status: "",
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
