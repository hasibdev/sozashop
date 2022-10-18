<template>
  <invoice-loading :loading="$fetchState.pending">
    <form-view>
      <template #header> {{ $t("sales.title.add") }} </template>
      <template>
        <!--  Date -->
        <date-control v-model="formData.date" :label="$t('fields.date')" :error="validationErrors.date"></date-control>

        <!-- Due Date -->
        <date-control v-model="formData.dueDate" :label="$t('fields.dueDate')" :error="validationErrors.dueDate" v-if="hasFieldPermission('sales.new-sales.due-date')"></date-control>

        <!-- Payment Method -->
        <select-control track="value" :label="$t('fields.paymentMethod')" :options="paymentMethods || []" v-model="formData.paymentMethod"></select-control>
        <!-- Customers -->
        <searchable-select :internalSearch="false" @search-change="searchCustomers" :loading="searchingCustomers" v-model="formData.customerId" searchable :label="$t('fields.customer')" :options="customers" :error="validationErrors.customerId" track="id">
          <!-- Single Label -->
          <template #singleLabel="{ option }">
            {{ option.name }}
            <span v-if="option.mobile">({{ option.mobile }})</span>
          </template>
          <!-- Option -->
          <template #option="{ option }">
            {{ option.name }}
            <span v-if="option.mobile">({{ option.mobile }})</span>
          </template>

          <!-- Add New Custoemr -->
          <template #action>
            <button class="
                btn btn-primary
                ml-1
                d-flex
                align-items-center
                justify-content-center
              " @click="openCustomerModal = true">
              <i class="ti-plus"></i>
            </button>
          </template>
        </searchable-select>

        <!-- Dynamic Inputs -->

        <div class="mt-5">
          <table class="table table-responsive table-bordered">
            <thead>
              <th>{{ $t("fields.products") }}</th>
              <th>{{ $t("fields.rate") }}</th>
              <th>{{ $t("fields.quantity") }}</th>
              <th>{{ $t("fields.unit") }}</th>
              <th v-if="hasFieldPermission('sales.new-sales.discount')">{{ $t("fields.discount") }}</th>
              <th v-if="hasFieldPermission('sales.new-sales.discount')">{{ $t("fields.type") }}</th>
              <th>{{ $t("fields.amount") }}</th>
              <th class="text-right" width="5%" style="vertical-align: middle">
                <btn-primary v-shortkey="['shift', '+']" @shortkey.native="addRow()" @click="addRow" v-b-tooltip.hover title="Shotcut Press 'Shift +' to add">
                  <i class="fas fa-plus"></i>
                </btn-primary>
              </th>
            </thead>
            <tbody>
              <tr v-for="(item, index) in saleItems" :key="index">
                <!-- Select product -->
                <td width="30%">
                  <!-- Name -->
                  <!-- <autosuggest :loading="fetchingProducts == index" autofocus :index="index" :getSuggestionValue="getSuggestionValue" v-model="item.batch" :suggestions="item.batches" @input="handleBatchChange(index)" @onSearch="fetchBatch($event, index)" placeholder="Search Product" :error="validationErrors[`saleItems.${index}.productId`]">
										<template slot-scope="{suggestion}">
										{{ suggestion.item.productName }} - {{ suggestion.item.name }}
										</template>
									</autosuggest> -->
                  <multiselect :internalSearch="false" v-model="item.batch" track-by="id" placeholder="Type to search" open-direction="bottom" :options="item.batches" :searchable="true" :max-height="600" :options-limit="50" :limit="50" :loading="fetchingProducts == index" @input="handleBatchChange(index)" @search-change="fetchBatch($event, index)" selectLabel="" deselectLabel="" ref="focusBatch">
                    <template #singleLabel="{ option }">
                      <span>{{ option.product.name }} - {{ option.name }}</span>
                    </template>
                    <template slot="option" slot-scope="{ option }">
                      <span>{{ option.product.name }} - {{ option.name }}</span>
                    </template>
                    <template #noResult>
                      <span>No product found!</span>
                    </template>
                  </multiselect>
                </td>
                <!-- Rate -->
                <td>
                  <input-control v-model="item.data.rate" type="number" @change="calculateTotal(index)" :error="validationErrors[`saleItems.${index}.rate`]" :readonly="!item.batch"></input-control>
                </td>
                <!-- Quantity -->
                <td>
                  <input v-shortkey="['ctrl', 'alt', 'q']" @shortkey="focusQuantityField" v-model.number="item.data.quantity" type="number" @change="calculateTotal(index)" :error="validationErrors[`saleItems.${index}.quantity`]" class="form-control mb-3" :readonly="!item.batch" ref="quantity" />
                </td>

                <!-- Unit -->
                <td>
                  <input-control :value="item.unit" type="text" :readonly="true" :error="validationErrors[`saleItems.${index}.unitId`]">
                  </input-control>
                </td>
                <!-- Discount -->
                <td v-if="hasFieldPermission('sales.new-sales.discount')">
                  <input-control v-model="item.data.discount" type="number" @change="calculateTotal(index)" :error="validationErrors[`saleItems.${index}.discount`]" :readonly="!item.batch" :clearonfocus="item.batch != null"></input-control>
                </td>
                <!-- Discount Type -->
                <td v-if="hasFieldPermission('sales.new-sales.discount')">
                  <select-control @input="calculateTotal(index)" v-model="item.data.discountType" :error="validationErrors[`saleItems.${index}.discountType`]" :options="discountTypes || []" track="value"></select-control>
                </td>

                <!-- Amount -->
                <td width="10%">
                  <input-control type="number" :value="item.data.amount" readonly></input-control>
                </td>
                <td>
                  <btn-danger v-shortkey="['shift', '-']" @shortkey.native="remove(saleItems.length - 1)" @click="remove(index)" v-b-tooltip.hover title="Shotcut Press 'Shift -' to remove">
                    <i class="fas fa-trash-alt"></i>
                  </btn-danger>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <!-- Charges -->
              <tr v-for="charge in charges" :key="charge.id">
                <td colspan="4" class="text-right">{{ charge.name }}</td>
                <td class="text-right">
                  <input disabled class="form-control" v-model="charge.amount" type="number" />
                </td>

                <td>{{ charge.type | capitalize }}</td>
                <td>{{ calculateCharge(charge) }}</td>
                <td></td>
              </tr>
              <!-- add discount -->
              <tr>
                <td :colspan="hasFieldPermission('sales.new-sales.discount') ? 6 : 5" class="text-right font-weight-bold">
                  {{ $t("fields.discount") }}
                </td>
                <td class="font-weight-bold text-left">
                  <div class="d-flex">
                    <input v-shortkey.focus="['ctrl', 'alt', 'd']" class="form-control" v-model.number="discount" type="number" />
                    <select-control v-model="discountType" :options="discountTypes || []" track="value"></select-control>
                  </div>
                </td>
                <td></td>
              </tr>

              <!-- Sub total -->
              <tr>
                <td :colspan="hasFieldPermission('sales.new-sales.discount') ? 6 : 5" class="text-right font-weight-bold">
                  {{ $t("fields.subTotal") }}
                </td>
                <td class="font-weight-bold text-left px-3">
                  {{ subTotal + totalCharge }}
                </td>
                <td></td>
              </tr>

              <!-- Total Discount -->
              <tr>
                <td :colspan="hasFieldPermission('sales.new-sales.discount') ? 6 : 5" class="text-right font-weight-bold">
                  {{ $t("fields.todalDiscount") }}
                </td>
                <td class="font-weight-bold text-left px-3">
                  <!-- {{ totalDiscount }} -->
                  {{ calculateTotalDiscount }}
                </td>
                <td></td>
              </tr>

              <!-- Grand total -->
              <tr>
                <td :colspan="hasFieldPermission('sales.new-sales.discount') ? 6 : 5" class="text-right font-weight-bold">
                  {{ $t("fields.grandTotal") }}
                </td>
                <td class="font-weight-bold text-left px-3">
                  {{ grandTotal }}
                </td>
                <td></td>
              </tr>

              <!-- Total Paid -->
              <tr>
                <td :colspan="hasFieldPermission('sales.new-sales.discount') ? 6 : 5" class="text-right font-weight-bold">
                  {{ $t("fields.totalPaid") }}
                </td>
                <td class="font-weight-bold text-left">
                  <input v-shortkey.focus="['ctrl', 'alt', 'p']" v-model="formData.paidAmount" v-b-tooltip.hover title="Shotcut Press ' Ctrl+alt+p '" ref="total-paid" type="number" name="total-paid" placeholder="Enter Amount" class="form-control border-primary total_paid_input" />
                </td>
                <td></td>
              </tr>
              <!-- Total Due -->
              <tr>
                <td :colspan="hasFieldPermission('sales.new-sales.discount') ? 6 : 5" class="text-right font-weight-bold">
                  {{ $t("fields.totalDue") }}
                </td>
                <td class="font-weight-bold text-left px-3">
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

        <btn-primary v-shortkey="['ctrl', 'enter']" @shortkey.native="openCalculator()" :disabled="!hasProducts" v-b-tooltip.hover title="Shotcut Press ' Ctrl+Enter '" @click="openCalculator">
          {{ $t("buttons.submit") }}
        </btn-primary>
      </template>

      <!-- ///////////////////////// -->
      <!-- print and submit modal -->
      <modal-control title="Invoice Print & PDf" v-model="openCalculateModal">
        <template #body>
          <div class="row">
            <div class="col-4">
              <input-control :value="grandTotal" readonly :label="$t('fields.grandTotal')" inModal stack></input-control>
            </div>
            <div class="col-4">
              <input-control readonly :value="totalDue" :label="$t('fields.dueAmount')" inModal stack></input-control>
            </div>
            <div class="col-4">
              <input-control stack inModal readonly v-model="formData.paidAmount" :label="$t('fields.paidAmount')"></input-control>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <form @submit.prevent="save">
                <input-control stack inModal focus ref="receivedAmount" v-model="receivedAmount" @input="onReceivedAmount" :label="$t('fields.receivedAmount')"></input-control>
              </form>
            </div>
            <div class="col-6">
              <input-control stack inModal readonly v-model="getChange" :label="$t('fields.exchange')"></input-control>
            </div>
          </div>
          <div class="col-2" v-if="!show_note_field">
            <button class="btn btn-sm btn-info" @click.prevent="show_note_field = !show_note_field"><i class="fas fa-plus"></i> Note</button>
          </div>

          <div class="col-12">
            <input-control v-model="formData.note" v-if="hasFieldPermission('sales.new-sales.note') && show_note_field" :label="$t('fields.note')" inModal stack></input-control>
          </div>
        </template>
        <template #footer>
          <btn-success v-shortkey="['ctrl','alt', 's']" @shortkey.native="save($event,true)" :loading="savingState" @click="save($event, true)" v-b-tooltip.hover title="Shotcut Press ' Ctrl+alt+s '">
            <i class="fas fa-print"></i>
            {{ $t("buttons.printSubmit") }}
          </btn-success>

          <btn-success type="submit" :loading="savingState" @click="save">
            <i class="fas fa-check"></i>
            {{ $t("buttons.submit") }}
          </btn-success>

          <btn-danger :loading="savingState" @click="closeCalculator">
            <i class="fas fa-window-close"></i>
            {{ $t("buttons.cancel") }}
          </btn-danger>
        </template>
      </modal-control>

      <!-- /////////////////////////// -->
      <!-- New Customer Modal -->
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
        </template>
        <template #footer="{ hide }">
          <btn-secondary @click="hide()">Close</btn-secondary>
          <btn-primary :loading="customerSavingState" @click="saveNewCustomer">Save</btn-primary>
        </template>
      </modal-control>
      <!-- // End New Customer Modal \\ -->
    </form-view>
  </invoice-loading>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
