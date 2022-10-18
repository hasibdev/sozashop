<template>
  <div class="container">
    <div class="row">
      <div class="col-md-7 col-lg-6 mx-auto" style="margin-top: 200px;">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Reset Your Account</h5>
          </div>

          <div class="card-body">
            <form autocomplete="off" @submit.prevent="resetPassword">
              <input-control readonly v-model="form.email" :label="$t('fields.email')" stack :error="validationErrors.email"></input-control>
              <input-control autocomplete="off" type="password" v-model="form.password" :label="$t('fields.password')" stack :error="validationErrors.password"></input-control>
              <input-control type="password" v-model="form.password_confirmation" :label="$t('fields.confirmPassword')" stack></input-control>

              <div class="d-flex justify-content-end">
                <btn-link class="btn-secondary mr-2" :to="localePath('/login')">
                  {{ $t("buttons.cancel") }}
                </btn-link>

                <btn-primary :loading="savingState" @click="save">
                  {{ $t("buttons.submit") }}
                </btn-primary>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import validation from "@/plugins/mixins/validation";

export default {
  name: "Login",
  layout: "auth",
  mixins: [validation],
  middleware: ["guest"],
  data() {
    return {
      form: {
        email: "",
        password: "",
        password_confirmation: "",
      },
      savingState: false,
    };
  },
  methods: {
    async save() {
      this.savingState = true;
      try {
        const res = await this.$axios.$post("/admins/reset-password", {
          ...this.form,
          token: this.$route.params.token,
        });
        this.$toast.success("Password reset successfully");
        this.$router.push("/admin/login");
      } catch (error) {
        this.$toast.error("Something went wrong");
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
  },
  mounted() {
    this.form.email = this.$route.query.email;
    console.log(this.$route.query.email);
  },
};
</script>

<style lang="scss" scoped>
</style>