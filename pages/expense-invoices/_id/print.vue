<template>
  <div id="print_area">
    <div v-if="isPageReady" class="p-3">
      <!-- Top Row -->
      <div class="row">
        <div class="col-12">
          <div class="invoice-title">
            <h4 class="float-right font-size-16">
              <strong>{{ $t("invoice.label") }} #
                {{ invoice.invoiceNo }}</strong>
            </h4>
            <h3 class="mt-0">
              <img :src="require('static/images/logo-sm.png')" alt="logo" height="24" />
            </h3>
          </div>
          <hr />
          <div class="row">
            <div class="col-6">
              <address>
                <strong>{{ $t("fields.companyInfo") }}:</strong><br />
                {{ settings.data.name }} <br />
                {{ settings.data.phone }}<br />
                {{ settings.data.address }}
              </address>
            </div>
            <div class="col-6 text-right">
              <address>
                <strong>{{ $t("fields.invoiceDate") }}:</strong><br />
                {{ invoice.date }}<br /><br />
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
              <h3 class="font-size-16">
                <strong>{{ $t("fields.invoiceSummary") }}</strong>
              </h3>
            </div>
            <div class="">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <th>{{ $t("fields.description") }}</th>
                    <th>{{ $t("fields.amount") }}</th>
                  </thead>
                  <tbody>
                    <tr v-for="item in invoice.expenseItems" :key="item.id">
                      <td>{{ item.description }}</td>

                      <td>
                        {{ currencySettings.data.currency_symbol }}
                        {{ item.amount }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="1" class="text-right font-weight-bold">
                        {{ $t("fields.total") }}
                      </td>
                      <td class="font-weight-bold text-left">
                        {{ currencySettings.data.currency_symbol }}
                        {{ invoice.totalAmount }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "print-invoice",
  layout: "print",
  data() {
    return {
      invoice: null,
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
  },

  methods: {
    async print() {
      await this.$htmlToPaper("print_area", null, () => {
        this.$router.back();
      });
    },
  },

  // async mounted() {
  //   this.$nextTick(() => {
  //     this.print();
  //   });
  // },
  watch: {
    isPageReady: {
      handler: function (newValue) {
        if (newValue) {
          this.$nextTick(() => {
            this.print();
          });
        }
      },
      immediate: true,
    },
  },

  async fetch() {
    const resInvoice = await this.$axios.get(
      `/expense-invoices/${this.$route.params.id}`
    );

    this.invoice = resInvoice.data.data;
  },
};
</script>

<style lang="scss" scoped>
</style>
