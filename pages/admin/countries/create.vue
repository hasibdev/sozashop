<template>
  <form-view>
    <template #header> {{ $t("countries.title.add") }} </template>
    <template>
      <!-- Name -->
      <input-control focus v-model="form.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
      <!-- Code -->
      <input-control v-model="form.code" :label="$t('fields.code')" :error="validationErrors.code"></input-control>
      <!-- Currency -->
      <input-control v-model="form.currency" :label="$t('fields.currency')" :error="validationErrors.currency"></input-control>
      <!-- Currency Code -->
      <input-control v-model="form.currencyCode" :label="$t('fields.currencyCode')" :error="validationErrors.currencyCode"></input-control>
      <!-- Currency symbol -->
      <input-control v-model="form.currencySymbol" :label="$t('fields.currencySymbol')" :error="validationErrors.currencySymbol"></input-control>
    </template>

    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" to="/admin/countries">
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
  name: "create-country",
  mixins: [validation],
  layout: "admin",
  meta: {
    permission: "create-countries",
  },
  data() {
    return {
      form: {
        name: "",
        code: "",
        currency: "",
        currencyCode: "",
        currencySymbol: "",
      },
      initialData: null,

      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/admin/countries", this.form);
        this.$toast.success("Country created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/admin/countries"));
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

<style lang="scss" scoped></style>
