<template>
	<index-view>
		<template #title> {{ $t("mobileBanks.title.manage") }} </template>

		<!-- List Header -->
		<template #header>
			<search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
			<btn-link v-if="hasPermission('create-mobile-banks') || hasRole('Super Admin')" class="btn-primary" to="/admin/mobile-banks/create">
				{{ $t("buttons.add") }} {{ $t("banks.label") }}
			</btn-link>
		</template>

		<!-- Data Table -->
		<template>
			<data-table :columns="columns" url="/admin/mobile-banks" :filters="filters">
				<!-- Action Slot -->
				<template v-slot:action="{ row, remove, index }">
					<action-dropdown>
						<b-dropdown-item v-if="hasPermission('view-mobile-banks') || hasRole('Super Admin')" :to="localePath(`/admin/mobile-banks/${row.id}`)">
							<i class="far mr-1 fa-share-square text-success"></i>
							Details
						</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('update-mobile-banks') || hasRole('Super Admin')" :to="localePath(`/admin/mobile-banks/${row.id}/edit`)">
							<i class="far mr-1 fa-edit text-primary"></i>
							Edit
						</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('delete-mobile-banks') || hasRole('Super Admin')" @click="remove(row.id, index)">
							<i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete
						</b-dropdown-item>
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
	name: "banks",
	layout: "admin",
	meta: {
		permission: "view-any-mobile-banks",
	},
	data() {
		return {
			filters: {
				search: "",
				perPage: 25,
			},
			columns: ["name", "email", "mobile", "countryName"],
		};
	},
};
</script>

<style lang="scss" scoped>
</style>
