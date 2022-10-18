<template>
  <index-view>
    <template #title> {{ $t("roles.title.manage") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="hasPagePermission('staffs.add-role')" class="btn-primary" to="/roles/create">
        {{ $t("buttons.add") }} {{ $t("roles.label") }}
      </btn-link>
    </template>

    <template>
      <data-table :columns="columns" url="/roles" :filters="filters" :showIndex="true">
        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <b-dropdown-item v-if="hasPagePermission('staffs.role-details')" :to="localePath(`/roles/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
            <b-dropdown-item v-if="hasPagePermission('staffs.edit-role')" :to="localePath(`/roles/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>
    </template>
  </index-view>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      columns: [
        // { field: "id", permission: true },
        {
          field: "name",
          permission: "staffs.manage-roles.name",
        },
        {
          field: "totalUser",
          permission: "staffs.manage-roles.total-user",
          sortable: false,
        },
      ],
      filters: {
        search: "",
        perPage: 25,

        client: this.$auth.user.clientId,
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
