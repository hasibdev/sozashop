<template>
   <div>
      <div class="p-3 login-card">
         <nuxt-link :to="localePath('/')" class="text-center py-2 ml-2">
            <img src="@/static/images/logo/SozaShop-1.png" alt="Sozashop" class="mx-auto" width="280px">
         </nuxt-link>
      </div>
      <div class="account-pages">
         <div class="container">

            <div style="height: 80px;"></div>

            <div class="row justify-content-center w-100">
               <div class="col-md-8 col-lg-6 col-xl-5">
                  <div class="card login-card overflow-hidden">
                     <div class="bg-primary">
                        <div class="text-primary text-center p-4">
                           <h5 class="text-white font-size-20">Welcome Back !</h5>
                           <p class="text-white-50 mb-0">Sign in to continue on Sozashop</p>
                        </div>
                     </div>

                     <div class="card-body p-4">
                        <div class="py-2 px-3">
                           <form class="form-horizontal mt-4" autocomplete="off" @submit.prevent="login">
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
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import validation from "@/plugins/mixins/validation"
export default {
   name: "Login",
   layout: "auth",
   mixins: [validation],
   middleware: ["guest"],
   data() {
      return {
         formData: {
            email: "",
            password: "",
         },
         savingState: false,
      }
   },

   methods: {
      async login() {
         this.savingState = true
         try {
            await this.$auth.loginWith("local", { data: this.formData })
            this.$router.push(this.localeRoute("/dashboard"))
         } catch (error) {
            if (error.response && error.response.status === 401) {
               this.$toast.error(error.response.data.message)
            }
         } finally {
            this.savingState = false
         }
      },
   },
};
</script>

<style lang="scss" scoped>
.login-card {
   box-shadow: 0px 0px 20px #ddd !important;
}
</style>
