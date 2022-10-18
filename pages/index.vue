<template>
  <section style="min-height: 100vh">
    <div style="height: 80px;"></div>
    <div class="container">
      <div class="row ">
        <div class="col-md-6">
          <div style="margin-top: 80px;">
            <img src="@/static/images/logo/SozaShop-1.png" alt="Sozashop" width="300px">
            <h3 class="mt-4">Sozashop helps you to manage your shop accounting and inventory.</h3>
          </div>

        </div>
        <div class="col-md-6">
          <div class="card login-card rounded">
            <div class="card-body p-4">
              <div class="py-2 px-3">
                <form class="form-horizontal" autocomplete="off" @submit.prevent="login">
                  <!-- Email -->
                  <input-control focus placeholder="Email" stack labelClasss="mb-2" v-model="formData.email" label="Email" :error="validationErrors.email"></input-control>

                  <!-- Password -->
                  <input-control type="password" placeholder="Enter password" stack labelClasss="mb-2" v-model="formData.password" label="Enter password" :error="validationErrors.password"></input-control>

                  <div class="form-group row mt-4">
                    <div class="col">
                      <btn-primary @click="login" :loading="savingState" class="w-md waves-effect waves-light w-100" type="submit">
                        Log In
                      </btn-primary>
                    </div>
                  </div>

                  <div class="">
                    <p class="mb-0 text-right">
                      <nuxt-link :to="localePath('/forgot-password')">I forgot my password</nuxt-link>
                    </p>
                    <p class="text-center mb-1 font-weight-bold">or</p>
                    <p class="mt-3 mb-2 text-center">
                      <nuxt-link class="btn btn-info font-weight-bold" :to="localePath('/register')" style="letter-spacing: 0.5px;">
                        Register now
                      </nuxt-link>
                    </p>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 mt-3" style="margin-bottom: 200px;">
          <hr class="bg-primary">
          <h1 class="text-center mt-4">Smart Technology For Smart Shop !</h1>

          <p class="text-center mt-2">Sozashop will make your business accounting and inventory management easy and smooth. <br> Unlimited invoice, product, receipts, and many more.</p>

          <div class="d-flex justify-content-center">
            <router-link to="/register" class="btn btn-primary font-weight-bold">Register Today!</router-link>
          </div>

          <div class="mt-5">
            <video width="100%" height="550" controls>
              <source src="@/static/video/intro-video.mp4" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Header from "@/components/website/Header.vue";
import validation from "@/plugins/mixins/validation";

export default {
  name: "home",
  layout: "website",
  mixins: [validation],
  components: {
    Header,
  },
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      savingState: false,
    };
  },
  methods: {
    async login() {
      this.savingState = true;
      try {
        await this.$auth.loginWith("local", { data: this.formData });
        this.$router.push(this.localeRoute("/dashboard"));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.error(error.response.data.message);
        }
      } finally {
        this.savingState = false;
      }
    },
  },
};
</script>

<style lang="scss">
.login-card {
  box-shadow: 0px 0px 20px #ddd !important;
}
</style>
