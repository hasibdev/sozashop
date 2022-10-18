<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view>
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("barcode.title.details") }} :
        </h3>
        <div>
          <!-- Print Barcode -->
          <button @click="$htmlToPaper('print_area')" class="btn btn-success waves-effect waves-light" v-if="selectedBatch">
            <i class="fas fa-print"></i> Print Barcode
          </button>
          <!-- Generate PDF -->
          <button v-if="selectedBatch" @click.prevent="generateReport" class="btn btn-info waves-effect waves-light">
            Generate Pdf
          </button>
        </div>
      </template>

      <template>
        <div class="row">
          <div class="col-md-8">
            <searchable-select stack track="self" label="Select Batch" :options="batches" @input="whenSelectBatch">
            </searchable-select>
          </div>
          <div class="col-md-4">
            <input-control class="mt-1" stack type="number" label="Total barcode" v-model="totalBarcode">
            </input-control>
          </div>
        </div>
        <client-only>
          <vue-html2pdf v-if="selectedBatch" :show-layout="true" :float-layout="false" :enable-download="false" :preview-modal="true" :paginate-elements-by-height="0" filename="hee hee" :pdf-quality="2" :manual-pagination="true" pdf-format="a4" pdf-orientation="portrait" pdf-content-width="100%" ref="html2Pdf">
            <card slot="pdf-content" id="print_area">
              <div class="barcode-grid pt-3 pb-4">
                <div class="bar-col text-center" v-for="col in parseInt(totalBarcode)" :key="col">
                  <p class="mb-0 lead">{{ selectedBatch.product.name }}</p>
                  <p class="mb-0">{{ selectedBatch.name }}</p>
                  <barcode :value="selectedBatch.product.name+'|'+selectedBatch.name " background="transparent" :display-value="false" width="1" height="45">
                  </barcode>

                  <h6 class="mb-0">Price: {{ selectedBatch.sellingRate }}</h6>
                </div>
              </div>
            </card>
          </vue-html2pdf>
        </client-only>
      </template>
    </detail-view>
  </loading-view>
</template>

<script>
import barcode from "vue-barcode";
export default {
  name: "ProductBarcode",
  components: {
    barcode: barcode,
  },
  data() {
    return {
      batches: [],
      selectedBatch: null,
      totalBarcode: 60,
    };
  },
  computed: {
    countRow() {
      return Math.floor(parseInt(this.totalBarcode) / 4);
    },
  },
  methods: {
    whenSelectBatch(batch) {
      this.selectedBatch = batch;
    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
  async fetch() {
    const resBatches = await this.$axios.get(
      `/batches?product=${this.$route.params.id}`
    );
    this.batches = resBatches.data.data;
  },
};
</script>

<style lang="scss">
.barcode-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 5px;
  row-gap: 24px;
}
</style>
