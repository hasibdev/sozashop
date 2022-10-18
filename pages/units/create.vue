<template>
  <form-view>
    <template #header> {{ $t("unit.title.add") }} </template>

    <!-- Default Slot -->
    <template>
      <!-- Name -->
      <input-control focus v-model="formData.name" :label="$t('fields.name')" v-if="hasFieldPermission('settings.add-unit.name')" :error="validationErrors.name"></input-control>
      <!-- code -->
      <input-control v-model="formData.code" :label="$t('fields.code')" v-if="hasFieldPermission('settings.add-unit.code')" :error="validationErrors.code"></input-control>
    </template>

    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" to="/units">
        {{ $t("buttons.cancel") }}
      </btn-link>
      <btn-success :loading="savingState" @click="save($event, true)">
        {{ $t("buttons.submitContinue") }}
      </btn-success>
      <btn-primary v-shortkey="['ctrl', 'enter']" @shortkey.native="save()" v-b-tooltip.hover title="Shotcut Press 'Ctrl+Enter'" :loading="savingState" @click="save">
        {{ $t("buttons.submit") }}
      </btn-primary>
    </template>
  </form-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
  name: "create-unit",
  mixins: [validation],
  data() {
    return {
      formData: {
        name: "",
        code: "",
      },
      initialData: null,

      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/units", this.formData);
        this.$toast.success("Unit created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/units"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    reset() {
      this.formData = { ...this.initialData };
    },
  },
  created() {
    this.initialData = { ...this.formData };
  },
};
</script>

<style lang="scss" scoped></style>
