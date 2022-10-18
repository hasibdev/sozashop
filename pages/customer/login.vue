<template>
  <div class="account-pages">
    <div class="container">
      <div class="row justify-content-center w-100">
        <div class="col-md-8 col-lg-6 col-xl-5">
          <div class="card overflow-hidden">
            <div class="bg-primary">
              <div class="text-primary text-center p-4">
                <h5 class="text-white font-size-20">Welcome Back !</h5>
                <p class="text-white-50">Sign in to continue as Customer</p>
                <a href="javasript:void(0)" class="logo logo-admin">
                  <img src="/images/logo-sm.png" height="24" alt="logo" />
                </a>
              </div>
            </div>

            <div class="card-body p-4">
              <div class="p-3">
                <form
                  class="form-horizontal mt-4"
                  autocomplete="off"
                  @submit.prevent="login"
                >
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input
                      type="text"
                      class="form-control"
                      id="email"
                      placeholder="Enter email"
                      v-model="formData.email"
                    />
                  </div>

                  <div class="form-group">
                    <label for="userpassword">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="userpassword"
                      placeholder="Enter password"
                      v-model="formData.password"
                    />
                  </div>
                  <div class="form-group row mt-4">
                    <div class="col">
                      <button
                        class="
                          btn btn-primary
                          w-md
                          waves-effect waves-light
                          w-100
                        "
                        type="submit"
                      >
                        Log In
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "customer-login",
  layout: "auth",
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
    };
  },

  methods: {
    async login() {
      try {
        await this.$auth.loginWith("local3", { data: this.formData });
        this.$router.push(this.localeRoute("/customer"));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.error(error.response.data.message);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
