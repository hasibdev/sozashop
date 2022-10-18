<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="withdraw">
			<template #header>
				<h3 class="font-weight-normal mb-3">
					Withdraw
				</h3>
			</template>

			<template>
				<card>
					<input-detail :label="$t('fields.amount')" :value="withdraw.amount"></input-detail>
					<input-detail v-if="hasFieldPermission(
						`finance.withdraw-details.reason`
					)" :label="$t('fields.reason')" :value="withdraw.reason"></input-detail>
					<input-detail :label="$t('fields.status')">
						<badge :value="withdraw.status"></badge>
					</input-detail>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "category-details",
	meta: {
		permission: "view-withdraws",
	},
	data() {
		return {
			withdraw: null,
		};
	},
	methods: {},
	async fetch() {
		const res = await this.$axios.$get(`/withdraws/${this.$route.params.id}`);
		this.withdraw = res.data;
	},
};
</script>

<style lang="scss" scoped></style>
