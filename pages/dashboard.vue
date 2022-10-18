<template>
  <loading-view :loading="$fetchState.pending">
    <div class="alert alert-danger" role="alert" v-if="latestTicket">
      <h4 class="alert-heading">{{latestTicket.subject}}</h4>
      <p>{{latestTicket.message}}</p>
      <div class="d-flex justify-content-end">
        <button @click="ticketRead(latestTicket.id)" class="btn btn-sm btn-primary">Read</button>
      </div>

    </div>
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
          <div class="input-group mb-1">
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
        <!-- Stat box -->
        <div class="col-xl-8">
          <div class="row">
            <!-- Total Categories -->
            <div class="col-xl-4 col-md-4" v-if="hasFieldPermission('dashboard.client.totalProductCategory')">
              <mini-stat-card :title="$t('dashboard.productCategory')" img="/images/dashboard/invoice.png" :amount="data.totalCategory"></mini-stat-card>
            </div>

            <!-- Total Product -->
            <div class="col-xl-4 col-md-4" v-if="hasFieldPermission('dashboard.client.totalProduct')">
              <mini-stat-card :title="$t('dashboard.product')" img="/images/dashboard/product.png" :amount="data.totalProduct"></mini-stat-card>
            </div>

            <!-- Total Invoice -->
            <div class="col-xl-4 col-md-4" v-if="hasFieldPermission('dashboard.client.totalInvoice')">
              <mini-stat-card :title="$t('dashboard.invoice')" img="/images/dashboard/invoice.png" :amount="data.totalInvoice"></mini-stat-card>
            </div>

            <!-- Total Staff -->
            <div class="col-xl-4 col-md-4" v-if="hasFieldPermission('dashboard.client.totalStaff')">
              <mini-stat-card :title="$t('dashboard.staff')" img="/images/dashboard/staff.png" :amount="data.totalStaff"></mini-stat-card>
            </div>

            <!-- Total Customer -->
            <div class="col-xl-4 col-md-4" v-if="hasFieldPermission('dashboard.client.totalCustomer')">
              <mini-stat-card :title="$t('dashboard.customer')" img="/images/dashboard/customer.png" :amount="data.totalCustomer"></mini-stat-card>
            </div>

            <!-- Stock amount -->
            <div class="col-xl-4 col-md-4" v-if="hasFieldPermission('dashboard.client.stockAmount')">
              <mini-stat-card :title="$t('dashboard.stockAmount')" img="/images/dashboard/stock-amount.png" :amount="data.totalStockAmount"></mini-stat-card>
            </div>

            <!-- Monthly report -->
            <div class="col-12" v-if="hasFieldPermission('dashboard.client.monthlyReportGraph')">
              <div class="card">
                <div class="card-body">
                  <h5>Monthly Report</h5>
                  <SalesChart :datas="month_wise_sales_data" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Circle pi -->
        <div class="col-xl-4">
          <!-- Stats -->
          <div class="row">
            <div class="col-xl-12 col-sm-6 order-last order-xl-first" v-if="hasFieldPermission('dashboard.client.receiveableReceivedGraph')">
              <div class="card custom-shadow">
                <div class="card-body">
                  <CirclePieChart v-if="data" :receiveable="data.totalDueAmount" :received="data.totalPaidAmount" />

                  <div class="d-flex align-items-center justify-content-around text-center mt-2 font-weight-bold">
                    <p class="mb-0 color2"><span>Receivable</span> <br> <span class="lead">{{ data.totalDueAmount.toFixed(2) }}</span></p>
                    <p class="mb-0 color1"><span>Received</span> <br> <span class="lead">{{ data.totalPaidAmount.toFixed(2) }}</span></p>
                  </div>

                </div>
              </div>
            </div>
            <div class="col-xl-12 col-sm-6" v-if="hasFieldPermission('dashboard.client.cashBalance')">
              <mini-stat-card :title="$t('dashboard.cashBalance')" img="/images/dashboard/balance_cash.png" :amount="data.balance_cash">
                <template #title>
                  <div class="d-flex justify-content-between w-100">
                    <h5 class="font-size-12 mt-0 text-black-50 align-items-center">
                      {{ $t('dashboard.cashBalance') }}
                    </h5>

                    <b-dropdown right no-caret size="sm" variant="transparent">
                      <template #button-content>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#6E8192" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="none" d="M0 0h24v24H0V0z"></path>
                          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                        </svg>
                      </template>

                      <b-dropdown-item @click="$refs['cash-add-modal'].show()">{{ $t('dashboard.addMoney') }}</b-dropdown-item>
                      <b-dropdown-item @click="$refs['cash-withdraw-modal'].show()">{{ $t('dashboard.withdraw') }}</b-dropdown-item>
                      <b-dropdown-item @click="$refs['cash-transfer-modal'].show()">{{ $t('dashboard.transfer') }}</b-dropdown-item>
                      <b-dropdown-item :to="`history/cash-balance`">{{ $t('dashboard.history') }}</b-dropdown-item>
                    </b-dropdown>

                  </div>
                </template>
              </mini-stat-card>
            </div>
            <div class="col-xl-12 col-sm-6" v-if="hasFieldPermission('dashboard.client.bankBalance')">
              <mini-stat-card :title="$t('dashboard.bankBalance')" img="/images/dashboard/balance_bank.png" :amount="data.balance_bank">
                <template #title>
                  <div class="d-flex justify-content-between w-100">
                    <h5 class="font-size-12 mt-0 text-black-50 align-items-center">
                      {{ $t('dashboard.bankBalance') }}
                    </h5>

                    <b-dropdown right no-caret size="sm" variant="transparent">
                      <template #button-content>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#6E8192" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="none" d="M0 0h24v24H0V0z"></path>
                          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                        </svg>
                      </template>

                      <b-dropdown-item @click="$refs['bank-add-modal'].show()">{{ $t('dashboard.addMoney') }}</b-dropdown-item>
                      <b-dropdown-item @click="$refs['bank-withdraw-modal'].show()">{{ $t('dashboard.withdraw') }}</b-dropdown-item>
                      <b-dropdown-item @click="$refs['bank-transfer-modal'].show()">{{ $t('dashboard.transfer') }}</b-dropdown-item>
                      <b-dropdown-item :to="`history/bank-balance`">{{ $t('dashboard.history') }}</b-dropdown-item>
                    </b-dropdown>

                  </div>
                </template>
              </mini-stat-card>
            </div>

            <div class="col-xl-12 col-sm-6" v-if="hasFieldPermission('dashboard.client.expenseAmount')">
              <mini-stat-card :title="$t('dashboard.expenseAmount')" img="/images/dashboard/expense.png" :amount="data.totalExpenseAmount"></mini-stat-card>
            </div>
            <div class="col-xl-12 col-sm-6" v-if="hasFieldPermission('dashboard.client.revenue')">
              <mini-stat-card :title="$t('dashboard.revenue')" img="/images/dashboard/revenue.png" :amount="revenue"></mini-stat-card>
            </div>
          </div>

        </div>

      </div>
      <!-- End Dashboard Card -->

      <!-- Recent sales report -->
      <div class="row" v-if="hasFieldPermission('dashboard.client.recentSalesReport')">
        <div class="col-8">
          <div class="card card-body">
            <h4 class="mb-4">Recent sales report</h4>

            <b-table striped hover :items="todaysSales" :fields="todaysSalesFields">
              <template #cell(status)="{item}">
                <badge :value="item.status" />
              </template>

              <template #cell(actions)="{item}">
                <b-button :to="`/sale-invoices/${item.id}`" size="sm" variant="primary">Details</b-button>
              </template>
            </b-table>

            <p v-if="!todaysSales.length" class="text-center">No Sales Found!</p>
          </div>
        </div>
      </div>

    </div>
    <!-- container-fluid -->

    <!-- Modals -->
    <!-- ////////////////////// -->

    <!-- Cash Add money -->
    <b-modal ref="cash-add-modal" hide-footer title="Add Cash Balance">
      <form @submit.prevent="addCashBalance">
        <input-control focus v-model.number="cashBalanceForm.amount" :label="$t('fields.amount')" :error="validationErrors.amount"></input-control>

        <button type="submit" class="d-none"></button>
      </form>

      <!-- Modal Footer -->
      <div class="modal-footer mt-2">
        <button @click="$refs['cash-add-modal'].hide()" class="btn btn-danger"> <i class="fas fa-window-close"></i> Close</button>
        <btn-primary @click="addCashBalance" :loading="addCashLoading" class="btn btn-success"><i class="fas fa-check"></i> Submit</btn-primary>
      </div>
    </b-modal>
    <!-- Cash transfer to bank -->
    <b-modal ref="cash-transfer-modal" hide-footer title="Transfer Cash Balance">
      <form @submit.prevent="transferCashBalance">
        <input-control focus v-model.number="cashBalanceTransferForm.amount" :label="$t('fields.amount')" :error="validationErrors.amount"></input-control>

        <button type="submit" class="d-none"></button>
      </form>

      <!-- Modal Footer -->
      <div class="modal-footer mt-2">
        <button @click="$refs['cash-transfer-modal'].hide()" class="btn btn-danger"> <i class="fas fa-window-close"></i> Close</button>
        <btn-primary @click="transferCashBalance" :loading="transferCashLoading" class="btn btn-success"><i class="fas fa-check"></i> Submit</btn-primary>
      </div>
    </b-modal>
    <!-- Cash withdraw  -->
    <b-modal ref="cash-withdraw-modal" hide-footer title="Withdraw Cash Balance">
      <form @submit.prevent="withdrawCashBalance">
        <input-control focus v-model.number="cashBalanceWithdrawForm.amount" :label="$t('fields.amount')" :error="validationErrors.amount"></input-control>

        <button type="submit" class="d-none"></button>
      </form>

      <!-- Modal Footer -->
      <div class="modal-footer mt-2">
        <button @click="$refs['cash-withdraw-modal'].hide()" class="btn btn-danger"> <i class="fas fa-window-close"></i> Close</button>
        <btn-primary @click="withdrawCashBalance" :loading="withdrawCashLoading" class="btn btn-success"><i class="fas fa-check"></i> Submit</btn-primary>
      </div>
    </b-modal>

    <!-- bank Add money -->
    <b-modal ref="bank-add-modal" hide-footer title="Add Bank Balance">
      <form @submit.prevent="addBankBalance">
        <input-control focus v-model.number="bankBalanceForm.amount" :label="$t('fields.amount')" :error="validationErrors.amount"></input-control>

        <button type="submit" class="d-none"></button>
      </form>

      <!-- Modal Footer -->
      <div class="modal-footer mt-2">
        <button @click="$refs['bank-add-modal'].hide()" class="btn btn-danger"> <i class="fas fa-window-close"></i> Close</button>
        <btn-primary @click="addBankBalance" :loading="addBankLoading" class="btn btn-success"><i class="fas fa-check"></i> Submit</btn-primary>
      </div>
    </b-modal>
    <!-- bank transfer to bank -->
    <b-modal ref="bank-transfer-modal" hide-footer title="Transfer Bank Balance">
      <form @submit.prevent="transferBankBalance">
        <input-control focus v-model.number="bankBalanceTransferForm.amount" :label="$t('fields.amount')" :error="validationErrors.amount"></input-control>

        <button type="submit" class="d-none"></button>
      </form>

      <!-- Modal Footer -->
      <div class="modal-footer mt-2">
        <button @click="$refs['bank-transfer-modal'].hide()" class="btn btn-danger"> <i class="fas fa-window-close"></i> Close</button>
        <btn-primary @click="transferBankBalance" :loading="transferBankLoading" class="btn btn-success"><i class="fas fa-check"></i> Submit</btn-primary>
      </div>
    </b-modal>
    <!-- bank withdraw  -->
    <b-modal ref="bank-withdraw-modal" hide-footer title="Withdraw Bank Balance">
      <form @submit.prevent="withdrawBankBalance">
        <input-control focus v-model.number="bankBalanceWithdrawForm.amount" :label="$t('fields.amount')" :error="validationErrors.amount"></input-control>

        <button type="submit" class="d-none"></button>
      </form>

      <!-- Modal Footer -->
      <div class="modal-footer mt-2">
        <button @click="$refs['bank-withdraw-modal'].hide()" class="btn btn-danger"> <i class="fas fa-window-close"></i> Close</button>
        <btn-primary @click="withdrawBankBalance" :loading="withdrawBankLoading" class="btn btn-success"><i class="fas fa-check"></i> Submit</btn-primary>
      </div>
    </b-modal>

  </loading-view>
  <!-- End Page-content -->
