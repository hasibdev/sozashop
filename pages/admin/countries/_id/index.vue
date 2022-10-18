<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="country">
			<template #header>
				<h3 class="font-weight-normal mb-3">
					{{ $t("categories.title.details") }} : {{ country.name }}
				</h3>
				<div>
					<action-dropdown iconVariant="light" variant="primary">
						<b-dropdown-item v-if="hasPermission('update-countries') || hasRole('Super Admin')" :to="localePath(`/admin/countries/${country.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
							Edit</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('delete-countries') || hasRole('Super Admin')" @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete</b-dropdown-item>
					</action-dropdown>
				</div>
			</template>

			<template>
				<card>
					<input-detail :label="$t('fields.name')" :value="country.name"></input-detail>
					<input-detail :label="$t('fields.code')" :value="country.code"></input-detail>
					<input-detail :label="$t('fields.currency')" :value="country.currency"></input-detail>
					<input-detail :label="$t('fields.currencyCode')" :value="country.currencyCode"></input-detail>
					<input-detail :label="$t('fields.currencySymbol')" :value="country.currencySymbol"></input-detail>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "country-details",
	layout: "admin",
	meta: {
		permission: "view-countries",
	},
	data() {
		return {
			country: null,
		};
	},
	methods: {
		remove() {
			// Global Mixins ( removeResource )
			this.removeResource({
				apiUrl: `/admin/countries/${this.$route.params.id}`,
				redirectUrl: "/admin/countries",
			});
		},
	},
	async fetch() {
		const response = await this.$axios.$get(
			`/admin/countries/${this.$route.params.id}`
		);
		this.country = response.data;
	},
};
</script>

<style lang="scss" scoped></style>
