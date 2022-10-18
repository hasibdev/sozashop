<template>
  <form-view>
    <!-- Header -->
    <template #header> {{ $t("customers.title.add") }} </template>

    <!-- Default Content -->
    <template>
      <!-- Name -->
      <input-control focus v-model="formData.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
      <!-- Mobile -->
      <input-control v-model="formData.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile" type="tel"></input-control>
      <!-- Email -->
      <input-control v-model="formData.email" :label="$t('fields.email')" :error="validationErrors.email" type="email"></input-control>
      <!-- Address -->
      <text-control v-model="formData.address" :label="$t('fields.address')" :error="validationErrors.address" v-if="hasFieldPermission('customers.add-customer.address')"></text-control>

      <!-- Opening Balance -->
      <input-control v-model="formData.openingBalance" :label="$t('fields.openingBalance')" :error="validationErrors.openingBalance" type="number" v-if="hasFieldPermission('customers.add-customer.opening-balance')"></input-control>

      <!-- Password -->
      <input-control v-if="hasFieldPermission('customers.add-customer.password')" type="password" v-model="formData.password" :label="$t('fields.password')" :error="validationErrors.password"></input-control>
      <!-- confirm Password -->
      <input-control v-if="hasFieldPermission('customers.add-customer.password_confirmation')" type="password" v-model="formData.password_confirmation" :label="$t('fields.confirmdPass')"></input-control>
    </template>

    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" to="/customers">
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
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
  name: "create-customers",
  mixins: [validation],
  meta: {
    permission: "create-customers",
  },
  data() {
    return {
      formData: {
        name: "",
        mobile: "",
        email: "",
        address: "",
        openingBalance: "",
        password: "",
        password_confirmation: "",
      },
      initialData: null,

      savingState: false,
    };
  },

  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/customers", this.formData);
        this.$toast.success("Customer created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/customers"));
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.savingState = false;
      }
    },
    reset() {
      this.formData = { ...this.initialData };
    },
  },
  created() {
    this.initialData = { ...this.formData };
  },
};
</script>

<style lang="scss" scoped></style>
