<template>
  <form-view>
    <template #header> {{ $t("charges.title.add") }} </template>
    <template>
      <!-- Name -->
      <input-control focus v-model="formData.name" v-if="hasFieldPermission('settings.add-charges.name')" :label="$t('fields.chargeName')" :error="validationErrors.name"></input-control>
      <!-- Amount -->
      <input-control type="number" v-model="formData.amount" :label="$t('fields.chargeAmount')" :error="validationErrors.amount" v-if="hasFieldPermission('settings.add-charges.amount')"></input-control>
      <!-- Type -->
      <select-control v-model="formData.type" :label="$t('fields.chargeType')" :error="validationErrors.type" :options="getChargeTypes" track="value" v-if="hasFieldPermission('settings.add-charges.charge-type')"></select-control>
      <!-- Charged By -->
      <select-control v-model="formData.chargedBy" :label="$t('fields.chargedBy')" :error="validationErrors.chargedBy" :options="getChargedBy" track="value" v-if="hasFieldPermission('settings.add-charges.charge-by')"></select-control>
      <!-- Profitable -->
      <checkbox-control v-model="formData.profitable" :label="$t('fields.profitable')" name="profitable" v-if="hasFieldPermission('settings.add-charges.profitable')"></checkbox-control>
      <!-- Status -->
      <select-control v-model="formData.status" :label="$t('fields.status')" name="active-status" :error="validationErrors.status" :options="getStatus" track="value" v-if="hasFieldPermission('settings.add-charges.status')"></select-control>
    </template>

    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" to="/charges">
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
  name: "create-charges",
  mixins: [validation],
  data() {
    return {
      formData: {
        name: "",
        amount: "",
        type: "",
        chargedBy: "",
        profitable: false,
        status: "inactive",
      },

      initialData: null,

      savingState: false,
    };
  },
  computed: {
    ...mapGetters({
      getChargeTypes: "config/getChargeTypes",
      getChargedBy: "config/getChargedBy",
      getStatus: "config/getStatus",
    }),
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/charges", this.formData);
        this.$toast.success("Charges created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/charges"));
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
