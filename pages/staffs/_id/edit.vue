<template>
  <loading-view :loading="$fetchState.pending">
    <form-view v-if="staff">
      <!-- Header -->
      <template #header> {{ $t("staffs.title.edit") }} </template>

      <!-- Body -->
      <template>
        <!-- Image -->
        <image-upload v-model="staff.photo" :label="$t('fields.photo')" :error="validationErrors.photo" :url="staff.profilePhotoUrl" v-if="hasFieldPermission('staffs.edit-staff.photo')"></image-upload>
        <!-- First Name -->
        <input-control v-model="staff.firstName" :label="$t('fields.firstName')" v-if="hasFieldPermission('staffs.edit-staff.firstName')" :error="validationErrors.firstName"></input-control>
        <!-- Last Name -->
        <input-control v-model="staff.lastName" :label="$t('fields.lastName')" v-if="hasFieldPermission('staffs.edit-staff.lastName')" :error="validationErrors.lastName"></input-control>
        <!-- Email -->
        <input-control v-model="staff.email" :label="$t('fields.email')" v-if="hasFieldPermission('staffs.edit-staff.email')" :error="validationErrors.email"></input-control>
        <!-- Mobile -->
        <input-control v-model="staff.mobile" :label="$t('fields.mobile')" v-if="hasFieldPermission('staffs.edit-staff.mobile')" :error="validationErrors.mobile"></input-control>
        <!-- designation -->
        <input-control v-model="staff.designation" :label="$t('fields.designation')" :error="validationErrors.designation" v-if="hasFieldPermission('staffs.edit-staff.designation')"></input-control>
        <!-- Roles -->
        <multiselect-control v-model="staff.roles" :label="$t('fields.roles')" :options="roles" :error="validationErrors.roles" v-if="hasFieldPermission('staffs.edit-staff.roles')"></multiselect-control>
        <!-- Password -->
        <!-- <input-control type="password" v-model="staff.password" v-if="hasFieldPermission('staffs.edit-staff.password')" :label="$t('fields.password')" :error="validationErrors.password"></input-control> -->
        <!-- Confirm Password -->
        <!-- <input-control type="password" v-model="staff.password_confirmation" v-if="hasFieldPermission('staffs.edit-staff.password_confirmation')" :label="$t('fields.confirmPassword')" :error="validationErrors.password_confirmation"></input-control> -->

        <!-- Status -->
        <select-control :label="$t('fields.status')" v-model="staff.status" :options="getStatus ? getStatus : {}" name="staff-status" track="value" v-if="hasFieldPermission('staffs.edit-staff.status')"></select-control>
      </template>
      <!-- Footer -->
      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" to="/staffs">{{
          $t("buttons.cancel")
        }}</btn-link>
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
  name: "edit-staff",
  mixins: [validation],
  data() {
    return {
      staff: { photo: null },
      roles: [],

      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      // Maping out only 'id' if the data type is object
      const fixRoles = this.staff.roles.map((role) => {
        if (typeof role === "object") {
          return role.id;
        }
        return role;
      });

      this.savingState = true;
      try {
        await this.$axios.$put(`/staffs/${this.$route.params.id}`, {
          ...this.staff,
          roles: fixRoles,
        });
        this.$toast.success("Staff Update successfully.");
        if (!createAndContinue) {
          this.$router.push(this.localePath("/staffs"));
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
      getStatus: "config/getStatus",
    }),
  },
  async fetch() {
    // Fetch Staffs
    const res = await this.$axios.get(`/staffs/${this.$route.params.id}`);
    this.staff = res.data.data;
    // Fetch Roles
    const resRoles = await this.$axios.get("/roles");
    this.roles = resRoles.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
