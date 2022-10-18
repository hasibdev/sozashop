<template>
  <index-view>
    <template #title> {{ $t("customers.label") }} </template>

    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
    </template>

    <template>
      <data-table :columns="columns" url="/admin/customers" :filters="filters">
        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Actions -->
        <!-- Action Slot -->
        <!-- <template v-slot:action="{ row }">
					<action-dropdown>
						<b-dropdown-item :to="localePath(`/admin/customers/${row.id}`)">
							<i class="far mr-1 fa-share-square text-success"></i>
							Details
						</b-dropdown-item>

					</action-dropdown>
				</template> -->

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
import validation from "@/plugins/mixins/validation";

export default {
  name: "customer-list",
  mixins: [validation],
  layout: "admin",
  data() {
    return {
      columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        { field: "name", permission: true },
        { field: "mobile", permission: true },
        { field: "email", permission: true },
        {
          field: "saleInvoicesCount",
          permission: true,
          label: "totalInvoice",
        },
        {
          field: "totalAmount",
          permission: true,
        },
        {
          field: "paidAmount",
          permission: true,
          sortable: false,
        },
        {
          field: "totalDue",
          permission: true,
          sortable: false,
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
