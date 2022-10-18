<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="isPageReady">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("salesInvoice.title.details") }}
        </h3>
        <div>

          <!-- Print -->
          <b-dropdown variant="info" right text="Print">
            <!-- Print -->
            <b-dropdown-item @click="print"> General Print</b-dropdown-item>
            <!-- Pos -->
            <b-dropdown-item>
              <nuxt-link class="text-dark" :to="`/purchase-return-invoices/${$route.params.id}/print`">
                POS Print
              </nuxt-link>
            </b-dropdown-item>
            <!-- pdf -->
            <b-dropdown-item @click.prevent="generateReport">Download PDF</b-dropdown-item>
          </b-dropdown>

        </div>
      </template>
      <template>
        <client-only>
          <vue-html2pdf :show-layout="true" :float-layout="false" :enable-download="false" :preview-modal="true" :paginate-elements-by-height="0" filename="hee hee" :pdf-quality="2" :manual-pagination="true" pdf-format="a4" pdf-orientation="portrait" pdf-content-width="100%" ref="html2Pdf">
            <card slot="pdf-content" class="border border-primary mb-0" id="print_area">
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
                          {{ $t("invoice.label") }}<strong class="font-size-15"> #{{ invoice.invoiceNo }}</strong>
                        </h4>

                        <h4 class="float-right font-size-16 text-uppercase mb-0" :class="invoiceStatus === 'PAID' ? 'text-success' : 'text-danger'">
                          {{ invoiceStatus }}
                        </h4>

                      </div>
                    </div>
                  </div>

                  <div class="row mt-5">
                    <!-- Customer Info -->
                    <div class="col-6">
                      <address>
                        <strong>{{ $t("fields.supplierInfo") }}:</strong><br />
                        <p class="mb-0 mt-1">{{ invoice.supplier.name }}</p>
                        <p class="mb-0 mt-1">{{ invoice.supplier.mobile }}</p>
                        <p class="mb-0 mt-1" v-if="invoice.supplier.address">{{ invoice.supplier.address }}</p>
                        <p class="mb-0 mt-1" v-if="invoice.supplier.email">{{ invoice.supplier.email }}</p>
                      </address>
                    </div>
                    <div class="col-6 text-right">
                      <!-- Invoice Date -->
                      <address>
                        <strong>{{ $t("fields.invoiceDate") }}:</strong><br />
                        {{ invoice.invoiceDateFormatted }}<br />
                      </address>
                     
                    </div>

                  </div>
                </div>
              </div>

              <!-- Bottom Row -->
              <!-- Sale Invoice -->
              <div class="row">
                <div class="col-12">

                  <div class="p-2">
                    <h3 class="font-size-16 text-center">
                      {{ $t("headings.saleInvoiceSummary") }}
                    </h3>
                  </div>

                  <!-- Sale Invoice Table -->
                  <div class="table-responsive">
                    <table class="table">
                      <thead class="text-white bg-primary">
                        <th>{{ $t("fields.description") }}</th>
                        <!-- <th>{{ $t("fields.batch") }}</th> -->
                        <th>{{ $t("fields.rate") }}</th>
                        <th>{{ $t("fields.quantity") }}</th>
                        <th>{{ $t("fields.unit") }}</th>
                        <th>{{ $t("fields.discount") }}</th>
                        <th>{{ $t("fields.amount") }}</th>
                      </thead>
                      <tbody>
                        <!-- Sale Items -->
                        <tr v-for="item in invoice.returnItems" :key="item.id">
                          <td>{{ item.product.name }} {{ `(${item.batch.name})` }}</td>
                          <!-- <td>{{ item.batch.name }}</td> -->
                          <td>
                            {{ currencySettings.data.currency_symbol }}{{ item.rate }}
                          </td>
                          <td>{{ item.quantity }}</td>
                          <td>{{ item.unit.name }}</td>
                          <td>
                            {{ currencySettings.data.currency_symbol }}{{ item.discount }}
                          </td>
                          <td>
                            {{ currencySettings.data.currency_symbol }}{{ item.amount }}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <!-- Charges -->
                        <tr v-for="charge in invoice.charges" :key="charge.id">
                          <td colspan="4" class="text-right font-weight-bold">
                            {{ charge.charge.name }}
                          </td>
                          <td class="font-weight-bold text-left">
                            {{ charge.charge.type }}
                          </td>
                          <td class="font-weight-bold text-left">
                            {{ charge.charge.amount }}
                          </td>
                        </tr>
                        <!-- total Discount -->
                        <tr>
                          <td colspan="5" class="text-right font-weight-bold">
                            {{ $t("fields.todalDiscount") }}
                          </td>
                          <td class="font-weight-bold text-left">
                            {{ currencySettings.data.currency_symbol }}{{ invoice.totalDiscount }}
                          </td>
                        </tr>
                        <!-- Grand Total -->
                        <tr>
                          <td colspan="5" class="text-right font-weight-bold">
                            {{ $t("fields.grandTotal") }}
                          </td>
                          <td class="font-weight-bold text-left">
                            {{ currencySettings.data.currency_symbol }}{{ invoice.totalAmount }}
                          </td>
                        </tr>
                        <!-- Total Paid -->
                        <tr>
                          <td colspan="5" class="text-right font-weight-bold">
                            {{ $t("fields.totalPaid") }}
                          </td>
                          <td class="font-weight-bold text-left">
                            {{ currencySettings.data.currency_symbol }}{{ invoice.paidAmount }}
                          </td>
                        </tr>
                        <!-- Total Due -->
                        <tr>
                          <td colspan="5" class="text-right font-weight-bold">
                            {{ $t("fields.totalDue") }}
                          </td>
                          <td class="font-weight-bold text-left">
                            {{ currencySettings.data.currency_symbol }}{{ invoice.totalDue }}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                </div>
              </div>
              <!-- Return Invoice -->
              <div class="row" v-if="returnInvoice && returnInvoice.length">
                <div class="col-12">

                  <div class="p-2">
                    <h3 class="font-size-16 ">
                      Return Products
                    </h3>
                  </div>

                  <!-- Return Products Table -->
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <th>{{ $t("fields.product") }}</th>
                        <!-- <th>{{ $t("fields.batch") }}</th> -->
                        <th>{{ $t("fields.rate") }}</th>
                        <th>{{ $t("fields.quantity") }}</th>
                        <th>{{ $t("fields.unit") }}</th>
                        <!-- <th>{{ $t("fields.discount") }}</th> -->
                        <th>{{ $t("fields.amount") }}</th>
                      </thead>
                      <tbody>
                        <tr v-for="item in returnInvoice" :key="item.id">
                          <td>{{ item.product.name }} {{`(${item.batch.name})`}} </td>
                          <!-- <td>{{ item.batch.name }}</td> -->
                          <td>
                            {{ currencySettings.data.currency_symbol }}{{ item.rate }}
                          </td>
                          <td>{{ item.quantity }}</td>
                          <td>{{ item.unit.name }}</td>

                          <td>
                            {{ currencySettings.data.currency_symbol }}{{ item.amount }}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="4" class="text-right font-weight-bold">
                            {{ $t("fields.grandTotal") }}
                          </td>
                          <td class="font-weight-bold text-left">
                            {{ currencySettings.data.currency_symbol }}{{ getTotalReturnAmount }}
                          </td>
                        </tr>
                      </tfoot>
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
          </vue-html2pdf>
        </client-only>
      </template>
    </detail-view>
  </loading-view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "purchase-return-invoice",
  data() {
    return {
      invoice: null,
      returnInvoice: null,
    };
  },
  computed: {
    ...mapGetters({
      settings: "config/getApplicationSetting",
      currencySettings: "config/getCurrencySettings",
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
    getTotalReturnAmount() {
      return this.returnInvoice.reduce(
        (acc, invoice) => (acc += invoice.amount),
        0
      );
    },
  },
  methods: {
    async print() {
      await this.$htmlToPaper("print_area");
    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
  },

  async fetch() {
    const resInvoice = await this.$axios.get(
      `/purchase-return-invoices/${this.$route.params.id}`
    );

    this.invoice = resInvoice.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
