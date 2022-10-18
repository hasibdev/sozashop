<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("tickets.title.manage") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="hasPagePermission('support.add-ticket') && (hasPermission('create-tickets') || hasRole('Admin'))" class="btn-primary" to="/tickets/create">
        {{ $t("buttons.add") }} {{ $t("tickets.label") }}
      </btn-link>
    </template>

    <template>
      <data-table :columns="columns" url="/tickets" :filters="filters">

        <!-- Subject Column -->
        <template #subject="{col, row}">
          <span :class="{'font-weight-bolder': row.unreadRepliesCount > 0}">{{col}}</span>
        </template>

        <!-- Message Column -->
        <template #message="{col, row}">
          <span :class="{'font-weight-bolder': row.unreadRepliesCount > 0}">{{col}}</span>
        </template>

        <!-- Status Column -->
        <template #status="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Priority Column -->
        <template v-slot:priority="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Action Slot -->
        <template v-slot:action="{ row }">
          <action-dropdown>
            <b-dropdown-item v-if="hasPagePermission('support.ticket-details') && (hasPermission('view-tickets') || hasRole('Admin'))" :to="localePath(`/tickets/${row.id}`)">
              <i class="far mr-1 fa-share-square text-success"></i>
              Details
            </b-dropdown-item>
          </action-dropdown>
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
  meta: {
    permission: "view-any-tickets",
  },
  data() {
    return {
      columns: [
        {
          field: "subject",
          permission: "support.manage-tickets.subject",
        },
        {
          field: "message",
          permission: "support.manage-tickets.message",
        },
        {
          field: "priority",
          permission: "support.manage-tickets.priority",
        },
        {
          field: "status",
          permission: "support.manage-tickets.status",
        },
      ],
      filters: {
        search: "",
        perPage: 25,
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
