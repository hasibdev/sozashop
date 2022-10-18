<template>
  <loading-view :loading="isLoading">
    <form-view v-if="item">
      <template #header> {{ $t("headings.purchaseItemEdit") }} </template>
      <template>
        <select-control
          :label="$t('fields.product')"
          v-model="item.productId"
          :options="products"
          name="products"
          track="id"
        >
        </select-control>
        <select-control
          :label="$t('fields.unit')"
          v-model="item.unitId"
          :options="units"
          name="units"
          track="id"
        >
        </select-control>
        <!-- amount -->
        <input-control
          v-model="item.amount"
          :label="$t('fields.amount')"
          :error="validationErrors.amount"
          type="number"
        ></input-control>
        <!-- Quantity -->
        <input-control
          v-model="item.quantity"
          :label="$t('fields.quantity')"
          :error="validationErrors.quantity"
          type="number"
        ></input-control>
        <!-- Rate -->
        <input-control
          v-model="item.rate"
          :label="$t('fields.rate')"
          :error="validationErrors.rate"
          type="number"
        ></input-control>
      </template>
      <!-- Action Buttons -->
      <template #footer>
        <btn-link
          class="btn-secondary"
          :to="`/purchase-invoices/${$route.params.id}`"
          >{{ $t("buttons.cancel") }}</btn-link
        >
        <btn-success @click="save($event, true)">
          {{ $t("buttons.updateContinue") }}
        </btn-success>
        <btn-primary @click="save">
          {{ $t("buttons.update") }}
        </btn-primary>
      </template>
    </form-view>
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
  name: "EditPurchaseItem",
  mixins: [validation],
  data() {
    return {
      item: null,
      products: [],
      units: []
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      try {
        await this.$axios.$put(
          `/purchase-items/${this.$route.params.item}`,
          this.item
        );
        this.$toast.success("Purchase Item Update successfully.");
        if (!createAndContinue) {
          this.$router.push(
            this.localePath(`/purchase-invoices/${this.$route.params.id}`)
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  async fetch() {
    const resItem = await this.$axios.get(
      `/purchase-items/${this.$route.params.item}`
    );

    const resProducts = await this.$axios.get("/products");
    const resUnits = await this.$axios.get("/units");

    this.products = resProducts.data.data;
    this.units = resUnits.data.data;
    this.item = resItem.data.data;
    this.isLoading = false;
  }
};
</script>

<style lang="scss" scoped></style>
