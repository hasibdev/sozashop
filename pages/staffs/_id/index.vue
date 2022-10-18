<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="staff">
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("staffs.title.details") }} : {{ staff.name }}
        </h3>
        <div>
          <action-dropdown iconVariant="light" variant="primary">
            <b-dropdown-item v-if="hasPagePermission('staffs.edit-staff') && !isAdminRole()" :to="localePath(`/staffs/${staff.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item v-if="!isAdminRole()" @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </div>
      </template>
      <!-- Body -->
      <template>
        <card>
          <!-- Image -->
          <image-detail :label="$t('fields.photo')" :value="staff.profilePhotoUrl" v-if="hasFieldPermission('staffs.staff-details.photo')"></image-detail>
          <!-- First Name -->
          <input-detail :label="$t('fields.firstName')" :value="staff.firstName" v-if="hasFieldPermission('staffs.staff-details.first-name')"></input-detail>

          <!-- Last Name -->
          <input-detail :label="$t('fields.lastName')" :value="staff.lastName" v-if="hasFieldPermission('staffs.staff-details.last-name')"></input-detail>
          <!-- Email -->
          <input-detail :label="$t('fields.email')" :value="staff.email" v-if="hasFieldPermission('staffs.staff-details.email')"></input-detail>

          <!-- Mobile -->
          <input-detail :label="$t('fields.mobile')" :value="staff.mobile" v-if="hasFieldPermission('staffs.staff-details.mobile')"></input-detail>

          <!-- Designation -->
          <input-detail :label="$t('fields.designation')" :value="staff.designation" v-if="hasFieldPermission('staffs.staff-details.designation')"></input-detail>
          <!-- Roles -->
          <input-detail :label="$t('fields.roles')" :value="staff.roles.map(role => role.name).join(', ')" v-if="hasFieldPermission('staffs.staff-details.roles')"></input-detail>

          <input-detail :label="$t('fields.status')" v-if="hasFieldPermission('staffs.staff-details.status')">
            <badge :value="staff.status"></badge>
          </input-detail>
        </card>
      </template>
    </detail-view>
  </loading-view>
</template>

<script>
export default {
  name: "staff-details",
  data() {
    return {
      staff: null,
    };
  },
  methods: {
    remove() {
      this.removeResource({
        apiUrl: `/staffs/${this.$route.params.id}`,
        redirectUrl: "/staffs",
      });
    },
    isAdminRole() {
      return this.staff.availableRoles?.includes("Admin");
    },
  },
  async fetch() {
    const res = await this.$axios.get(`/staffs/${this.$route.params.id}`);
    this.staff = res.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
