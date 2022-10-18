<template>
  <index-view>
    <loading-view :loading="isLoading">
      <detail-view v-if="product">
        <!-- Header -->
        <template #header>
          <h3 class="font-weight-normal mb-3">
            {{ $t("products.title.details") }} : {{ product.name }}
          </h3>

          <action-dropdown :split="false" variant="primary" iconVariant="light">
            <b-dropdown-item v-if="hasActionPermission('products.product-detail.history')" :to="localePath(`/products/${product.id}/history`)">
              <i class="far fa-eye text-info mr-2"></i> History
            </b-dropdown-item>

            <b-dropdown-item v-if="
              hasPagePermission('products.edit-product') &&
              (hasPermission('update-products') || hasRole('Admin'))
            " :to="localePath(`/products/${product.id}/edit`)">
              <i class="far fa-edit text-primary mr-2"></i> Edit
            </b-dropdown-item>

            <b-dropdown-item v-if="hasPermission('delete-products') || hasRole('Admin')" @click="remove()">
              <i class="far fa-trash-alt text-danger mr-2"></i> Delete
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Default slot -->
        <template>
          <card>
            <image-detail :label="$t('fields.image')" :value="product.imageUrl" v-if="hasFieldPermission('products.product-detail.product-image')"></image-detail>
            <!-- Name -->
            <input-detail :label="$t('fields.name')" :value="product.name" v-if="hasFieldPermission('products.product-detail.name')" />
            <!-- Code -->
            <input-detail :label="$t('fields.code')" :value="product.code || '-'" v-if="hasFieldPermission('products.product-detail.code')" />
            <!-- Store in -->
            <input-detail :label="$t('fields.storeIn')" :value="product.storeIn || '-'" v-if="hasFieldPermission('products.product-detail.store-in')" />
            <!-- Size -->
            <input-detail :label="$t('fields.size')" :value="product.size || '-'" v-if="hasFieldPermission('products.product-detail.size')" />
            <!-- Color -->
            <input-detail :label="$t('fields.color')" :value="product.color || '-'" v-if="hasFieldPermission('products.product-detail.color')" />
            <!-- Unit -->
            <input-detail :label="$t('fields.unit')" :value="product.unit.name" v-if="hasFieldPermission('products.product-detail.unit')" />
            <!-- Category -->
            <input-detail :label="$t('fields.category')" :value="product.category.name" v-if="hasFieldPermission('products.product-detail.category')" />
            <!-- total purchase amount -->
            <input-detail :label="$t('fields.totalPurchaseAmount')" :value="product.totalPurchaseAmount" />
            <!-- Brand -->
            <input-detail :label="$t('fields.brand')" :value="product.brand || '-'" v-if="hasFieldPermission('products.product-detail.brand')" />
            <!-- Purchase Unit -->
            <input-detail :label="$t('fields.purchaseUnits')" :value="product.purchaseUnits" v-if="hasFieldPermission('products.product-detail.purchase-units')">
              <template #default="{ value }">
                {{ value.map((val) => val.name).join(", ") }}
              </template>
            </input-detail>
            <!-- Selling Unit -->
            <input-detail :label="$t('fields.sellingUnits')" :value="product.sellingUnits" v-if="hasFieldPermission('products.product-detail.selling-units')">
              <template #default="{ value }">
                {{ value.map((val) => val.name).join(", ") }}
              </template>
            </input-detail>

            <input-detail :label="$t('fields.totalQuantity')" :value="product.totalQuantity" v-if="hasFieldPermission('products.product-detail.total-quantity')" />
            <input-detail :label="$t('fields.alertQuantity')" :value="product.alertQuantity" v-if="hasFieldPermission('products.product-detail.alert-quantity')" />
            <input-detail :label="$t('fields.status')" v-if="hasFieldPermission('products.product-detail.status')">
              <badge :value="product.status"></badge>
            </input-detail>
          </card>
        </template>
      </detail-view>

      <div>
        <h3 class="font-weight-normal">
          {{ $t("headings.batches") }}
        </h3>

        <div class="d-flex justify-content-between">
          <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
        </div>
      </div>

      <data-table :key="tableKey" :columns="columns" url="/batches" :showIndex="true" :filters="filters">
        <!-- Action Slot -->
        <template v-slot:action="{ row }">
          <!-- Edit -->
          <!-- <btn-icon-link
          :to="`/products/${$route.params.id}/batches/${row.id}/edit`"
        >
          <i class="far fa-edit text-primary px-3"></i>
        </btn-icon-link> -->

          <!-- Delete -->
          <!-- <btn-icon @click="remove(row.id, index)">
          <i class="far fa-trash-alt text-danger"></i>
        </btn-icon> -->
          <!-- Action Slot -->

          <action-dropdown>

            <!-- add stock -->
            <b-dropdown-item @click="onTableActionClick(row)" v-if="hasActionPermission('products.manage-batch.batch-stock-quantity')">
              <i class="ti-plus mr-1 text-info"></i> Add Stock
            </b-dropdown-item>
            <!-- add stock -->
            <b-dropdown-item v-if="hasActionPermission('products.manage-batch.edit-batch-sellingRate')" @click="onTableActionClickBatch(row)">
              <i class="far fa-edit mr-1 text-info"></i> Edit
            </b-dropdown-item>

          </action-dropdown>

        </template>
        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>
        </template>
      </data-table>

    </loading-view>

    <!-- Add Stock Modal -->
    <modal-control size="lg" title="Add Stock" @hide="closeModal" v-model="isModalOpen">

      <template #body>

        <!-- Quantity -->
        <input-control focus v-model="stokForm.quantity" :label="$t('fields.quantity')" :error="validationErrors.quantity" type="number"></input-control>

        <!-- Generate Invoice -->
        <checkbox-control v-model="stokForm.generateInvoice" :label="$t('fields.generateInvoice')" name="generate-invoice" @input="onChangeGenerateInvoice">
        </checkbox-control>

        <template v-if="stokForm.generateInvoice">
          <!-- Date -->
          <date-control v-model="stokForm.date" :label="$t('fields.date')" :error="validationErrors.date"></date-control>
          <!-- Invoice No -->
          <input-control focus v-model="stokForm.invoiceNo" :label="$t('fields.invoiceNo')" :error="validationErrors.invoiceNo"></input-control>
          <!-- Suppliers -->
          <select-control v-model="stokForm.supplierId" :label="$t('fields.supplier')" :options="supplierOptions" track="id" :error="validationErrors.supplierId"></select-control>
        </template>

      </template>
      <template #footer>
        <button @click="closeModal" class="btn btn-secondary">{{$t('buttons.close')}}</button>
        <btn-primary :loading="savingState" @click="saveStock" class="btn btn-primary">
          {{$t('buttons.submit')}}
        </btn-primary>
      </template>
    </modal-control>
    <!-- Edit Batch Modal -->
    <modal-control size="lg" title="Edit Batch" @hide="closeModalBatch" v-model="isModalOpenBatch">
      <template #body>
        <!-- Quantity -->
        <input-control focus v-model="batchEdit.sellingRate" :label="$t('fields.sellingRate')" :error="validationErrors.sellingRate" type="number"></input-control>

      </template>
      <template #footer>
        <button @click="closeModalBatch" class="btn btn-secondary">{{$t('buttons.close')}}</button>
        <btn-primary :loading="editStateBatch" @click="saveBatch" class="btn btn-primary">
          {{$t('buttons.submit')}}
        </btn-primary>
      </template>
    </modal-control>
  </index-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
  name: "ProductDetails",
  mixins: [validation],
  meta: {
    permission: "view-products",
  },
  data() {
    return {
      isModalOpen: false,
      isModalOpenBatch: false,
      tableKey: 1,
      product: null,

      columns: [
        {
          field: "name",
          permission: "products.manage-batch.name",
        },
        {
          field: "unitName",
          label: "unitName",
          permission: "products.manage-batch.unitName",
        },
        {
          field: "quantity",
          permission: "products.manage-batch.quantity",
        },
        {
          field: "purchaseRate",
          permission: "products.manage-batch.purchaseRate",
        },
        {
          field: "sellingRate",
          permission: "products.manage-batch.sellingRate",
        },
        {
          field: "totalSellingRate",
          permission: "products.manage-batch.totalSellingRate",
        },
        {
          field: "totalSale",
          permission: "products.manage-batch.totalSale",
        },

        {
          field: "profit",
          permission: "products.manage-batch.profit",
        },
        {
          field: "mfgDate",
          permission: "products.manage-batch.mfgDate",
        },
        {
          field: "expDate",
          permission: "products.manage-batch.expDate",
        },
      ],

      filters: {
        search: "",
        perPage: 25,

        product: this.$route.params.id,
      },
      stokForm: {
        date: new Date(),
        invoiceNo: "",
        productId: "",
        quantity: "",
        supplierId: "",
        generateInvoice: false,
        batchId: "",
      },
      batchEdit: {
        productId: "",
        batchId: "",
      },
      supplierOptions: [],
      savingState: false,
      editStateBatch: false,
    };
  },
  methods: {
    remove() {
      this.removeResource({
        apiUrl: `/products/${this.$route.params.id}`,
        redirectUrl: "/products",
      });
    },
    onTableActionClick(batch) {
      this.openModal();
      this.fetchSuppliers();
      this.stokForm.batchId = batch.id;
      this.stokForm.productId = batch.productId;
    },
    onTableActionClickBatch(batch) {
      this.openModalBatch();
      this.fetchSuppliers();
      this.batchEdit.batchId = batch.id;
      this.batchEdit.productId = batch.productId;
    },
    async fetchSuppliers() {
      const resSuppliers = await this.$axios.get("/suppliers");
      this.supplierOptions = resSuppliers.data.data;
    },
    openModal() {
      this.isModalOpen = true;
    },
    openModalBatch() {
      this.isModalOpenBatch = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.reset();
    },
    closeModalBatch() {
      this.isModalOpenBatch = false;
      this.batchEdit.sellingRate = "";
    },
    async saveStock() {
      this.savingState = true;
      try {
        await this.$axios
          .post("/purchase-items/stock/batch", this.stokForm)
          .then((res) => {
            this.$toast.success("Stock created successfully.");
            this.closeModal();
            this.tableKey++;
            this.fetchProduct();
          });
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    async saveBatch() {
      this.savingState = true;
      try {
        await this.$axios
          .post("/purchase-items/edit/batch", this.batchEdit)
          .then((res) => {
            this.$toast.success("Batch Updated successfully.");
            this.closeModalBatch();
            this.tableKey++;
            this.fetchProduct();
          });
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
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
    reset() {
      this.stokForm = {
        date: new Date(),
        invoiceNo: "",
        productId: "",
        quantity: "",
        supplierId: "",
        generateInvoice: false,
        batchId: "",
      };
    },
    async fetchProduct() {
      const resProduct = await this.$axios.get(
        `/products/${this.$route.params.id}`
      );
      this.product = resProduct.data.data;
    },
  },

  async fetch() {
    await this.fetchProduct();
    // disable loading
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped></style>
