<template>
	<!-- Page-content -->
	<index-view>
		<template #title> {{ $t("supportCategories.label") }} </template>
		<!-- List Header -->
		<template #header>
			<search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
			<btn-link v-if="hasPermission('create-support-categories') || hasRole('Super Admin')" class="btn-primary" to="/admin/support-categories/create">
				{{ $t("buttons.add") }} {{ $t("categories.label") }}
			</btn-link>
		</template>

		<template>
			<data-table :columns="columns" url="/admin/support-categories" :filters="filters">
				<!-- Action Slot -->
				<template v-slot:action="{ row, remove, index }">
					<action-dropdown>
						<b-dropdown-item v-if="hasPermission('view-support-categories') || hasRole('Super Admin')" :to="localePath(`/admin/support-categories/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
							Details</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('update-support-categories') || hasRole('Super Admin')" :to="localePath(`/admin/support-categories/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
							Edit</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('delete-support-categories') || hasRole('Super Admin')" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
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
	<!-- End Page-content -->
</template>

<script>
export default {
	name: "categories",
	layout: "admin",
	meta: {
		permission: "view-any-support-categories",
	},
	data() {
		return {
			columns: ["name", "description"],
			filters: {
				search: "",
				perPage: 25,
			},
		};
	},
};
</script>

<style lang="scss" scoped></style>
