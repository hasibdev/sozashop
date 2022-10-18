<template>
  <index-view>
    <template #title> {{ $t("headings.purchaseInvoiceReport") }} </template>
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
      <data-table @onCheck="handleCheck" :columns="columns" url="/purchase-invoices" :filters="filters">
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
  name: "purchase-invoices",
  meta: {
    permission: "view-purchase-invoices-report",
  },
  data() {
    return {
      columns: [
        {
          field: "invoiceNo",
          label: "invoice",
          permission: "report.purchase-invoices.invoice-no",
        },
        {
          field: "date",
          permission: "report.purchase-invoices.date",
        },
        {
          field: "totalAmount",
          permission: "report.purchase-invoices.total-amount",
        },
        {
          field: "paidAmount",
          label: "totalPaid",
          permission: "report.purchase-invoices.total-paid",
        },
        {
          field: "totalDue",

          permission: "report.purchase-invoices.total-due",
          sortable: false,
        },
        {
          field: "profit",
          permission: "report.purchase-invoices.profit",
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
      const url = `/reports/purchase-invoices/${name}?sort=id,des`;
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
        fileName: "purchase-invoices-report.pdf",
      });
    },
    downloadExcel() {
      this.fileDownload({
        url: this.getDownloadUrl("excel"),
        fileType: "application/vnd.ms-excel",
        fileName: "purchase-invoices-report.xlsx",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
