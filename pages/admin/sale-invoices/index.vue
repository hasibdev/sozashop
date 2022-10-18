<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("headings.saleInvoices") }} </template>

    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
    </template>

    <template>

      <data-table :key="tableKey" :columns="columns" url="/admin/sale-invoices" :filters="filters">
        <!-- Bulk Action Slot -->
        <template #bulk-action="{ids}">
          <confirm-action @confirmed="tableKey++" url="/admin/sale-invoices" :ids="ids" variant="dropdown"></confirm-action>
        </template>
        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>

        <template #date="{col}">
          {{formatDate(col)}}
        </template>

        <template #invoiceNo="{col, row}">
          <router-link :to="`/admin/sale-invoices/${row.id}`">{{col}}</router-link>
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
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      tableKey: 1,
      columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        {
          field: "invoiceNo",
          permission: true,
        },
        {
          field: "invoiceDateFormatted",
          label: "date",
          permission: true,
        },
        {
          field: "customerName",
          permission: true,
        },
        {
          field: "totalAmount",
          permission: true,
        },
        {
          field: "totalCharge",
          permission: true,
        },
        {
          field: "totalDiscount",
          permission: true,
        },
        {
          field: "totalCost",
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
          sortable: false,
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

<style lang="scss" scoped>
</style>
