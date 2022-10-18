<template>
  <index-view>
    <template #title> {{ $t("headings.expenseCategoriesReport") }} </template>
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
      <data-table @onCheck="handleCheck" :columns="columns" url="/expense-categories" :filters="filters">
        <!-- Filter slot -->
        <template #filter>
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
    permission: "view-expense-categories-report",
  },
  data() {
    return {
      columns: [
        {
          field: "name",
          label: "expenseType",
          permission: "report.expense-categories.expense-type",
        },
        {
          field: "totalAmount",
          permission: "report.expense-categories.total-amount",
        },
        {
          field: "totalPaid",
          permission: "report.expense-categories.total-paid",
        },
        {
          field: "totalDue",
          permission: "report.expense-categories.total-due",
        },
        {
          field: "lastExpenseDateFormatted",
          label: "lastExpense",
          permission: "report.expense-categories.last-expense",
        },
      ],
      checkedList: [],
      filters: {
        search: "",
        perPage: 25,

        status: "",
      },
    };
  },
  methods: {
    handleCheck(value) {
      this.checkedList = value;
    },
    getDownloadUrl(name) {
      const url = `/reports/expense-categories/${name}?sort=id,des`;
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
        fileName: "expense-categories-report.pdf",
      });
    },
    downloadExcel() {
      this.fileDownload({
        url: this.getDownloadUrl("excel"),
        fileType: "application/vnd.ms-excel",
        fileName: "expense-categories-report.xlsx",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
