<template>
  <loading-view :loading="$fetchState.pending">
    <form-view>
      <template #header> {{ $t("staffs.title.add") }} </template>
      <template>
        <!-- Image -->
        <image-upload v-model="form.photo" :label="$t('fields.photo')" :error="validationErrors.photo" v-if="hasFieldPermission('staffs.add-staff.photo')"></image-upload>
        <!-- First Name -->
        <input-control focus v-model="form.firstName" :label="$t('fields.firstName')" :error="validationErrors.firstName" v-if="hasFieldPermission('staffs.add-staff.firstName')"></input-control>
        <!-- Last Name -->
        <input-control v-model="form.lastName" :label="$t('fields.lastName')" :error="validationErrors.lastName" v-if="hasFieldPermission('staffs.add-staff.lastName')"></input-control>
        <!-- Email -->
        <input-control v-model="form.email" :label="$t('fields.email')" :error="validationErrors.email" v-if="hasFieldPermission('staffs.add-staff.email')"></input-control>
        <!-- Mobile -->
        <input-control type="tel" v-model="form.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile" v-if="hasFieldPermission('staffs.add-staff.mobile')"></input-control>
        <!-- designation -->
        <input-control v-model="form.designation" :label="$t('fields.designation')" :error="validationErrors.designation" v-if="hasFieldPermission('staffs.add-staff.designation')"></input-control>
        <!-- Roles -->
        <multiselect-control v-model="form.roles" :label="$t('fields.roles')" :options="roles" :error="validationErrors.roles" v-if="hasFieldPermission('staffs.add-staff.roles')"></multiselect-control>
        <!-- Password -->
        <input-control v-model="form.password" :label="$t('fields.password')" :error="validationErrors.password" type="password" v-if="hasFieldPermission('staffs.add-staff.password')"></input-control>
        <!-- Confirm Password -->
        <input-control v-model="form.password_confirmation" :label="$t('fields.confirmPassword')" :error="validationErrors.password_confirmation" type="password" v-if="hasFieldPermission('staffs.add-staff.password_confirmation')"></input-control>
        <!-- Status -->
        <select-control :label="$t('fields.status')" v-model="form.status" :options="getStatus ? getStatus : {}" name="staff-status" track="value" v-if="hasFieldPermission('staffs.add-staff.status')"></select-control>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/staffs">
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
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
  name: "add-staff",
  mixins: [validation],
  data() {
    return {
      form: {
        photo: null,
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        roles: [],
        password_confirmation: "",
        clientId: this.$auth.user.clientId,
      },
      initialData: null,
      roles: [],

      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      const formData = new FormData();
      for (const key in this.form) {
        formData.append(key, this.form[key]);
      }

      this.savingState = true;
      try {
        await this.$axios.$post("/staffs", formData);
        this.$toast.success("Staff created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/staffs"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    reset() {
      this.form = { ...this.initialData };
      this.form.roles = [];
    },
  },
  computed: {
    ...mapGetters({
      getStatus: "config/getStatus",
    }),
  },
  created() {
    this.initialData = { ...this.form };
  },
  async fetch() {
    const resRoles = await this.$axios.get("/roles");
    this.roles = resRoles.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
