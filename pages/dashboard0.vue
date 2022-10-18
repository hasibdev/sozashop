<template>
   <loading-view :loading="$fetchState.pending">
      <div class="container-fluid" v-if="data">
         <!-- start page title -->
         <div class="row align-items-center">
            <div class="col-sm-6">
               <div class="page-title-box">
                  <h4 class="font-size-18">{{ $t("menu.dashboard") }}</h4>
                  <ol class="breadcrumb mb-0">
                     <li class="breadcrumb-item active">
                        {{ $t("welcome") }}
                     </li>
                  </ol>
               </div>
            </div>
            <div class="offset-4 col-sm-2 d-flex justify-content-end">
               <div class="input-group mb-3">
                  <select @change="getData" v-model="date_range" class="custom-select" id="inputGroupSelect03">
                     <option selected>Select</option>
                     <option value="today">Today</option>
                     <option value="seven_days">7 days</option>
                     <option value="thirty_days">1 month</option>
                     <option value="year">365 days</option>
                     <option value="all_time">All Time</option>
                  </select>
               </div>

            </div>
         </div>
         <!-- end page title -->

         <!-- Dashboard Card -->
         <div class="row">
            <!-- Total Receivable -->
            <div class="col-xl-3 col-md-6">
               <mini-stat-card :title="$t('dashboard.receiveable')" img="/images/services-icon/01.png" :amount="data.totalDueAmount"></mini-stat-card>
            </div>
            <!-- Total Received -->
            <div class="col-xl-3 col-md-6">
               <mini-stat-card :title="$t('dashboard.received')" img="/images/services-icon/02.png" :amount="data.totalPaidAmount"></mini-stat-card>
            </div>
            <!-- Total Discount -->
            <div class="col-xl-3 col-md-6">
               <mini-stat-card :title="$t('dashboard.revenue')" img="/images/services-icon/03.png" :amount="data.totalDiscountAmount"></mini-stat-card>
            </div>

            <!-- Total Expenses -->
            <div class="col-xl-3 col-md-6">
               <mini-stat-card :title="$t('dashboard.stockAmount')" img="/images/services-icon/04.png" :amount="data.totalExpenseAmount"></mini-stat-card>
            </div>

            <!-- Total Invoice -->
            <div class="col-xl-3 col-md-6">
               <mini-stat-card :title="$t('dashboard.invoice')" img="/images/services-icon/01.png" :amount="data.totalInvoice"></mini-stat-card>
            </div>

            <!-- Total Customer -->
            <div class="col-xl-3 col-md-6">
               <mini-stat-card :title="$t('dashboard.staff')" img="/images/services-icon/02.png" :amount="data.totalStaff"></mini-stat-card>
            </div>

            <!-- Total Product -->
            <div class="col-xl-3 col-md-6">
               <mini-stat-card :title="$t('dashboard.product')" img="/images/services-icon/03.png" :amount="data.totalProduct"></mini-stat-card>
            </div>

            <!-- Total Product Category -->
            <div class="col-xl-3 col-md-6">
               <mini-stat-card :title="$t('dashboard.productCategory')" img="/images/services-icon/04.png" :amount="data.totalCategory"></mini-stat-card>
            </div>
         </div>
         <!-- End Dashboard Card -->

         <!-- Chart row -->
         <div class="row">
            <div class="col-md-8">
               <MonthlyEarning :currentMonth="current_month_sales" />
            </div>

            <div class="col-md-2 col-6">
               <div class="text-center mt-3">
                  <p class="text-muted mb-4">This month</p>
                  <h3>$34,252</h3>
                  <p class="text-muted mb-5">It will be as simple as in fact it
                     will be occidental.</p>
               </div>
            </div>
            <div class="col-md-2 col-6">
               <div class="text-center mt-3">
                  <p class="text-muted mb-4">Last month</p>
                  <h3>$36,253</h3>
                  <p class="text-muted mb-5">It will be as simple as in fact it
                     will be occidental.</p>
               </div>
            </div>
         </div>

         <!-- Invoices Chart Row -->
         <div class="row">
            <div class="col-md-4">
               <SaleInvoiceChart />
            </div>
         </div>

         <!-- Report Row -->
         <div class="row">
            <div class="col-xl-3">
               <div class="card">
                  <div class="card-body">
                     <h4 class="card-title mb-4">Sales Report</h4>

                     <div class="cleafix">
                        <p class="float-left">
                           <i class="mdi mdi-calendar mr-1 text-primary"></i> Jan 01 -
                           Jan 31
                        </p>
                        <h5 class="font-18 text-right">$4230</h5>
                     </div>

                     <div id="ct-donut" class="ct-chart wid"></div>

                     <div class="mt-4">
                        <table class="table mb-0">
                           <tbody>
                              <tr>
                                 <td>
                                    <span class="badge badge-primary">Desk</span>
                                 </td>
                                 <td>Desktop</td>
                                 <td class="text-right">54.5%</td>
                              </tr>
                              <tr>
                                 <td>
                                    <span class="badge badge-success">Mob</span>
                                 </td>
                                 <td>Mobile</td>
                                 <td class="text-right">28.0%</td>
                              </tr>
                              <tr>
                                 <td>
                                    <span class="badge badge-warning">Tab</span>
                                 </td>
                                 <td>Tablets</td>
                                 <td class="text-right">17.5%</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
            <div class="col-xl-4">
               <div class="card">
                  <div class="card-body">
                     <h4 class="card-title mb-4">Activity</h4>
                     <ol class="activity-feed">
                        <li class="feed-item">
                           <div class="feed-item-list">
                              <span class="date">Jan 22</span>
                              <span class="activity-text">
                                 Responded to need “Volunteer Activities”
                              </span>
                           </div>
                        </li>
                        <li class="feed-item">
                           <div class="feed-item-list">
                              <span class="date">Jan 20</span>
                              <span class="activity-text">
                                 At vero eos et accusamus et iusto odio dignissimos ducimus
                                 qui deleniti atque...
                                 <a href="#" class="text-success">Read more</a>
                              </span>
                           </div>
                        </li>
                        <li class="feed-item">
                           <div class="feed-item-list">
                              <span class="date">Jan 19</span>
                              <span class="activity-text">
                                 Joined the group “Boardsmanship Forum”
                              </span>
                           </div>
                        </li>
                        <li class="feed-item">
                           <div class="feed-item-list">
                              <span class="date">Jan 17</span>
                              <span class="activity-text">
                                 Responded to need “In-Kind Opportunity”
                              </span>
                           </div>
                        </li>
                        <li class="feed-item">
                           <div class="feed-item-list">
                              <span class="date">Jan 16</span>
                              <span class="activity-text">
                                 Sed ut perspiciatis unde omnis iste natus error sit rem.
                              </span>
                           </div>
                        </li>
                     </ol>
                     <div class="text-center">
                        <a href="#" class="btn btn-primary">Load More</a>
                     </div>
                  </div>
               </div>
            </div>

            <div class="col-xl-5">
               <div class="row">
                  <div class="col-md-6">
                     <div class="card text-center">
                        <div class="card-body">
                           <div class="py-4">
                              <i class="
                        ion ion-ios-checkmark-circle-outline
                        display-4
                        text-success
                      "></i>

                              <h5 class="text-primary mt-4">Order Successful</h5>
                              <p class="text-muted">Thanks you so much for your order.</p>
                              <div class="mt-4">
                                 <a href class="btn btn-primary btn-sm">Chack Status</a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="col-md-6">
                     <div class="card bg-primary">
                        <div class="card-body">
                           <div class="text-center text-white py-4">
                              <h5 class="mt-0 mb-4 text-white-50 font-size-16">
                                 Top Product Sale
                              </h5>
                              <h1>1452</h1>
                              <p class="font-size-14 pt-1">Computer</p>
                              <p class="text-white-50 mb-0">
                                 At solmen va esser necessi far uniform myth...
                                 <a href="#" class="text-white">View more</a>
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-md-12">
                     <div class="card">
                        <div class="card-body">
                           <h4 class="card-title mb-4">Client Reviews</h4>
                           <p class="text-muted mb-3 pb-4">
                              " Everyone realizes why a new common language would be
                              desirable one could refuse to pay expensive translators it
                              would be necessary. "
                           </p>
                           <div class="float-right mt-2">
                              <a href="#" class="text-primary">
                                 <i class="mdi mdi-arrow-right h5"></i>
                              </a>
                           </div>
                           <h6 class="mb-0">
                              <img src="/images/users/user-3.jpg" alt class="avatar-sm rounded-circle mr-2" />
                              James Athey
                           </h6>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <!-- end row -->
      </div>
      <!-- container-fluid -->
   </loading-view>
   <!-- End Page-content -->
</template>

<script>
import MiniStatCard from "@/components/utils/MiniStatCard.vue"
import MonthlyEarning from "@/components/charts/MonthlyEarning.vue"
import SaleInvoiceChart from "@/components/charts/SaleInvoiceChart.vue"
export default {
   name: "Dashboard",
   components: {
      MiniStatCard,
      MonthlyEarning,
      SaleInvoiceChart,
   },
   data() {
      return {
         dashboard: null,
         data: {},
         date_range: "all_time",
         last_month_sales: [],
         current_month_sales: [],
      }
   },
   async fetch() {
      //  const response = await this.$axios.get("/dashboard");
      //  this.dashboard = response.data.data;
   },
   methods: {
      getData() {
         this.$axios.get("/get-dashboard-data/" + this.date_range).then((res) => {
            this.data = res.data.data
         })
      },
      lastMonthSales() {
         this.$axios.get("/get-last-month-sales/").then((res) => {
            this.last_month_sales = res.data.data
         })
      },
      currentMonthSales() {
         this.$axios.get("/get-current-month-sales/").then((res) => {
            this.current_month_sales = res.data.data
         })
      },
   },
   created() {
      this.getData()
      this.lastMonthSales()
      this.currentMonthSales()
   },
};
</script>

<style></style>
