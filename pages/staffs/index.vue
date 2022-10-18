<template>
  <index-view>
    <!-- Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="hasPagePermission('staffs.add-staff')" class="btn-primary" to="/staffs/create">
        {{ $t("buttons.add") }} {{ $t("staffs.label") }}
      </btn-link>
    </template>

    <!-- Data Table -->
    <template>
      <data-table :columns="columns" url="/staffs" :filters="filters">
        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <b-dropdown-item v-if="hasPagePermission('staffs.staff-details')" :to="localePath(`/staffs/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
            <b-dropdown-item v-if="hasPagePermission('staffs.edit-staff') && !isAdminRole(row)" :to="localePath(`/staffs/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item v-if="!isAdminRole(row)" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
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
    </template>
  </index-view>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          field: "id",
          permission: "staffs.manage-staffs.id",
        },

        {
          field: "name",
          permission: "staffs.manage-staffs.name",
        },
        {
          field: "email",
          permission: "staffs.manage-staffs.email",
        },
        {
          field: "mobile",
          permission: "staffs.manage-staffs.mobile",
        },
        {
          field: "designation",
          permission: "staffs.manage-staffs.designation",
        },
        {
          field: "availableRoles",
          permission: "staffs.manage-staffs.roles",
          sortable: false,
        },
        {
          field: "status",
          permission: "staffs.manage-staffs.status",
        },
      ],
      filters: {
        search: "",
        perPage: 25,

        client: this.$auth.user.clientId,
      },
    };
  },
  methods: {
    isAdminRole(row) {
      return row.availableRoles?.includes("Admin");
    },
  },
};
</script>

<style lang="scss" scoped></style>
