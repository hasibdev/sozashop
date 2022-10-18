<template>
	<b-tab active :title="$t('fields.withdraws')">
		<data-table cardclass="mt-0" :columns="withdrawcolumns" url="/withdraws" :filters="withwrawfilters">
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
				<page-filter v-model="withwrawfilters.perPage"></page-filter>

			</template>
		</data-table>
	</b-tab>
</template>

<script>
export default {
	data() {
		return {
			withdrawcolumns: [
				"amount",
				{
					field: "reason",
					permission: this.hasFieldPermission(
						"finance.manage-withdraws.reason"
					),
				},
				"status",
			],
			withwrawfilters: {
				search: "",
				perPage: 25,
			},
		};
	},
};
</script>

<style lang="scss" scoped>
</style>
