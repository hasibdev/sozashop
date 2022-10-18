<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="category">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("serviceCategories.title.details") }} : {{ category.name }}
        </h3>
        <div>
          <action-dropdown iconVariant="light" variant="primary">
            <b-dropdown-item v-if="
          hasPagePermission('services.edit-service-category') &&
                (hasPermission('update-service-categories') || hasRole('Admin'))
          " :to="localePath(`/service-categories/${category.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>

            <b-dropdown-item v-if="(hasPermission('delete-service-categories') || hasRole('Admin'))" @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </div>
      </template>

      <template>
        <card>
          <!-- name -->
          <input-detail :label="$t('fields.name')" :value="category.name" v-if="hasFieldPermission('services.service-category-details.name')"></input-detail>
          <!-- description -->
          <input-detail v-if="hasFieldPermission('services.service-category-details.description')" :label="$t('fields.description')" :value="category.description"></input-detail>
          <!-- status -->
          <input-detail :label="$t('fields.status')" v-if="hasFieldPermission('services.service-category-details.status')">
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
    permission: "view-service-categories",
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
        apiUrl: `/service-categories/${this.$route.params.id}`,
        redirectUrl: "/service-categories",
      });
    },
  },
  async fetch() {
    const resCategory = await this.$axios.$get(
      `/service-categories/${this.$route.params.id}`
    );
    this.category = resCategory.data;
  },
};
</script>

<style lang="scss" scoped></style>
