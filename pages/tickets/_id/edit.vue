<template>
  <loading-view :loading="$fetchState.pending">
    <form-view v-if="formData">
      <template #header> {{ $t("tickets.title.edit") }} </template>

      <template>
        <!-- Subject -->
        <input-control v-model="formData.subject" :label="$t('fields.subject')" :error="validationErrors.subject"></input-control>
        <!-- message -->
        <text-control v-model="formData.message" :label="$t('fields.message')" :error="validationErrors.message"></text-control>

        <!-- priority Status -->
        <select-control :label="$t('fields.priority')" v-model="formData.priority" :options="priorityOptions || []" name="ticket-priority" track="value"></select-control>
        <!-- change Status -->
        <select-control :label="$t('fields.status')" v-model="formData.status" :options="openStatusOptions || []" name="ticket-status" track="value"></select-control>
      </template>
      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/tickets">{{
          $t("buttons.cancel")
        }}</btn-link>
        <btn-success @click="save($event, true)">
          {{ $t("buttons.updateContinue") }}
        </btn-success>
        <btn-primary @click="save">
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
  name: "edit-category",
  mixins: [validation],
  meta: {
    permission: "update-tickets",
  },
  data() {
    return {
      formData: null,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      try {
        await this.$axios.$put(
          `/tickets/${this.$route.params.id}`,
          this.formData
        );
        this.$toast.success("Tickets Update successfully.");
        if (!createAndContinue) {
          this.$router.push(this.localePath("/tickets"));
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapGetters({
      openStatusOptions: "config/getOpenStatusOptions",
      priorityOptions: "config/getPriorityOptions",
    }),
  },
  async fetch() {
    const resTicket = await this.$axios.$get(
      `/tickets/${this.$route.params.id}`
    );
    this.formData = resTicket.data;
  },
};
</script>

<style lang="scss" scoped></style>
