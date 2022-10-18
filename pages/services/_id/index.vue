<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="service">
			<template #header>
				<h3 class="font-weight-normal mb-3">
					{{ $t("services.title.details") }} : {{ service.name }}
				</h3>
				<div>
					<action-dropdown iconVariant="light" variant="primary">
						<b-dropdown-item v-if="hasPagePermission('services.edit-service') && (hasPermission('update-services') || hasRole('Admin'))" :to="localePath(`/services/${service.id}/edit`)">
							<i class="far mr-1 fa-edit text-primary"></i>
							Edit
						</b-dropdown-item>
						<b-dropdown-item v-if=" (hasPermission('delete-services') || hasRole('Admin'))" @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete</b-dropdown-item>
					</action-dropdown>
				</div>
			</template>

			<template>
				<card>
					<!-- name -->
					<input-detail :label="$t('fields.name')" :value="service.name"></input-detail>
					<!-- amount -->
					<input-detail :label="$t('fields.amount')" :value="service.amount"></input-detail>
					<!-- description -->
					<input-detail v-if="hasFieldPermission('services.service-details.description')" :label="$t('fields.description')" :value="service.description"></input-detail>
					<!-- status -->
					<input-detail :label="$t('fields.status')">
						<badge :value="service.status"></badge>
					</input-detail>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "service-details",
	meta: {
		permission: "view-services",
	},
	data() {
		return {
			service: null,
		};
	},
	methods: {
		remove() {
			// Global Mixins ( removeResource )
			this.removeResource({
				apiUrl: `/services/${this.$route.params.id}`,
				redirectUrl: "/services",
			});
		},
	},
	async fetch() {
		const resCategory = await this.$axios.$get(
			`/services/${this.$route.params.id}`
		);
		this.service = resCategory.data;
	},
};
</script>

<style lang="scss" scoped></style>
