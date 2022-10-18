<template>
  <index-view>
    <template #title> {{ $t("headings.suppliersReport") }} </template>
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
      <data-table @onCheck="handleCheck" :columns="columns" url="/suppliers" :filters="filters">
        <template #date="{ col }">
          {{ formatDate(col) }}
        </template>

        <!-- Filter slot -->
        <template #filter>
          <!-- <date-filter v-model="filters.dateRange"></date-filter> -->
          <page-filter v-model="filters.perPage"></page-filter>

          <invoice-status-filter v-model="filters.status"></invoice-status-filter>
        </template>

      </data-table>
    </template>
  </index-view>
</template>

<script>
export default {
  name: "suppliers-report",
  meta: {
    permission: "view-suppliers-report",
  },
  data() {
    return {
      columns: [
        {
          field: "name",
          label: "supplier",
          permission: "report.suppliers.supplier",
        },
        {
          field: "mobile",
          permission: "report.suppliers.mobile",
        },
        {
          field: "totalInvoice",
          permission: "report.suppliers.total-invoice",
        },
        {
          field: "totalPurchase",
          permission: "report.suppliers.total-purchase",
        },
        {
          field: "paidAmount",
          label: "totalPaid",
          permission: "report.suppliers.total-paid",
        },
        {
          field: "totalDue",
          permission: "report.suppliers.total-due",
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
      const url = `/reports/suppliers/${name}?sort=id,des`;
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
        fileName: "suppliers-report.pdf",
      });
    },
    downloadExcel() {
      this.fileDownload({
        url: this.getDownloadUrl("excel"),
        fileType: "application/vnd.ms-excel",
        fileName: "suppliers-report.xlsx",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
