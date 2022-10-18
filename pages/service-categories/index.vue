<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("serviceCategories.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="
          hasPagePermission('services.add-service-category') &&
                (hasPermission('create-service-categories') || hasRole('Admin'))
          " class="btn-primary" to="/service-categories/create">
        {{ $t("serviceCategories.title.add") }}
      </btn-link>
    </template>

    <!-- Data Table -->
    <data-table :columns="columns" url="/service-categories" :filters="filters">
      <!-- Action Slot -->
      <template v-slot:action="{ row, remove, index }">
        <action-dropdown>
          <b-dropdown-item v-if="
          hasPagePermission('services.service-category-details') &&
                (hasPermission('view-service-categories') || hasRole('Admin'))
          " :to="localePath(`/service-categories/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
            Details</b-dropdown-item>

          <b-dropdown-item v-if="
          hasPagePermission('services.edit-service-category') &&
                (hasPermission('update-service-categories') || hasRole('Admin'))
          " :to="localePath(`/service-categories/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
            Edit</b-dropdown-item>

          <b-dropdown-item v-if="(hasPermission('delete-service-categories') || hasRole('Admin'))" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
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
  </index-view>

</template>

<script>
export default {
  meta: {
    permission: "view-any-service-categories",
  },
  data() {
    return {
      columns: [
        {
          field: "name",
          permission: "services.manage-service-categories.name",
        },
        {
          field: "description",
          permission: "services.manage-service-categories.description",
        },
        {
          field: "status",
          permission: "services.manage-service-categories.status",
        },
      ],
      filters: {
        search: "",
        perPage: 25,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
