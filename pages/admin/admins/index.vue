<template>
	<!-- Page-content -->
	<index-view>
		<template #title> {{ $t("admins.title.manage") }} </template>
		<!-- List Header -->
		<template #header>
			<search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
			<btn-link v-if="hasPermission('create-admins') || hasRole('Super Admin')" class="btn-primary" to="/admin/admins/create">
				{{ $t("buttons.add") }} {{ $t("admins.label") }}
			</btn-link>
		</template>

		<template>
			<data-table :columns="columns" url="/admin/admins" :filters="filters">
				<!-- Action Slot -->
				<template v-slot:action="{ row, remove, index }">
					<action-dropdown>
						<b-dropdown-item v-if="hasPermission('view-admins') || hasRole('Super Admin')" :to="localePath(`/admin/admins/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
							Details</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('update-admins') || hasRole('Super Admin')" :to="localePath(`/admin/admins/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
							Edit</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('delete-admins') || hasRole('Super Admin')" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
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
	name: "admins",
	layout: "admin",
	meta: {
		permission: "view-any-admins",
	},
	data() {
		return {
			columns: ["name", "email", "status"],
			filters: {
				search: "",
				perPage: 25,
			},
		};
	},
};
</script>

<style lang="scss" scoped></style>
