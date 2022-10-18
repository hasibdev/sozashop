<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="category">
			<template #header>
				<h3 class="font-weight-normal mb-3">
					{{ $t("categories.title.details") }} : {{ category.name }}
				</h3>
				<div>

				</div>
			</template>

			<template>
				<card>
					<input-detail :label="$t('fields.name')" :value="category.name"></input-detail>
					<input-detail :label="$t('fields.description')" :value="category.description"></input-detail>
					<input-detail :label="$t('fields.status')">
						<badge :value="category.status"></badge>
					</input-detail>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "category-details",
	layout: "admin",
	data() {
		return {
			category: null,
		};
	},
	async fetch() {
		const resCategory = await this.$axios.$get(
			`/admin/categories/${this.$route.params.id}`
		);
		this.category = resCategory.data;
	},
};
</script>

<style lang="scss" scoped></style>
