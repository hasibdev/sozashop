<template>
  <form-view>
    <template #header> {{ $t("categories.title.add") }} </template>
    <template>
      <!-- Name -->
      <input-control focus v-model="form.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>

      <!-- Status  -->
      <select-control v-model="form.status" :options="getStatus" track="value" :label="$t('fields.status')" :error="validationErrors.status" id="active-status"></select-control>
    </template>

    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" :to="localePath('/categories')">
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
import validation from "@/plugins/mixins/validation"
import { mapGetters } from 'vuex'

export default {
  layout: "admin",
  mixins: [validation],
  data() {
    return {
      form: {
        name: '',
        status: 'active'
      },

      initialData: null,
      savingState: false,
    }
  },
  computed: {
    ...mapGetters({
      getStatus: "config/getStatus",
    }),
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true
      try {
        await this.$axios.$post("/admin/blogCategories", this.form)
        this.$toast.success("Created successfully.")
        if (createAndContinue) {
          this.reset()
        } else {
          this.$router.push(this.localePath("/admin/blog/category"))
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.savingState = false
      }
    },
    reset() {
      this.formData = { ...this.initialData }
    },
  },
  created() {
    this.initialData = { ...this.formData }
  },
}
</script>

<style lang="scss" scoped>
</style>
