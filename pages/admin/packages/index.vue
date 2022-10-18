<template>
  <index-view>
    <template #title> {{ $t("packages.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

      <!-- Create button -->
      <btn-link v-if="hasPermission('create-packages') || hasRole('Super Admin')" class="btn-primary" :to="localePath('/admin/packages/create')">
        {{ $t("buttons.add") }} {{ $t("packages.label") }}
      </btn-link>
    </template>

    <template>
      <data-table :columns="columns" url="/admin/packages" :filters="filters">
        <!-- Action Slot -->
        <template #action="{ row, remove, index }">
          <action-dropdown>
            <b-dropdown-item v-if="hasPermission('view-packages') || hasRole('Super Admin')" :to="localePath(`/admin/packages/${row.id}`)">
              <i class="far mr-1 fa-share-square text-success"></i>
              Details
            </b-dropdown-item>
            <b-dropdown-item v-if="hasPermission('update-packages') || hasRole('Super Admin')" :to="localePath(`/admin/packages/${row.id}/edit`)">
              <i class="far mr-1 fa-edit text-primary"></i>
              Edit
            </b-dropdown-item>
            <b-dropdown-item v-if="hasPermission('delete-packages') || hasRole('Super Admin')" @click="remove(row.id, index)">
              <i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Type -->
        <template #type="{ col }">
          {{ col.split('_').join(' ') | capitalize }}
        </template>
        <!-- Description -->
        <template #description="{ col }">
          <p v-for="d in col" :key="d.id" class="mb-1">{{ d.description }}</p>
          <!-- {{ col[0].description }} -->
        </template>
        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>
          <trash-filter v-model="filters.trashed"></trash-filter>
        </template>
      </data-table>
    </template>
  </index-view>
</template>

<script>
export default {
  name: "packages",
  layout: "admin",
  meta: {
    permission: "view-any-packages",
  },
  data() {
    return {
      columns: ["industryName","clientName","name", "totalClient", "price", "type", "description"],
      filters: {
        search: "",
        perPage: 25,
        trashed: "",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>