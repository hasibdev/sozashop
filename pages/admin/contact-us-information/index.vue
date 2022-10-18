<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("headings.contactSearch") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

    </template>

    <template>
      <data-table :columns="columns" url="/admins/contact-us-information" :filters="filters">
        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>
          <trash-filter v-model="filters.trashed"></trash-filter>
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
        { field: "name", permission: true },
        { field: "email", permission: true },
        { field: "mobile", permission: true },
        { field: "subject", permission: true },
        { field: "description", permission: true },
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
