<template>
  <form-view>
    <template #header> {{ $t("serviceCategories.title.add") }} </template>
    <template>
      <!-- Name -->
      <input-control focus v-model="form.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
      <!-- Description -->
      <text-control v-if="hasFieldPermission('services.add-service-category.description')" v-model="form.description" :label="$t('fields.description')" :error="validationErrors.description"></text-control>

    </template>

    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" to="/service-categories">
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
  name: "service-create",
  meta: {
    permission: "create-service-categories",
  },
  mixins: [validation],
  data() {
    return {
      form: {
        name: "",
        description: "",
      },
      initialData: null,

      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/service-categories", this.form);
        this.$toast.success("Category created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/service-categories"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    reset() {
      this.form = { ...this.initialData };
    },
  },
  created() {
    this.initialData = { ...this.form };
  },
};
</script>

<style lang="scss" scoped>
</style>
