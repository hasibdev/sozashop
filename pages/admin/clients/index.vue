<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("clients.title.manage") }} </template>
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="hasPermission('create-clients') || hasRole('Super Admin')" class="btn-primary" to="/admin/clients/create">{{ $t("buttons.add") }} {{ $t("clients.label") }}</btn-link>
    </template>

    <template>
      <data-table :columns="columns" url="/admin/clients" :filters="filters">
        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <b-dropdown-item if="hasPermission('view-clients') || hasRole('Super Admin')" :to="localePath(`/admin/clients/${row.id}/message`)">
              <i class="far mr-1 fa-folder-open text-success"></i>
              Message
            </b-dropdown-item>
            <b-dropdown-item @click="loginAsClient(row.id)">
              <i class="far mr-1 fa-folder-open text-success"></i>
              Open
            </b-dropdown-item>
            <b-dropdown-item v-if="hasPermission('view-clients') || hasRole('Super Admin')" :to="localePath(`/admin/clients/${row.id}`)">
              <i class="far mr-1 fa-share-square text-success"></i>
              Details
            </b-dropdown-item>
            <b-dropdown-item v-if="hasPermission('update-clients') || hasRole('Super Admin')" :to="localePath(`/admin/clients/${row.id}/edit`)">
              <i class="far mr-1 fa-edit text-primary"></i>
              Edit
            </b-dropdown-item>
            <b-dropdown-item v-if="hasPermission('delete-clients') || hasRole('Super Admin')" @click="remove(row.id, index)">
              <i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Status Badge -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>
        <!-- last login -->
        <template v-slot:lastLogin="{ row }">
          <slot v-if="row.users">
            <slot v-for="(user,index) in row.users">
              <span v-if="user.id == row.id" :key="index">
                <span v-if="user.lastLogin">{{ $moment(user.lastLogin).format('lll') }}</span>
                <span v-else>-</span>
              </span>
            </slot>
          </slot>
        </template>
        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>
        </template>
      </data-table>
    </template>
  </index-view>
  <!-- End Page-content -->
</template>

<script>
import Badge from "~/components/utils/Badge.vue";
export default {
  components: { Badge },
  layout: "admin",
  name: "user-list",
  meta: {
    permission: "view-any-clients",
  },
  data() {
    return {
      columns: [
        { field: "countryName", permission: true },
        { field: "industryName", permission: true },
        { field: "readableId", permission: true },
        { field: "shopName", permission: true },
        { field: "name", permission: true },
        { field: "email", permission: true },
        { field: "mobile", permission: true },
        { field: "lastLogin", permission: true },
        { field: "status", permission: true },
      ],
      filters: {
        search: "",
        perPage: 25,
      },
    };
  },
  methods: {
    async loginAsClient(id) {
      try {
        await this.$auth.loginWith("local", { data: { id } });
        this.$router.push(this.localeRoute("/dashboard"));
      } catch (err) {
        console.log(err);
      }

      // window.open(
      //   "http://localhost:5000/dashboard",
      //   "New Window",
      //   "width=1000,height=800"
      // );
    },
  },
};
</script>

<style lang="scss" scoped></style>
