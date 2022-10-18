<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="permissions">
			<template #header>
				<h3 class="font-weight-normal">
					{{ $t("roles.title.details") }} : {{ roles.name }}
				</h3>
				<div>
					<action-dropdown iconVariant="light" variant="primary">
						<!-- Edit -->
						<b-dropdown-item v-if="hasPermission('update-roles') || hasRole('Super Admin')" :to="localePath(`/admin/roles/${$route.params.id}/edit`)">
							<i class="far mr-1 fa-edit text-primary"></i>
							Edit
						</b-dropdown-item>
						<!-- Delete -->
						<b-dropdown-item v-if="hasPermission('delete-roles') || hasRole('Super Admin')" @click="remove()">
							<i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete
						</b-dropdown-item>
					</action-dropdown>
				</div>
			</template>

			<template>
				<card>
					<div class="row">
						<div class="col-12">
							<h4>Permissions</h4>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6" v-for="row in permissions" :key="row.id">
							<h5>
								{{ row.label }}
							</h5>

							<ul class="pl-0 list-unstyled">
								<li v-for="col in row.permissions" :key="col.id" class="font-weight-bold font-size-15">
									<span class="dot mr-1" :class="{ primary: hasPermission(col.id) }"></span>

									{{ col.label }}
								</li>
							</ul>
						</div>
					</div>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "roles-details",
	layout: "admin",
	meta: {
		permission: "view-roles",
	},
	data() {
		return {
			roles: null,
			permissions: null,
		};
	},
	methods: {
		hasPermission(id) {
			return this.roles.permissions.some((p) => p.id == id);
		},
		remove() {
			console.log("remove");
		},
	},
	async fetch() {
		const resRoles = await this.$axios.get(
			`/admin/roles/${this.$route.params.id}`
		);
		const resPermissions = await this.$axios.get("/ajax/permissions");

		this.roles = resRoles.data.data;
		this.permissions = resPermissions.data.data;
	},
};
</script>

<style lang="scss">
.dot {
	width: 8px;
	height: 8px;
	background: var(--danger);
	border-radius: 100%;
	display: inline-block;

	&.primary {
		background: var(--success);
	}
}
</style>
