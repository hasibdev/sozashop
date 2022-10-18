<template>
  <loading-view :loading="$fetchState.pending">
    <form-view>
      <template #header> {{ $t("headings.messageCreate") }} </template>
      <template>
        <!-- Subject -->
        <input-control focus v-model="form.subject" :label="$t('fields.subject')" :error="validationErrors.subject"></input-control>
        <!-- support Category -->
        <select-control :label="$t('fields.department')" v-model="form.supportCategoryId" :options="supportCategories" name="suport-category" :error="validationErrors.supportCategoryId"></select-control>
        <!-- industry -->
        <select-control v-model="form.industryId" :options="industries" :label="$t('fields.industry')" :error="validationErrors.industryId"></select-control>
        <!-- country -->
        <select-control v-model="form.countryId" :options="countries" :label="$t('fields.country')" :error="validationErrors.countryId"></select-control>
        <!-- message -->
        <text-control v-model="form.message" :label="$t('fields.message')" :error="validationErrors.message"></text-control>
        <!-- Auto Select -->
        <checkbox-control v-model="form.auto" :label="$t('fields.auto')" name="auto">
        </checkbox-control>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/admin/tickets">
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
  name: "message-send",
  layout: "admin",
  mixins: [validation],
  meta: {
    permission: "view-any-tickets",
  },
  data() {
    return {
      form: {
        countryId: "",
        subject: "",
        message: "",
        supportCategoryId: "",
        auto: false,
      },
      countries: [],
      industries: [],
      supportCategories: [],
      initialData: null,
      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        const res = await this.$axios.$post("/admin/send-message", this.form);
        if (res.status == "404") {
          this.$toast.error(res.message);
        } else if (res.status == "200") {
          this.$toast.success(res.message);
        }
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/admin/tickets"));
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
    const resIndustires = await this.$axios.get("/ajax/industires");
    this.industries = resIndustires.data;
    const resCategories = await this.$axios("/ajax/support-categories");
    this.supportCategories = resCategories.data.data;
  },
};
</script>

<style lang="scss" scoped>
</style>
