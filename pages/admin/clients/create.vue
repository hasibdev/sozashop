<template>
  <form-view>
    <template #header> {{ $t("clients.title.add") }} </template>

    <template>
      <!-- First Name -->
      <input-control focus v-model="formData.firstName" :label="$t('fields.firstName')" :error="validationErrors.firstName"></input-control>

      <!-- Last Name -->
      <input-control v-model="formData.lastName" :label="$t('fields.lastName')" :error="validationErrors.lastName"></input-control>

      <!-- Shop Name -->
      <input-control v-model="formData.shopName" :label="$t('fields.shopName')" :error="validationErrors.shopName"></input-control>

      <!-- Email -->
      <email-control v-model="formData.email" :label="$t('fields.email')" :error="validationErrors.email"></email-control>

      <!-- Mobile -->
      <input-control type="tel" v-model="formData.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile"></input-control>

      <!-- Industry -->
      <select-control @input="onIndustryChange" :label="$t('industries.label')" v-model="formData.industryId" :options="industries" title="name" placeholder="Select Industry" :error="validationErrors.industryId"></select-control>

      <!-- Modules -->
      <select-control :disabled="!formData.industryId" :loader="loadingCountries" title="countryName" v-model="formData.moduleId" :label="$t('fields.country')" :options="modules" placeholder="Select Country" :error="validationErrors.moduleId"></select-control>

      <!-- Password -->
      <input-control v-model="formData.password" :label="$t('fields.password')" type="password" :error="validationErrors.password"></input-control>

      <!-- Password Confirm -->
      <input-control v-model="formData.password_confirmation" :label="$t('fields.confirmPassword')" type="password"></input-control>
    </template>
    <template #footer>
      <btn-link class="btn-secondary" to="/admin/clients">{{
        $t("buttons.cancel")
      }}</btn-link>
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
  layout: "admin",
  name: "create-user",
  mixins: [validation],
  meta: {
    permission: "create-clients",
  },
  data() {
    return {
      formData: {
        firstName: "",
        lastName: "",
        shopName: "",
        email: "",
        mobile: "",
        moduleId: null,
        industryId: null,
        password: "",
        password_confirmation: "",
      },
      industries: [],
      modules: [],
      initialData: null,
      loadingCountries: false,

      savingState: false,
    };
  },

  methods: {
    async onIndustryChange(id) {
      this.loadingCountries = true;
      this.formData.moduleId = null;

      try {
        const resModule = await this.$axios.$get(
          `/admin/modules?industryId=${id}`
        );
        this.modules = resModule.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingCountries = false;
      }
    },

    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        const res = await this.$axios.$post("/admin/clients", this.formData);
        this.$toast.success("User created successfully");

        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push("/admin/clients");
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

  async fetch() {
    const res = await this.$axios.$get("/ajax/industries");
    this.industries = res.data;
  },
};
</script>

<style lang="scss" scoped></style>
