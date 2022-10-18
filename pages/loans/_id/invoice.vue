<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="isPageReady">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("loanInvoice.title.details") }}
        </h3>
        <div>
          <action-dropdown iconVariant="light" :split="false" variant="primary">
            <b-dropdown-item @click="$htmlToPaper('print_area')">
              <i class="fa fa-print text-info"></i> Print
            </b-dropdown-item>
            <b-dropdown-item @click="openPayModal($route.params.id)" v-if="invoice.status !== 'draft' && invoice.totalDue > 0">
              <i class="mr-2 fas fa-money-check text-success"></i>
              Pay Now
            </b-dropdown-item>
          </action-dropdown>
          <!-- <button @click="$htmlToPaper('print_area')" class="btn btn-success waves-effect waves-light">
            <i class="fa fa-print"></i> Print
          </button> -->
        </div>
      </template>
      <template>
        <!-- Print Area Start -->
        <card id="print_area" class="border border-primary mb-0">
          <!-- Top Row -->

          <div class="row">
            <div class="col-12">
              <div class="row">
                <!-- Logo -->
                <div class="col-4">
                  <img v-if="settings.primaryMediaUrl.length" :src="settings.primaryMediaUrl" alt="Logo" width="200" />
                  <img v-else src="/images/default-invoice-logo.png" width="200" alt="Logo">
                </div>
                <!-- Company Info -->
                <div class="col-4">
                  <address>
                    <!-- <strong>{{ $t("fields.companyInfo") }}:</strong><br /> -->
                    <h1>{{ settings.data.name }}</h1>
                    {{ settings.data.address }} <br />
                    {{ settings.data.phone }}<br />
                    {{ settings.data.website }}<br />
                  </address>
                </div>

                <!-- Customer Info -->
                <div class="col-4 text-right">
                  <div class="invoice-title">
                    <h4 class="font-size-16 mb-2">
                      {{ $t("invoice.label") }}<strong class="font-size-15"> #{{ invoice.id }}</strong>
                    </h4>

                    <h4 class="float-right font-size-16 text-uppercase mb-0" :class="invoiceStatus === 'PAID' ? 'text-success' : 'text-danger'">
                      {{ invoiceStatus }}
                    </h4>

                  </div>
                </div>
              </div>

              <div class="row mt-5">
                <!-- Customer Info -->
                <div class="col-4">

                  <address>
                    <p class="mb-1">
                      <strong>DATE OF ISSUE:</strong>
                      {{ formatDate(invoice.createdAt) }}
                    </p>
                    <p class="mb-1">
                      <strong>LOAN TYPE:</strong> {{ invoice.type }}
                    </p>
                    <p class="mb-1">
                      <strong>CONTRACT START:</strong>
                      {{ formatDate(invoice.contractStartDate) }}
                    </p>
                    <p class="mb-1">
                      <strong>DATE OF ISSUE:</strong>
                      {{ formatDate(invoice.contractEndDate) }}
                    </p>
                  </address>

                </div>
                <div class="col-4">

                  <address>
                    <h5>LOAN FROM</h5>
                    <p class="mb-1 lead">{{ invoice.clientName }}</p>
                    <p class="mb-1">{{ settings.data.phone }}</p>
                    <p class="mb-1">{{ settings.data.address }}</p>
                    <p class="mb-1">{{ settings.data.website }}</p>
                  </address>

                </div>
                <div class="col-4 text-right">
                  <!-- Invoice Date -->
                  <address>
                    <h5>LOAN TO</h5>
                    <p class="mb-0 lead">{{ invoice.loaner.name }}</p>
                    <p class="mb-0">{{ invoice.loaner.mobile }}</p>
                    <p class="mb-0">{{ invoice.loaner.email }}</p>
                  </address>

                </div>

              </div>
            </div>
          </div>
          <!-- Bottom Row -->

          <div class="row border-bottom border-bold pb-2 pt-1 mt-5 text-white bg-primary">
            <div class="col-6">Date: {{ formatDate(invoice.createdAt) }}</div>
            <div class="col-6 text-right">Returned Amount</div>
          </div>

          <div class="row mt-3">
            <div class="col-6">
              <p class="lead mb-1">INVOICE TOTAL</p>
              <h3>
                {{ currencySettings.data.currency_code }} {{ invoice.amount }}
              </h3>
            </div>
            <div class="col-6 text-right">
              <div class="table-responsive">
                <table class="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td>GRAND TOTAL</td>
                      <td>
                        {{ currencySettings.data.currency_symbol }}
                        {{ invoice.amount }}
                      </td>
                    </tr>
                    <tr>
                      <td>PAID AMOUNT</td>
                      <td>
                        {{ currencySettings.data.currency_symbol }}
                        {{ invoice.paidAmount }}
                      </td>
                    </tr>
                    <tr>
                      <td>DUE AMOUNT</td>
                      <td>
                        {{ currencySettings.data.currency_symbol }}
                        {{ invoice.totalDue }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Invoice Footer -->
          <div v-if="settings.data.invoiceFooter" class="text-center mt-4">
            <hr class="border-top-dotted">
            <p class="mb-1 mt-4 mb-2  font-size-15">{{ settings.data.invoiceFooter }}</p>
          </div>

        </card>
        <!-- // Print Area End \\ -->

        <!-- //////////////////////////////// -->
        <!-- Payment Modal -->
        <modal-control @hide="closePaymentModal" title="Add Payment" v-model="openPaymentModal">

          <template #body>
            <form @submit.prevent="savePayment">
              <!-- Payment Select -->
              <select-control track="value" :label="$t('fields.paymentMethod')" :options="paymentMethods || []" v-model="paymentForm.method" :error="validationErrors.method">
              </select-control>
              <input-control focus label="Paid Amount" v-model="paymentForm.amount" :error="validationErrors.amount"></input-control>
            </form>
          </template>
          <!-- Action Buttons -->
          <template #footer="{ hide }">
            <button @click="hide()" class="btn btn-secondary">Close</button>
            <btn-primary :loading="savingState" @click="savePayment" class="btn btn-primary">Save</btn-primary>
          </template>
        </modal-control>

      </template>
    </detail-view>
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
  name: "invoice-details",
  mixins: [validation],
  data() {
    return {
      invoice: null,

      openPaymentModal: false,
      paymentForm: {
        method: "cash",
        amount: "",
        paymentableId: null,
      },
      savingState: false,
    };
  },
  computed: {
    ...mapGetters({
      settings: "config/getApplicationSetting",
      currencySettings: "config/getCurrencySettings",
      paymentMethods: "config/getPaymentMethods",
    }),
    isPageReady() {
      return (
        this.invoice &&
        this.settings &&
        this.settings.data &&
        this.currencySettings &&
        this.currencySettings.data
      );
    },
    invoiceStatus() {
      if (this.invoice.totalDue <= 0) {
        return "PAID";
      } else if ((this.invoice.total = this.invoice.totalAmount)) {
        return "UNPAID";
      } else {
        return "DUE";
      }
    },
  },
  methods: {
    async savePayment() {
      this.savingState = true;
      try {
        await this.$axios.post(
          `/loans/${this.paymentForm.paymentableId}/payments`,
          this.paymentForm
        );

        this.$toast.success("Payment Added Succesfully.");
        this.closePaymentModal();
        await this.fetchLoanData();
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    openPayModal(id) {
      this.paymentForm.paymentableId = id;
      this.openPaymentModal = true;
    },
    closePaymentModal() {
      this.openPaymentModal = false;
      this.paymentForm.amount = "";
      this.paymentForm.method = "";
      this.paymentForm.paymentableId = null;
    },
    async fetchLoanData() {
      const resInvoice = await this.$axios.get(
        `/loans/${this.$route.params.id}`
      );
      this.invoice = resInvoice.data.data;
    },
  },
  async fetch() {
    await this.fetchLoanData();
  },
};
</script>

<style lang="scss">
.border-bold {
  border-width: 3px !important;
}
</style>
