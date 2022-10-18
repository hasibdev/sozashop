<template>
  <index-view>
    <template #title> {{ $t("withdraw.title.manage") }} </template>

    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link class="btn-primary" to="/withdraws/create" v-if="hasPagePermission('finance.add-withdraw') &&
            (hasPermission('create-withdraws') || hasRole('Admin'))">
        {{ $t("buttons.add") }} {{ $t("withdraw.label") }}
      </btn-link>
    </template>

    <!-- Data Table -->
    <template>
      <data-table :columns="columns" url="/withdraws" :filters="filters">
        <!-- Action Slot -->
        <template v-slot:action="{ row }">
          <action-dropdown>
            <!-- Details  -->
            <b-dropdown-item v-if="hasPagePermission('finance.withdraw-details') &&
            (hasPermission('view-withdraws') || hasRole('Admin'))" :to="localePath(`/withdraws/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
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
  name: "manage-withdraw",
  meta: {
    permission: "view-any-withdraws",
  },
  data() {
    return {
      columns: [
        "amount",
        {
          field: "reason",
          permission: "finance.manage-withdraws.reason",
        },
        "status",
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
