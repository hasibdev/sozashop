<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="category">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("categories.title.details") }} : {{ category.name }}
        </h3>
        <div>
          <action-dropdown variant="primary" iconVariant="light">
            <b-dropdown-item :to="localePath(`/categories/${category.id}/edit`)" v-if="
                hasPagePermission('categories.edit-category') &&
                  (hasPermission('update-categories') || hasRole('Admin'))
              "><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item @click="remove()" v-if="hasPermission('delete-categories') || hasRole('Admin')"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </div>
      </template>

      <template>
        <card>
          <!-- Name -->
          <input-detail :label="$t('fields.name')" :value="category.name" v-if="hasFieldPermission('categories.category-detail.name')"></input-detail>
          <!-- Description -->
          <input-detail :label="$t('fields.description')" :value="category.description" v-if="hasFieldPermission('categories.category-detail.description')"></input-detail>

          <!-- Product Type -->
          <input-detail :label="$t('fields.productType')" :value="category.totalProduct" v-if="hasFieldPermission('categories.category-detail.total-product')"></input-detail>
          <!-- Total Sale -->
          <input-detail :label="$t('fields.totalSale')" :value="category.totalSaleAmount" v-if="hasFieldPermission('categories.category-detail.total-sale')"></input-detail>

          <!-- Status -->
          <input-detail v-if="hasFieldPermission('categories.category-detail.status')" :label="$t('fields.status')">
            <badge :value="category.status"></badge>
          </input-detail>
        </card>
      </template>
    </detail-view>
  </loading-view>
</template>

<script>
export default {
  name: "category-details",
  meta: {
    permission: "view-categories",
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
        apiUrl: `/categories/${this.$route.params.id}`,
        redirectUrl: "/categories",
      });
    },
  },
  async fetch() {
    const resCategory = await this.$axios.$get(
      `/categories/${this.$route.params.id}`
    );
    this.category = resCategory.data;
  },
};
</script>

<style lang="scss" scoped></style>
