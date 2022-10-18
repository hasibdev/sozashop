<template>
  <loading-view :loading="$fetchState.pending">
    <form-view>
      <!-- Header slot -->
      <template #header> {{ $t("products.title.add") }} </template>

      <!-- Default slot -->
      <template>
        <!-- Name -->
        <input-control :placeholder="$t('placeholder.yourProductName')" focus v-model="form.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
        <!-- Code -->
        <input-control :placeholder="$t('placeholder.yourUniqueNumber')" v-model="form.code" :label="$t('fields.code')" :error="validationErrors.code" v-if="hasFieldPermission('products.add-product.code')"></input-control>
        <!-- Store in -->
        <input-control :placeholder="$t('placeholder.whereProductwillbeStore')" v-model="form.storeIn" :label="$t('fields.storeIn')" :error="validationErrors.storeIn" v-if="hasFieldPermission('products.add-product.store-in')"></input-control>
        <!-- Size -->
        <input-control :placeholder="$t('placeholder.sizeOfThisProduct')" v-model="form.size" :label="$t('fields.size')" :error="validationErrors.size" v-if="hasFieldPermission('products.add-product.size')"></input-control>
        <!-- color -->
        <input-control :placeholder="$t('placeholder.colorOfThisProduct')" v-model="form.color" :label="$t('fields.color')" :error="validationErrors.color" v-if="hasFieldPermission('products.add-product.color')"></input-control>

        <!-- Category select -->
        <select-control v-model="form.categoryId" :label="$t('fields.category')" :options="categoryOptions" track="id" :error="validationErrors.categoryId">
          <template #icon-right>
            <button class="btn btn-primary ml-1 d-flex align-items-center justify-content-center" @click="openCategoryModal = true">
              <i class="ti-plus"></i>
            </button>
          </template>
        </select-control>

        <!-- Batch -->
        <input-tags :placeholder="$t('placeholder.enterYourBatch')" v-model="form.batches" :options="batchOptions" :label="$t('fields.batchNo')" :error="validationErrors.batches"></input-tags>
        <!-- Brand -->
        <input-control :placeholder="$t('placeholder.productBrandName')" v-model="form.brand" :label="$t('fields.brand')" :error="validationErrors.brand" v-if="hasFieldPermission('products.add-product.brand')"></input-control>
        <!-- Purchase Rate -->
        <input-control :placeholder="$t('placeholder.yourBuyingPrice')" v-model="form.purchaseRate" :label="$t('fields.purchaseRate')" :error="validationErrors.purchaseRate" type="number"></input-control>
        <!-- Selling Rate -->
        <input-control :placeholder="$t('placeholder.salePriceForCustomer')" v-model="form.sellingRate" :label="$t('fields.sellingRate')" :error="validationErrors.sellingRate" type="number"></input-control>
        <!-- Opening Quantity -->
        <input-control :placeholder="$t('placeholder.howManyProductStore')" v-model="form.openingQuantity" :label="$t('fields.openingQuantity')" :error="validationErrors.openingQuantity" type="number"></input-control>
        <!-- Alert Quantity -->
        <input-control :placeholder="$t('placeholder.beNotifiedLow')" v-model="form.alertQuantity" :label="$t('fields.alertQuantity')" :error="validationErrors.alertQuantity" type="number" v-if="hasFieldPermission('products.add-product.alert-quantity')"></input-control>

        <!--  Unit -->
        <select-control v-model="form.unitId" :label="$t('fields.unit')" :options="unitOptions" track="id" :error="validationErrors.unitId" @input="onSelectUnit">
          <template #icon-right>
            <button class="btn btn-primary ml-1 d-flex align-items-center justify-content-center" @click="openUnitModal = true">
              <i class="ti-plus"></i>
            </button>
          </template>
        </select-control>

        <!-- Purchase Unit -->
        <multiselect-control :label="$t('fields.purchaseUnits')" v-model="form.purchaseUnits" :options="purchaseUnitOptions" track="unitId" title="unitName" :error="validationErrors.purchaseUnits" v-if="hasFieldPermission('products.add-product.purchase-units')">
        </multiselect-control>
        <!-- Selling Unit -->
        <multiselect-control :label="$t('fields.sellingUnits')" v-model="form.sellingUnits" :options="sellingUnitOptions" track="unitId" title="unitName" :error="validationErrors.sellingUnits" v-if="hasFieldPermission('products.add-product.selling-units')">
        </multiselect-control>

        <!-- MFG Date -->
        <date-control v-model="form.mfgDate" :label="$t('fields.mfgDate')" :error="validationErrors.mfgDate" v-if="hasFieldPermission('products.add-product.manufacture-date')"></date-control>
        <!-- Expire Date -->
        <date-control v-model="form.expDate" :label="$t('fields.expDate')" :error="validationErrors.expDate" v-if="hasFieldPermission('products.add-product.expire-date')"></date-control>
        <!-- Product Image -->
        <image-upload v-model="productImage" :error="validationErrors.photo" :label="$t('fields.productImage')" v-if="hasFieldPermission('products.add-product.product-image')"></image-upload>
        <!-- change Status -->
        <select-control :label="$t('fields.status')" v-model="form.status" :error="validationErrors.status" :options="getStatus" name="product-status" track="value" v-if="hasFieldPermission('products.add-product.status')"></select-control>

        <!-- Generate Invoice -->
        <checkbox-control v-model="form.generateInvoice" :label="$t('fields.generateInvoice')" name="generate-invoice" @input="onChangeGenerateInvoice" v-if="hasFieldPermission('products.add-product.generate-invoice')">
        </checkbox-control>

        <!-- Generate Invoice -->
        <template v-if="form.generateInvoice">
          <!-- Date -->
          <date-control v-if="hasFieldPermission('products.add-product.date')" v-model="form.date" :label="$t('fields.date')" :error="validationErrors.date"></date-control>
          <!-- Supplier -->
          <searchable-select :label="$t('fields.supplier')" :options="supplierOptions" v-model="form.supplierId" track="id" :error="validationErrors.supplierId">
            <template #icon-right>
              <button class="btn btn-primary ml-1 d-flex align-items-center justify-content-center" @click="openSupplierModal = true">
                <i class="ti-plus"></i>
              </button>
            </template>
          </searchable-select>
          <!-- Invoice No -->
          <autosuggest :disabled="!form.supplierId" :error="validationErrors.invoiceNo" :label="$t('fields.invoiceNo')" :suggestions="invoiceSuggestions" v-model="form.invoiceNo" @onSearch="fetchInvoices" v-if="hasFieldPermission('products.add-product.invoice-no')" placeholder="Invoice No"></autosuggest>
        </template>

        <!-- Add Category Modal -->
        <modal-control title="Add Category" v-model="openCategoryModal">
          <!-- Modal Body Content -->
          <template #body>
            <form @submit.prevent="saveCategoryModal">
              <input-control focus :label="$t('fields.name')" v-model="categoryModal.categoryName" :error="validationErrors.categoryName" stack></input-control>

              <div class="form-group" v-if="hasFieldPermission('categories.add-category.description')">
                <label for="category-description">
                  {{ $t("fields.description") }}
                </label>
                <textarea rows="5" v-model="categoryModal.description" class="form-control" id="category-description"></textarea>
              </div>

              <input type="submit" value="" class="d-none">
            </form>
          </template>
          <!-- Modal Footer Content -->
          <template #footer="{ hide }">
            <button @click="hide()" class="btn btn-secondary">{{$t('buttons.close')}}</button>
            <btn-primary :loading="categorySavingState" @click="saveCategoryModal">
              {{$t('buttons.submit')}}
            </btn-primary>
          </template>
        </modal-control>

        <!-- Add Unit Modal -->
        <modal-control title="Add Unit" v-model="openUnitModal">
          <!-- Modal Body Content -->
          <template #body>
            <form @submit.prevent="saveUnitModal">
              <input-control focus :label="$t('fields.unit')" v-model="unitModal.name" :error="validationErrors.name" stack></input-control>
              <!-- Don't need any code field -->
              <!-- <input-control :label="$t('fields.code')" v-model="unitModal.code" :error="validationErrors.code" stack></input-control> -->
              <input type="submit" value="" class="d-none">
            </form>
          </template>
          <!-- Modal Footer Content -->
          <template #footer="{ hide }">
            <button @click="hide()" class="btn btn-secondary">{{$t('buttons.close')}}</button>
            <btn-primary :loading="unitSavingState" @click="saveUnitModal">{{$t('buttons.submit')}}</btn-primary>
          </template>
        </modal-control>

        <!-- Add Supplier Modal -->
        <modal-control title="Add Supplier" v-model="openSupplierModal">
          <!-- Modal Body Content -->
          <template #body>
            <form @submit.prevent="saveSupplierModal">
              <!-- Name -->
              <input-control focus v-model="supplierModal.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
              <!-- Mobile -->
              <input-control v-model="supplierModal.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile" type="tel"></input-control>
              <!-- Telephone -->
              <input-control v-model="supplierModal.telephone" :label="$t('fields.telephone')" :error="validationErrors.telephone"></input-control>
              <!-- Email -->
              <input-control v-model="supplierModal.email" :label="$t('fields.email')" :error="validationErrors.email" type="email"></input-control>
              <!-- fax -->
              <input-control v-model="supplierModal.fax" :label="$t('fields.fax')" :error="validationErrors.fax"></input-control>
              <!-- Vat Number -->
              <input-control v-model="supplierModal.vatNumber" :label="$t('fields.vatNumber')" :error="validationErrors.vatNumber"></input-control>
              <!-- Opening Balance -->
              <input-control v-model="supplierModal.openingBalance" :label="$t('fields.openingBalance')" :error="validationErrors.openingBalance" type="number"></input-control>
              <!-- Status -->
              <select-control :label="$t('fields.status')" v-model="supplierModal.status" :options="getStatus ? getStatus : {}" name="supplier-status" track="value"></select-control>

              <input type="submit" value="" class="d-none">
            </form>
          </template>
          <!-- Modal Footer Content -->
          <template #footer="{ hide }">
            <button @click="hide()" class="btn btn-secondary">{{$t('buttons.close')}}</button>
            <btn-primary :loading="supplierSavingState" @click="saveSupplierModal">
              {{$t('buttons.submit')}}
            </btn-primary>
          </template>
        </modal-control>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/products">
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
import _ from "lodash";
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
  name: "create-product",
  meta: {
    permission: "create-products",
  },
  mixins: [validation],
  data() {
    return {
      openCategoryModal: false,
      openUnitModal: false,
      openSupplierModal: false,

      productImage: null,
      form: {
        name: "",
        code: "",
        storeIn: "",
        size: "",
        color: "",
        categoryId: "",
        batches: [],
        purchaseRate: "",
        sellingRate: "",
        openingQuantity: "",
        alertQuantity: "",
        unitId: "",
        purchaseUnits: [],
        unitAsPurchaseUnit: true,
        sellingUnits: [],
        unitAsSellingUnit: true,
        mfgDate: "",
        expDate: "",
        date: new Date(),
        invoiceNo: "",
        supplierId: null,
        generateInvoice: false,
        brand: "",
      },

      categoryModal: {
        categoryName: "",
        description: "",
      },
      unitModal: {
        name: "",
        code: "",
      },
      supplierModal: {
        name: "",
        mobile: "",
        telephone: "",
        email: "",
        fax: "",
        vatNumber: "",
        openingBalance: "",
        status: "",
      },
      batchOptions: [],
      categoryOptions: [],
      unitOptions: [],
      purchaseUnitOptions: [],
      sellingUnitOptions: [],
      supplierOptions: [],
      initialData: null,
      invoiceSuggestions: [],
      savingState: false,
      categorySavingState: false,
      unitSavingState: false,
      supplierSavingState: false,
    };
  },
  computed: {
    ...mapGetters({
      getStatus: "config/getStatus",
    }),
  },
  methods: {
    /**
     * Save the product
     */
    async save(event, createAndContinue = false) {
      const formData = new FormData();
      formData.append("photo", this.productImage);

      this.savingState = true;
      try {
        // Save Product
        const resProduct = await this.$axios.$post("/products", this.form);

        // Save Product image
        if (this.productImage) {
          await this.$axios.$post(
            `/products/${resProduct.data.id}/photo`,
            formData
          );
        }

        this.$toast.success("Product created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/products"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },

    /**
     * Fetch invoiceSuggestions
     */
    fetchInvoices: _.debounce(async function (value) {
      try {
        this.form.invoiceNo = value;
        const res = await this.$axios.$get(
          `/purchase-invoices?invoice=${value}&supplier=${this.form.supplierId}&status=draft`
        );
        this.invoiceSuggestions = res.data.map((inv) => inv.invoiceNo);
      } catch (error) {
        console.log(error);
      }
    }, 300),

    /**
     * Save the category
     */
    async saveCategoryModal() {
      this.categorySavingState = true;
      try {
        const resNewCategory = await this.$axios.post(
          "/categories",
          this.categoryModal
        );

        this.$store.dispatch("validation/clearErrors");
        // Fetch Categories Again with updated data
        await this.getCategoriesOptions();

        this.$toast.success("Category Added successfully");

        this.form.categoryId = resNewCategory.data.data.id;

        // Hide and clear modal
        this.openCategoryModal = false;
        this.categoryModal.name = "";
        this.categoryModal.description = "";
      } catch (error) {
        console.log(error);
      } finally {
        this.categorySavingState = false;
      }
    },

    /**
     * Save the unit
     */
    async saveUnitModal() {
      this.unitSavingState = true;
      try {
        const resUnit = await this.$axios.post("/units", {
          ...this.unitModal,
          code: this.unitModal.name,
        });

        this.$store.dispatch("validation/clearErrors");
        // Fetch Categories Again with updated data
        await this.fetchUnits();

        this.form.unitId = resUnit.data.data.id;

        this.$toast.success("Unit Added successfully");
        // Hide and clear modal
        this.openUnitModal = false;
        this.unitModal.name = "";
        this.unitModal.code = "";
      } catch (error) {
        console.log(error);
      } finally {
        this.unitSavingState = false;
      }
    },

    async saveSupplierModal() {
      this.supplierSavingState = true;
      try {
        const resSupplier = await this.$axios.$post(
          "/suppliers",
          this.supplierModal
        );
        this.$toast.success("Supplier created successfully.");

        // Fetch Suppliers Again
        await this.fetchSuppliers();
        this.form.supplierId = resSupplier.data.id;

        // Reset Form
        this.supplierModal.name = "";
        this.supplierModal.mobile = "";
        this.supplierModal.telephone = "";
        this.supplierModal.email = "";
        this.supplierModal.fax = "";
        this.supplierModal.vatNumber = "";
        this.supplierModal.openingBalance = "";
        this.supplierModal.status = "";

        // Close modal
        this.openSupplierModal = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.supplierSavingState = false;
      }
    },

    /**
     * Get available units
     */
    async fetchUnits() {
      try {
        const resUnit = await this.$axios.get("/units");
        this.unitOptions = resUnit.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Get the available unit conversions
     */
    async onSelectUnit(id) {
      if (!id) return;
      try {
        const res = await this.$axios.get(`/unit-conversions?baseUnit=${id}`);
        this.purchaseUnitOptions = res.data.data;
        this.sellingUnitOptions = res.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Handle generate invoice change
     */
    async onChangeGenerateInvoice(value) {
      if (value) {
        await this.fetchSuppliers();
      }
    },

    async fetchSuppliers() {
      try {
        const resSuppliers = await this.$axios.get("/get-suppliers");
        this.supplierOptions = resSuppliers.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Reset the form
     */
    reset() {
      this.form = {
        ...this.initialData,
      };
      this.productImage = null;
    },

    /**
     * Get the categoies
     */
    async getCategoriesOptions() {
      try {
        const resCategory = await this.$axios.get("/get-categories");
        this.categoryOptions = resCategory.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.initialData = { ...this.form };
  },

  /**
   * Get the initial categories and units
   */
  async fetch() {
    await this.getCategoriesOptions();
    await this.fetchUnits();
  },
};
</script>

<style lang="scss" scoped></style>
