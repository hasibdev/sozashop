<template>
  <index-view>
    <template #title> {{ $t("unit.title.manage") }} </template>

    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="hasPagePermission('settings.add-unit')" class="btn-primary" :to="localePath('/units/create')">
        {{ $t("buttons.add") }} {{ $t("unit.label") }}
      </btn-link>
    </template>
    <!-- Data Table -->
    <template>
      <data-table :columns="columns" url="/units" :filters="filters">
        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <!-- Details  -->
            <b-dropdown-item v-if="hasPagePermission('settings.unit-details')" :to="localePath(`/units/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
            <!-- Edit -->
            <b-dropdown-item v-if="hasPagePermission('settings.edit-unit')" :to="localePath(`/units/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <!-- Delete -->
            <b-dropdown-item @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
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
  name: "Units",
  data() {
    return {
      columns: [
        {
          field: "name",
          permission: "settings.manage-units.name",
        },
        {
          field: "code",
          permission: "settings.manage-units.code",
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
