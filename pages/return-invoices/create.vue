<template>
  <loading-view :loading="$fetchState.pending">
    <form-view>
      <template #header> {{ $t("returnInvoices.title.add") }} </template>

      <template>
        <!--  Date -->
        <date-control v-model="formData.date" :label="$t('fields.date')" :error="validationErrors.date"></date-control>

        <!-- Invoice select -->
        <searchable-select :loading="fetchingInvoiceData" @input="onInvoiceSelect" v-model="formData.invoiceId" title="invoiceNo" :label="$t('fields.invoice')" :options="saleInvoices" :error="validationErrors.invoiceId" track="id">
        </searchable-select>

        <!-- Customers -->
        <searchable-select v-model="formData.customerId" :label="$t('fields.customer')" :options="customers" :error="validationErrors.customerId" track="id">
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
          <table style="overflow: visible;" class="table table-responsive table-bordered">
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
                  <!-- Name -->
                  <!-- <autosuggest watchProduct :loading="fetchingProducts == index" autofocus :index="index" :getSuggestionValue="getSuggestionValue" v-model="item.batch" :suggestions="item.batches" @input="handleBatchChange(index)" @onSearch="fetchBatch($event, index)" placeholder="Search Product" :error="validationErrors[`saleItems.${index}.productId`]">
                    <template slot-scope="{suggestion}">
                      {{ suggestion.item.productName }} - {{ suggestion.item.name }}
                    </template>
                  </autosuggest>
                  <span class="text-danger">{{validationErrors.returnItems && validationErrors.returnItems[0]}}</span> -->

                  <multiselect v-model="item.batch" track-by="id" placeholder="Type to search" open-direction="bottom" :options="item.batches" :searchable="true" :max-height="600" autocomplete="off" :internal-search="false" :clear-on-select="false" :close-on-select="true" :options-limit="5" :limit="5" :show-no-results="false" :hide-selected="true" :showLabels="false" :loading="fetchingProducts == index" @input="handleBatchChange(index)" @search-change="fetchBatch($event, index)" ref="focusBatch">
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
                  {{ $t("fields.totalDue") }}
                </td>
                <td class="font-weight-bold text-left px-4">
                  {{totalDue}}
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
          {{ $t("buttons.submitPrint") }}
        </btn-success>
        <btn-primary v-shortkey="['ctrl', 'enter']" @shortkey.native="save()" :loading="savingState" @click="save">
          {{ $t("buttons.submit") }}
        </btn-primary>
      </template>

      <!-- Customer Modal -->
      <modal-control title="Create New Customer" v-model="openCustomerModal">
        <template #body>
          <!-- Name -->
          <input-control focus v-model="customerForm.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
          <!-- Mobile -->
          <input-control type="tel" v-model="customerForm.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile"></input-control>
          <!-- Email -->
          <input-control v-model="customerForm.email" :label="$t('fields.email')" :error="validationErrors.email"></input-control>
          <!-- Address -->
          <text-control v-model="customerForm.address" :label="$t('fields.address')" :error="validationErrors.address"></text-control>
          <!-- Opening Balance -->
          <input-control v-model="customerForm.openingBalance" :label="$t('fields.openingBalance')" :error="validationErrors.openingBalance" type="number"></input-control>
        </template>
        <template #footer="{ hide }">
          <button @click="hide()" class="btn btn-secondary">Close</button>
          <btn-primary :loading="customerSavingState" @click="saveNewCustomer" class="btn btn-primary">Save</btn-primary>
        </template>
      </modal-control>
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
      customers: [],
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
        },
      },
      returnItems: [],
      saleInvoices: [],
      // Form data to send
      formData: {
        date: new Date(),
        paidAmount: 0,
        paymentMethod: "cash",
        customerId: null,
        invoiceId: null,
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
      fetchingInvoiceData: false,

      invoice_total_due: 0,
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
     * Get suggestion value for dynamic product search
     * This is similer to track value
     */
    getSuggestionValue(suggestion) {
      return `${suggestion.item.productName} - ${suggestion.item.name}`;
    },

    /**
     * When Select Invoice
     */
    async onInvoiceSelect(id) {
      this.fetchingInvoiceData = true;
      try {
        this.formData.customerId = "";
        const res = await this.$axios.get(`/sale-items?invoice=${id}`);

        //paid & due amount show
        this.invoice_total_due = res.data.data[0].invoice.totalDue;
        this.formData.customerId = res.data.data[0].invoice.customerId;

        const newReturnItems = res.data.data.map((item) => ({
          batches: [],
          batch: item.batch,
          unit: item.unitName,
          data: {
            productId: item.productId,
            batchId: item.batchId,
            rate: item.rate,
            quantity: item.quantity,
            unitId: item.unitId,
            discount: item.discount,
            amount: item.amount,
            old_quantity: item.quantity,
            id: item.id,
          },
        }));

        this.returnItems = newReturnItems;
        this.addRow();
      } catch (error) {
        console.log(error);
      } finally {
        this.fetchingInvoiceData = false;
      }
    },
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
    async save(event, createAndPrint = false) {
      const filterdReturnItems = this.returnItems
        .filter((item) => item.batch !== null)
        .map((item) => item.data);

      this.savingState = true;
      try {
        const res = await this.$axios.$post("/return-invoices", {
          ...this.formData,
          returnItems: filterdReturnItems,
        });
        this.$toast.success("Invoice created successfully.");
        if (createAndPrint) {
          this.reset();
          this.$router.push(
            this.localePath(`/return-invoices/${res.data.id}/print`)
          );
        } else {
          this.$router.push(this.localePath("/return-invoices"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    /**
     * Create new customer from Modal
     */
    async saveNewCustomer() {
      this.customerSavingState = true;
      try {
        const res = await this.$axios.$post("/customers", this.customerForm);
        this.$toast.success("Customer created successfully.");

        this.fetchCustomers();

        // Reset Form
        this.customerForm.name = "";
        this.customerForm.mobile = "";
        this.customerForm.email = "";
        this.customerForm.address = "";
        // Close Modal
        this.openCustomerModal = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.customerSavingState = false;
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
        this.returnItems[index].batch.sellingRate;
      // Set Unit
      this.returnItems[index].data.unitId =
        this.returnItems[index].batch.unit.id;
      this.returnItems[index].unit = this.returnItems[index].batch.unit.name;

      // Check if the last item has selected or empty
      if (this.returnItems[this.returnItems.length - 1].batch) {
        this.addRow();
      }
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
    async fetchCustomers() {
      // Fetch Customers
      const resCustomers = await this.$axios.get("/customers");
      this.customers = resCustomers.data.data;
    },
  },
  created() {
    this.initialData = { ...this.formData };
    const invoiceId = this.$route.query.invoiceId;
    if (!invoiceId) this.addRow();
  },
  async fetch() {
    await this.fetchCustomers();

    // Fetch Sale Invoices for select options
    const resSaleInvoices = await this.$axios.get("/sale-invoices");
    this.saleInvoices = resSaleInvoices.data.data;

    // Return Invoice data
    const invoiceId = this.$route.query.invoiceId;
    if (invoiceId) {
      const invoiceData = await this.$axios.get(`/sale-invoices/${invoiceId}`);
      //paid & due amount show
      this.invoice_total_due = invoiceData.data.data.totalDue;

      // Set formData
      const newFormData = {
        date: invoiceData.data.data.date,
        paidAmount: 0,
        paymentMethod: "cash",
        customerId: invoiceData.data.data.customerId,
        invoiceId,
      };
      this.formData = newFormData;

      // Set sell Items
      invoiceData.data.data.saleItems.forEach((item) => {
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
            old_quantity: item.quantity,
            id: item.id,
          },
        };
        this.returnItems.push(newReturnItem);
      });
    }
  },
  watch: {
    //customer wise invoice get
    "formData.customerId": function (newVal, oldVal) {
      if (newVal) {
        this.$axios
          .get("/get-sale-invoice/return-page/customer/" + newVal)
          .then((res) => {
            this.saleInvoices = res.data;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
