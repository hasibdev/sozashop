<template>
  <loading-view :loading="$fetchState.pending">
    <form-view>
      <template #header> {{ $t("headings.messageCreate") }} </template>
      <template>
        <!-- Subject -->
        <input-control focus v-model="form.subject" :label="$t('fields.subject')" :error="validationErrors.subject"></input-control>
        <!-- support Category -->
        <select-control :label="$t('fields.department')" v-model="form.supportCategoryId" :options="supportCategories" name="suport-category" :error="validationErrors.supportCategoryId"></select-control>
        <!-- message -->
        <text-control v-model="form.message" :label="$t('fields.message')" :error="validationErrors.message"></text-control>

      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/admin/clients">
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
  name: "message",
  layout: "admin",
  mixins: [validation],
  meta: {
    permission: true,
  },
  data() {
    return {
      form: {
        subject: "",
        message: "",
        supportCategoryId: "",
      },
      supportCategories: [],
      initialData: null,
      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        const res = await this.$axios.$post(
          "/admin/client/" + this.$route.params.id + "/send-message",
          this.form
        );
        this.$toast.success("Message Send Successfully!");

        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/admin/clients"));
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

<style lang="scss" scoped>
</style>
