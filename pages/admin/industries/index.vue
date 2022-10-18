<template>
	<!-- Page-content -->
	<index-view>
		<template #title> {{ $t("industries.label") }} </template>
		<!-- List Header -->
		<template #header>
			<search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
			<btn-link v-if="hasPermission('create-industries') || hasRole('Super Admin')" class="btn-primary" to="/admin/industries/create">
				{{ $t("buttons.add") }} {{ $t("industries.label") }}
			</btn-link>
		</template>

		<!-- Default slot -->
		<template>
			<data-table :columns="columns" url="/admin/industries" :filters="filters">
				<!-- Status Column -->
				<template v-slot:status="{ col }">
					<badge :value="col"></badge>
				</template>

				<!-- Action Slot -->
				<template v-slot:action="{ row, remove, index }">
					<!-- new -->
					<action-dropdown>
						<b-dropdown-item v-if="hasPermission('view-industries') || hasRole('Super Admin')" :to="localePath(`/admin/industries/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
							Details</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('update-industries') || hasRole('Super Admin')" :to="localePath(`/admin/industries/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
							Edit</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('delete-industries') || hasRole('Super Admin')" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
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
	<!-- End Page-content -->
</template>

<script>
export default {
	name: "Industry",
	layout: "admin",
	meta: {
		permission: "view-any-industries",
	},
	data() {
		return {
			columns: ["id", "name","totalClient", "description", "status"],
			filters: {
				search: "",
				perPage: 25,
			},
		};
	},
};
</script>

<style lang="scss" scoped></style>
