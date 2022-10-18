<template>
  <index-view>
    <template #title> {{ $t("products.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

    </template>

    <!-- Data Table -->
    <template>
      <data-table :columns="columns" url="/admin/products" :filters="filters" :showIndex="true">

        <template #lens>
          <b-dropdown variant="secondary" text="Lens" right>
            <b-dropdown-item>
              <nuxt-link class="text-dark" :to="localePath('/admin/products/most-selling')">Most Selling Products</nuxt-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <nuxt-link class="text-dark" :to="localePath('/admin/products/most-return')">Most Return Products</nuxt-link>
            </b-dropdown-item>
          </b-dropdown>
        </template>

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge v-if="col" :value="col"></badge>
        </template>

        <!-- Purchase Units -->
        <template #purchaseUnits="{col}">
          <span v-if="col">{{ col.map(c => c.name).join(', ') }}</span>
        </template>
        <!-- Sellings Units -->
        <template #sellingUnits="{col}">
          <span v-if="col">{{ col.map(c => c.name).join(', ') }}</span>
        </template>

        <!-- Action Slot -->
        <!-- <template v-slot:action="{ row }">
					<action-dropdown>
						<b-dropdown-item :to="localePath(`/admin/products/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
							Details</b-dropdown-item>
					</action-dropdown>
				</template> -->

        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>
          <trash-filter v-model="filters.trashed"></trash-filter>
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
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        { field: "name", label: "productName", permission: true },
        {
          field: "categoryName",
          permission: true,
        },
        {
          field: "code",
          permission: true,
        },
        {
          field: "storeIn",
          permission: true,
        },
        {
          field: "size",
          permission: true,
        },
        {
          field: "color",
          permission: true,
        },
        {
          field: "brand",
          permission: true,
        },

        {
          field: "purchaseRate",
          permission: true,
        },
        {
          field: "sellingRate",
          permission: true,
        },
        {
          field: "unitName",
          permission: true,
        },
        {
          field: "purchaseUnits",
          permission: true,
        },
        {
          field: "sellingUnits",
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
        trashed: "",
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
