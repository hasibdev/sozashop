<template>
  <div>
    <div class="container-fluid">
      <!-- start page title -->
      <div class="row align-items-center">
        <div class="col-sm-12">
          <div class="page-title-box">
            <h4 class="font-size-18">{{ $t("welcome") }}</h4>
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item active">Welcome Back, Admin</li>
            </ol>
          </div>
        </div>
      </div>
      <!-- end page title -->

      <!-- Dashboard Card -->
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <mini-stat-card :title="$t('dashboard.shop')" img="/images/dashboard/shop.png" :amount="data.totalShop"></mini-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <mini-stat-card :title="$t('dashboard.product')" img="/images/dashboard/product.png" :amount="data.totalProduct"></mini-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <mini-stat-card :title="$t('dashboard.productCategory')" img="/images/dashboard/invoice.png" :amount="data.totalCategory"></mini-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <mini-stat-card :title="$t('dashboard.staff')" img="/images/dashboard/staff.png" :amount="data.totalStaff"></mini-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <mini-stat-card :title="$t('dashboard.customer')" img="/images/dashboard/customer.png" :amount="data.totalCustomer"></mini-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <mini-stat-card :title="$t('dashboard.supplier')" img="/images/dashboard/customer.png" :amount="data.totalSupplier"></mini-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <mini-stat-card :title="$t('dashboard.today_login_user')" url="/admin/today-login-history" img="/images/dashboard/customer.png" :amount="data.todayLoginUser"></mini-stat-card>
        </div>

      </div>
      <!-- End Dashboard Card -->

      <!-- end row -->
    </div>
    <!-- container-fluid -->
  </div>
  <!-- End Page-content -->
</template>

<script>
import MiniStatCard from "@/components/utils/MiniStatCard2.vue";
export default {
  components: { MiniStatCard },
  name: "admin-dashbord",
  layout: "admin",
  data() {
    return {
      data: {
        totalShop: 0,
        totalStaff: 0,
        totalProduct: 0,
        totalCategory: 0,
        totalSupplier: 0,
        totalCustomer: 0,
        todayLoginUser: 0,
      },
    };
  },
  methods: {
    async getData() {
      const res = await this.$axios.get("/admins/get-dashboard-data");
      this.data = res.data.data;
    },
  },

  async fetch() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped></style>
