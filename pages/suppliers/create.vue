<template>
  <form-view>
    <!-- Header -->
    <template #header> {{ $t("suppliers.title.add") }} </template>

    <!-- Default Content -->
    <template>
      <!-- Name -->
      <input-control focus v-model="formData.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
      <!-- Mobile -->
      <input-control v-model="formData.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile" type="tel"></input-control>
      <!-- Telephone -->
      <input-control v-model="formData.telephone" :label="$t('fields.telephone')" :error="validationErrors.telephone" v-if="hasFieldPermission('suppliers.add-suppliers.telephone')" type="tel"></input-control>
      <!-- Email -->
      <input-control v-model="formData.email" :label="$t('fields.email')" :error="validationErrors.email" type="email"></input-control>
      <!-- fax -->
      <input-control v-model="formData.fax" :label="$t('fields.fax')" :error="validationErrors.fax" v-if="hasFieldPermission('suppliers.add-suppliers.fax')"></input-control>
      <!-- Vat Number -->
      <input-control v-model="formData.vatNumber" :label="$t('fields.vatNumber')" :error="validationErrors.vatNumber" v-if="hasFieldPermission('suppliers.add-suppliers.vat-number')"></input-control>
      <!-- Opening Balance -->
      <input-control v-model="formData.openingBalance" :label="$t('fields.openingBalance')" :error="validationErrors.openingBalance" type="number"></input-control>
      <!-- Status -->
      <select-control :label="$t('fields.status')" v-model="formData.status" :options="getStatus ? getStatus : {}" name="supplier-status" track="value" v-if="hasFieldPermission('suppliers.add-suppliers.status')"></select-control>
    </template>
    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" to="/suppliers">
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
import { mapGetters } from "vuex";
export default {
  name: "create-suppliers",
  mixins: [validation],
  meta: {
    permission: "create-suppliers",
  },
  data() {
    return {
      formData: {
        name: "",
        mobile: "",
        telephone: "",
        email: "",
        fax: "",
        vatNumber: "",
        openingBalance: "",
        status: "",
      },
      initialData: null,

      savingState: false,
    };
  },
  computed: {
    ...mapGetters({
      getStatus: "config/getStatus",
    }),
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/suppliers", this.formData);
        this.$toast.success("Supplier created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/suppliers"));
        }
      } catch (error) {
        console.error(error);
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
