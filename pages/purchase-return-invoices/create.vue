<template>
  <loading-view :loading="$fetchState.pending">
    <form-view>
      <template #header> {{ $t("returnInvoices.title.add") }} </template>

      <template>
        <!--  Date -->
        <date-control v-model="formData.date" :label="$t('fields.date')" :error="validationErrors.date"></date-control>

        <!-- Invoice select -->
        <searchable-select v-model="formData.purchaseInvoiceId" title="invoiceNo" :label="$t('fields.invoice')" :options="purchaseInvoices" :error="validationErrors.purchaseInvoiceId" track="id">
        </searchable-select>

        <!-- Suppliers -->
        <searchable-select v-model="formData.supplierId" :label="$t('fields.supplier')" :options="suppliers" :error="validationErrors.supplierId" track="id">
          <template #action>
            <button class=" btn btn-primary ml-1 d-flex  align-items-center justify-content-center" @click="openCustomerModal = true">
              <i class="ti-plus"></i>
            </button>
          </template>
        </searchable-select>

        <!-- Payment Select -->
        <select-control track="value" :label="$t('fields.paymentMethod')" :options="paymentMethods || []" v-model="formData.paymentMethod">
        </select-control>

        <!-- Dynamic Inputs -->
        <div class="mt-5">
          <table style="overflow: visible" class="table table-responsive table-bordered">
            <thead>
              <th>{{ $t("fields.product") }}</th>
              <th>{{ $t("fields.rate") }}</th>
              <th>{{ $t("fields.quantity") }}</th>
              <th>{{ $t("fields.unit") }}</th>
              <!-- <th>{{ $t("fields.discount") }}</th> -->
              <th>{{ $t("fields.amount") }}</th>
              <th class="text-right" width="5%" style="vertical-align: middle">
                <btn-primary @click="addRow" v-b-tooltip.hover title="Shotcut Press ' + ' to add">
                  <i class="fas fa-plus"></i>
                </btn-primary>
              </th>
            </thead>
            <tbody>
              <tr v-for="(item, index) in returnItems" :key="index">
                <!-- Batch -->
                <td width="30%">
                  <multiselect v-model="item.batch" track-by="id" placeholder="Type to search" open-direction="bottom" :options="item.batches" :searchable="true" :max-height="600" autocomplete="off" :internal-search="false" :clear-on-select="false" :close-on-select="true" :options-limit="5" :limit="5" :show-no-results="false" :hide-selected="true" :showLabels="false" :loading="fetchingProducts == index" @input="handleBatchChange(index)" @search-change="fetchBatch($event, index)" ref="focusBatch">
                    <template #singleLabel="{ option }">
                      <span>{{ option.product.name }} - {{ option.name }}</span>
                    </template>
                    <template slot="option" slot-scope="{ option }">
                      <span>{{ option.product.name }} - {{ option.name }}</span>
                    </template>
                  </multiselect>
                  <span class="text-danger">{{validationErrors.returnItems && validationErrors.returnItems[0]}}</span>
                </td>
                <!-- Rate -->
                <td>
                  <input-control v-model="item.data.rate" type="number" @change="calculateTotal(index)" :error="validationErrors[`returnItems.${index}.rate`]" :readonly="!item.batch">
                  </input-control>
                </td>
                <!-- Quantity -->
                <td>
                  <input-control v-model="item.data.quantity" type="number" @change="calculateTotal(index)" :error="validationErrors[`returnItems.${index}.quantity`]" :readonly="!item.batch"></input-control>
                </td>

                <!-- Unit -->
                <td>
                  <input-control :value="item.unit" type="text" :readonly="true" :error="validationErrors[`returnItems.${index}.unitId`]">
                  </input-control>
                </td>
                <!-- Discount -->

                <!-- Amount -->
                <td width="10%">
                  <input-control type="number" :value="item.data.amount" readonly></input-control>
                </td>
                <td>
                  <btn-danger @click="remove(index)" v-b-tooltip.hover title="Shotcut Press ' - ' to remove">
                    <i class="fas fa-trash-alt"></i>
                  </btn-danger>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-right font-weight-bold">
                  {{ $t("fields.grandTotal") }}
                </td>
                <td class="font-weight-bold text-left px-4">
                  {{ grandTotal }}
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right font-weight-bold">
                  {{ $t("fields.totalPaid") }}
                </td>
                <td class="font-weight-bold text-left">
                  <input v-shortkey.focus="['ctrl', 'alt', 'p']" v-model="formData.paidAmount" ref="total-paid" type="number" name="total-paid" class="form-control" />
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
        <btn-success :loading="savingState" @click="save($event, true)">
          {{ $t("buttons.submitContinue") }}
        </btn-success>
        <btn-primary v-shortkey="['ctrl', 'enter']" @shortkey.native="save()" v-b-tooltip.hover title="Shotcut Press 'Ctrl+Enter'" :loading="savingState" @click="save">
          {{ $t("buttons.submit") }}
        </btn-primary>
      </template>

    </form-view>
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
  name: "create-return-invoices",
  mixins: [validation],
  data() {
    return {
      suppliers: [],
      batches: [],
      initialData: null,
      item: {
        batches: [],
        batch: null,
        unit: null,
        data: {
          productId: null,
          batchId: null,
          rate: 0,
          quantity: 1,
          unitId: null,
          discount: 0,
          amount: 0,
          id: null,
        },
      },
      returnItems: [],
      purchaseInvoices: [],
      // Form data to send
      formData: {
        date: new Date(),
        paidAmount: 0,
        paymentMethod: "cash",
        supplierId: null,
        purchaseInvoiceId: null,
        totalAmount: 0,
      },

      openCustomerModal: false,
      customerForm: {
        name: "",
        mobile: "",
        email: "",
        address: "",
        openingBalance: "",
      },
      fetchingProducts: null,

      savingState: false,
      customerSavingState: false,
    };
  },
  computed: {
    ...mapGetters({
      appSettings: "config/getApplicationSetting",
      paymentMethods: "config/getPaymentMethods",
    }),
    // customerId() {
    //   return this.appSettings?.data?.defaultCustomer;
    // },

    /**
     * Calculate total discount
     */
    totalDiscount() {
      return this.returnItems
        .map((item) => parseFloat(item.data.discount || "0"))
        .reduce((total, current) => (total += current), 0);
    },

    /**
     * Calculate grand total
     */
    grandTotal() {
      return this.returnItems
        .map((item) => parseFloat(item.data.amount || "0"))
        .reduce((total, current) => (total += current), 0);
    },

    // /**
    //  * Calculate total due
    //  */
    totalDue() {
      return (
        parseFloat(this.grandTotal) -
        parseFloat(this.formData.paidAmount || "0")
      );
    },
  },
  methods: {
    /**
     * Fetch batches at search
     */
    fetchBatch: _.debounce(function (search, index) {
      if (!search) {
        this.fetchingProducts = null;
        return;
      }

      this.fetchingProducts = index;
      this.$axios
        .get(`/batches?searchByProduct=${search}`)
        .then((res) => {
          this.returnItems[index].batches = res.data.data;
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.fetchingProducts = null;
        });
    }, 300),
    /**
     * Save sale invoice
     */
    async save(event, createAndContinue = false) {
      const filterdReturnItems = this.returnItems
        .filter((item) => item.batch !== null)
        .map((item) => item.data);

      this.savingState = true;
      try {
        this.formData.totalAmount = this.grandTotal;
        await this.$axios.$post("/purchase-return-invoices", {
          ...this.formData,
          returnItems: filterdReturnItems,
        });
        this.$toast.success("Invoice created successfully.");
        if (createAndContinue) {
          this.reset();
          this.$router.push(
            this.localePath("/purchase-return-invoices/create")
          );
        } else {
          this.$router.push(this.localePath("/purchase-return-invoices"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },

    /**
     * Reset the form
     */
    reset() {
      this.formData = { ...this.initialData };
      this.returnItems = [{ ...this.item, data: { ...this.item.data } }];
    },

    /**
     * Add new row to the table
     */
    addRow() {
      this.returnItems.push({ ...this.item, data: { ...this.item.data } });
      this.focusLastBatch();
    },

    /**
     * Remove row from the table
     */
    remove(index) {
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
            this.focusLastBatch();
          }
        });
    },

    /**
     * Focus Last Batch input
     */
    focusLastBatch() {
      this.$nextTick(() => {
        const lastIndex = this.returnItems.length - 1;
        if (
          this.$refs &&
          this.$refs.focusBatch &&
          this.$refs.focusBatch[lastIndex]
        ) {
          this.$refs.focusBatch[lastIndex].$el.focus();
        }
      });
    },

    /**
     * Handle batch change and set other values
     */
    handleBatchChange(index) {
      // Set Product
      this.returnItems[index].data.productId =
        this.returnItems[index].batch.productId;
      // Set batch
      this.returnItems[index].data.batchId = this.returnItems[index].batch.id;
      // Set Rate
      this.returnItems[index].data.rate =
        this.returnItems[index].batch.purchaseRate;
      // Set Unit
      this.returnItems[index].data.unitId =
        this.returnItems[index].batch.unit.id;
      this.returnItems[index].unit = this.returnItems[index].batch.unit.name;

      this.addRow();
    },

    /**
     * Calculate row total amount
     */
    calculateTotal(index) {
      let rate = this.returnItems[index].data.rate;
      let quantity = this.returnItems[index].data.quantity;
      let discount = this.returnItems[index].data.discount;
      this.returnItems[index].data.amount =
        parseFloat(rate || "0") * parseFloat(quantity || "0") -
        parseFloat(discount || "0");
    },
    async fetchSuppliers() {
      // Fetch Customers
      const res = await this.$axios.get("/suppliers");
      this.suppliers = res.data.data;
    },
    async getInvoiceInfo(invoiceId) {
      this.returnItems = [];
      // Return Invoice data
      let purchaseInvoiceId = invoiceId;
      if (purchaseInvoiceId) {
        const invoiceData = await this.$axios.get(
          `/purchase-invoices/${purchaseInvoiceId}`
        );

        // Set formData
        const newFormData = {
          date: new Date(),
          paidAmount: invoiceData.data.data.paidAmount,
          paymentMethod: "cash",
          supplierId: invoiceData.data.data.supplierId,
          purchaseInvoiceId,
        };
        this.formData = newFormData;
        // Set sell Items
        invoiceData.data.data.purchaseItems.forEach((item) => {
          // console.log(item);
          const newReturnItem = {
            batches: [],
            batch: item.batch,
            unit: item.unit.name,
            data: {
              productId: item.productId,
              batchId: item.batchId,
              rate: item.rate,
              quantity: item.quantity,
              unitId: item.unitId,
              discount: item.discount,
              amount: item.amount,
              id: item.id,
            },
          };
          this.returnItems.push(newReturnItem);
        });
      }
    },
  },
  created() {
    this.initialData = { ...this.formData };
    const purchaseInvoiceId = this.$route.query.invoiceId;
    // if (!purchaseInvoiceId) this.addRow();
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
    await this.fetchSuppliers();

    // Fetch purchase Invoices for select options
    const resPurchaseInvoices = await this.$axios.get("/purchase-invoices");
    resPurchaseInvoices.data.data.forEach((item) => {
      if (item.purchaseItems && item.purchaseItems.length > 0) {
        this.purchaseInvoices.push(item);
      }
    });

    // // Return Invoice data
    if (this.$route.query.invoiceId) {
      this.getInvoiceInfo(this.$route.query.invoiceId);
    }
  },
  watch: {
    //supplier wise invoice get
    "formData.supplierId": function (newVal, oldVal) {
      if (newVal) {
        this.$axios
          .get("/get-purchase-invoice/return-page/supplier/" + newVal)
          .then((res) => {
            this.purchaseInvoices = [];
            res.data.data.forEach((item) => {
              if (item.purchaseItems && item.purchaseItems.length > 0) {
                this.purchaseInvoices.push(item);
              }
            });
          });
      }
    },
    //supplier wise invoice wize product get
    "formData.purchaseInvoiceId": function (newVal, oldVal) {
      if (newVal) {
        this.getInvoiceInfo(newVal);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