</template>

<script>
import MiniStatCard from "@/components/utils/MiniStatCard2.vue";
import MonthlyEarning from "@/components/charts/MonthlyEarning.vue";
import SalesChart from "@/components/charts/SalesChart.vue";
import CirclePieChart from "@/components/charts/CirclePieChart.vue";

import validation from "@/plugins/mixins/validation";

export default {
  name: "Dashboard",
  mixins: [validation],
  components: {
    MiniStatCard,
    MonthlyEarning,
    CirclePieChart,
    SalesChart,
  },
  data() {
    return {
      dashboard: null,
      data: null,
      date_range: "all_time",
      todaysSales: [],
      month_wise_sales_data: [],
      todaysSalesFields: [
        { key: "invoice_no" },
        { key: "customer_name" },
        {
          key: "grand_total",
          label: "Total Amount",
        },
        { key: "paid_amount" },
        { key: "status" },
        { key: "actions", label: "Action", sortable: false },
      ],
      cashBalanceForm: {
        amount: "",
      },
      cashBalanceTransferForm: {
        amount: "",
      },
      cashBalanceWithdrawForm: {
        amount: "",
      },
      addCashLoading: false,
      transferCashLoading: false,
      withdrawCashLoading: false,
      bankBalanceForm: {
        amount: "",
      },
      bankBalanceTransferForm: {
        amount: "",
      },
      bankBalanceWithdrawForm: {
        amount: "",
      },
      addBankLoading: false,
      transferBankLoading: false,
      withdrawBankLoading: false,

      latestTicket: {},
    };
  },
  computed: {
    revenue() {
      if (this.data) {
        let amount =
          parseFloat(this.data.totalProfitAmount) -
          parseFloat(this.data.totalExpenseAmount) -
          parseFloat(this.data.totalChargeRemoveAmount) +
          parseFloat(this.data.totalChargeAmount);
        return amount.toFixed(2);
      }
      return 0;
    },
  },

  methods: {
    async getData() {
      const res = await this.$axios.get(
        `/get-dashboard-data/${this.date_range}`
      );
      this.data = res.data.data;
    },
    ticketRead(id) {
      this.$axios.get(`/latest-ticket/${id}/read`);
      this.$router.push(this.localePath(`/tickets/${id}`));
    },
    async addCashBalance() {
      try {
        const res = await this.$axios.post(
          "add-balance/cash",
          this.cashBalanceForm
        );
        if (res) {
          this.$toast.success("Add Balance Successfully.");
          this.$refs["cash-add-modal"].hide();
          this.cashBalanceForm.amount = "";
          this.getData();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.addCashLoading = false;
      }
    },
    async transferCashBalance() {
      try {
        const res = await this.$axios.post(
          "balance-transfer/cash",
          this.cashBalanceTransferForm
        );
        if (res) {
          this.$toast.success(
            "Balance Transfer From Cash to Bank Successfully."
          );
          this.$refs["cash-transfer-modal"].hide();
          this.cashBalanceTransferForm.amount = "";
          this.getData();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.transferCashLoading = false;
      }
    },
    async withdrawCashBalance() {
      try {
        const res = await this.$axios.post(
          "balance-withdraw/cash",
          this.cashBalanceWithdrawForm
        );
        if (res) {
          this.$toast.success("Balance Withdraw From Cash Successfully.");
          this.$refs["cash-withdraw-modal"].hide();
          this.cashBalanceWithdrawForm.amount = "";
          this.getData();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.withdrawCashLoading = false;
      }
    },
    async addBankBalance() {
      try {
        const res = await this.$axios.post(
          "add-balance/bank",
          this.bankBalanceForm
        );
        if (res) {
          this.$toast.success("Add Balance Successfully.");
          this.$refs["bank-add-modal"].hide();
          this.bankBalanceForm.amount = "";
          this.getData();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.addBankLoading = false;
      }
    },
    async transferBankBalance() {
      try {
        const res = await this.$axios.post(
          "balance-transfer/bank",
          this.bankBalanceTransferForm
        );
        if (res) {
          this.$toast.success(
            "Balance Transfer From Bank to Cash Successfully."
          );
          this.$refs["bank-transfer-modal"].hide();
          this.bankBalanceTransferForm.amount = "";
          this.getData();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.transferBankLoading = false;
      }
    },
    async withdrawBankBalance() {
      try {
        const res = await this.$axios.post(
          "balance-withdraw/bank",
          this.bankBalanceWithdrawForm
        );
        if (res) {
          this.$toast.success("Balance Withdraw From Bank Successfully.");
          this.$refs["bank-withdraw-modal"].hide();
          this.bankBalanceWithdrawForm.amount = "";
          this.getData();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.withdrawBankLoading = false;
      }
    },
  },

  async fetch() {
    this.getData();

    const fetchTodaySales = await this.$axios.get("/get-today-sales");
    this.todaysSales = fetchTodaySales.data.data;

    const getMonthWiseSaleInvoice = await this.$axios.get(
      "/get-month-wise-sales"
    );
    this.month_wise_sales_data = getMonthWiseSaleInvoice.data.data;

    const testMailRes = await this.$axios.get("/send-mail");
    console.log(testMailRes);

    const latestTicket = await this.$axios.get("/get-latest-ticket");
    this.latestTicket = latestTicket.data;
  },
};
</script>

<style lang="scss" scoped>
.color1 {
  color: #008ffb;
}
.color2 {
  color: #00e396;
}
.color3 {
  color: #feb019;
}
.custom-shadow {
  box-shadow: 0px 0px 18px #e7dfdf;
}
