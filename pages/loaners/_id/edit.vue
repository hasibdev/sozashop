<template>
  <loading-view :loading="$fetchState.pending">
    <form-view v-if="loaner">
      <!-- Header -->
      <template #header> {{ $t("loaners.title.edit") }} </template>

      <!-- Default Content -->
      <template>
        <!-- Name -->
        <input-control v-model="loaner.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
        <!-- Mobile -->
        <input-control v-model="loaner.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile"></input-control>
        <!-- Email -->
        <input-control v-model="loaner.email" :label="$t('fields.email')" :error="validationErrors.email"></input-control>
        <!-- Address -->
        <text-control v-model="loaner.address" :label="$t('fields.address')" :error="validationErrors.address" v-if="hasFieldPermission('loan.edit-loaner.address')"></text-control>

        <!-- Status -->
        <select-control :label="$t('fields.status')" v-model="loaner.status" :options="getStatus ? getStatus : {}" name="loner-status" track="value" v-if="hasFieldPermission('loan.edit-loaner.status')"></select-control>
      </template>
      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/loaners">
          {{ $t("buttons.cancel") }}
        </btn-link>
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
  name: "edit-loaner",
  mixins: [validation],
  meta: {
    permission: "update-loaners",
  },
  data() {
    return {
      loaner: null,
      savingState: false,
    };
  },

  methods: {
    async save(event, updateAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$put(
          "/loaners/" + this.$route.params.id,
          this.loaner
        );
        this.$toast.success("Loaner updated successfully");
        if (updateAndContinue == false) {
          this.$router.push("/loaners");
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
  },
  computed: mapGetters({
    getStatus: "config/getStatus",
  }),
  async fetch() {
    //   Fetch customer
    const res = await this.$axios.$get(`/loaners/${this.$route.params.id}`);
    this.loaner = res.data;
  },
};
</script>

<style lang="scss" scoped></style>
