<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="user">
      <!-- Header -->
      <template #header>
        <h3 class="font-weight-normal">{{ $t("users.title.details") }}</h3>
        <div>
          <action-dropdown>
            <b-dropdown-item :to="
                localePath(
                  `/admin/clients/${$route.params.id}/users/${$route.params.user}/edit`
                )
              "><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item @click="removeUser(user.id)"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </div>
      </template>

      <!-- Default Content -->
      <template>
        <card>
          <!-- Id -->
          <input-detail :label="$t('fields.readableId')" :value="user.client.readableId"></input-detail>
          <!-- Id -->
          <input-detail :label="$t('fields.industryName')" :value="user.client.industryName"></input-detail>
          <!-- Id -->
          <input-detail :label="$t('fields.countryName')" :value="user.client.countryName"></input-detail>
          <!-- First Name -->
          <input-detail :label="$t('fields.firstName')" :value="user.firstName"></input-detail>
          <!-- Last Name -->
          <input-detail :label="$t('fields.lastName')" :value="user.lastName"></input-detail>
          <!-- Email -->
          <email-detail :label="$t('fields.email')" :value="user.email"></email-detail>
          <!-- Mobile -->
          <mobile-detail :label="$t('fields.mobile')" :value="user.mobile"></mobile-detail>

          <!-- Status -->
          <input-detail :label="$t('fields.status')">
            <badge :value="user.status"></badge>
          </input-detail>
        </card>
      </template>
    </detail-view>
  </loading-view>
</template>

<script>
export default {
  layout: "admin",
  name: "user-details",
  data() {
    return {
      user: null,
    };
  },
  methods: {
    // Delete User
    async removeUser(id) {
      this.removeResource({
        apiUrl: `/admin/users/${id}`,
        redirectUrl: `/admin/clients/${this.$route.params.id}`,
      });
    },
  },
  async fetch() {
    const resUser = await this.$axios.get(
      `/admin/users/${this.$route.params.user}`
    );

    this.user = resUser.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
