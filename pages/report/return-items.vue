<template>
  <index-view>
    <template #title> {{ $t("headings.returnItemsReport") }} </template>
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
      <data-table @onCheck="handleCheck" :columns="columns" url="/return-items" :filters="filters">
        <!-- purchaseRate -->
        <template v-slot:purchaseRate="{ col }">
          {{ Number(col).toFixed(2)}}
        </template>
        <!-- sellingRate -->
        <template v-slot:sellingRate="{ col }">
          {{ Number(col).toFixed(2)}}
        </template>
        <!-- amount -->
        <template v-slot:amount="{ col }">
          {{ Number(col).toFixed(2)}}
        </template>
        <!-- cost -->
        <template v-slot:cost="{ col }">
          {{ Number(col).toFixed(2)}}
        </template>
        <!-- profit -->
        <template v-slot:profit="{ col }">
          {{ Number(col).toFixed(2)}}
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
  name: "sale-items",
  meta: {
    permission: "view-return-items-report",
  },
  data() {
    return {
      columns: [
        {
          field: "productName",
          permission: "report.return-items.product-name",
        },
        {
          field: "batchName",
          permission: "report.return-items.batch-name",
        },
        {
          field: "invoiceNo",
          label: "invoice",
          permission: "report.return-items.invoice-no",
        },

        {
          field: "quantity",
          permission: "report.return-items.quantity",
        },

        {
          field: "sellingRate",
          label: "saleRate",
          permission: "report.return-items.sale-rate",
        },

        {
          field: "amount",
          label: "total",
          permission: "report.return-items.total-amount",
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
      const url = `/reports/return-items/${name}?sort=id,des`;
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
        fileName: "return-items.pdf",
      });
    },
    downloadExcel() {
      this.fileDownload({
        url: this.getDownloadUrl("excel"),
        fileType: "application/vnd.ms-excel",
        fileName: "return-items.xlsx",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
