<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="adminData">
			<template #header>
				<h3 class="font-weight-normal mb-3">
					{{ $t("admins.title.details") }} : {{ adminData.name }}
				</h3>
				<div>
					<action-dropdown iconVariant="light" variant="primary">
						<b-dropdown-item v-if="hasPermission('update-admins') || hasRole('Super Admin')" :to="localePath(`/admin/admins/${adminData.id}/edit`)">
							<i class="far mr-1 fa-edit text-primary"></i>
							Edit
						</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('delete-admins') || hasRole('Super Admin')" @click="remove()">
							<i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete
						</b-dropdown-item>
					</action-dropdown>
				</div>
			</template>

			<template>
				<card>
					<input-detail :label="$t('fields.name')" :value="adminData.name"></input-detail>
					<input-detail :label="$t('fields.email')" :value="adminData.email"></input-detail>
					<!-- Roles -->
					<input-detail :label="$t('fields.roles')" :value="adminData.roles.map(role => role.name).join(', ')"></input-detail>

					<input-detail :label="$t('fields.status')">
						<badge :value="adminData.status"></badge>
					</input-detail>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "adminData-details",
	layout: "admin",
	meta: {
		permission: "view-admins",
	},
	data() {
		return {
			adminData: null,
		};
	},
	methods: {
		remove() {
			// Global Mixins ( removeResource )
			this.removeResource({
				apiUrl: `/admin/admins/${this.$route.params.id}`,
				redirectUrl: "/admin/admins",
			});
		},
	},
	async fetch() {
		const resAdmin = await this.$axios.$get(
			`/admin/admins/${this.$route.params.id}`
		);
		this.adminData = resAdmin.data;
	},
};
</script>

<style lang="scss" scoped></style>
