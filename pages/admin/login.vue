<template>
   <div class="account-pages">
      <div class="container">
         <div style="height: 80px;"></div>
         <div class="row justify-content-center w-100">
            <div class="col-md-8 col-lg-6 col-xl-5">
               <div class="card overflow-hidden">
                  <div class="bg-primary">
                     <div class="text-primary text-center p-4">
                        <h5 class="text-white font-size-20">Welcome Back !</h5>
                        <p class="text-white-50">Sign in to continue as Admin</p>
                        <a href="javasript:void(0)" class="logo logo-admin">
                           <img src="/images/logo-sm.png" height="24" alt="logo" />
                        </a>
                     </div>
                  </div>

                  <div class="card-body p-4">
                     <div class="p-3">
                        <form class="form-horizontal mt-4" autocomplete="off" @submit.prevent="login">

                           <input-control placeholder="Email" stack labelClasss="mb-2" v-model="formData.email" label="Email" :error="validationErrors.email"></input-control>
                           <input-control type="password" placeholder="Password" stack labelClasss="mb-2" v-model="formData.password" label="Password" :error="validationErrors.password"></input-control>

                           <div class="form-group row mt-4">
                              <div class="col">
                                 <btn-primary @click="login" :loading="savingState" class="w-md waves-effect waves-light w-100" type="submit">
                                    Log In
                                 </btn-primary>

                                 <p class="mt-3 mb-0">
                                    <nuxt-link :to="localePath('/admin/forgot-password')">I forgot my password</nuxt-link>
                                 </p>
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
import validation from "@/plugins/mixins/validation"
export default {
   name: "AdminLogin",
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
            await this.$auth.loginWith("local2", { data: this.formData })
            this.$router.push(this.localeRoute("/admin"))
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

<style lang="scss" scoped></style>
