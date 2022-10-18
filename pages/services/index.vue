<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("services.title.manage") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="
          hasPagePermission('services.add-service') &&
                (hasPermission('create-services') || hasRole('Admin'))
          " class="btn-primary" to="/services/create">
        {{ $t("buttons.add") }} {{ $t("services.label") }}
      </btn-link>
    </template>

    <!-- Data Table -->
    <data-table :columns="columns" url="/services" :filters="filters">
      <!-- Action Slot -->
      <template v-slot:action="{ row, remove, index }">
        <action-dropdown>
          <b-dropdown-item v-if="
          hasPagePermission('services.service-details') &&
                (hasPermission('view-services') || hasRole('Admin'))
          " :to="localePath(`/services/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
            Details</b-dropdown-item>
          <b-dropdown-item v-if="
          hasPagePermission('services.edit-service') &&
                (hasPermission('update-services') || hasRole('Admin'))
          " :to="localePath(`/services/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
            Edit</b-dropdown-item>
          <b-dropdown-item v-if="
                (hasPermission('delete-services') || hasRole('Admin'))
          " @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
            Delete</b-dropdown-item>
        </action-dropdown>
      </template>

      <!-- Status Column -->
      <template #status="{ col }">
        <badge :value="col"></badge>
      </template>
      <!-- Status Column -->
      <template #type="{ col }">
        {{col | capitalize}}
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
    permission: "view-any-services",
  },
  data() {
    return {
      columns: [
        {
          field: "name",
          permission: "services.manage-services.name",
        },
        {
          field: "description",
          permission: "services.manage-services.description",
        },
        {
          field: "type",
          permission: "services.manage-services.type",
        },
        {
          field: "amount",
          permission: "services.manage-services.amount",
        },
        {
          field: "status",
          permission: "services.manage-services.status",
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
