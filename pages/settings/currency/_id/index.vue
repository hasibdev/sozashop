<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="currency">
			<template #header>
				<h3 class="font-weight-normal mb-3">
					{{ $t("currency.title.details") }} : {{ currency.name }}
				</h3>
				<div>
					<action-dropdown iconVariant="light" variant="primary">
						<b-dropdown-item :to="localePath(`/settings/currency/${currency.id}/edit`)">
							<i class="far mr-1 fa-edit text-primary"></i>
							Edit
						</b-dropdown-item>
						<b-dropdown-item @click="remove()">
							<i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete
						</b-dropdown-item>
					</action-dropdown>
				</div>
			</template>

			<template>
				<card>
					<input-detail :label="$t('fields.name')" :value="currency.name"></input-detail>
					<input-detail :label="$t('fields.code')" :value="currency.code"></input-detail>
					<input-detail :label="$t('fields.symbol')" :value="currency.symbol"></input-detail>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "currency-details",
	meta: {
		permission: true,
	},
	data() {
		return {
			currency: null,
		};
	},
	methods: {
		remove() {
			// Global Mixins ( removeResource )
			this.removeResource({
				apiUrl: `/currency/${this.$route.params.id}`,
				redirectUrl: "/currency",
			});
		},
	},
	async fetch() {
		const resCategory = await this.$axios.$get(
			`/currency/${this.$route.params.id}`
		);
		this.currency = resCategory.data;
	},
};
</script>

<style lang="scss" scoped></style>
