<template>
  <index-view>
    <template #title> {{ $t("headings.stockReport") }} </template>
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
      <data-table @onCheck="handleCheck" @toggledFilter="toggledFilter" :columns="columns" url="/batches" :filters="filters">
        <template #date="{ col }">
          {{ formatDate(col) }}
        </template>

        <!-- Filter slot -->
        <template #filter>
          <multi-select-filter v-model="filters.productIds" :options="products || []" label="Select Product"></multi-select-filter>
          <page-filter v-model="filters.perPage"></page-filter>

          <invoice-status-filter v-model="filters.status"></invoice-status-filter>
        </template>

      </data-table>
    </template>
  </index-view>
</template>

<script>
export default {
  name: "stock-report",
  meta: {
    permission: "view-batches-report",
  },
  data() {
    return {
      products: [],
      columns: [
        {
          field: "productName",
          label: "product",
          permission: "report.stocks.product",
        },
        {
          field: "name",
          label: "batch",
          permission: "report.stocks.batch",
        },
        {
          field: "categoryName",
          label: "category",
          permission: "report.stocks.category",
        },
        {
          field: "purchaseRate",
          permission: "report.stocks.purchase-rate",
        },
        {
          field: "sellingRate",
          label: "saleRate",
          permission: "report.stocks.sale-rate",
        },
        {
          field: "quantity",
          permission: "report.stocks.quantity",
        },
        {
          field: "totalPurchaseRate",
          label: "stockBalance",
          permission: "report.stocks.stock-balance",
        },
        {
          field: "totalSale",
          label: "sold",
          permission: "report.stocks.sold",
        },
        {
          field: "profit",
          permission: "report.stocks.profit",
        },
      ],
      checkedList: [],
      filters: {
        search: "",
        perPage: 25,

        status: "",
        productIds: [],
      },
    };
  },
  methods: {
    handleCheck(value) {
      this.checkedList = value;
    },
    getDownloadUrl(name) {
      const url = `/reports/batches/${name}?sort=id,des`;
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
        fileName: "stock-report.pdf",
      });
    },
    downloadExcel() {
      this.fileDownload({
        url: this.getDownloadUrl("excel"),
        fileType: "application/vnd.ms-excel",
        fileName: "stock-report.xlsx",
      });
    },

    async toggledFilter(value) {
      if (value) {
        try {
          const response = await this.$axios.get("/products");

          this.products = response.data;
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
