<template>
  <index-view>
    <template #title> {{ $t("services.label") }} </template>

    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
    </template>

    <template>
      <data-table :columns="columns" url="/admin/services" :filters="filters">
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
import validation from "@/plugins/mixins/validation";

export default {
  name: "service-list",
  mixins: [validation],
  layout: "admin",
  data() {
    return {
      columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        { field: "name", permission: true },
        { field: "type", permission: true },
        { field: "amount", permission: true },
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
