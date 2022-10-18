<template>
	<index-view hasBack>
		<template #title> {{ $t("products.title.mostSelling") }} </template>
		<!-- List Header -->
		<template #header>
			<search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

		</template>

		<!-- Data Table -->
		<template>
			<data-table :columns="columns" url="/admin/products/most-selling-products" :filters="filters" :showIndex="true">

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
	layout: "admin",
	data() {
		return {
			columns: [
				{ field: "name", permission: true },
				{
					field: "categoryName",
					permission: true,
				},
				{
					field: "code",
					permission: true,
				},
				{
					field: "totalQuantity",
					permission: true,
					sortable: false,
				},
				{
					field: "unitName",
					permission: true,
				},
				{
					field: "status",
					permission: true,
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
