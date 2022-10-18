<template>
  <loading-view :loading="$fetchState.pending">
    <form-view>
      <template #header> {{ $t("packages.title.edit") }} </template>

      <template>

        <!-- clients -->
        <searchable-select :internalSearch="false" @search-change="searchClients" :loading="searchingClients" v-model="formData.clientId" searchable :label="$t('fields.client')" :options="clients" :error="validationErrors.clientId" track="id">
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
        <select-control v-model="formData.industryId" track="id" :label="$t('fields.industry')" :options="industries || []" :error="validationErrors.clientId"></select-control>
        <!-- Name -->
        <input-control v-model="formData.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
        <!-- Price -->
        <input-control v-model="formData.price" :label="$t('fields.price')" type="number" :error="validationErrors.price">
          <template #append>
            <div class="input-group-prepend">
              <span class="input-group-text">USD</span>
            </div>
          </template>
        </input-control>
        <!-- Type -->
        <select-control v-model="formData.type" track="value" :label="$t('fields.type')" :options="packageOptions || []" :error="validationErrors.type"></select-control>
        <!-- Recomended -->
        <checkbox-control label="Recomended" v-model="formData.recommended"></checkbox-control>
        <!-- Description -->
        <input-detail :label="$t('fields.plan')">
          <dynamic-field :fields="fields" v-model="formData.description" errorName="description"></dynamic-field>
        </input-detail>
      </template>
      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" :to="localePath('/admin/packages')">{{
          $t("buttons.cancel")
        }}</btn-link>
        <btn-success :loading="savingState" @click="save($event, true)">
          {{ $t("buttons.updateContinue") }}
        </btn-success>
        <btn-primary :loading="savingState" @click="save">
          {{ $t("buttons.update") }}
        </btn-primary>
      </template>
    </form-view>
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
  name: "edit-package",
  layout: "admin",
  mixins: [validation],
  meta: {
    permission: "update-packages",
  },
  data() {
    return {
      formData: {
        name: "",
        type: "",
        clientId: "",
        industryId: "",
        description: "",
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
      clients: [],
      industries: [],
      searchingClients: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$put(
          `/admin/packages/${this.$route.params.id}`,
          this.formData
        );
        this.$toast.success("Package Update successfully.");
        if (!createAndContinue) {
          this.$router.push(this.localePath("/admin/packages"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
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
  computed: {
    ...mapGetters({
      packageOptions: "config/getPackageOptions",
    }),
  },
  async fetch() {
    const resPackages = await this.$axios.$get(
      `/admin/packages/${this.$route.params.id}`
    );
    this.formData = resPackages.data;

    const fetchIndustries = await this.$axios.get(
      "/admin/get-package-industries"
    );
    this.industries = fetchIndustries.data.data;

    await this.fetchClients();
  },
};
</script>

<style lang="scss" scoped></style>
