<template>
  <div>
    <h3 class="font-weight-normal">{{ $t("industries.title.add") }}</h3>
    <div class="row mt-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div>
              <!-- Name -->
              <input-control focus v-model="formData.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>

              <!-- Description -->
              <text-control v-model="formData.description" :label="$t('fields.description')" :error="validationErrors.description"></text-control>

              <!-- Status -->
              <select-control :label="$t('fields.status')" :options="statuses" track="value" name="industry-status" :showPlaceholder="false" v-model="formData.status" :error="validationErrors.status">
              </select-control>
            </div>

            <div class="d-flex justify-content-end">
              <btn-link class="btn-secondary px-3 " :to="localePath('/admin/industries')">
                {{ $t("buttons.cancel") }}</btn-link>
              <btn-success :loading="savingState" @click="save($event, true)" class="btn btn-success px-3 ml-3">
                {{ $t("buttons.submitContinue") }}
              </btn-success>

              <btn-primary v-shortkey="['ctrl', 'enter']" @shortkey.native="save()" v-b-tooltip.hover title="Shotcut Press 'Ctrl+Enter'" :loading="savingState" @click="save" class="btn btn-primary px-3 ml-3">
                {{ $t("buttons.submit") }}
              </btn-primary>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
  layout: "admin",
  name: "create-industry",
  meta: {
    permission: "create-industries",
  },
  mixins: [validation],
  data() {
    return {
      errors: [],
      formData: {
        name: "",
        description: null,
        status: "draft",
      },
      initialData: null,
      // statuses: []

      savingState: false,
    };
  },
  computed: {
    ...mapGetters({
      statuses: "config/getIndustryStatusOptions",
    }),
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/admin/industries", this.formData);
        this.$toast.success("Industry created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/admin/industries"));
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
