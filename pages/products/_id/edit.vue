<template>
  <loading-view :loading="isLoading">
    <form-view>
      <template #header> {{ $t("products.title.edit") }} </template>

      <template v-if="form">
        <!-- Name -->
        <input-control v-model="form.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>

        <!-- Code -->
        <input-control v-model="form.code" :label="$t('fields.code')" :error="validationErrors.code" v-if="hasFieldPermission('products.edit-product.code')"></input-control>

        <!-- Store in -->
        <input-control :placeholder="$t('placeholder.whereProductwillbeStore')" v-model="form.storeIn" :label="$t('fields.storeIn')" :error="validationErrors.storeIn" v-if="hasFieldPermission('products.add-product.store-in')"></input-control>
        <!-- Size -->
        <input-control :placeholder="$t('placeholder.sizeOfThisProduct')" v-model="form.size" :label="$t('fields.size')" :error="validationErrors.size" v-if="hasFieldPermission('products.add-product.size')"></input-control>
        <!-- color -->
        <input-control :placeholder="$t('placeholder.colorOfThisProduct')" v-model="form.color" :label="$t('fields.color')" :error="validationErrors.color" v-if="hasFieldPermission('products.add-product.color')"></input-control>

        <!-- Category select -->
        <select-control v-model="form.categoryId" :label="$t('fields.category')" :options="categoryOptions" track="id" :error="validationErrors.categoryId"></select-control>

        <!-- select Unit -->
        <select-control v-model="form.unitId" :label="$t('fields.unit')" :options="unitOptions" track="id" :error="validationErrors.unitId" @input="onSelectUnit"></select-control>

        <!-- Brand -->
        <input-control v-model="form.brand" :label="$t('fields.brand')" :error="validationErrors.brand" v-if="hasFieldPermission('products.edit-product.brand')"></input-control>

        <!-- Purchase Unit -->
        <multiselect-control :label="$t('fields.purchaseUnits')" v-model="form.purchaseUnits" :options="purchaseUnitOptions" track="code" title="name" :error="validationErrors.purchaseUnits" v-if="hasFieldPermission('products.edit-product.purchase-units')"></multiselect-control>
        <!-- Selling Unit -->
        <multiselect-control :label="$t('fields.sellingUnits')" v-model="form.sellingUnits" :options="sellingUnitOptions" track="code" title="name" :error="validationErrors.sellingUnits" v-if="hasFieldPermission('products.edit-product.selling-units')"></multiselect-control>

        <!-- Product Image -->
        <image-upload v-model="productImage" :url="form.imageUrl" :error="validationErrors.photo" :label="$t('fields.productImage')" v-if="hasFieldPermission('products.edit-product.product-image')"></image-upload>

        <!-- change Status -->
        <select-control :label="$t('fields.status')" v-model="form.status" :options="getStatus" name="product-status" track="value" v-if="hasFieldPermission('products.edit-product.status')"></select-control>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/products">
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
  name: "EditProduct",
  mixins: [validation],
  meta: {
    permission: "update-products",
  },
  data() {
    return {
      form: null,
      batchOptions: [],
      categoryOptions: [],
      unitOptions: [],
      purchaseUnitOptions: [],
      sellingUnitOptions: [],
      initialData: null,

      productImage: null,

      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      const formData = new FormData();
      formData.append("photo", this.productImage);

      this.savingState = true;
      try {
        // Save Product
        const resProduct = await this.$axios.$put(
          `/products/${this.$route.params.id}`,
          {
            ...this.form,
            sellingUnits: this.form.sellingUnits.map((unit) => unit.id),
            purchaseUnits: this.form.purchaseUnits.map((unit) => unit.id),
          }
        );

        // Save Product image
        if (this.productImage) {
          await this.$axios.$post(
            `/products/${resProduct.data.id}/photo`,
            formData
          );
        }

        this.$toast.success("Product Updated successfully.");

        if (!createAndContinue) {
          this.$router.push(this.localePath("/products"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },

    async onSelectUnit(id) {
      if (!id) return;

      const res = await this.$axios.get(`/unit-conversions?baseUnit=${id}`);
      this.purchaseUnitOptions = res.data.data;
      this.sellingUnitOptions = res.data.data;
    },
  },
  computed: {
    ...mapGetters({
      getStatus: "config/getStatus",
    }),
  },
  async fetch() {
    const resProduct = await this.$axios.get(
      `/products/${this.$route.params.id}`
    );
    this.form = resProduct.data.data;

    const resCategory = await this.$axios.get("/categories");
    const resUnit = await this.$axios.get("/units");

    this.categoryOptions = resCategory.data.data;
    this.unitOptions = resUnit.data.data;
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped></style>
