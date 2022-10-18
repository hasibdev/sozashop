<template>
  <div>
    <div id="print_area">
      <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="pos-card">
          <img class="logo" src="/images/logo-sm.png" alt="Logo" />
          <p class="mb-1 font-weight-bold">Sozashop</p>
          <p>
            DIT Road, Rampura , Dhaka - 1219 , BD +88 017 4179 4862
          </p>
          <p class="mb-0 text-left font-weight-bold">
            Invoice No: {{ invoice.invoiceNo }}
          </p>
          <p class="mb-2 text-left font-weight-bold">
            Data: {{ invoice.invoiceDateFormatted }}
          </p>

          <!-- Table -->
          <table class="table-bordered w-100">
            <!-- Head -->
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <!-- Sell Items -->
            <tbody>
              <tr v-for="item in invoice.returnItems" :key="item.id">
                <td>{{ item.product.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.rate }}</td>
                <td>{{ item.amount }}</td>
              </tr>
            </tbody>
            <br />
            <tfoot>
              <tr>
                <td class="text-right pr-2" colspan="3">Net Total</td>
                <td>{{ invoice.totalAmount }}</td>
              </tr>

              <tr>
                <td class="text-right pr-2" colspan="3">Discount</td>
                <td>{{ invoice.totalDiscount }}</td>
              </tr>
              <tr>
                <td class="text-right pr-2" colspan="3">Paid</td>
                <td>{{ invoice.paidAmount }}</td>
              </tr>

              <tr>
                <td class="text-right pr-2" colspan="3">Total</td>
                <td>{{ invoice.grandTotal }}</td>
              </tr>

              <tr>
                <td class="text-right pr-2" colspan="3">Due</td>
                <td>{{ invoice.totalDue }}</td>
              </tr>
            </tfoot>
          </table>

          <p class="text-left mb-1 mt-3">
            <strong>Thank you for shopping!</strong> Thanks for coming and you
            are always welcome.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pos-print",
  layout: "print",

  methods: {
    async print() {
      await this.$htmlToPaper("print_area", null, () => {
        this.$router.back();
      });
    },
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.print();
    });
  },
  async asyncData({ $axios, route }) {
    const resInvoice = await $axios.get(`/purchase-return-invoices/${route.params.id}`);

    return {
      invoice: resInvoice.data.data,
    };
  },
};
</script>

<style scoped>
.pos-card {
  width: 250px;
  background: white;
  padding: 12px;
  box-shadow: 0px 2px 20px #ddd;
  text-align: center;
}
.pos-card .logo {
  width: 70px;
}
</style>
