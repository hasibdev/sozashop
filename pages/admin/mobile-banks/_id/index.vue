<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="bank">
			<template #header>
				<h3 class="font-weight-normal mb-3">
					{{ $t("banks.title.details") }} : {{ bank.name }}
				</h3>
				<div>
					<action-dropdown iconVariant="light" variant="primary">
						<b-dropdown-item v-if="hasPermission('update-mobile-banks') || hasRole('Super Admin')" :to="localePath(`/admin/mobile-banks/${bank.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
							Edit</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('delete-mobile-banks') || hasRole('Super Admin')" @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete</b-dropdown-item>
					</action-dropdown>
				</div>
			</template>

			<template>
				<card>
					<!-- name -->
					<input-detail :label="$t('fields.name')" :value="bank.name"></input-detail>
					<!-- email -->
					<input-detail :label="$t('fields.email')" :value="bank.email"></input-detail>
					<!-- mobile -->
					<input-detail :label="$t('fields.mobile')" :value="bank.mobile || '-'"></input-detail>
					<!-- telephone -->
					<input-detail :label="$t('fields.telephone')" :value="bank.telephone || '-'"></input-detail>
					<!-- address -->
					<input-detail :label="$t('fields.address')" :value="bank.address || '-'"></input-detail>
					<!-- country -->
					<input-detail :label="$t('fields.country')" :value="bank.country.name"></input-detail>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "bank-details",
	layout: "admin",
	meta: {
		permission: "view-mobile-banks",
	},
	data() {
		return {
			bank: null,
		};
	},
	methods: {
		remove() {
			// Global Mixins ( removeResource )
			this.removeResource({
				apiUrl: `/admin/mobile-banks/${this.$route.params.id}`,
				redirectUrl: "/admin/mobile-banks",
			});
		},
	},
	async fetch() {
		const resBank = await this.$axios.$get(
			`/admin/mobile-banks/${this.$route.params.id}`
		);
		this.bank = resBank.data;
	},
};
</script>

<style lang="scss" scoped>
</style>
