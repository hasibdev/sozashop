<template>
  <div>
    <div class="p-3 login-card">
      <nuxt-link :to="localePath('/')" class="text-center py-2 ml-2">
        <img src="@/static/images/logo/SozaShop-1.png" alt="Sozashop" class="mx-auto" width="280px">
      </nuxt-link>
    </div>
    <div class="account-pages">
      <div class="container">
        <div class="row justify-content-center w-100" style="margin-top: 70px;">
          <div class="col-md-8 col-lg-7 col-xl-6">
            <div class="card overflow-auto">
              <!-- style="height: 800px" -->
              <div class="bg-primary mb-3 text-primary text-center p-4">
                <h5 class="text-white font-size-20">Welcome !</h5>
                <p class="text-white-50">Sign up to continue on Sozashop For Agent</p>
              </div>

              <div class="card-body ">
                <form @submit.prevent="register">
                  <div class="row">
                    <div class="col-lg-12">

                    </div>
                  </div>
                  <div class="row">
                    <!-- Name -->
                    <div class="col-lg-6">
                      <input-control placeholder="Name" stack labelClasss="mb-2" v-model="formData.name" label="Name" :error="validationErrors.name"></input-control>
                    </div>
                    <!-- designation -->
                    <div class="col-lg-6">
                      <input-control placeholder="Designation" stack labelClasss="mb-2" type="tel" v-model="formData.designation" label="Designation" :error="validationErrors.designation"></input-control>
                    </div>
                  </div>
                  <div class="row">
                    <!-- Email -->
                    <div class="col-lg-6">
                      <input-control type="email" placeholder="Email" stack labelClasss="mb-2" v-model="formData.email" label="Email" :error="validationErrors.email"></input-control>
                    </div>
                    <!-- Phone number -->
                    <div class="col-lg-6">
                      <input-control placeholder="Phone Number" stack labelClasss="mb-2" type="tel" v-model="formData.mobile" label="Phone Number" :error="validationErrors.mobile"></input-control>
                    </div>
                  </div>
                  <div class="row">
                    <!-- Password -->
                    <div class="col-lg-6">
                      <input-control type="password" placeholder="Password" stack labelClasss="mb-2" v-model="formData.password" label="Password" :error="validationErrors.password"></input-control>
                    </div>
                    <!-- Confirm Password -->
                    <div class="col-lg-6">
                      <input-control type="password" placeholder="Confirm Password" stack labelClasss="mb-2" v-model="formData.password_confirmation" label="Confirm Password"></input-control>
                    </div>
                  </div>

                  <!-- Random Calculation -->
                  <div class="row align-items-center">
                    <div class="col-6 text-right align-items-center">
                      <p class="d-flex justify-content-between mb-0 fw-500">
                        <span class="text-bold">Make sure you are human?</span>
                        <span>{{ firstNumber }} + {{ lastNumber }}</span>
                      </p>

                    </div>
                    <div class="col-3">
                      <input v-model.number="randomCalcAnswer" @input="clearAnswerError" type="number" placeholder="Answer" class="form-control" :class="{'border-danger': randomCalcError}">
                    </div>
                  </div>
                  <p v-if="randomCalcError" class="text-danger">{{ randomCalcError }}</p>

                  <!-- Sign up Button -->
                  <div class="form-group row mt-3">
                    <div class="col">
                      <btn-primary @click="register" :loading="savingState" class="w-md waves-effect waves-light w-100" type="submit">
                        Register
                      </btn-primary>
                    </div>
                  </div>

                  <div class="text-center">
                    <span class="mt-3 mb-0">Already have an account?
                      <nuxt-link :to="localePath('/agent/login')"> Login </nuxt-link>
                    </span>
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
import validation from "@/plugins/mixins/validation";
import MultiStepForm from "@/components/multi-setp-form/MultiStepForm.vue";
import _ from "lodash";
export default {
  name: "AgentRegister",
  layout: "auth",
  mixins: [validation],
  middleware: ["guest"],
  components: {
    MultiStepForm,
  },
  data() {
    return {
      formData: {
        name: "",
        designation: "",
        email: "",
        password: "",
        password_confirmation: "",
        mobile: "",
      },
      loadingCountries: false,
      savingState: false,
      randomCalcAnswer: "",
      randomCalcError: "",
    };
  },

  computed: {
    firstNumber() {
      return _.random(1, 9);
    },
    lastNumber() {
      return _.random(1, 9);
    },
  },

  methods: {
    async register() {
      this.randomCalcError = "";
      if (this.firstNumber + this.lastNumber != this.randomCalcAnswer) {
        this.randomCalcError = "Wrong Answer!";
        return;
      }
      try {
        this.savingState = true;
        await this.$axios.post("/agents/register", this.formData);
        this.$router.push(this.localeRoute("/agent/login"));
        this.$toast.success("Agent Register successfully");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.error(error.response.data.message);
        }
      } finally {
        this.savingState = false;
      }
    },
    clearAnswerError() {
      this.randomCalcError = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.fw-500 {
  font-weight: 500;
}
</style>
