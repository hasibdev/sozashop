<template>
  <loading-view :loading="isLoading">
    <detail-view v-if="unit">
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("unit.title.details") }} : {{ unit.name }}
        </h3>

        <action-dropdown iconVariant="light" :split="false" variant="primary">
          <b-dropdown-item v-if="hasPagePermission('settings.edit-unit')" :to="localePath(`/units/${unit.id}/edit`)">
            <i class="far fa-edit text-primary mr-2"></i> Edit
          </b-dropdown-item>
          <b-dropdown-item @click="remove()">
            <i class="far fa-trash-alt text-danger mr-2"></i> Delete
          </b-dropdown-item>
        </action-dropdown>
      </template>
      <!-- Default slot -->
      <template>
        <card>
          <input-detail v-if="hasFieldPermission('settings.unit-details.name')" :label="$t('fields.name')" :value="unit.name"></input-detail>
          <input-detail v-if="hasFieldPermission('settings.unit-details.code')" :label="$t('fields.code')" :value="unit.code"></input-detail>
        </card>
      </template>
    </detail-view>

    <div>
      <h3 class="font-weight-normal">
        {{ $t("unit.label") }} {{ $t("conversions.label") }}
      </h3>

      <div class="d-flex justify-content-between">
        <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
        <btn-link class="btn-primary" :to="`/units/${$route.params.id}/conversions/create`">
          {{ $t("buttons.add") }} {{ $t("conversions.label") }}
        </btn-link>
      </div>

      <data-table :columns="columns" url="/unit-conversions" :filters="filters">
        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <!-- Show  -->
          <btn-icon-link :to="`/units/${$route.params.id}/conversions/${row.id}`">
            <i class="far fa-share-square text-success pr-1"></i>
          </btn-icon-link>

          <!-- Edit -->
          <btn-icon-link :to="`/units/${$route.params.id}/conversions/${row.id}/edit`">
            <i class="far fa-edit text-primary px-3"></i>
          </btn-icon-link>

          <!-- Delete -->
          <btn-icon @click="remove(row.id, index)">
            <i class="far fa-trash-alt text-danger"></i>
          </btn-icon>
        </template>

        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>
    </div>
  </loading-view>
</template>

<script>
export default {
  name: "UnitDetails",
  data() {
    return {
      unit: null,
      columns: [
        { field: "unitName", label: "unit", permission: true },
        "operator",
        "value",
      ],
      filters: {
        search: "",
        perPage: 25,

        baseUnit: this.$route.params.id,
      },
    };
  },
  methods: {
    remove() {
      this.removeResource({
        apiUrl: `/units/${this.$route.params.id}`,
        redirectUrl: "/units",
      });
    },
  },

  async fetch() {
    const unitRes = await this.$axios.get(`/units/${this.$route.params.id}`);

    this.unit = unitRes.data.data;

    // disable loading
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped></style>
