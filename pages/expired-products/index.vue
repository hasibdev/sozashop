<template>
  <index-view>
    <template #title> {{ $t("headings.expiredProducts") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
    </template>

    <!-- Data Table -->
    <template>
      <data-table :columns="columns" url="/batches/expired" :filters="filters" :showIndex="true">
        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Action Slot -->
        <template v-slot:action="{ row }">
          <action-dropdown>
            <!-- Details -->
            <b-dropdown-item :to="`/products/${row.productId}`">
              <i class="far mr-1 fa-share-square text-success"></i>
              Details
            </b-dropdown-item>
          </action-dropdown>
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
        {
          field: "name",
          label: "batch",
          permission: "products.expired-products.batch",
        },
        {
          field: "productName",
          label: "product",
          permission: "products.expired-products.product",
        },
        {
          field: "categoryName",
          label: "category",
          permission: "products.expired-products.category",
        },
        {
          field: "productColor",
          label: "color",
          permission: "products.expired-products.color",
        },
        {
          field: "productCode",
          label: "code",
          permission: "products.expired-products.code",
        },
        {
          field: "expDate",
          label: "expiredDate",
          permission: "products.expired-products.expired-date",
        },
        { field: "quantity", permission: "products.expired-products.quantity" },
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
