<template>
  <loading-view :loading="isLoading">
    <detail-view v-if="conversion">
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("conversions.title.details") }}
        </h3>
        <div>
          <btn-icon @click="remove()">
            <i class="far fa-trash-alt text-danger h4"></i>
          </btn-icon>
          <btn-icon-link :to="$route.fullPath + '/edit'" class="px-0">
            <i class="far fa-edit text-primary h4"></i>
          </btn-icon-link>
        </div>
      </template>
      <!-- Details -->
      <template>
        <card>
          <!-- Base Unit name -->
          <input-detail
            :label="$t('fields.baseUnit')"
            :value="conversion.baseUnit.name"
          >
          </input-detail>
          <!-- Unit name -->
          <input-detail
            :label="$t('fields.unit')"
            :value="conversion.unit.name"
          >
          </input-detail>
          <!-- Operator -->
          <input-detail
            :label="$t('fields.operator')"
            :value="conversion.operator"
          >
          </input-detail>
          <!-- Value -->
          <input-detail :label="$t('fields.value')" :value="conversion.value">
          </input-detail>
        </card>
      </template>
    </detail-view>
  </loading-view>
</template>

<script>
export default {
  name: "conversion-details",
  data() {
    return {
      conversion: null
    };
  },
  methods: {
    remove() {
      this.removeResource({
        apiUrl: `/unit-conversions/${this.$route.params.conversion}`,
        redirectUrl: `/settings/units/${this.$route.params.id}`
      });
    }
  },
  async fetch() {
    const resConversion = await this.$axios.get(
      `/unit-conversions/${this.$route.params.conversion}`
    );
    this.conversion = resConversion.data.data;

    // disable Loading
    this.isLoading = false;
  }
};
</script>

<style lang="scss" scoped></style>
