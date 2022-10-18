<template>
  <loading-view :loading="$fetchState.pending">
    <form-view>
      <template #header> {{ $t("banks.title.add") }} </template>
      <template>
        <!-- Name -->
        <input-control focus v-model="form.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
        <!-- email -->
        <input-control v-model="form.email" :label="$t('fields.email')" :error="validationErrors.email" type="email"></input-control>

        <!-- mobile -->
        <input-control v-model="form.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile" type="tel"></input-control>
        <!-- telephone -->
        <input-control v-model="form.telephone" :label="$t('fields.telephone')" :error="validationErrors.telephone" type="tel"></input-control>
        <!-- Address -->
        <input-control v-model="form.address" :label="$t('fields.address')" :error="validationErrors.address"></input-control>

        <!-- country -->
        <select-control v-model="form.countryId" :options="countries" :label="$t('fields.country')" :error="validationErrors.countryId"></select-control>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/admin/mobile-banks">
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
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
  name: "create-bank",
  layout: "admin",
  mixins: [validation],
  meta: {
    permission: "create-mobile-banks",
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        mobile: "",
        telephone: "",
        address: "",
        countryId: "",
      },
      countries: [],
      initialData: null,
      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/admin/mobile-banks", this.form);
        this.$toast.success("Bank created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/admin/mobile-banks"));
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
  async fetch() {
    const resCountries = await this.$axios.get("/ajax/countries");
    this.countries = resCountries.data;
  },
};
</script>

<style lang="scss" scoped>
</style>
