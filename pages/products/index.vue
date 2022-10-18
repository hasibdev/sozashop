<template>
  <index-view>
    <template #title> {{ $t("products.label") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="
          hasPagePermission('products.add-product') &&
            (hasPermission('create-products') || hasRole('Admin'))
        " class="btn-primary" to="/products/create">
        {{ $t("buttons.add") }} {{ $t("products.label") }}
      </btn-link>
    </template>

    <!-- Data Table -->
    <template>
      <data-table @onCheck="onCheck" :columns="columns" url="/products" :filters="filters" :showIndex="true">

        <!-- Buttons -->
        <!-- <template #buttons>
					<button v-if="checkedList.length" @click="openCalculateModal" class="btn btn-success mx-2">Calculate</button>
				</template> -->

        <!-- Lens -->
        <template #lens>
          <b-dropdown variant="secondary" text="Lens" right>
            <b-dropdown-item v-if="checkedList.length" @click="openCalculateModal">
              Calculate
            </b-dropdown-item>

            <b-dropdown-item>
              <nuxt-link class="text-dark" :to="localePath('/products/most-selling')">Top Sales</nuxt-link>
            </b-dropdown-item>

            <b-dropdown-item>
              <nuxt-link class="text-dark" :to="localePath('/products/most-return')">Top Return</nuxt-link>
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

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <!-- Details -->
            <b-dropdown-item :to="localePath(`/products/${row.id}`)" v-if="
                hasPagePermission('products.product-detail') &&
                  (hasPermission('view-products') || hasRole('Admin'))
              "><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>

            <!-- Edit -->
            <b-dropdown-item :to="localePath(`/products/${row.id}/edit`)" v-if="
                hasPagePermission('products.edit-product') &&
                  (hasPermission('update-products') || hasRole('Admin'))
              "><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <!-- Barcode -->
            <b-dropdown-item :to="localePath(`/products/${row.id}/barcode`)">
              <i class="fas mr-1 fa-barcode text-dark"></i>
              Barcode
            </b-dropdown-item>

            <!-- Delete -->
            <b-dropdown-item @click="remove(row.id, index)" v-if="hasPermission('delete-products') || hasRole('Admin')">
              <i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>

      <!-- //////////////////////////// -->
      <!-- Calculate Modal -->
      <b-modal ref="calculate-modal" hide-footer title="Calculate">
        <div v-if="calculateData">
          <input-detail inModal :label="$t('fields.totalSell')" :value="calculateData.total_sell"></input-detail>
          <input-detail inModal :label="$t('fields.stockAmount')" :value="calculateData.total_cost"></input-detail>
          <input-detail inModal :label="$t('fields.stockProduct')" :value="calculateData.total_stock"></input-detail>
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

    </template>
  </index-view>
</template>

<script>
export default {
  name: "ProductsPage",
  meta: {
    permission: "view-any-products",
  },
  data() {
    return {
      columns: [
        {
          field: "name",
          permission: "products.manage-products.name",
        },
        {
          field: "categoryName",
          label: "category",
          permission: "products.manage-products.category",
        },
        {
          field: "code",
          permission: "products.manage-products.code",
        },
        {
          field: "storeIn",
          permission: "products.manage-products.store-in",
        },
        {
          field: "size",
          permission: "products.manage-products.size",
        },
        {
          field: "color",
          permission: "products.manage-products.color",
        },
        {
          field: "brand",
          permission: "products.manage-products.brand",
        },

        {
          field: "unitName",
          permission: "products.manage-products.unit",
        },
        {
          field: "purchaseUnits",
          permission: "products.manage-products.purchase-units",
        },
        {
          field: "sellingUnits",
          permission: "products.manage-products.selling-units",
        },
        {
          field: "totalQuantity",
          permission: "products.manage-products.total-quantity",
          sortable: false,
        },

        {
          field: "status",
          permission: "products.manage-products.status",
        },
      ],
      filters: {
        search: "",
        perPage: 25,
      },
      checkedList: [],
      calculateData: null,
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
  },
};
</script>

<style lang="scss" scoped></style>
