<template>
  <loading-view :loading="$fetchState.pending">
    <form-view v-if="invoice">
      <template #header> {{ $t("sales.title.edit") }} </template>
      <template>
        <!-- MFG Date -->
        <date-control v-model="invoice.date" :label="$t('fields.date')" :error="validationErrors.date"></date-control>

        <!-- Customers -->
        <searchable-select v-model="invoice.customerId" :label="$t('fields.customer')" :options="customers" :error="validationErrors.customerId" track="id"></searchable-select>

        <!-- Payment Select -->
        <select-control track="value" :label="$t('fields.paymentMethod')" :options="paymentMethods || []" v-model="invoice.paymentMethod" :error="validationErrors.paymentMethod"></select-control>

        <!-- Dynamic Inputs -->
        <div class="mt-5">
          <table class="table table-responsive table-bordered">
            <thead>
              <th>{{ $t("fields.products") }}</th>
              <th>{{ $t("fields.rate") }}</th>
              <th>{{ $t("fields.quantity") }}</th>
              <th>{{ $t("fields.unit") }}</th>
              <th>{{ $t("fields.discount") }}</th>
              <th>{{ $t("fields.type") }}</th>
              <th>{{ $t("fields.amount") }}</th>
              <th class="text-right" width="5%" style="vertical-align: middle">
                <btn-primary @click="addRow">
                  <i class="fas fa-plus"></i>
                </btn-primary>
              </th>
            </thead>
            <tbody>
              <!-- Sale Items -->
              <tr v-for="(item, index) in saleItems" :key="index">
                <!-- Batch -->
                <td width="20%">
                  <multiselect v-model="item.batch" track-by="id" placeholder="Type to search" open-direction="bottom" :options="item.batches" :searchable="true" :max-height="600" autocomplete="off" :internal-search="false" :clear-on-select="false" :close-on-select="true" :options-limit="300" :limit="3" :show-no-results="false" :hide-selected="true" :showLabels="false" :error="validationErrors[`saleItems.${index}.batchId`]" @input="handleBatchChange(index)" @search-change="fetchBatch($event, index)">
                    <template #singleLabel="{ option }">
                      <span>{{ option.product.name }} - {{ option.name }}</span>
                    </template>
                    <template slot="option" slot-scope="{ option }">
                      <span>{{ option.product.name }} - {{ option.name }}</span>
                    </template>
                  </multiselect>
                </td>
                <!-- Rate -->
                <td>
                  <input-control v-model="item.data.rate" type="number" @change="calculateTotal(index)" :error="validationErrors[`saleItems.${index}.rate`]">
                  </input-control>
                </td>
                <!-- Quantity -->
                <td>
                  <input-control v-model="item.data.quantity" type="number" @change="calculateTotal(index)" :error="validationErrors[`saleItems.${index}.quantity`]"></input-control>
                </td>
                <!-- Unit -->
                <td>
                  <input-control :value="item.unit" type="text" :readonly="true" :error="validationErrors[`saleItems.${index}.unitId`]">
                  </input-control>
                </td>
                <!-- Discount -->
                <td>
                  <input-control v-model="item.data.discount" type="number" @change="calculateTotal(index)" :error="validationErrors[`saleItems.${index}.discount`]" v-if="hasFieldPermission('sales.edit-sales.discount')"></input-control>
                </td>

                <!-- Discount Type -->
                <td>
                  <select-control @input="calculateTotal(index)" v-model="item.data.discountType" :error="validationErrors[`saleItems.${index}.discountType`]" :options="discountTypes || []" track="value"></select-control>
                </td>

                <!-- Amount -->
                <td>
                  <input-control type="number" :value="item.data.amount" readonly></input-control>
                </td>
                <td>
                  <btn-danger @click="remove(index, item)">
                    <i class="fas fa-trash-alt"></i>
                  </btn-danger>
                </td>
              </tr>
            </tbody>

            <tfoot>
              <!-- Charges -->
              <tr v-for="charge in invoice.charges" :key="charge.id">
                <td colspan="4" class="text-right">{{ charge.chargeName }}</td>
                <td class="text-right">
                  <input class="form-control" v-model="charge.chargeAmount" type="number" />
                </td>

                <td>{{ charge.chargeType | capitalize }}</td>
                <td>{{ calculateCharge(charge) }}</td>
                <td></td>
              </tr>

              <!-- Total Discount -->
              <tr>
                <td colspan="6" class="text-right font-weight-bold">
                  Total Discount
                </td>
                <td class="font-weight-bold text-left px-4">
                  {{ totalDiscount }}
                </td>
                <td></td>
              </tr>
              <!-- Grand Total -->
              <tr>
                <td colspan="6" class="text-right font-weight-bold">
                  Grand Total
                </td>
                <td class="font-weight-bold text-left px-4">
                  {{ grandTotal }}
                </td>
                <td></td>
              </tr>
              <!-- Total Paid -->
              <tr>
                <td colspan="6" class="text-right font-weight-bold">
                  Total Paid
                </td>
                <td class="font-weight-bold text-left">
                  <input-control type="number" v-model="invoice.paidAmount">
                  </input-control>
                </td>
                <td></td>
              </tr>
              <!-- Total Due -->
              <tr>
                <td colspan="6" class="text-right font-weight-bold">
                  Total Due
                </td>
                <td class="font-weight-bold text-left px-4">
                  {{ totalDue }}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/sale-invoices">
          {{ $t("buttons.cancel") }}
        </btn-link>
        <btn-success @click="save($event, true)">
          {{ $t("buttons.updateContinue") }}
        </btn-success>
        <btn-primary @click="save">
          {{ $t("buttons.update") }}
        </btn-primary>
      </template>
    </form-view>
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
  name: "edit-sale-invoice",
  middleware: ["sale-invoice-status"],
  meta: {
    permission: "update-sale-invoices",
  },
  mixins: [validation],
  data() {
    return {
      customers: [],
      batches: [],
      initialData: null,
      products: [],
      item: {
        batches: [],
        batch: null,
        unit: null,
        data: {
          productId: null,
          batchId: null,
          rate: 0,
          quantity: 0,
          unitId: null,
          discount: 0,
          amount: 0,
        },
      },
      saleItems: [],
      invoice: null,
    };
  },
  computed: {
    ...mapGetters({
      paymentMethods: "config/getPaymentMethods",
      discountTypes: "config/getDiscountTypes",
    }),
    /**
     * Calculate total discount
     */
    /**
     * Calculate Sub total
     */
    subTotal() {
      return this.saleItems
        .map((item) => parseFloat(item.data.amount || "0"))
        .reduce((total, current) => (total += current), 0);

      // return 0;
    },

    /**
     * Calculate total discount
     */
    totalDiscount() {
      return this.saleItems
        .map(({ data }) => {
          const discount = parseFloat(data.discount || "0");
          let total = 0;
          if (data.discountType == "%") {
            total = (data.rate * data.quantity * data.discount) / 100;
          } else {
            total += discount;
          }
          return total;
        })
        .reduce((total, current) => (total += current), 0);
    },

    /**
     * Calculate Total Charge
     */
    totalCharge() {
      return this.invoice.charges
        .map((charge) => parseFloat(this.calculateCharge(charge)))
        .reduce((total, current) => total + current, 0);
    },

    /**
     * Calculate grand total
     */
    grandTotal() {
      return parseFloat(this.subTotal) + parseInt(this.totalCharge);
    },
    /**
     * Calculate total due
     */
    totalDue() {
      return this.grandTotal - parseFloat(this.invoice.paidAmount);
    },
  },
  methods: {
    async save(event, createAndContinue = false) {
      try {
        await this.$axios.$put(`/sale-invoices/${this.$route.params.id}`, {
          ...this.invoice,
          saleItems: this.saleItems.map((item) => item.data),
        });
        this.$toast.success("Invoice updated successfully.");

        if (!createAndContinue) {
          this.$router.push(this.localePath("/sale-invoices"));
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Calculate Charge
     */
    calculateCharge(charge) {
      let total = 0;
      if (charge.chargeType == "%") {
        total = (this.subTotal * charge.chargeAmount) / 100;
      } else {
        total += charge.chargeAmount;
      }
      return total;
    },

    /**
     * Add new row to the table
     */
    addRow() {
      this.saleItems.push({ ...this.item });
    },

    /**
     * Remove row from the table
     */
    async remove(index, item = null) {
      this.saleItems.splice(index, 1);
      try {
        await this.$axios.$delete(`/sale-items/${item.data.id}/delete`);
        this.$toast.success("Deleted successfully.");
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Get the batch on product change
     */
    async getBatch(index) {
      const res = await this.$axios.$get(
        `/batches?product=${this.saleItems[index].data.productId}`
      );
      this.saleItems[index].batches = res.data;
    },

    /**
     * Handle batch change and set other values
     */
    handleBatchChange(index) {
      // Set Product
      this.saleItems[index].data.productId =
        this.saleItems[index].batch.productId;
      // Set batch
      this.saleItems[index].data.batchId = this.saleItems[index].batch.id;
      // Set Rate
      this.saleItems[index].data.rate = this.saleItems[index].batch.sellingRate;
      // Set Unit
      this.saleItems[index].data.unitId = this.saleItems[index].batch.unit.id;
      this.saleItems[index].unit = this.saleItems[index].batch.unit.name;
    },

    /**
     * Calculate row total amount
     */
    calculateTotal(index) {
      let rate = this.saleItems[index].data.rate;
      let quantity = this.saleItems[index].data.quantity;
      let discount = this.saleItems[index].data.discount;
      let type = this.saleItems[index].data.discountType;

      if (type == "%") {
        const subTotal = parseFloat(rate || "0") * parseFloat(quantity || "0");
        const subDis = (subTotal * parseFloat(discount || "0")) / 100;
        this.saleItems[index].data.amount = subTotal - subDis;
      } else {
        this.saleItems[index].data.amount =
          parseFloat(rate || "0") * parseFloat(quantity || "0") -
          parseFloat(discount || "0");
      }
    },
  },
  created() {
    // this.addRow();
  },
  async fetch() {
    // Fetch Customers
    const resCustomers = await this.$axios.get("/customers");
    this.customers = resCustomers.data.data;
    // Fetch Products
    const resProducts = await this.$axios.$get("/products");
    this.products = resProducts.data;
    // Fetch Invoice
    const resInvoice = await this.$axios.$get(
      `/sale-invoices/${this.$route.params.id}`
    );
    this.invoice = resInvoice.data;

    // Set sale items
    await this.invoice.saleItems.forEach(async (item) => {
      // Get the batch option for the product
      const resBatches = await this.$axios.$get(
        `/batches?product=${item.productId}`
      );
      let data = {
        batches: resBatches.data,
        batch: item.batch,
        unit: item.batch.unit.name,
        readonly: true,
        data: item,
      };
      this.saleItems.push(data);
    });
  },
};
</script>

<style lang="scss" scoped></style>
