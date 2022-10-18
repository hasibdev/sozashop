<template>
	<!-- Page-content -->
	<index-view>
		<template #title> {{ $t("clients.title.manage") }} </template>
		<template #header>
			<search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
			<btn-link v-if="hasPermission('create-clients') || hasRole('Super Admin')" class="btn-primary" to="/admin/clients/create">{{ $t("buttons.add") }} {{ $t("clients.label") }}</btn-link>
		</template>

		<template>
			<data-table :columns="columns" url="/admin/clients/verified" :filters="filters">
				<!-- Action Slot -->
				<template v-slot:action="{ row, remove, index }">
					<action-dropdown>
						<b-dropdown-item v-if="hasPermission('view-clients') || hasRole('Super Admin')" :to="localePath(`/admin/clients/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
							Details</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('update-clients') || hasRole('Super Admin')" :to="localePath(`/admin/clients/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
							Edit</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('delete-clients') || hasRole('Super Admin')" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete</b-dropdown-item>
					</action-dropdown>
				</template>

				<!-- Status Badge -->
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
import Badge from "~/components/utils/Badge.vue";
export default {
	components: { Badge },
	layout: "admin",
	name: "user-list",
	meta: {
		permission: "view-any-clients",
	},
	data() {
		return {
			columns: [
				{ field: "name", permission: true },
				{ field: "shopName", permission: true },
				{ field: "email", permission: true },
				{ field: "mobile", permission: true },
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
