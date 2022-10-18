<template>
  <form-view>
    <!-- Header -->
    <template #header> {{ $t("loaners.title.add") }} </template>

    <!-- Default Content -->
    <template>
      <!-- Name -->
      <autosuggest :getSuggestionValue="getSuggestionValue" :label="$t('fields.name')" :suggestions="useroptions" @input="onSelectName" @onSearch="searchChange" placeholder="Loaner Name" :loading="loadingLoaner">
        <template slot-scope="{suggestion}">
          {{ suggestion.item.name }} - {{ suggestion.item.source | capitalize}}
        </template>
      </autosuggest>
      <!-- Mobile -->
      <input-control v-model="formData.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile" type="tel" placeholder="Loaner Mobile"></input-control>
      <!-- Email -->
      <input-control v-model="formData.email" :label="$t('fields.email')" :error="validationErrors.email" placeholder="Loaner Email"></input-control>
      <!-- Address -->
      <text-control v-model="formData.address" :label="$t('fields.address')" :error="validationErrors.address" v-if="hasFieldPermission('loan.add-loaner.address')" placeholder="Loaner Address"></text-control>
      <!-- Opening Balance -->
      <input-control clearonfocus v-model="formData.openingBalance" :label="$t('fields.openingBalance')" :error="validationErrors.openingBalance" type="number"></input-control>

      <template v-if="formData.openingBalance > 0">
        <!-- Contract Start Date -->
        <date-control v-model="formData.contractStartDate" :error="validationErrors.contractStartDate" :label="$t('fields.contractStartDate')"> </date-control>
        <!-- Contract End Date -->
        <date-control v-model="formData.contractEndDate" :error="validationErrors.contractEndDate" :label="$t('fields.contractEndDate')"> </date-control>
        <!-- Type -->
        <select-control v-model="formData.type" :label="$t('fields.loanType')" :options="loanTypes || []" track="value" :error="validationErrors.type"> </select-control>
      </template>

      <!-- Status -->
      <select-control :label="$t('fields.status')" v-model="formData.status" :options="getStatus ? getStatus : {}" name="loner-status" track="value" v-if="hasFieldPermission('loan.add-loaner.status')"></select-control>
    </template>
    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" to="/loaners">
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
  name: "create-loaner",
  mixins: [validation],
  meta: {
    permission: "create-loaners",
  },
  data() {
    return {
      formData: {
        name: "",
        mobile: "",
        email: "",
        address: "",
        openingBalance: 0,
        type: null,
        contractStartDate: null,
        contractEndDate: null,
        type: "",
      },
      initialData: null,

      useroptions: [],

      savingState: false,
      loadingLoaner: false,
    };
  },
  computed: mapGetters({
    loanTypes: "config/getLoanTypes",
    getStatus: "config/getStatus",
  }),
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/loaners", this.formData);
        this.$toast.success("Loaner created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/loaners"));
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.savingState = false;
      }
    },

    /**
     * Get suggestion value for dynamic product search
     * This is similer to track value
     */
    getSuggestionValue(suggestion) {
      return suggestion.item.name;
    },

    onSelectName(val) {
      this.formData.name = val.name;
      this.formData.mobile = val.mobile;
      this.formData.email = val.email;
      this.formData.address = val.address || "";
    },

    async searchChange(val) {
      this.formData.name = val;
      if (!val) {
        return;
      }

      this.loadingLoaner = true;
      try {
        const res = await this.$axios.get(`/ajax/search-loaners?name=${val}`);
        this.useroptions = res.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingLoaner = false;
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
