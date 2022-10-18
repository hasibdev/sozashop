<template>
  <div class="container">
    <div class="row">
      <div class="col-md-7 col-lg-6 mx-auto" style="margin-top: 200px;">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Forgot Password</h5>
          </div>
          <div class="card-body">
            <p class="lead">Please enter your email address to reset for your account.</p>
            <form @submit.prevent="save">
              <input-control v-model="form.email" label="Email" stack :error="validationErrors.email"></input-control>

              <div class="d-flex justify-content-end">
                <btn-link class="btn-secondary mr-2" :to="localePath('/login')">
                  {{ $t("buttons.cancel") }}
                </btn-link>

                <btn-primary :loading="savingState" @click="save">
                  {{ $t("buttons.sendResetLink") }}
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
  name: "forgot-password",
  layout: "auth",
  mixins: [validation],
  middleware: ["guest"],

  data() {
    return {
      form: {
        email: "",
      },
      savingState: false,
      message: "",
    };
  },
  methods: {
    async save() {
      this.savingState = true;
      try {
        const res = await this.$axios.post("/forgot-password", this.form);
        this.$toast.success(res.data.message);
        this.$router.push("/forgot-password-success");
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>