<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("categories.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

    </template>

    <template>
      <data-table :columns="columns" url="/admin/categories" :filters="filters">
        <!-- Action Slot -->
        <!-- <template v-slot:action="{ row }">
					<action-dropdown>
						<b-dropdown-item :to="localePath(`/admin/categories/${row.id}`)">
							<i class="far mr-1 fa-share-square text-success"></i>
							Details
						</b-dropdown-item>
					</action-dropdown>
				</template> -->

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>
        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>
          <trash-filter v-model="filters.trashed"></trash-filter>
        </template>
      </data-table>
    </template>
  </index-view>
  <!-- End Page-content -->
</template>

<script>
export default {
  name: "categories",
  layout: "admin",
  data() {
    return {
      columns: [
        { field: "clientName", label: "client", permission: true },
        { field: "shopName", permission: true },
        { field: "name", label: "category", permission: true },
        {
          field: "description",
          permission: true,
        },
        {
          field: "totalProduct",
          label: "productType",
          permission: true,
          sortable: false,
        },
        {
          field: "totalSaleAmount",
          label: "totalSale",
          permission: true,
          sortable: false,
        },
        {
          field: "status",
          permission: true,
        },
      ],
      filters: {
        search: "",
        perPage: 25,
        trashed: "",
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
