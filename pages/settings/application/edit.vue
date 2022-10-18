<template>
  <loading-view :loading="isLoading">
    <form-view v-if="settings">
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal">{{ $t("settings.title.edit") }}</h3>
      </template>

      <!-- Content -->
      <template>
        <input-control v-model="settings.data.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
        <input-control v-model="settings.data.currency" :label="$t('fields.currency')" :error="validationErrors.currency"></input-control>
        <input-control v-model="settings.data.address" :label="$t('fields.address')" :error="validationErrors.address"></input-control>
        <input-control v-model="settings.data.website" :label="$t('fields.website')" :error="validationErrors.website"></input-control>

        <!-- Default Customer Select -->
        <searchable-select v-model="settings.data.defaultCustomer" :options="customerOptions" label="Default Customer" track="id">
        </searchable-select>

        <input-control v-model="settings.data.invoiceFooter" :label="$t('fields.invoiceFooter')" :error="validationErrors.invoiceFooter"></input-control>
      </template>

      <!-- Footer -->
      <template #footer>
        <btn-link class="btn-secondary" to="/settings/application">{{
          $t("buttons.cancel")
        }}</btn-link>

        <btn-primary v-shortkey="['ctrl', 'enter']" @shortkey.native="save()" v-b-tooltip.hover title="Shotcut Press 'Ctrl+Enter'" :loading="savingState" @click="save"> {{ $t("buttons.update") }} </btn-primary>

      </template>
    </form-view>
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";

export default {
  name: "EditSettings",
  mixins: [validation],
  data() {
    return {
      settings: null,
      customerOptions: [],

      savingState: false,
    };
  },
  methods: {
    async save() {
      this.savingState = true;
      try {
        const response = await this.$axios.$post(
          "/client-settings",
          this.settings
        );

        // Set Default Customer
        this.$store.commit(
          "config/SET_DEFAULT_CUSTOMER",
          response.data.defaultCustomer
        );

        this.$toast.success("Settings updated successfully");
        this.$router.push("/settings/application");
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
  },
  async fetch() {
    const resSettings = await this.$axios.$get(
      `/client-settings?type=application`
    );
    const resCustomers = await this.$axios.$get(`/customers`);

    this.customerOptions = resCustomers.data;
    this.settings = resSettings;
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped></style>
