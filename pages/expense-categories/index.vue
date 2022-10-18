<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("expenseCategories.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="
          hasPagePermission('expenses.add-expenses-category') &&
            (hasPermission('create-expense-categories') || hasRole('Admin'))
        " class="btn-primary" to="/expense-categories/create">
        {{ $t("buttons.add") }} {{ $t("expenseCategories.label") }}
      </btn-link>
    </template>

    <template>
      <data-table @onCheck="onCheck" :columns="columns" url="/expense-categories" :filters="filters">

        <!-- Lense -->
        <template #lens>
          <b-dropdown class="mx-2" v-if="checkedList.length" variant="secondary" text="Lens" right>
            <!-- Calculate -->
            <b-dropdown-item v-if="checkedList.length" @click="openCalculateModal">
              Calculate
            </b-dropdown-item>
          </b-dropdown>
        </template>

        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <b-dropdown-item v-if="
                hasPagePermission('expenses.expenses-category-details') &&
                  (hasPermission('view-expense-categories') || hasRole('Admin'))
              " :to="localePath(`/expense-categories/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
            <b-dropdown-item v-if="
                hasPagePermission('expenses.edit-expenses-category') &&
                  (hasPermission('update-expense-categories') ||
                    hasRole('Admin'))
              " :to="localePath(`/expense-categories/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item v-if="
                hasPermission('delete-expense-categories') || hasRole('Admin')
              " @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>
        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>

      <!-- Calculate Modal -->
      <b-modal ref="calculate-modal" hide-footer title="Calculate">
        <div v-if="calculateData">
          <input-detail inModal :label="$t('fields.totalItems')" :value="calculateData.total_amount"></input-detail>
          <input-detail inModal :label="$t('fields.totalPaid')" :value="calculateData.total_paid"></input-detail>
          <input-detail inModal :label="$t('fields.totalDue')" :value="calculateData.total_due"></input-detail>
        </div>
        <!-- Loading -->
        <div v-else class="d-flex justify-content-center">
          <b-spinner variant="primary" label="Spinning"></b-spinner>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer mt-3">
          <btn-primary :disabled="!calculateData" @click="downloadCalculate">Download</btn-primary>
        </div>
      </b-modal>
    </template>
  </index-view>
  <!-- End Page-content -->
</template>

<script>
export default {
  meta: {
    permission: "view-any-expense-categories",
  },
  data() {
    return {
      columns: [
        {
          field: "name",
          permission: "expenses.manage-expenses-category.name",
        },
        {
          field: "description",
          permission: "expenses.manage-expenses-category.description",
        },
        {
          field: "totalAmount",
          permission: "expenses.manage-expenses-category.total-amount",
        },
        {
          field: "totalPaid",
          permission: "expenses.manage-expenses-category.total-paid",
        },
        {
          field: "totalDue",
          permission: "expenses.manage-expenses-category.total-due",
        },
        {
          field: "invoicesCount",
          label: "totalInvoice",
          permission: "expenses.manage-expenses-category.total-invoice",
        },
        {
          field: "status",
          permission: "expenses.manage-expenses-category.status",
        },
      ],
      filters: {
        search: "",
        perPage: 25,
      },
      openPaymentModal: false,
      checkedList: [],
      calculateData: null,
    };
  },
  methods: {
    // Open Calculate Modal
    async openCalculateModal() {
      this.$refs["calculate-modal"].show();
      this.calculateData = null;

      try {
        const res = await this.$axios.post("/expense-categories/calculate", {
          ids: this.checkedList,
        });
        this.calculateData = res.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    // Download from calculate modal
    async downloadCalculate() {
      this.downloadPdf();
      this.$refs["calculate-modal"].hide();
    },
    // Generate Download URL
    getDownloadUrl(name) {
      const url = `/reports/expense-categories/${name}?sort=id,des`;
      return `${url}&ids=${this.checkedList}`;
    },
    // Download PDF
    downloadPdf() {
      this.fileDownload({
        url: this.getDownloadUrl("pdf"),
        fileType: "application/pdf",
        fileName: "expense-categories-calculate.pdf",
      });
    },
    // Tigger when select or checked any data
    onCheck(val) {
      this.checkedList = val;
    },
  },
};
</script>

<style lang="scss" scoped></style>
