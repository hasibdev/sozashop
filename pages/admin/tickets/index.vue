<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("tickets.title.manage") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
    </template>

    <template>
      <data-table :key="tableKey" :columns="columns" url="/admin/tickets" :filters="filters">
        <!-- Action Slot -->
        <template v-slot:action="{ row }">
          <action-dropdown>
            <b-dropdown-item v-if="hasPermission('view-tickets') || hasRole('Super Admin')" :to="localePath(`/admin/tickets/${row.id}`)">
              <i class="far mr-1 fa-share-square text-success"></i>
              Details
            </b-dropdown-item>
            <b-dropdown-item @click="updateStatus(row)" v-if="row.status == 'open'">
              <i class="far mr-1 fa-edit text-primary"></i>
              Close
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Subject Column -->
        <template #subject="{col, row}">
          <span :class="{'font-weight-bolder': row.unreadRepliesCount > 0}">{{col}}</span>
        </template>

        <!-- Message Column -->
        <template #message="{col, row}">
          <span :class="{'font-weight-bolder': row.unreadRepliesCount > 0}">{{col}}</span>
        </template>

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Priority Column -->
        <template v-slot:priority="{ col }">
          <badge v-if="col" :value="col"></badge>
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
export default {
  name: "tickets",
  layout: "admin",
  meta: {
    permission: "view-any-tickets",
  },
  data() {
    return {
      tableKey: 1,
      columns: ["subject", "message", "priority", "status"],
      filters: {
        search: "",
        perPage: 25,
      },
    };
  },
  methods: {
    async updateStatus(row) {
      try {
        await this.$axios.post(`/admin/tickets/${row.id}/update-status`, {
          status: "close",
        });
        this.$toast.success("Status updated successfully.");

        this.tableKey++;
      } catch (error) {
        this.$toast.success("Status updated Fail.");
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
