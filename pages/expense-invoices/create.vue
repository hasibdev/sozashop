<template>
  <loading-view :loading="$fetchState.pending">
    <form-view>
      <template #header> {{ $t("expenseInvoices.title.add") }} </template>
      <template>
        <!-- MFG Date -->
        <date-control v-model="formData.date" :label="$t('fields.date')" :error="validationErrors.date"></date-control>

        <!-- Category -->
        <select-control :label="$t('fields.expenseType')" :options="categories" name="expense-category" v-model="formData.expenseCategoryId" :error="validationErrors.expenseCategoryId">
          <template #icon-right>
            <button class="btn btn-primary ml-1 d-flex align-items-center justify-content-center" @click="openCategoryModal = true">
              <i class="ti-plus"></i>
            </button>
          </template>
        </select-control>

        <!-- Payment Select -->
        <select-control track="value" :label="$t('fields.paymentMethod')" :options="paymentMethods || []" v-model="formData.paymentMethod" :error="validationErrors.paymentMethod" v-if="
            hasFieldPermission('expenses.add-expenses-invoice.payment-method')
          ">
        </select-control>

        <!-- Dynamic Inputs -->
        <div class="mt-5">
          <dynamic-field :fields="fields" v-model="formData.expenseItems" errorName="expenseItems">
            <template #footer>
              <tr>
                <td class="font-weight-bold text-right" colspan="1">
                  {{ $t("fields.total") }}
                </td>
                <td class="font-weight-bold text-left px-4">{{ total }}</td>
                <td></td>
              </tr>
              <tr>
                <td class="font-weight-bold text-right" colspan="1">
                  {{ $t("fields.paidAmount") }}
                </td>
                <td class="font-weight-bold text-left px-3">
                  <input-control :error="validationErrors.paidAmount" type="number" v-model="formData.paidAmount" clearonfocus>
                  </input-control>
                </td>
                <td></td>
              </tr>
              <tr>
                <td class="font-weight-bold text-right" colspan="1">
                  {{ $t("fields.totalDue") }}
                </td>
                <td class="font-weight-bold text-left px-4">
                  {{ total - parseFloat(formData.paidAmount || "0") }}
                </td>
                <td></td>
              </tr>
            </template>
          </dynamic-field>
        </div>

        <!-- //////////////////////////////////// -->
        <!-- Add Category Modal -->
        <modal-control title="Add Category" v-model="openCategoryModal">
          <!-- Modal title -->
          <template #title></template>
          <!-- Modal Body Content -->
          <template #body>
            <input-control focus :label="$t('fields.name')" v-model="categoryModal.name" :error="validationErrors.name" stack></input-control>

            <div class="form-group">
              <label for="category-description">{{
                $t("fields.description")
              }}</label>
              <textarea rows="5" v-model="categoryModal.description" class="form-control" id="category-description"></textarea>
            </div>
          </template>
          <!-- Modal Footer Content -->
          <template #footer="{ hide }">
            <button @click="hide()" class="btn btn-secondary">Close</button>
            <button @click="saveCategoryModal" class="btn btn-primary">
              Save
            </button>
          </template>
        </modal-control>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/expense-invoices">
          {{ $t("buttons.cancel") }}
        </btn-link>
        <btn-success :loading="savingState" @click="save($event, true)">
          {{ $t("buttons.submitPrint") }}
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
  name: "create-expense-invoice",
  mixins: [validation],
  meta: {
    permission: "create-expense-invoices",
  },
  data() {
    return {
      categories: [],
      formData: {
        expenseCategoryId: "",
        date: new Date(),
        expenseItems: [{ description: "", amount: 0 }],
        paymentMethod: "cash",
        paidAmount: 0,
      },
      fields: [
        {
          name: "description", //For v-model
          component: "input-control", // Render component type
          value: "", // Initial value
          listen: true,
          props: {
            type: "text",
          },
        },
        {
          name: "amount", //For v-model
          component: "input-control", // Render component type
          value: 0, // Initial value
          props: {
            type: "number",
            clearonfocus: true,
          },
        },
      ],
      openCategoryModal: false,
      categoryModal: {
        name: "",
        description: "",
      },
      initialData: null,

      savingState: false,
    };
  },
  computed: {
    ...mapGetters({
      paymentMethods: "config/getPaymentMethods",
    }),
    /**
     * Calculate the item total
     */
    total() {
      return this.formData.expenseItems
        .map((item) => parseFloat(item["amount"] || "0"))
        .reduce((total, current) => (total += current), 0);
    },
  },
  methods: {
    async save(event, createAndPrint = false) {
      this.savingState = true;
      try {
        const response = await this.$axios.$post(
          "/expense-invoices",
          this.formData
        );
        this.$toast.success("Invoice created successfully.");
        if (createAndPrint) {
          this.$router.push(`/expense-invoices/${response.data.id}/print`);
        } else {
          this.$router.push(this.localePath("/expense-invoices"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    async saveCategoryModal() {
      try {
        await this.$axios.$post("/expense-categories", this.categoryModal);
        this.$toast.success("Category created successfully.");
        // Fetch New Category
        this.fetchExpenseCategory();
        // Reset
        this.categoryModal.name = "";
        this.categoryModal.description = "";
        this.openCategoryModal = false;
      } catch (error) {
        console.log(error);
      }
    },
    reset() {
      this.formData = { ...this.initialData };
    },
    async fetchExpenseCategory() {
      const res = await this.$axios.get("/expense-categories-list");
      this.categories = res.data.data;
    },
  },

  created() {
    this.initialData = { ...this.formData };
  },
  async fetch() {
    await this.fetchExpenseCategory();
  },
};
</script>

<style lang="scss" scoped></style>
