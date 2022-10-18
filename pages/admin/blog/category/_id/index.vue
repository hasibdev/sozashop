<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="category">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("categories.title.details") }} : {{ category.name }}
        </h3>
        <div>
          <action-dropdown variant="primary" iconVariant="light">
            <b-dropdown-item :to="localePath(`/admin/blog/category/${category.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </div>
      </template>

      <template>
        <card>
          <!-- Name -->
          <input-detail :label="$t('fields.name')" :value="category.name"></input-detail>

          <!-- Status -->
          <input-detail :label="$t('fields.status')">
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
  layout: 'admin',
  meta: {
    permission: true,
  },
  data() {
    return {
      category: null,
    }
  },
  methods: {
    remove() {
      // Global Mixins ( removeResource )
      this.removeResource({
        apiUrl: `/admin/blogCategories/${this.$route.params.id}`,
        redirectUrl: "/admin/blog/category",
      })
    },
  },
  async fetch() {
    const resCategory = await this.$axios.$get(
      `/admin/blogCategories/${this.$route.params.id}`
    )
    this.category = resCategory.data
  },
};
</script>

<style lang="scss" scoped></style>
