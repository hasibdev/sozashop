<template>
  <loading-view :loading="isLoading">
    <detail-view v-if="category">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("expenseCategories.title.details") }} : {{ category.name }}
        </h3>
        <div>
          <action-dropdown iconVariant="light" variant="primary">
            <b-dropdown-item v-if="
                hasPagePermission('expenses.edit-expenses-category') &&
                  (hasPermission('update-expense-categories') ||
                    hasRole('Admin'))
              " :to="localePath(`/expense-categories/${category.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item v-if="
                hasPermission('delete-expense-categories') || hasRole('Admin')
              " @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </div>
      </template>

      <template>
        <card>
          <!-- Name -->
          <input-detail :label="$t('fields.name')" :value="category.name" v-if="
              hasFieldPermission(
                'expenses.expenses-category-details.name'
              )
            "></input-detail>
          <!-- Description -->
          <input-detail :label="$t('fields.description')" :value="category.description" v-if="
              hasFieldPermission(
                'expenses.expenses-category-details.description'
              )
            "></input-detail>
          <!-- Total Amount -->
          <input-detail :label="$t('fields.totalAmount')" :value="category.totalAmount" v-if="
              hasFieldPermission(
                'expenses.expenses-category-details.total-amount'
              )
            "></input-detail>
          <!-- Total Paid -->
          <input-detail :label="$t('fields.totalPaid')" :value="category.totalPaid" v-if="
              hasFieldPermission(
                'expenses.expenses-category-details.total-paid'
              )
            "></input-detail>
          <!-- Total Due -->
          <input-detail :label="$t('fields.totalDue')" :value="category.totalDue" v-if="
              hasFieldPermission(
                'expenses.expenses-category-details.total-due'
              )
            "></input-detail>
          <!-- Total Invoice -->
          <input-detail :label="$t('fields.totalInvoice')" :value="category.invoicesCount" v-if="
              hasFieldPermission(
                'expenses.expenses-category-details.total-invoice'
              )
            "></input-detail>
          <!-- Status -->
          <input-detail :label="$t('fields.status')" v-if="
              hasFieldPermission('expenses.expenses-category-details.status')
            ">
            <badge :value="category.status"></badge>
          </input-detail>
        </card>
      </template>
    </detail-view>
  </loading-view>
</template>

<script>
export default {
  meta: {
    permission: "view-expense-categories",
  },
  data() {
    return {
      category: null,
    };
  },
  methods: {
    remove() {
      // Global Mixins ( removeResource )
      this.removeResource({
        apiUrl: `/expense-categories/${this.$route.params.id}`,
        redirectUrl: "/expense-categories",
      });
    },
  },
  async fetch() {
    const resCategory = await this.$axios.$get(
      `/expense-categories/${this.$route.params.id}`
    );
    this.category = resCategory.data;
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped></style>
