<template>
  <loading-view :loading="$fetchState.pending">
    <form-view v-if="charge">
      <template #header> {{ $t("charges.title.edit") }} </template>

      <template>
        <!-- Name -->
        <input-control v-model="charge.name" :label="$t('fields.name')" :error="validationErrors.name" v-if="hasFieldPermission('settings.edit-charges.name')"></input-control>
        <!-- Amount -->
        <input-control v-model="charge.amount" :label="$t('fields.chargeAmount')" :error="validationErrors.amount" v-if="hasFieldPermission('settings.edit-charges.amount')"></input-control>
        <!-- Type -->
        <select-control v-model="charge.type" :label="$t('fields.chargeType')" :error="validationErrors.type" :options="getChargeTypes" v-if="hasFieldPermission('settings.edit-charges.charge-type')" track="value"></select-control>
        <!-- Charged By -->
        <select-control v-model="charge.chargedBy" :label="$t('fields.chargedBy')" :error="validationErrors.chargedBy" v-if="hasFieldPermission('settings.edit-charges.charge-by')" :options="getChargedBy" track="value"></select-control>
        <!-- Profitable -->
        <checkbox-control v-model="charge.profitable" :label="$t('fields.profitable')" v-if="hasFieldPermission('settings.edit-charges.profitable')" name="profitable"></checkbox-control>
        <!-- Status -->
        <select-control v-model="charge.status" :label="$t('fields.status')" v-if="hasFieldPermission('settings.edit-charges.status')" name="active-status" :error="validationErrors.status" :options="getStatus" track="value"></select-control>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <!-- Cancel -->
        <btn-link class="btn-secondary" to="/charges">{{
          $t("buttons.cancel")
        }}</btn-link>
        <!-- Continue -->
        <btn-success :loading="savingState" @click="save($event, true)">
          {{ $t("buttons.updateContinue") }}
        </btn-success>
        <!-- Save -->
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
  mixins: [validation],
  data() {
    return {
      charge: null,
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
        await this.$axios.$put(
          `/charges/${this.$route.params.id}`,
          this.charge
        );
        this.$toast.success("Charges Update successfully.");
        if (!createAndContinue) {
          this.$router.push(this.localePath("/charges"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
  },
  async fetch() {
    const res = await this.$axios.get(`/charges/${this.$route.params.id}`);
    this.charge = res.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