import _ from "lodash";
export default {
  name: "create-sale-invoice",
  mixins: [validation],
  meta: {
    permission: "create-sale-invoices",
  },
  data() {
    return {
      // customers and charges came from asyncData
      show_note_field: false,
      customers: [],
      charges: [],
      batches: [],
      initialData: null,
      discount: 0,
      discountType: "%",
      total_discount_amount: 0.0,

      focusIndex: 0,

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
          discountType: "%",
          amount: 0,
        },
      },
      saleItems: [],

      // Form data to send
      formData: {
        date: this.$moment(new Date()).format("YYYY-MM-DD"),
        dueDate: this.$moment(new Date()).format("YYYY-MM-DD"),
        paidAmount: "",
        paymentMethod: "cash",
        customerId: null,
        totalDiscount: 0,
        note: "",
        discountType: "%",
        subTotal: 0,
      },
      receivedAmount: null,
      openCustomerModal: false,
      openCalculateModal: false,
      customerForm: {
        name: "",
        mobile: "",
        email: "",
        address: "",
      },

      fetchingProducts: null,
      searchingCustomers: false,

      savingState: false,
      customerSavingState: false,
    };
  },
  computed: {
    ...mapGetters({
      appSettings: "config/getApplicationSetting",
      paymentMethods: "config/getPaymentMethods",
      discountTypes: "config/getDiscountTypes",
    }),
    // Check for any product selected
    hasProducts() {
      return this.saleItems.some((sale) => sale.batch);
    },

    // Default Customer
    defaultCustomer() {
      return this.appSettings?.data?.defaultCustomer;
    },
    /**
     * Get Change
     */
    getChange() {
      const change = this.receivedAmount - this.formData.paidAmount;
      return change > 0 ? change : 0;
    },
    /**
     * Calculate total discount
     */
    // totalDiscount() {
    //   return this.saleItems
    //     .map(({ data }) => {
    //       const discount = parseFloat(data.discount || "0");
    //       let total = 0;
    //       if (data.discountType == "%") {
    //         total = (data.rate * data.quantity * data.discount) / 100;
    //       } else {
    //         total += discount;
    //       }
    //       return total;
    //     })
    //     .reduce((total, current) => (total += current), 0);
    // },
    /**
     * Calculate Grand Total
     */
    grandTotal() {
      return this.hasProducts
        ? (
            this.subTotal +
            this.totalCharge -
            this.total_discount_amount
          ).toFixed(2)
        : 0;
    },

    /**
     * Calculate Sub total
     */
    subTotal() {
      return this.saleItems
        .map((item) => parseFloat(item.data.amount || "0"))
        .reduce((total, current) => (total += current), 0);
    },
    /**
     * Calculate Total Charge
     */
    totalCharge() {
      return this.charges
        .map((charge) => parseFloat(this.calculateCharge(charge)))
        .reduce((total, current) => total + current, 0);
    },

    // /**
    //  * Calculate total due
    //  */
    totalDue() {
      return (
        parseFloat(this.grandTotal) -
        parseFloat(this.formData.paidAmount || "0")
      ).toFixed(2);
    },

    // discount calculate grand total amount
    calculateTotalDiscount() {
      var total = 0;
      if (this.discount != "0" && this.discountType != "") {
        if (this.discountType == "%") {
          total =
            parseFloat(
              this.discount * parseFloat(this.subTotal + this.totalCharge)
            ) / 100;
        } else {
          total = this.discount;
        }
      }
      this.total_discount_amount = total.toFixed(2);
      this.formData.totalDiscount = total.toFixed(2);

      return total.toFixed(2);
    },
  },
  methods: {
    /**
     * Focus Quantity field
     * key: Ctrl + alt + q
     */
    focusQuantityField(e) {
      this.$refs.quantity[this.focusIndex].focus();

      if (this.focusIndex + 1 >= this.saleItems.length) {
        this.focusIndex = 0;
      } else {
        this.focusIndex++;
      }
    },
    /**
     * When Received Amount
     */
    onReceivedAmount(val) {
      // if (val > 0 && val <= this.grandTotal) this.formData.paidAmount = val;
      // if (val > this.grandTotal) this.formData.paidAmount = this.grandTotal;
    },
    /**
     * Open calculator when submit
     */
    openCalculator() {
      // this.$refs["calculator-modal"].show();
      if (this.grandTotal) {
        // this.receivedAmount = this.formData.paidAmount
        this.openCalculateModal = true;
      }
    },
    /**
     * close calculator when cancel button click
     */
    closeCalculator() {
      this.openCalculateModal = false;
    },
    /**
     * Calculate Charge
     */
    calculateCharge(charge) {
      let total = 0;
      if (charge.type == "%") {
        total = (this.subTotal * charge.amount) / 100;
      } else {
        total += charge.amount;
      }
      return total;
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
          this.saleItems[index].batches = res.data.data;
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
      const filterdSelItems = this.saleItems
        .filter((item) => item.batch !== null)
        .map((item) => item.data);

      const filterdCharges = this.charges.map(({ id, amount }) => ({
        chargeId: id,
        chargeAmount: amount,
      }));

      this.formData.subTotal = this.subTotal;

      this.savingState = true;
      try {
        const response = await this.$axios.$post("/sale-invoices", {
          ...this.formData,
          saleItems: filterdSelItems,
          charges: filterdCharges,
          discountType: this.discountType,
          discount: this.discount,
          totalDiscountAmount: this.total_discount_amount,
        });

        this.$toast.success("Invoice created successfully.");
        if (createAndPrint) {
          this.$router.push(`/sale-invoices/${response.data.id}/print`);
        } else {
          this.reset();
          this.focusLastBatch();
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

        await this.fetchCustomers();
        // Select new created customer
        this.formData.customerId = res.data.id;

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
      this.openCalculateModal = false;

      this.formData = {
        date: new Date(),
        dueDate: new Date(),
        paidAmount: "",
        paymentMethod: "cash",
        customerId: this.defaultCustomer,
      };
      this.receivedAmount = null;
      this.saleItems = [{ ...this.item, data: { ...this.item.data } }];

      this.focusIndex = 0;
    },

    /**
     * Add new row to the table
     */
    addRow() {
      this.saleItems.push({ ...this.item, data: { ...this.item.data } });
      this.focusLastBatch();
    },

    /**
     * Remove row from the table
     */
    remove(index) {
      if (this.saleItems.length <= 1) return;

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
            this.focusIndex = 0;
            this.saleItems.splice(index, 1);
            this.focusLastBatch();
          }
        });
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

      // Check if the last item has selected or empty
      if (this.saleItems[this.saleItems.length - 1].batch) {
        this.addRow();
      }
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
    /**
     * Fetch Customers
     */
    async fetchCustomers() {
      try {
        // Fetch Customers
        const resCustomers = await this.$axios.get("/customers");
        this.customers = resCustomers.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Search Customer
     */
    searchCustomers: _.debounce(async function (val) {
      this.searchingCustomers = true;
      try {
        const res = await this.$axios.get(`/customers?search=${val}`);
        this.customers = res.data.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.searchingCustomers = false;
      }
    }, 300),
    /**
     * Get suggestion value for dynamic product search
     * This is similer to track value
     */
    getSuggestionValue(suggestion) {
      return `${suggestion.item.productName} - ${suggestion.item.name}`;
    },

    /**
     * Focus Last Batch input
     */
    focusLastBatch() {
      this.$nextTick(() => {
        const lastIndex = this.saleItems.length - 1;
        this.focusInput(lastIndex);
      });
    },
    focusInput(index = 0) {
      if (this.$refs.focusBatch[index].$el) {
        this.$refs.focusBatch[index].$el.focus();
      }
      // this.$refs?.focusBatch[index]?.$refs?.search?.focus();
    },
  },
  // Created Hook
  created() {
    this.initialData = { ...this.formData };
    this.addRow();
  },
  // Before destroy hook
  beforeDestroy() {
    this.$refs.focusBatch?.forEach((item) => {
      item.deactivate();
    });
  },

  // Fetch initial data
  async fetch() {
    await this.fetchCustomers();
    this.formData.customerId = this.defaultCustomer;

    const resCharges = await this.$axios.get("/charge/sale");
    this.charges = resCharges.data.data;
  },
};
</script>

<style lang="scss">
#calc_modal.modal-dialog {
  max-width: 555px;
}
.total_paid_input {
  border-width: 4px;
  height: 61px;
  width: 118px;
}
</style>
