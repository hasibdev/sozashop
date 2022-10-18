<template>
  <form-view>
    <template #header> {{ $t("tickets.title.add") }} </template>
    <template>
      <!-- Subject -->
      <input-control v-if="hasFieldPermission('support.add-ticket.subject')" focus v-model="form.subject" :label="$t('fields.subject')" :error="validationErrors.subject"></input-control>
      <!-- support Category -->
      <select-control v-if="hasFieldPermission('support.add-ticket.category')" :label="$t('fields.department')" v-model="form.supportCategoryId" :options="supportCategories" name="suport-category" :error="validationErrors.supportCategoryId"></select-control>
      <!-- message -->
      <text-control v-if="hasFieldPermission('support.add-ticket.message')" v-model="form.message" :label="$t('fields.message')" :error="validationErrors.message"></text-control>

      <!-- priority Status -->
      <select-control v-if="hasFieldPermission('support.add-ticket.priority')" :label="$t('fields.priority')" v-model="form.priority" :options="priorityOptions || []" name="ticket-priority" track="value" :error="validationErrors.priority"></select-control>

      <!-- Atachments -->
      <file-input v-if="hasFieldPermission('support.add-ticket.attachments')" :label="$t('fields.attachments')" v-model="attachments" name="attachments" multiple :error="validationErrors.attachments"></file-input>

    </template>

    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" to="/tickets">
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
  name: "create-ticket",
  mixins: [validation],
  meta: {
    permission: "create-tickets",
  },
  data() {
    return {
      form: {
        subject: "",
        message: "",
        priority: "",
        supportCategoryId: "",
      },
      attachments: null,
      supportCategories: [],
      initialData: null,

      savingState: false,
    };
  },
  computed: {
    ...mapGetters({
      openStatusOptions: "config/getOpenStatusOptions",
      priorityOptions: "config/getPriorityOptions",
    }),
  },
  methods: {
    async save(event, createAndContinue = false) {
      const formData = new FormData();

      for (const key of Object.keys(this.form)) {
        formData.append(key, this.form[key]);
      }
      if (this.attachments) {
        for (const i of Object.keys(this.attachments)) {
          formData.append(`attachments[${i}]`, this.attachments[i]);
        }
      }

      this.savingState = true;
      try {
        await this.$axios.$post("/tickets", formData);
        this.$toast.success("Ticket created successfully.");
        this.attachments = null;
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/tickets"));
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
    const resCategories = await this.$axios("/ajax/support-categories");

    this.supportCategories = resCategories.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
