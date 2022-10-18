<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("countries.title.manage") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="hasPermission('create-countries') || hasRole('Super Admin')" class="btn-primary" to="/admin/countries/create">
        {{ $t("buttons.add") }} {{ $t("countries.label") }}
      </btn-link>
    </template>

    <template>
      <data-table :columns="columns" url="/admin/countries" :filters="filters">
        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <b-dropdown-item v-if="hasPermission('view-countries') || hasRole('Super Admin')" :to="localePath(`/admin/countries/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
            <b-dropdown-item v-if="hasPermission('update-countries') || hasRole('Super Admin')" :to="localePath(`/admin/countries/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item v-if="hasPermission('delete-countries') || hasRole('Super Admin')" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>
        <!-- total client Column -->
        <template v-slot:totalClient="{ row}">
          <p v-if="row.modules">
            <span>{{getTotalClient(row.modules)}}</span>
          </p>
        </template>
        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>
    </template>
  </index-view>
  <!-- End Page-content -->
</template>

<script>
export default {
  name: "countries",
  layout: "admin",
  meta: {
    permission: "view-any-countries",
  },
  data() {
    return {
      columns: [
        { field: "name", permission: true },
        { field: "totalClient", permission: true },
        { field: "code", permission: true },
        { field: "currency", permission: true },
        { field: "currencySymbol", permission: true },
      ],
      filters: {
        search: "",
        perPage: 25,
      },
    };
  },
  methods: {
    getTotalClient(modules) {
      let total = 0;
      modules.forEach((item) => {
        total += item.totalClient;
      });
      return total;
    },
  },
};
</script>

<style lang="scss" scoped></style>
