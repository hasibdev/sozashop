<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="isPageReady">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("purchaseInvoices.title.details") }}
        </h3>
        <div>
          <b-dropdown variant="info" right text="Print">
            <!-- Print -->
            <b-dropdown-item @click="print"> General Print</b-dropdown-item>
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
                      <img v-else src="/images/default-invoice-logo.png" class="d-print-none" width="200" alt="Logo">
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
                        <span v-if="invoice.supplier">{{ invoice.supplier.name }} <br />
                          {{ invoice.supplier.mobile }}<br /><br /></span>

                      </address>
                    </div>
                    <div class="col-6 text-right">
                      <!-- Invoice Date -->
                      <address class="mb-1">
                        <strong>{{ $t("fields.invoiceDate") }}:</strong><br />
                        {{ invoice.date }}<br />
                      </address>

                    </div>

                  </div>
                </div>
              </div>

              <!-- Bottom Row -->
              <div class="row">
                <div class="col-12">
                  <div>
                    <div class="p-2">
                      <h3 class="font-size-16 text-center">
                        <strong>{{ $t("headings.purchaseInvoiceSummary") }}</strong>
                      </h3>
                    </div>
                    <div class="">
                      <div class="table-responsive">
                        <table class="table">
                          <thead class="text-white bg-primary">
                            <slot v-if="invoice.purchaseItems && Object.keys(invoice.purchaseItems).length > 0">
                              <th>{{ $t("fields.product") }}</th>
                              <th>{{ $t("fields.rate") }}</th>
                              <th>{{ $t("fields.quantity") }}</th>
                              <th>{{ $t("fields.unit") }}</th>
                              <th>{{ $t("fields.amount") }}</th>
                            </slot>
                            <slot v-else>
                              <th style="width:90%"> {{ $t("fields.description") }}</th>
                              <th>{{ $t("fields.amount") }}</th>
                            </slot>

                          </thead>
                          <tbody>

                            <slot v-if="invoice.purchaseItems && Object.keys(invoice.purchaseItems).length > 0">
                              <tr v-for="item in invoice.purchaseItems" :key="item.id">
                                <td>{{ item.productName }}</td>
                                <td>
                                  {{ currencySettings.data.currency_symbol
                                }}{{ item.rate }}
                                </td>
                                <td>{{ item.quantity }}</td>
                                <td>{{ item.unitCode }}</td>

                                <td>
                                  {{ currencySettings.data.currency_symbol
                                }}{{ item.amount }}
                                </td>
                              </tr>
                            </slot>
                            <slot v-else>
                              <tr>
                                <td>{{$t("fields.opening_balance")}}</td>
                                <td>{{ currencySettings.data.currency_symbol }}{{ invoice.totalAmount }}</td>
                              </tr>
                            </slot>

                          </tbody>
                          <tfoot>
                            <!-- Charges -->
                            <tr v-for="charge in invoice.charges" :key="charge.id">
                              <td colspan="3" class="text-right font-weight-bold">
                                {{ charge.charge.name }}
                              </td>
                              <td class="font-weight-bold text-left">
                                {{ charge.charge.type }}
                              </td>
                              <td class="font-weight-bold text-left">
                                {{ charge.charge.amount }}
                              </td>
                            </tr>

                            <!-- Grand Total -->
                            <tr>
                              <td :colspan="Object.keys(invoice.purchaseItems).length > 0 ? 4: ''" class="text-right font-weight-bold">
                                {{ $t("fields.grandTotal") }}
                              </td>
                              <td class="font-weight-bold text-left">
                                {{ currencySettings.data.currency_symbol
                                }}{{ invoice.totalAmount }}
                              </td>
                            </tr>
                            <!-- Total Paid -->
                            <tr>
                              <td :colspan="Object.keys(invoice.purchaseItems).length > 0 ? 4: ''" class="text-right font-weight-bold">
                                {{ $t("fields.totalPaid") }}
                              </td>
                              <td class="font-weight-bold text-left">
                                {{ currencySettings.data.currency_symbol
                                }}{{ invoice.paidAmount }}
                              </td>
                            </tr>
                            <!-- Total Due -->
                            <tr>
                              <td :colspan="Object.keys(invoice.purchaseItems).length ? 4: ''" class="text-right font-weight-bold">
                                {{ $t("fields.totalDue") }}
                              </td>
                              <td class="font-weight-bold text-left">
                                {{ currencySettings.data.currency_symbol
                                }}{{ invoice.totalDue }}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
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
                          <td><span v-if="item.product">{{ item.product.name }}</span> <span v-if="item.batch">{{`(${item.batch.name})`}}</span> </td>
                          <!-- <td>{{ item.batch.name }}</td> -->
                          <td>
                            {{ currencySettings.data.currency_symbol }}{{ item.rate }}
                          </td>
                          <td>{{ item.quantity }}</td>
                          <td><span v-if="item.unit">{{ item.unit.name }}</span></td>

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
  name: "invoice-details",
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
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    async print() {
      await this.$htmlToPaper("print_area");
    },
  },
  async fetch() {
    const resInvoice = await this.$axios.get(
      `/purchase-invoices/${this.$route.params.id}`
    );

    this.invoice = resInvoice.data.data;

    // Return Invoice
    const resReturn = await this.$axios.get(
      `/purchase-return-items/${this.$route.params.id}`
    );
    this.returnInvoice = resReturn.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
