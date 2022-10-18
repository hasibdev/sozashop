<template>
  <index-view>
    <template #title> {{ $t("headings.saleItemsReport") }} </template>
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
      <data-table @onCheck="handleCheck" :columns="columns" url="/sale-items" :filters="filters">
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
    permission: "view-sale-items-report",
  },
  data() {
    return {
      columns: [
        {
          field: "productName",
          permission: "report.sale-items.product-name",
        },
        {
          field: "invoiceNo",
          label: "invoice",
          permission: "report.sale-items.invoice-no",
        },
        // {
        //   field: "date",
        //   permission: "report.sale-items.date",
        // },
        {
          field: "purchaseRate",
          permission: "report.sale-items.purchase-rate",
        },
        {
          field: "quantity",
          permission: "report.sale-items.quantity",
        },
        {
          field: "cost",
          label: "totalCost",
          permission: "report.sale-items.total-cost",
        },
        {
          field: "sellingRate",
          label: "saleRate",
          permission: "report.sale-items.sale-rate",
        },
        {
          field: "totalDiscount",
          label: "discount",
          permission: "report.sale-items.discount",
        },
        {
          field: "amount",
          label: "total",
          permission: "report.sale-items.total-amount",
        },
        {
          field: "profit",
          permission: "report.sale-items.profit",
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
      const url = `/reports/sale-items/${name}?sort=id,des`;
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
        fileName: "sale-items.pdf",
      });
    },
    downloadExcel() {
      this.fileDownload({
        url: this.getDownloadUrl("excel"),
        fileType: "application/vnd.ms-excel",
        fileName: "sale-items.xlsx",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
