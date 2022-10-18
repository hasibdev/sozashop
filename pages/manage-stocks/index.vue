<template>
  <index-view>
    <template #title> {{ $t("headings.manageStocks") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
    </template>

    <template>
      <data-table :key="tableKey" @onCheck="onCheck" :columns="columns" url="/products" :filters="filters">

        <!-- Lens -->
        <template #lens>
          <b-dropdown variant="secondary" text="Lens" right>
            <b-dropdown-item v-if="checkedList.length" @click="openCalculateModal">
              Calculate
            </b-dropdown-item>
          </b-dropdown>
        </template>

        <!-- Purchase Units -->
        <template #purchaseUnits="{col}">
          <span>{{ col.map(c => c.name).join(', ') }}</span>
        </template>
        <!-- Sellings Units -->
        <template #sellingUnits="{col}">
          <span>{{ col.map(c => c.name).join(', ') }}</span>
        </template>

        <!-- Action Slot -->
        <template v-slot:action="{ row }">
          <!-- Show  -->

          <action-dropdown>
            <b-dropdown-item :to="localePath(`/products/${row.id}`)">
              <i class="far mr-1 fa-share-square text-success"></i>
              Details
            </b-dropdown-item>
            <b-dropdown-item v-if="hasActionPermission('products.manage-stocks.add-stock')" @click="onTableActionClick(row)">
              <i class="ti-plus mr-1 text-info"></i> Add Stock
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>
        <!-- Filter slot -->
        <template #filter>
          <date-filter v-model="filters.dateRange"></date-filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>
    </template>

    <!-- //////////////////////////// -->
    <!-- Calculate Modal -->
    <b-modal ref="calculate-modal" hide-footer title="Calculate">
      <div v-if="calculateData">
        <input-detail inModal :label="$t('fields.totalSell')" :value="calculateData.total_sell"></input-detail>
        <input-detail inModal :label="$t('fields.totalCost')" :value="calculateData.total_cost"></input-detail>
        <input-detail inModal :label="$t('fields.totalStock')" :value="calculateData.total_stock"></input-detail>
      </div>
      <!-- Loading -->
      <div v-else class="d-flex justify-content-center">
        <b-spinner variant="primary" label="Spinning"></b-spinner>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer mt-3">
        <btn-primary :disabled="!calculateData" @click="downloadCalculate">Download</btn-primary>
      </div>
    </b-modal>

    <!-- //////////////////////////////// -->
    <!-- Add Stock Modal -->
    <modal-control size="lg" title="Add Stock" @hide="closeModal" v-model="isModalOpen">

      <template #body>

        <!-- Quantity -->
        <input-control focus v-model="stokForm.quantity" :label="$t('fields.quantity')" v-if="hasFieldPermission('products.add-stock.quantity')" :error="validationErrors.quantity" type="number"></input-control>
        <!-- Batch -->
        <input-tags v-model="stokForm.batches" :options="batchOptions" :label="$t('fields.batchNo')" :error="validationErrors.batches" v-if="hasFieldPermission('products.add-stock.batchNo')"></input-tags>
        <!-- Purchese Rate -->
        <input-control v-model="stokForm.purchaseRate" :label="$t('fields.purchaseRate')" :error="validationErrors.purchaseRate" v-if="hasFieldPermission('products.add-stock.purchaseRate')" type="number"></input-control>
        <!-- Selling Rate -->
        <input-control v-model="stokForm.sellingRate" :label="$t('fields.sellingRate')" :error="validationErrors.sellingRate" type="number" v-if="hasFieldPermission('products.add-stock.sellingRate')"></input-control>

        <!-- Unit -->
        <select-control v-model="stokForm.unitId" :label="$t('fields.unit')" :options="unitOptions" track="id" :error="validationErrors.unitId" v-if="hasFieldPermission('products.add-stock.unitId')"></select-control>
        <!-- MFG Date -->
        <date-control v-model="stokForm.mfgDate" :label="$t('fields.mfgDate')" :error="validationErrors.mfgDate" v-if="hasFieldPermission('products.add-stock.mfgDate')"></date-control>
        <!-- Expire Date -->
        <date-control v-model="stokForm.expDate" :label="$t('fields.expDate')" :error="validationErrors.expDate" v-if="hasFieldPermission('products.add-stock.expDate')"></date-control>

        <!-- Generate Invoice -->
        <checkbox-control v-model="stokForm.generateInvoice" :label="$t('fields.generateInvoice')" name="generate-invoice" @input="onChangeGenerateInvoice" v-if="hasFieldPermission('products.add-stock.generateInvoice')">
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
  </index-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
  name: "ManageStocks",
  mixins: [validation],
  meta: {
    permission: "can-add-product-stocks",
  },
  data() {
    return {
      tableKey: 1,
      isModalOpen: false,
      columns: [
        {
          field: "name",
          permission: "products.manage-stocks.name",
        },
        {
          field: "categoryName",
          label: "category",
          permission: "products.manage-stocks.category",
        },
        {
          field: "code",
          permission: "products.manage-stocks.code",
        },
        {
          field: "storeIn",
          permission: "products.manage-stocks.store-in",
        },
        {
          field: "size",
          permission: "products.manage-stocks.size",
        },
        {
          field: "color",
          permission: "products.manage-stocks.color",
        },
        {
          field: "brand",
          permission: "products.manage-stocks.brand",
        },
        {
          field: "purchaseUnits",
          permission: "products.manage-stocks.purchase-units",
        },
        {
          field: "sellingUnits",
          permission: "products.manage-stocks.selling-units",
        },
        {
          field: "totalQuantity",
          permission: "products.manage-stocks.total-quantity",
        },
        {
          field: "alertQuantity",
          permission: "products.manage-stocks.alert-quantity",
        },
      ],
      filters: {
        search: "",
        perPage: 25,
      },
      stokForm: {
        date: new Date(),
        invoiceNo: "",
        productId: "",
        batches: [],
        quantity: "",
        purchaseRate: "",
        sellingRate: "",
        unitId: "",
        supplierId: "",
        mfgDate: "",
        expDate: "",
        generateInvoice: false,
      },
      batchOptions: [],
      supplierOptions: [],
      unitOptions: [],

      checkedList: [],
      calculateData: null,
      initialData: null,

      savingState: false,
    };
  },
  methods: {
    // Generate Download URL
    getDownloadUrl(name) {
      const url = `/reports/batches/${name}?sort=id,des`;
      return `${url}&ids=${this.calculateData.batchIds}`;
    },
    // Download PDF
    downloadPdf() {
      this.fileDownload({
        url: this.getDownloadUrl("pdf"),
        fileType: "application/pdf",
        fileName: "products-calculate.pdf",
      });
    },
    // Download from calculate modal
    async downloadCalculate() {
      this.downloadPdf();
      this.$refs["calculate-modal"].hide();
    },
    // Open Calculate Modal
    async openCalculateModal() {
      this.$refs["calculate-modal"].show();
      this.calculateData = null;

      try {
        const res = await this.$axios.post("/products/calculate", {
          ids: this.checkedList,
        });
        this.calculateData = res.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    // Tigger when select or checked any data
    onCheck(val) {
      this.checkedList = val;
    },

    async saveStock() {
      this.savingState = true;
      try {
        await this.$axios.post("/purchase-items", this.stokForm);
        this.$toast.success("Stock created successfully.");
        this.closeModal();

        this.tableKey++;
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.reset();
    },
    onTableActionClick(product) {
      this.openModal();
      this.fetchSuppliers();

      this.unitOptions = product.purchaseUnits;
      this.stokForm.productId = product.id;
    },
    reset() {
      this.stokForm = { ...this.initialData, batches: [] };
    },
    async fetchSuppliers() {
      const resSuppliers = await this.$axios.get("/suppliers");
      this.supplierOptions = resSuppliers.data.data;
    },

    /**
     * Handle generate invoice change
     */
    async onChangeGenerateInvoice(value) {
      if (value) {
        await this.fetchSuppliers();
      }
    },
  },
  created() {
    this.initialData = { ...this.stokForm };
  },
};
</script>

<style lang="scss" scoped>
.modal-dialog {
  margin-top: 165px !important;
}
</style>
