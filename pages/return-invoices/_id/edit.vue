<template>
  <loading-view :loading="$fetchState.pending">
    <form-view v-if="invoice">
      <template #header> {{ $t("invoice.title.edit") }} </template>

      <!-- Details -->
      <template>
        <!--  Date -->
        <date-control v-model="invoice.date" :label="$t('fields.date')" :error="validationErrors.date"></date-control>

        <!-- Customers -->
        <searchable-select v-model="invoice.customerId" :label="$t('fields.customer')" :options="customers" :error="validationErrors.customerId" track="id">
        </searchable-select>

        <!-- Dynamic Inputs -->
        <div class="mt-5">
          <table class="table table-responsive table-bordered">
            <thead>
              <th>{{ $t("fields.batch") }}</th>
              <th>{{ $t("fields.rate") }}</th>
              <th>{{ $t("fields.quantity") }}</th>
              <th>{{ $t("fields.unit") }}</th>

              <th>{{ $t("fields.amount") }}</th>
              <th class="text-right" width="5%" style="vertical-align: middle">
                <btn-primary @click="addRow">
                  <i class="fas fa-plus"></i>
                </btn-primary>
              </th>
            </thead>
            <tbody>
              <tr v-for="(item, index) in returnItems" :key="index">
                <!-- Batch -->
                <td width="20%">
                  <multiselect v-model="item.batch" track-by="id" placeholder="Type to search" open-direction="bottom" :options="[]" :searchable="true" :max-height="600" autocomplete="off" :internal-search="false" :clear-on-select="false" :close-on-select="true" :options-limit="300" :limit="3" :show-no-results="false" :hide-selected="true" :showLabels="false" :error="validationErrors[`returnItems.${index}.batchId`]" @input="handleBatchChange(index)" @search-change="fetchBatch($event, index)">
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
                  <input-control v-model="item.data.rate" type="number" @change="calculateTotal(index)" :error="validationErrors[`returnItems.${index}.rate`]">
                  </input-control>
                </td>
                <!-- Quantity -->
                <td>
                  <input-control v-model="item.data.quantity" type="number" @change="calculateTotal(index)" :error="validationErrors[`returnItems.${index}.quantity`]"></input-control>
                </td>

                <!-- Unit -->
                <td>
                  <input-control :value="item.unit" type="text" :readonly="true" :error="validationErrors[`returnItems.${index}.unitId`]">
                  </input-control>
                </td>

                <!-- Amount -->
                <td>
                  <input-control type="number" :value="item.data.amount" readonly></input-control>
                </td>
                <!-- Del Button -->
                <td>
                  <btn-danger @click="remove(index, item)">
                    <i class="fas fa-trash-alt"></i>
                  </btn-danger>
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td colspan="5" class="text-right font-weight-bold">
                  Grand Total
                </td>
                <td class="font-weight-bold text-left px-4">
                  {{ grandTotal }}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/return-invoices">
          {{ $t("buttons.cancel") }}
        </btn-link>
        <btn-success :loading="savingState" @click="save($event, true)">
          {{ $t("buttons.updateContinue") }}
        </btn-success>
        <btn-primary :loading="savingState" @click="save">
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
  name: "edit-return-invoice",
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
      returnItems: [],
      invoice: null,

      savingState: false,
    };
  },
  computed: {
    ...mapGetters({
      paymentMethods: "config/getPaymentMethods",
    }),

    /**
     * Calculate grand total
     */
    grandTotal() {
      return this.returnItems
        .map((item) => parseFloat(item.data.amount))
        .reduce((total, current) => (total += current), 0);
    },
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$put(`/return-invoices/${this.$route.params.id}`, {
          ...this.invoice,
        });
        this.$toast.success("Invoice updated successfully.");

        if (!createAndContinue) {
          this.$router.push(this.localePath("/return-invoices"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    /**
     * Add new row to the table
     */
    addRow() {
      this.returnItems.push({ ...this.item });
    },
    /**
     * Remove row from the table
     */
    async remove(index, item = null) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          confirmButtonColor: "var(--danger)",
          cancelButtonColor: "var(--primary)",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            this.returnItems.splice(index, 1);
            try {
              await this.$axios.$delete(`/return-items/${item.data.id}/delete`);
              this.$toast.success("Deleted successfully.");
            } catch (error) {
              console.log(error);
            }
          }
        });
    },
    calculateTotal(index) {
      let rate = this.returnItems[index].data.rate;
      let quantity = this.returnItems[index].data.quantity;

      this.returnItems[index].data.amount =
        parseFloat(rate) * parseFloat(quantity);
    },
  },
  mounted() {
    // Event listener for keyboard '+' button
    // Add new row when clickd on '+' button
    window.addEventListener("keyup", (e) => {
      if (e.key === "+") {
        this.addRow();
      }
    });
    // Event listener for keyboard '-' button
    // Remove row when clickd on '-' button
    window.addEventListener("keyup", (e) => {
      if (e.key === "-") {
        this.$swal
          .fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            confirmButtonColor: "var(--danger)",
            cancelButtonColor: "var(--primary)",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              const index = this.returnItems.length - 1;
              this.returnItems.splice(index, 1);
            }
          });
      }
    });
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
      `/return-invoices/${this.$route.params.id}`
    );
    this.invoice = resInvoice.data;

    // Set return items
    await this.invoice.returnItems.forEach(async (item) => {
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
      this.returnItems.push(data);
    });
  },
};
</script>

<style lang="scss" scoped></style>
