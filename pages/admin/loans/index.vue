<template>
  <index-view>
    <template #title> {{ $t("loans.title.manage") }} </template>

    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
    </template>

    <template>
      <data-table :columns="columns" url="/admin/loans" :filters="filters">

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Actions -->
        <!-- Action Slot -->
        <!-- <template v-slot:action="{ row }">
					<action-dropdown>
						<b-dropdown-item :to="localePath(`/admin/loans/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
							Details</b-dropdown-item>

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
  name: "loans",
  mixins: [validation],
  layout: "admin",
  data() {
    return {
      columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        { field: "loanerName", label: "loaner", permission: true },
        { field: "loanerMobile", label: "mobile", permission: true },
        { field: "type", permission: true },
        { field: "amount", permission: true },
        { field: "paidAmount", permission: true },
        { field: "totalDue", permission: true },

        { field: "status", permission: true },
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
