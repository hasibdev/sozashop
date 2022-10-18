<template>
  <index-view>
    <template #title> {{ $t("headings.expenseInvoicesReport") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

      <!-- Download -->
      <b-dropdown variant="info" right text="Download">
        <b-dropdown-item @click="downloadPdf">Download PDF</b-dropdown-item>
        <b-dropdown-item @click="downloadExcel">Download Excel</b-dropdown-item>
      </b-dropdown>
    </template>

    <!-- Data Table -->
    <template>
      <data-table @onCheck="handleCheck" :columns="columns" url="/expense-invoices" :filters="filters">
        <!-- Filter slot -->
        <template #filter>
          <date-filter v-model="filters.dateRange"></date-filter>
          <page-filter v-model="filters.perPage"></page-filter>

          <invoice-status-filter v-model="filters.status"></invoice-status-filter>
        </template>

      </data-table>
    </template>
  </index-view>
</template>

<script>
export default {
  name: "expense-invoice",
  meta: {
    permission: "view-expense-invoices-report",
  },
  data() {
    return {
      columns: [
        {
          field: "invoiceNo",
          label: "invoice",
          permission: "report.expense-invoices.invoice-no",
        },
        {
          field: "invoiceDateFormatted",
          label: "date",
          permission: "report.expense-invoices.date",
        },
        {
          field: "categoryName",
          label: "expenseType",
          permission: "report.expense-invoices.category-name",
        },
        {
          field: "creator",
          label: "createdBy",
          permission: "report.expense-invoices.created-by",
        },
        {
          field: "totalAmount",
          permission: "report.expense-invoices.total-amount",
        },
        {
          field: "paidAmount",
          label: "totalPaid",
          permission: "report.expense-invoices.total-paid",
        },
        {
          field: "totalDue",
          permission: "report.expense-invoices.total-due",
        },
      ],
      checkedList: [],
      filters: {
        search: "",
        perPage: 25,

        status: "",
        dateRange: "",
      },
    };
  },
  methods: {
    handleCheck(value) {
      this.checkedList = value;
    },
    getDownloadUrl(name) {
      const url = `/reports/expense-invoices/${name}?sort=id,des`;
      if (this.checkedList.length) {
        return `${url}&ids=${this.checkedList}`;
      } else {
        return `${url}${this.getQueries(this.filters)}`;
      }
    },
    downloadPdf() {
      this.fileDownload({
        url: this.getDownloadUrl("pdf"),
        fileType: "application/pdf",
        fileName: "expense-invoices-report.pdf",
      });
    },
    downloadExcel() {
      this.fileDownload({
        url: this.getDownloadUrl("excel"),
        fileType: "application/vnd.ms-excel",
        fileName: "expense-invoices-report.xlsx",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
