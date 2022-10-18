<template>
	<index-view hasBack>
		<template #title> {{ $t("products.title.mostSelling") }} </template>
		<!-- List Header -->
		<template #header>
			<search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

		</template>

		<!-- Data Table -->
		<template>
			<data-table :columns="columns" url="/products/most-selling-products" :filters="filters" :showIndex="true">

				<!-- Status Column -->
				<template v-slot:status="{ col }">
					<badge :value="col"></badge>
				</template>
				<!-- Filter slot -->
				<template #filter>
					<page-filter v-model="filters.perPage"></page-filter>
				</template>
			</data-table>

		</template>
	</index-view>
</template>

<script>
export default {
	name: "ProductsPage",
	meta: {
		permission: "view-any-products",
	},
	data() {
		return {
			columns: [
				{ field: "name", permission: true },
				{
					field: "categoryName",
					permission: this.hasFieldPermission(
						"products.manage-products.category"
					),
				},
				{
					field: "code",
					permission: this.hasFieldPermission("products.manage-products.code"),
				},
				{
					field: "totalQuantity",
					permission: this.hasFieldPermission(
						"products.manage-products.total-quantity"
					),
					sortable: false,
				},	
				{
					field: "totalSaleItem",
					permission: this.hasFieldPermission(
						"products.manage-products.total-sale-item"
					),
					sortable: false,
				},
				{
					field: "unitName",
					permission: this.hasFieldPermission("products.manage-products.unit"),
				},
				{
					field: "status",
					permission: this.hasFieldPermission(
						"products.manage-products.status"
					),
				},
			],
			filters: {
				search: "",
				perPage: 25,
			},
		};
	},
};
</script>

<style lang="scss" scoped></style>
