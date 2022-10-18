<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="customer">
			<!-- Header Part -->
			<template #header>
				<h3 class="font-weight-normal">
					{{ $t("customers.title.details") }} : {{ customer.name }}
				</h3>
			</template>

			<!-- Details -->
			<template>
				<card>
					<!-- Name -->
					<input-detail :label="$t('fields.name')" :value="customer.name">
					</input-detail>
					<!-- Mobile -->
					<input-detail :label="$t('fields.mobile')" :value="customer.mobile">
					</input-detail>
					<!-- email -->
					<input-detail :label="$t('fields.email')" :value="customer.email">
					</input-detail>
					<!-- Address -->
					<input-detail :label="$t('fields.address')" :value="customer.address">
					</input-detail>

					<!-- Total Amount -->
					<input-detail :label="$t('fields.totalAmount')" :value="customer.totalAmount">
					</input-detail>
					<!-- Total Due -->
					<input-detail :label="$t('fields.totalDue')" :value="customer.totalDue">
					</input-detail>
					<!-- Total paid -->
					<input-detail :label="$t('fields.totalPaid')" :value="customer.totalPaid">
					</input-detail>
					<!-- Total paid -->
					<input-detail :label="$t('fields.openingBalance')" :value="customer.openingBalance">
					</input-detail>

					<!-- Status -->
					<input-detail :label="$t('fields.status')">
						<badge :value="customer.status"></badge>
					</input-detail>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "customer-details",
	layout: "admin",
	data() {
		return {
			customer: null,
		};
	},
	async fetch() {
		//   Fetch Customer
		const res = await this.$axios.$get(
			`/admin/customers/${this.$route.params.id}`
		);
		this.customer = res.data;
	},
};
</script>

<style lang="scss" scoped></style>
