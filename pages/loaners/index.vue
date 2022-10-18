<template>
  <index-view>
    <template #title> {{ $t("loaners.title.manage") }} </template>

    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <btn-link v-if="
          hasPagePermission('loan.add-loaner') &&
            (hasPermission('create-loaners') || hasRole('Admin'))
        " class="btn-primary" to="/loaners/create">
        {{ $t("buttons.add") }} {{ $t("loaners.label") }}
      </btn-link>
    </template>

    <template>
      <data-table :columns="columns" url="/loaners" :filters="filters">
        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Actions -->
        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <b-dropdown-item v-if="
                hasPagePermission('loan.loaner-details') &&
                  (hasPermission('view-loaners') || hasRole('Admin'))
              " :to="localePath(`/loaners/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
            <b-dropdown-item v-if="
                hasPagePermission('loan.edit-loaner') &&
                  (hasPermission('update-loaners') || hasRole('Admin'))
              " :to="localePath(`/loaners/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item v-if="hasPermission('delete-loaners') || hasRole('Admin')" @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>
    </template>
  </index-view>
</template>

<script>
export default {
  name: "loaners-list",
  meta: {
    permission: "view-any-loaners",
  },
  data() {
    return {
      columns: [
        {
          field: "id",
          permission: "loan.manage-loaners.id",
        },
        {
          field: "name",
          permission: "loan.manage-loaners.name",
        },
        {
          field: "mobile",
          permission: "loan.manage-loaners.mobile",
        },
        {
          field: "email",
          permission: "loan.manage-loaners.email",
        },
        {
          field: "address",
          permission: "loan.manage-loaners.address",
        },
        {
          field: "loansCount",
          label: "totalLoan",
          permission: "loan.manage-loaners.total-loan",
        },
        {
          field: "openingBalance",
          permission: "loan.manage-loaners.opening-balance",
        },
        {
          field: "paidAmount",
          label: "totalPaid",
          permission: "loan.manage-loaners.paid-amount",
        },
        {
          field: "balance",
          permission: "loan.manage-loaners.balance",
        },
        {
          field: "status",
          permission: "loan.manage-loaners.status",
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
