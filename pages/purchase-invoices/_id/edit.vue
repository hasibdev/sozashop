<template>
  <loading-view :loading="isLoading">
    <form-view v-if="invoice">
      <template #header> {{ $t("headings.purchaseInvoiceEdit") }} </template>

      <template>
        <!-- Suppliers -->
        <select-control :label="$t('fields.supplier')" v-model="invoice.supplierId" :options="suppliers" name="suppliers" track="id">
        </select-control>
        <!-- Invoice No -->
        <input-control v-model="invoice.invoiceNo" :label="$t('fields.invoiceNo')" :error="validationErrors.invoiceNo"></input-control>

        <!-- change Status -->
        <select-control :label="$t('fields.status')" v-model="invoice.status" :options="getStatus" name="invoice-status" track="value" v-if="hasFieldPermission('suppliers.edit-purchase-invoice.status')"></select-control>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" :to="`/purchase-invoices/${$route.params.id}`">{{ $t("buttons.cancel") }}</btn-link>
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
  name: "PruchaseInvoiceEdit",
  mixins: [validation],
  data() {
    return {
      invoice: null,
      suppliers: [],

      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$put(
          `/purchase-invoices/${this.$route.params.id}`,
          this.invoice
        );
        this.$toast.success("Purchase Invoice Update successfully.");
        if (!createAndContinue) {
          this.$router.push(
            this.localePath(`/purchase-invoices/${this.$route.params.id}`)
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      getStatus: "config/getInvoiceStatus",
    }),
  },
  async fetch() {
    const resInvoices = await this.$axios.get(
      `/purchase-invoices/${this.$route.params.id}`
    );

    const resSuppliers = await this.$axios.get("suppliers");

    this.invoice = resInvoices.data.data;
    this.suppliers = resSuppliers.data.data;

    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped></style>
