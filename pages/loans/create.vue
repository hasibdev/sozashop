<template>
  <loading-view :loading="$fetchState.pending">
    <form-view>
      <!-- Header -->
      <template #header> {{ $t("loans.title.add") }} </template>

      <!-- Default Content -->
      <template>
        <!-- Loaner -->
        <select-control v-model="formData.loanerId" :label="$t('fields.loaner')" :options="loaners" :error="validationErrors.loanerId">
        </select-control>
        <!-- Type -->
        <select-control v-model="formData.type" :label="$t('fields.loanType')" :options="loanTypes || []" track="value" :error="validationErrors.type">
        </select-control>
        <!-- Amount -->
        <input-control focus :label="$t('fields.amount')" type="number" v-model="formData.amount" :error="validationErrors.amount"></input-control>

        <!-- Contract Start Date -->
        <date-control v-model="formData.contractStartDate" :error="validationErrors.contractStartDate" :label="$t('fields.contractStartDate')">
        </date-control>
        <!-- Contract End Date -->
        <date-control v-model="formData.contractEndDate" :error="validationErrors.contractEndDate" :label="$t('fields.contractEndDate')">
        </date-control>
      </template>
      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/loans">
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
import { mapGetters } from "vuex";
export default {
  name: "create-loans",
  mixins: [validation],
  meta: {
    permission: "create-loans",
  },
  data() {
    return {
      formData: {
        loanerId: "",
        type: "",
        amount: "",
        contractStartDate: null,
        contractEndDate: null,
      },
      loaners: [],

      initialData: null,
      savingState: false,
    };
  },
  computed: mapGetters({
    loanTypes: "config/getLoanTypes",
  }),

  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/loans", this.formData);
        this.$toast.success("Loan created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/loans"));
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
  async fetch() {
    const resLoaner = await this.$axios.get("/get-loaners");
    this.loaners = resLoaner.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
