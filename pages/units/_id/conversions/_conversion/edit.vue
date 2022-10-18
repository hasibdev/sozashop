<template>
  <loading-view :loading="isLoading">
    <form-view>
      <template #header> {{ $t("conversions.title.edit") }} </template>

      <!-- Default Slot -->
      <template>
        <!--Root Unit -->
        <select-control
          :label="$t('fields.baseUnitId')"
          v-model="formData.baseUnitId"
          :options="baseUnitIdOptions"
          :disabled="true"
        ></select-control>
        <!-- Base Unit Url -->
        <select-control
          :label="$t('fields.unit')"
          v-model="formData.unitId"
          :options="baseUnitIdOptions"
          name="base-unit-id"
          track="id"
        ></select-control>

        <!-- Operators -->
        <select-control
          :label="$t('fields.operator')"
          v-model="formData.operator"
          :options="operators"
          name="operator"
          track="name"
        ></select-control>
        <!-- Name -->
        <input-control
          v-model="formData.value"
          :label="$t('fields.value')"
          :error="validationErrors.value"
          type="number"
        ></input-control>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" :to="`/units/${$route.params.id}`">
          {{ $t("buttons.cancel") }}
        </btn-link>
        <btn-success @click="save($event, true)">
          {{ $t("buttons.updateContinue") }}
        </btn-success>
        <btn-primary @click="save">
          {{ $t("buttons.update") }}
        </btn-primary>
      </template>
    </form-view>
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
  name: "edit-conversion",
  mixins: [validation],
  data() {
    return {
      formData: {
        baseUnitId: this.$route.params.id,
        unitId: "",
        operator: "",
        value: ""
      },
      operators: [{ name: "*" }, { name: "/" }],
      baseUnitIdOptions: [],
      initialData: null
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      try {
        await this.$axios.$put(
          `/unit-conversions/${this.$route.params.conversion}`,
          this.formData
        );
        this.$toast.success("Conversion Update successfully.");
        if (!createAndContinue) {
          this.$router.push(
            this.localePath(
              `/units/${this.$route.params.id}/conversions/${this.$route.params.conversion}`
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  async fetch() {
    const resConversion = await this.$axios.get(
      `/unit-conversions/${this.$route.params.conversion}`
    );
    this.formData = {
      ...this.formData,
      ...resConversion.data.data
    };

    // Options
    const resBaseUnit = await this.$axios.get("/units");
    this.baseUnitIdOptions = resBaseUnit.data.data;

    // disable Loading
    this.isLoading = false;
  }
};
</script>

<style lang="scss" scoped></style>
