<template>
  <form-view>
    <template #header> {{ $t("packages.title.add") }} </template>
    <template>

      <!-- clients -->
      <searchable-select :internalSearch="false" @search-change="searchClients" :loading="searchingClients" v-model="form.clientId" searchable :label="$t('fields.client')" :options="clients" :error="validationErrors.clientId" track="id">
        <!-- Single Label -->
        <template #singleLabel="{ option }">
          {{ option.name }}
          <span v-if="option.mobile">({{ option.mobile }})</span>
        </template>
        <!-- Option -->
        <template #option="{ option }">
          {{ option.name }}
          <span v-if="option.mobile">({{ option.mobile }})</span>
        </template>

      </searchable-select>

      <!-- industry -->
      <select-control v-model="form.industryId" track="id" :label="$t('fields.industry')" :options="industries || []" :error="validationErrors.industryId"></select-control>
      <!-- Name -->
      <input-control focus v-model="form.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
      <!-- Price -->
      <input-control v-model="form.price" :label="$t('fields.price')" type="number" :error="validationErrors.price">
        <template #append>
          <div class="input-group-prepend">
            <span class="input-group-text">USD</span>
          </div>
        </template>
      </input-control>
      <!-- Type -->
      <select-control v-model="form.type" track="value" :label="$t('fields.type')" :options="packageOptions || []" :error="validationErrors.type"></select-control>

      <!-- Recomended -->
      <checkbox-control label="Recomended" v-model="form.recommended"></checkbox-control>
      <!-- Description -->
      <input-detail :label="$t('fields.plan')">
        <dynamic-field :fields="fields" v-model="form.description" errorName="description"></dynamic-field>
      </input-detail>
    </template>

    <!-- Action Buttons -->
    <template #footer>
      <div class="mt-4 mb-2">
        <btn-link class="btn-secondary" :to="localePath('/admin/packages')">
          {{ $t("buttons.cancel") }}
        </btn-link>
        <btn-success :loading="savingState" @click="save($event, true)">
          {{ $t("buttons.submitContinue") }}
        </btn-success>
        <btn-primary v-shortkey="['ctrl', 'enter']" @shortkey.native="save()" v-b-tooltip.hover title="Shotcut Press 'Ctrl+Enter'" :loading="savingState" @click="save">
          {{ $t("buttons.submit") }}
        </btn-primary>
      </div>
    </template>
  </form-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
  name: "create-package",
  layout: "admin",
  mixins: [validation],
  meta: {
    permission: "create-packages",
  },
  data() {
    return {
      form: {
        name: "",
        price: "",
        clientId: "",
        industryId: "",
        description: [{ description: "" }],
        type: "",
        recommended: false,
      },
      fields: [
        {
          name: "description", //For v-model
          component: "input-control", // Render component type
          value: "", // Initial value
          listen: true,
          props: {
            type: "text",
          },
        },
      ],
      savingState: false,
      initialData: null,
      clients: [],
      industries: [],
      searchingClients: false,
    };
  },

  computed: {
    ...mapGetters({
      packageOptions: "config/getPackageOptions",
    }),
  },

  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/admin/packages", this.form);
        this.$toast.success("Package created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/admin/packages"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    reset() {
      this.form = { ...this.initialData, description: [{ description: "" }] };
    },
    /**
     * Search clients
     */
    searchClients: _.debounce(async function (val) {
      this.searchingClients = true;
      try {
        const res = await this.$axios.get(
          `/admin/get-package-clients?search=${val}`
        );
        this.clients = res.data.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.searchingClients = false;
      }
    }, 300),

    /**
     * Fetch clients
     */
    async fetchClients() {
      try {
        // Fetch clients
        const resClients = await this.$axios.get("/admin/get-package-clients");
        this.clients = resClients.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  async fetch() {
    const fetchIndustries = await this.$axios.get(
      "/admin/get-package-industries"
    );
    this.industries = fetchIndustries.data.data;
    await this.fetchClients();
  },

  created() {
    this.initialData = {
      ...this.form,
      description: [...this.form.description],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>