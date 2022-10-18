<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("headings.loginHistory") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

    </template>

    <template>
      <data-table :columns="columns" url="/admin/today-login-history" :filters="filters">
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>
        </template>
      </data-table>
    </template>
  </index-view>
  <!-- End Page-content -->
</template>

<script>
export default {
  name: "categories",
  layout: "admin",
  data() {
    return {
      columns: [
        { field: "countryName", permission: true },
        { field: "industryName", permission: true },
        { field: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        { field: "name", permission: true },
        { field: "mobile", permission: true },
        { field: "loginTime", permission: true },
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
