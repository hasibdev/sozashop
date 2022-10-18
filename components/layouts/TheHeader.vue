<template>
   <header id="page-topbar">
      <top-header v-if="$auth.user.emailVerifiedAt === null"></top-header>
      <div class="navbar-header">
         <div class="">
            <img :src="require('/static/images/logo/SozaShop-1.png')" alt="Sozashop" class="pl-3" width="230px">
            <!-- LOGO -->
            <!-- <div class="navbar-brand-box">
               <a role="button" @click.prevent="$router.push(localePath('/dashboard'))" class="logo logo-dark">
                  <span class="logo-sm">
                     <img src="/images/logo.svg" alt height="22" />
                  </span>
                  <span class="logo-lg">
                     <img src="@/static/images/logo/SozaShop-1.png" alt="Sozashop" width="300px">
                  </span>
               </a>

               <a role="button" @click.prevent="$router.push(localePath('/dashboard'))" class="logo logo-light">
                  <span class="logo-sm">
                     <img src="/images/logo-sm.png" alt height="22" />
                  </span>
                  <span class="logo-lg">
                     <img src="@/static/images/logo/SozaShop-1.png" alt="Sozashop" width="300px">
                  </span>
               </a>
            </div> -->
         </div>

         <div class="d-flex">
            <!-- App Search-->
            <form class="app-search d-none d-lg-block">
               <div class="position-relative">
                  <input type="text" class="form-control" :placeholder="$t('placeholder.search')" />
                  <span class="fa fa-search"></span>
               </div>
            </form>
            <div class="dropdown d-inline-block d-lg-none ml-2">
               <button type="button" class="btn header-item noti-icon dropdown-btn" id="page-header-search-dropdown">
                  <i class="mdi mdi-magnify"></i>
               </button>
               <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0" aria-labelledby="page-header-search-dropdown">
                  <form class="p-3">
                     <div class="form-group m-0">
                        <div class="input-group">
                           <input type="text" class="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                           <div class="input-group-append">
                              <button class="btn btn-primary" type="submit">
                                 <i class="mdi mdi-magnify"></i>
                              </button>
                           </div>
                        </div>
                     </div>
                  </form>
               </div>
            </div>

            <!-- End App Search -->

            <!-- Language dropdown -->
            <language-dropdown></language-dropdown>
            <!-- End language dropdown -->

            <!-- Notification -->
            <notification-dropdown></notification-dropdown>
            <!-- End Notification -->

            <!-- User Profile -->
            <b-dropdown variant="link" no-caret :right="true">
               <template #button-content>
                  <img class="rounded-circle header-profile-user" :src="profileImage" alt="Header Avatar" />
               </template>
               <b-dropdown-item v-b-tooltip.hover.left="clientId" :to="localePath('/profile')">
                  <i class="mdi mdi-account-circle font-size-17 align-middle mr-1"></i>
                  Profile
               </b-dropdown-item>
               <b-dropdown-item v-if=" hasPagePermission('wallets.show-wallet')" v-b-tooltip.hover.left="clientBalance" :to="localePath('/wallet')">
                  <i class="mdi mdi-wallet font-size-17 align-middle mr-1"></i> My
                  Wallet
               </b-dropdown-item>
               <b-dropdown-item @click="logout">
                  <i class="mdi mdi-lock-open-outline font-size-17 align-middle mr-1"></i>
                  Logout
               </b-dropdown-item>
            </b-dropdown>
            <!-- End User Profile -->
         </div>
      </div>
   </header>
</template>

<script>
import NotificationDropdown from "@/components/dropdowns/NotificationDropdown"
import LanguageDropdown from "../dropdowns/LanguageDropdown.vue"
import TopHeader from "./TopHeader.vue"
import profileImage from "@/static/images/profile.png"
export default {
   components: { NotificationDropdown, LanguageDropdown, TopHeader },
   computed: {
      profileImage() {
         return this.$auth.user.profilePhotoUrl || profileImage
      },
      clientId() {
         return this.$auth.user?.client?.readableId
      },
      clientBalance() {
         return this.$auth.user?.client?.balance
      },
   },
   methods: {
      showDropdown(event) {
         if (event.target.nextElementSibling.classList.contains("dropdown-menu")) {
            event.target.nextElementSibling.classList.toggle("show")
         }
      },
      async logout() {
         try {
            await this.$auth.logout()
            this.$router.push(this.localePath("/login"))
         } catch (error) {
            console.log(error)
         }
      },
   },
};
</script>

<style lang="scss">
.relative {
   position: relative;
}

.absolute {
   position: absolute;
   top: -2px;
   left: 10px;
}
</style>
