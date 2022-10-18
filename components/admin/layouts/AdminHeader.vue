<template>
   <header id="page-topbar">
      <div class="navbar-header">
         <div class="d-flex">
            <!-- LOGO -->
            <div class="navbar-brand-box">
               <nuxt-link :to="localePath('/admin')" class="logo logo-dark">
                  <span class="logo-sm">
                     <img src="/images/logo.svg" alt height="22" />
                  </span>
                  <span class="logo-lg">
                     <img src="/images/logo-dark.png" alt height="17" />
                  </span>
               </nuxt-link>

               <nuxt-link :to="localePath('/admin')" class="logo logo-light">
                  <span class="logo-sm">
                     <img src="/images/logo-sm.png" alt height="22" />
                  </span>
                  <span class="logo-lg">
                     <img src="/images/logo/SozaShop-1.png" alt height="18" />
                  </span>
               </nuxt-link>
            </div>
         </div>

         <div class="d-flex">
            <!-- App Search-->
            <form class="app-search d-none d-lg-block">
               <div class="position-relative">
                  <input type="search" class="form-control" :placeholder="$t('placeholder.search')" />
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
            <language-dropdown></language-dropdown>

            <!-- NotificationDropdown -->
            <notification-dropdown></notification-dropdown>
            <!-- End NotificationDropdown -->

            <!-- Admin Profile -->
            <profile-dropdown></profile-dropdown>
            <!-- End Admin Profile -->
         </div>
      </div>
   </header>
</template>

<script>
import NotificationDropdown from "@/components/admin/dropdowns/NotificationDropdown"
import ProfileDropdown from "@/components/admin/dropdowns/ProfileDropdown"
import LanguageDropdown from "~/components/dropdowns/LanguageDropdown.vue"
export default {
   components: {
      NotificationDropdown,
      ProfileDropdown,
      LanguageDropdown,
   },
   methods: {
      toggleSidebar() {
         document.body.classList.toggle("sidebar-enable")
         document.body.classList.toggle("vertical-collpsed")
      },
      showDropdown(event) {
         if (event.target.nextElementSibling.classList.contains("dropdown-menu")) {
            event.target.nextElementSibling.classList.toggle("show")
         }
      },
   },
};
</script>

<style lang="scss" scoped>
.relative {
   position: relative;
}

.absolute {
   position: absolute;
   top: -2px;
   left: 10px;
}
</style>
