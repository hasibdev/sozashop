<template>
  <index-view>
    <template #title> {{ $t("headings.saleInvoicesReport") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

      <!-- Download -->
      <b-dropdown variant="info" right text="Download">
        <b-dropdown-item @click="downloadPdf">Download PDF</b-dropdown-item>
        <b-dropdown-item @click="downloadExcel">Download Excel</b-dropdown-item>
      </b-dropdown>

      <!-- <div>
				<button @click="downloadPdf" class="btn btn-info">Download PDF</button>
				<button @click="downloadExcel" class="btn btn-success">Download Excel</button>
			</div> -->
    </template>

    <!-- Data Table -->
    <template>
      <data-table @onCheck="handleCheck" :columns="columns" url="/sale-invoices" :filters="filters">
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
  name: "sale-invoice",
  meta: {
    permission: "view-sale-invoices-report",
  },
  data() {
    return {
      columns: [
        {
          field: "invoiceNo",
          permission: "report.sale-invoices.invoice-no",
        },
        {
          field: "invoiceDateFormatted",
          label: "date",
          permission: "report.sale-invoices.date",
        },
        {
          field: "dueDateFormatted",
          label: "dueDate",
          permission: "report.sale-invoices.due-date",
        },
        {
          field: "creator",
          permission: "report.sale-invoices.creator",
        },
        {
          field: "customerName",
          permission: "report.sale-invoices.customer",
        },
        {
          field: "totalAmount",
          permission: "report.sale-invoices.total-amount",
        },
        {
          field: "totalCharge",
          permission: "report.sale-invoices.total-charge",
        },
        {
          field: "totalDiscount",
          permission: "report.sale-invoices.total-discount",
        },
        {
          field: "totalCost",
          permission: "report.sale-invoices.total-cost",
        },
        {
          field: "paidAmount",
          permission: "report.sale-invoices.total-paid",
        },
        {
          field: "totalDue",
          permission: "report.sale-invoices.total-due",
          sortable: false,
        },
        {
          field: "status",
          permission: "report.sale-invoices.status",
          sortable: false,
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
      const url = `/reports/sale-invoices/${name}?sort=id,des`;
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
        fileName: "sale-invoices-report.pdf",
      });
    },
    downloadExcel() {
      this.fileDownload({
        url: this.getDownloadUrl("excel"),
        fileType: "application/vnd.ms-excel",
        fileName: "sale-invoices-report.xlsx",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
