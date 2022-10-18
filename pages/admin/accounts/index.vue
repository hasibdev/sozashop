<template>
  <index-view>
    <template #title> {{ $t("accounts.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
    </template>

    <template>
      <data-table :columns="columns" url="/admin/accounts" :filters="filters">
        <!-- Action Slot -->
        <template #action="{ row}">
          <action-dropdown>
            <b-dropdown-item v-if="hasPermission('view-accounts') || hasRole('Super Admin')" :to="localePath(`/admin/accounts/${row.id}`)">
              <i class="far mr-1 fa-share-square text-success"></i>
              Details
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Status Column -->
        <template #status="{ col }">
          <badge :value="col"></badge>
        </template>
        <!-- Status accountType -->
        <template #accountType="{ col }">
          {{ col.split('_').join(' ') | capitalize}}
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
  name: "manage-accounts",
  layout: "admin",
  meta: {
    permission: "view-any-accounts",
  },
  data() {
    return {
      columns: [
        { field: "clientName", permission: true },
        { field: "accountNo", permission: true },
        { field: "accountType", permission: true },
        { field: "accountHolderName", permission: true },
        { field: "accountEmail", permission: true },
        { field: "accountMobile", permission: true },
        { field: "status", permission: true },
      ],
      filters: {
        search: "",
        perPage: 25,
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
