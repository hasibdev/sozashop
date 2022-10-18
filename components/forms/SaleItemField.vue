<template>
  <tr>
    <!-- Product -->
    <td width="30%">
      <searchable-select
        v-model="saleItems.productId"
        :options="products"
        track="id"
        @input="getBatch"
      >
      </searchable-select>
    </td>

    <!-- Batch -->
    <td width="20%">
      <searchable-select
        v-model="batch"
        :options="batches"
        track="self"
        @input="handleBatchChange"
      >
      </searchable-select>
    </td>
    <!-- Rate -->
    <td>
      <input-control v-model="saleItems.rate" type="number" :readonly="true">
      </input-control>
    </td>
    <!-- Quantity -->
    <td>
      <input-control v-model="saleItems.quantity" type="number"> </input-control>
    </td>

    <!-- Unit -->
    <td>
      <input-control :value="unit" type="text" :readonly="true"> </input-control>
    </td>
    <!-- Amount -->
    <td>
      <input-control type="number" :value="amount"></input-control>
    </td>
    <td>
      <slot name="action"></slot>
    </td>
  </tr>
</template>

<script>
export default {
  name: "sale-item-field",
  props: {
    value: {
      type: [Array, Object],
      default: () => {}
    },
  },
  data() {
    return {
      products: [],
      batches: [],
      batch: null,
      unit: null,
      saleItems: {
        productId: null,
        batchId: null,
        rate: 0,
        quantity: 1,
        unitId: null,
      },
    };
  },
  computed: {
    /**
     * Calcuate total amount
     */
    amount() {
      return parseFloat(this.saleItems.quantity) * parseFloat(this.saleItems.rate)
    }
  },
  methods: {
    /**
     * Get the batch on product change
     */
    async getBatch() {
      const res = await this.$axios.$get(
        `/batches?product=${this.saleItems.productId}`
      );
      this.batches = res.data;
    },

    /**
     * Handle batch change and set other values
     */
    handleBatchChange(){
      // Set batch
      this.saleItems.batchId = this.batch.id
      // Set Rate
      this.saleItems.rate = this.batch.sellingRate
      // Set Unit
      this.saleItems.unitId = this.batch.unit.id
      this.unit = this.batch.unit.name
    }
  },
  created () {
    this.saleItems = this.value;
  },
  async fetch() {
    // Fetch Products
    const resProducts = await this.$axios.$get("/products");
    this.products = resProducts.data;
  },
};
</script>

<style lang="scss" scoped>
</style>
