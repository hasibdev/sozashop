<template>
	<loading-view :loading="isLoading">
		<detail-view v-if="product">
			<!-- Header -->
			<template #header>
				<h3 class="font-weight-normal mb-3">
					{{ $t("products.title.details") }} : {{ product.name }}
				</h3>
			</template>

			<!-- Default slot -->
			<template>
				<card>
					<!-- name -->
					<input-detail :label="$t('fields.name')" :value="product.name" />
					<!-- code -->
					<input-detail :label="$t('fields.code')" :value="product.code" />
					<!-- unit -->
					<input-detail :label="$t('fields.unit')" :value="product.unit.name" />
					<!-- category -->
					<input-detail :label="$t('fields.category')" :value="product.category.name" />
					<!-- brand -->
					<input-detail :label="$t('fields.brand')" :value="product.brand" />
					<!-- Purchase Unit -->
					<input-detail :label="$t('fields.purchaseUnits')" :value="product.purchaseUnits">
						<template #default="{value}">
							{{ value.map(val => val.name).join(", ") }}
						</template>
					</input-detail>
					<!-- Selling Unit -->
					<input-detail :label="$t('fields.sellingUnits')" :value="product.sellingUnits">
						<template #default="{value}">
							{{ value.map(val => val.name).join(", ") }}
						</template>
					</input-detail>

					<input-detail :label="$t('fields.totalQuantity')" :value="product.totalQuantity" />
					<input-detail :label="$t('fields.alertQuantity')" :value="product.alertQuantity" />
					<input-detail :label="$t('fields.status')">
						<badge :value="product.status"></badge>
					</input-detail>
				</card>
			</template>
		</detail-view>

	</loading-view>
</template>

<script>
export default {
	name: "ProductDetails",
	layout: "admin",
	data() {
		return {
			product: null,
			columns: ["name", "unitName", "quantity", "purchaseRate", "sellingRate"],
			filters: {
				search: "",
				perPage: 25,

				product: this.$route.params.id,
			},
		};
	},

	async fetch() {
		const resProduct = await this.$axios.get(
			`/admin/products/${this.$route.params.id}`
		);
		this.product = resProduct.data.data;
		// disable loading
		this.isLoading = false;
	},
};
</script>

<style lang="scss" scoped></style>
