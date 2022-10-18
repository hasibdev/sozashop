<template>
   <!-- Begin page -->
   <div id="layout-wrapper">
      <admin-header></admin-header>

      <admin-sidebar></admin-sidebar>
      <!-- ============================================================== -->
      <!-- Start right Content here -->
      <!-- ============================================================== -->
      <div class="main-content">
         <div class="page-content mt-4 px-4 calc-ml">
            <Nuxt />
         </div>
         <!-- End Page-content -->
         <admin-footer></admin-footer>
      </div>
      <!-- end main content-->
   </div>
   <!-- END layout-wrapper -->
</template>

<script>
import AdminHeader from "@/components/admin/layouts/AdminHeader.vue"
import AdminSidebar from "@/components/admin/layouts/AdminSidebar.vue"
import AdminFooter from "@/components/admin/layouts/AdminFooter.vue"
export default {
   name: "admin-layout",
   components: { AdminHeader, AdminSidebar, AdminFooter },
   middleware: ["admin", "permission"],

   beforeCreate() {
      document.body.setAttribute("data-sidebar", "dark")
      // document.body.setAttribute('class', 'sidebar-enable vertical-collpsed');
   },
   async fetch() {
      await this.$store.dispatch("config/setConfig", { url: "/admins/config" })
   },
};
</script>

<style lang="scss">
@import "vue-multiselect/dist/vue-multiselect.min.css";

button:focus {
   outline: none !important;
   box-shadow: none !important;
}
.calc-ml {
   margin-left: 70px;
   @media (min-width: 992px) {
      margin-left: 0;
   }
}

.main-content {
   transition: margin 0.3s ease !important;
}
</style>
