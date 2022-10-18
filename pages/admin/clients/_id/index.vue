<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="user">
      <template #header>
        <h3 class="font-weight-normal">{{ $t("clients.title.details") }}</h3>
        <div>
          <action-dropdown iconVariant="light" variant="primary">
            <b-dropdown-item v-if="hasPermission('update-clients') || hasRole('Super Admin')" :to="localePath(`/admin/clients/${user.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item v-if="hasPermission('delete-clients') || hasRole('Super Admin')" @click="removeUser(user.id)"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </div>
      </template>

      <template>
        <!-- Tab Start -->
        <b-card no-body>
          <b-tabs no-nav-style active-nav-item-class="border-bottom border-primary" content-class="p-3">
            <!-- Client Details Tab -->
            <b-tab title-link-class="font-size-18 text-body" @click="userInfoShow(1)" card title="Client Details" active>
              <!-- Id -->
              <input-detail :label="$t('fields.id')" :value="user.id"></input-detail>
              <!-- First Name -->
              <input-detail :label="$t('fields.firstName')" :value="user.firstName"></input-detail>
              <!-- Last Name -->
              <input-detail :label="$t('fields.lastName')" :value="user.lastName"></input-detail>
              <!-- Email -->
              <email-detail :label="$t('fields.email')" :value="user.email"></email-detail>
              <!-- Mobile -->
              <mobile-detail :label="$t('fields.mobile')" :value="user.mobile"></mobile-detail>
              <!-- Shop Name -->
              <input-detail :label="$t('fields.shopName')" :value="user.shopName"></input-detail>
              <!-- Country -->
              <input-detail :label="$t('fields.country')" :value="user.module ? user.module.country.name : '-'"></input-detail>
              <!-- Status -->
              <input-detail :label="$t('fields.status')">
                <badge :value="user.status"></badge>
              </input-detail>
            </b-tab>
            <!-- Fields Tab -->
            <b-tab title-link-class="font-size-18 text-body" @click="userInfoShow(0)" card title="Fields">
              <!-- Panel -->
              <!-- Permission and Fields -->
              <h4 class="mb-4">Permission and Fields</h4>
              <div class="row">
                <div class="col-3">
                  <ul class="list-group  rounded-0 permission-menu mb-1">
                    <li v-for="(per, i) in permissions" :key="i" @click="selected = per" class="list-group-item" :class="{ active: per.id == selected.id }" role="button">
                      {{ per.label }}
                    </li>
                  </ul>
                </div>
                <div class="col-9">
                  <div class="row">
                    <div class="col-md-6 col-xl-4 mb-4" v-for="(row, i) in selected.pages" :key="i">
                      <div class="card-col h-100">
                        <div class="header border-bottom d-flex justify-content-between ">
                          <p class="mb-0 font-weight-medium">{{ row.label }}</p>
                          <b-form-checkbox v-model="row.value" name="check-button" switch>
                          </b-form-checkbox>
                        </div>
                        <div class="body">
                          <ul class="list mb-1">
                            <!-- Field List -->
                            <li v-if="!row.fields">
                              No Fields Avilable.
                            </li>
                            <li v-for="(col, i) in row.fields" :key="i" class="item d-flex justify-content-between">
                              <p class="mb-0">{{ col.label }}</p>
                              <b-form-checkbox v-model="col.value" name="check-button" switch>
                              </b-form-checkbox>
                            </li>
                            <!-- Actions -->
                            <template v-if="row.actions && row.actions.length">
                              <!-- Line -->
                              <li>
                                <hr />
                              </li>

                              <li class="font-weight-bold">Actions</li>

                              <!-- Action list -->
                              <li v-for="action in row.actions" :key="action.name" class="item d-flex justify-content-between">
                                <p>{{ action.label }}</p>

                                <b-form-checkbox v-model="action.value" name="check-button" switch>
                                </b-form-checkbox>
                              </li>
                            </template>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Bottom content -->
              <div class="d-flex justify-content-end mt-4">
                <button @click="onDataSave" class="btn btn-primary px-3 ml-3">
                  Save
                </button>
              </div>
            </b-tab>
            <!-- categories -->
            <b-tab title-link-class="font-size-18 text-body" @click="userInfoShow(0)" card title="Categories">
              <!-- Panel -->
              <!-- Permission and Fields -->
              <h4 class="mb-4"> {{ $t("categories.label") }}</h4>
              <data-table :columns="categories_columns" :url="`/admin/categories/${$route.params.id}/client`" :filters="client_filters">
                <!-- Status Column -->
                <template v-slot:status="{ col }">
                  <badge :value="col"></badge>
                </template>
                <!-- Filter slot -->
                <template #filter>
                  <page-filter v-model="filters.perPage"></page-filter>
                  <trash-filter v-model="filters.trashed"></trash-filter>
                </template>
              </data-table>

            </b-tab>
            <!-- products -->
            <b-tab title-link-class="font-size-18 text-body" @click="userInfoShow(0)" card title="Products">
              <!-- Panel -->
              <!-- Permission and Fields -->
              <h4 class="mb-4"> {{ $t("products.label") }}</h4>
              <data-table :columns="products_columns" :url="`/admin/products/${$route.params.id}/client`" :filters="client_filters" :showIndex="true">
                <!-- Status Column -->
                <template v-slot:status="{ col }">
                  <badge v-if="col" :value="col"></badge>
                </template>

                <!-- Purchase Units -->
                <template #purchaseUnits="{col}">
                  <span v-if="col">{{ col.map(c => c.name).join(', ') }}</span>
                </template>
                <!-- Sellings Units -->
                <template #sellingUnits="{col}">
                  <span v-if="col">{{ col.map(c => c.name).join(', ') }}</span>
                </template>

                <!-- Filter slot -->
                <template #filter>
                  <page-filter v-model="filters.perPage"></page-filter>
                  <trash-filter v-model="filters.trashed"></trash-filter>
                </template>
              </data-table>

            </b-tab>
            <!-- customers -->
            <b-tab title-link-class="font-size-18 text-body" @click="userInfoShow(0)" card title="Customers">
              <!-- Panel -->
              <!-- Permission and Fields -->
              <h4 class="mb-4"> {{ $t("customers.label") }}</h4>
              <data-table :columns="customers_columns" :url="`/admin/customers/${$route.params.id}/client`" :filters="client_filters">
                <!-- Status Column -->
                <template v-slot:status="{ col }">
                  <badge :value="col"></badge>
                </template>

                <!-- Filter slot -->
                <template #filter>
                  <page-filter v-model="filters.perPage"></page-filter>
                  <trash-filter v-model="filters.trashed"></trash-filter>
                </template>
              </data-table>

            </b-tab>
            <!-- suppliers -->
            <b-tab title-link-class="font-size-18 text-body" @click="userInfoShow(0)" card title="Suppliers">
              <!-- Panel -->
              <!-- Permission and Fields -->
              <h4 class="mb-4"> {{ $t("suppliers.label") }}</h4>
              <data-table :columns="suppliers_columns" :url="`/admin/suppliers/${$route.params.id}/client`" :filters="client_filters">
                <!-- Status Column -->
                <template v-slot:status="{ col }">
                  <badge :value="col"></badge>
                </template>
                <!-- Filter slot -->
                <template #filter>
                  <page-filter v-model="filters.perPage"></page-filter>
                </template>
              </data-table>

            </b-tab>
            <!-- sale invoices -->
            <b-tab title-link-class="font-size-18 text-body" @click="userInfoShow(0)" card title="Sale Invoices">
              <!-- Panel -->
              <!-- Permission and Fields -->
              <h4 class="mb-4">{{ $t("headings.saleInvoices") }}</h4>

              <data-table :key="tableKey" :columns="sale_invoices_columns" :url="`/admin/sale-invoices/${$route.params.id}/client`" :filters="client_filters">
                <!-- Bulk Action Slot -->
                <template #bulk-action="{ids}">
                  <confirm-action @confirmed="tableKey++" url="/admin/sale-invoices" :ids="ids" variant="dropdown"></confirm-action>
                </template>
                <!-- Status Column -->
                <template v-slot:status="{ col }">
                  <badge :value="col"></badge>
                </template>

                <template #date="{col}">
                  {{formatDate(col)}}
                </template>

                <!-- Filter slot -->
                <template #filter>
                  <page-filter v-model="filters.perPage"></page-filter>
                  <trash-filter v-model="filters.trashed"></trash-filter>
                  <invoice-status-filter v-model="filters.status"></invoice-status-filter>
                </template>
              </data-table>

            </b-tab>
            <!-- expense invoices -->
            <b-tab title-link-class="font-size-18 text-body" @click="userInfoShow(0)" card title="Expense Invoices">
              <!-- Panel -->
              <!-- Permission and Fields -->
              <h4 class="mb-4">{{ $t("expenseInvoices.label") }}</h4>

              <data-table :columns="expense_invoices_columns" :url="`/admin/expense-invoices/${$route.params.id}/client`" :filters="client_filters" :showIndex="true">
                <!-- Status Column -->
                <template v-slot:status="{ col }">
                  <badge :value="col"></badge>
                </template>
                <!-- Filter slot -->
                <template #filter>
                  <page-filter v-model="filters.perPage"></page-filter>
                  <trash-filter v-model="filters.trashed"></trash-filter>
                  <invoice-status-filter v-model="filters.status"></invoice-status-filter>
                </template>
              </data-table>

            </b-tab>
            <!-- login history -->
            <b-tab title-link-class="font-size-18 text-body" @click="userInfoShow(0)" card title="Login History">
              <!-- Panel -->
              <!-- Permission and Fields -->
              <h4 class="mb-4">{{ $t("headings.loginHistory") }}</h4>

              <data-table :columns="login_history_columns" :url="`/admin/user-login-history/${$route.params.id}/client`" :filters="client_filters" :showIndex="true">
                <template #filter>
                  <page-filter v-model="filters.perPage"></page-filter>
                </template>
              </data-table>

            </b-tab>
          </b-tabs>
        </b-card>
        <!-- //Tab End -->
      </template>
    </detail-view>

    <template v-if="user_section_display">
      <!-- Users Data Table Header -->
      <div class="d-flex">
        <h3>{{ $t("users.title.manage") }}</h3>

        <btn-link class="btn-primary ml-auto" :to="`/admin/clients/${$route.params.id}/users/create`">{{ $t("buttons.add") }} {{ $t("users.label") }}</btn-link>
      </div>

      <!-- Users Data Table -->
      <data-table url="/admin/users" :columns="columns" :filters="filters">
        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <b-dropdown-item :to="
              localePath(`/admin/clients/${$route.params.id}/users/${row.id}`)
            "><i class="far mr-1 fa-share-square text-success"></i>
              Details</b-dropdown-item>
            <b-dropdown-item :to="
              localePath(
                `/admin/clients/${$route.params.id}/users/${row.id}/edit`
              )
            "><i class="far mr-1 fa-edit text-primary"></i> Edit</b-dropdown-item>
            <b-dropdown-item @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>
        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>
    </template>
  </loading-view>
</template>

<script>
import permissions from "~/permissions";
import _ from "lodash";
export default {
  layout: "admin",
  name: "client-details",
  meta: {
    permission: "view-clients",
  },
  data() {
    return {
      user_section_display: true,
      user: null,
      permissions: null,
      selected: null,
      tableKey: 1,
      columns: [
        { field: "id", permission: true },
        { field: "firstName", permission: true },
        { field: "lastName", permission: true },
        { field: "email", permission: true },
        { field: "mobile", permission: true },
        { field: "status", permission: true },
        {
          field: "userLastLogin",
          label: "lastLogin",
          permission: true,
        },
      ],
      categories_columns: [
        { field: "clientName", label: "client", permission: true },
        { field: "shopName", permission: true },
        { field: "name", label: "category", permission: true },
        {
          field: "description",
          permission: true,
        },
        {
          field: "totalProduct",
          label: "productType",
          permission: true,
          sortable: false,
        },
        {
          field: "totalSaleAmount",
          label: "totalSale",
          permission: true,
          sortable: false,
        },
        {
          field: "status",
          permission: true,
        },
      ],
      products_columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        { field: "name", label: "productName", permission: true },
        {
          field: "categoryName",
          permission: true,
        },
        {
          field: "code",
          permission: true,
        },
        {
          field: "storeIn",
          permission: true,
        },
        {
          field: "size",
          permission: true,
        },
        {
          field: "color",
          permission: true,
        },
        {
          field: "brand",
          permission: true,
        },

        {
          field: "purchaseRate",
          permission: true,
        },
        {
          field: "sellingRate",
          permission: true,
        },
        {
          field: "unitName",
          permission: true,
        },
        {
          field: "purchaseUnits",
          permission: true,
        },
        {
          field: "sellingUnits",
          permission: true,
        },
        {
          field: "totalQuantity",
          permission: true,
          sortable: false,
        },
        {
          field: "unitName",
          permission: true,
        },
        {
          field: "status",
          permission: true,
        },
      ],
      customers_columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        { field: "name", permission: true },
        { field: "mobile", permission: true },
        { field: "email", permission: true },
        {
          field: "saleInvoicesCount",
          permission: true,
          label: "totalInvoice",
        },
        {
          field: "totalAmount",
          permission: true,
        },
        {
          field: "paidAmount",
          permission: true,
          sortable: false,
        },
        {
          field: "totalDue",
          permission: true,
          sortable: false,
        },
      ],
      suppliers_columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        { field: "name", permission: true },
        { field: "mobile", permission: true },
        { field: "email", permission: true },
        {
          field: "saleInvoicesCount",
          permission: true,
          label: "totalInvoice",
        },
        {
          field: "totalAmount",
          permission: true,
        },
        {
          field: "paidAmount",
          permission: true,
          sortable: false,
        },
        {
          field: "totalDue",
          permission: true,
          sortable: false,
        },
      ],
      sale_invoices_columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        {
          field: "invoiceNo",
          permission: true,
        },
        {
          field: "invoiceDateFormatted",
          label: "date",
          permission: true,
        },
        {
          field: "customerName",
          permission: true,
        },
        {
          field: "totalAmount",
          permission: true,
        },
        {
          field: "totalCharge",
          permission: true,
        },
        {
          field: "totalDiscount",
          permission: true,
        },
        {
          field: "totalCost",
          permission: true,
        },
        {
          field: "paidAmount",
          permission: true,
        },
        {
          field: "totalDue",
          permission: true,
          sortable: false,
        },
        {
          field: "status",
          permission: true,
          sortable: false,
        },
      ],
      expense_invoices_columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        {
          field: "invoiceNo",
          permission: true,
        },
        { field: "invoiceDateFormatted", label: "date", permission: true },
        { field: "categoryName", permission: true },
        {
          field: "totalAmount",
          permission: true,
        },
        {
          field: "paidAmount",
          permission: true,
        },
        {
          field: "totalDue",
          permission: true,
          sortable: false,
        },
        {
          field: "status",
          permission: true,
        },
      ],
      login_history_columns: [
        { field: "countryName", permission: true },
        { field: "industryName", permission: true },
        { field: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        { field: "name", permission: true },
        { field: "mobile", permission: true },
        { field: "loginTime", permission: true },
        { field: "logoutTime", permission: true },
      ],
      columns: [
        { field: "shopNumber", label: "shopNumber", permission: true },
        { field: "shopName", permission: true },
        { field: "name", permission: true },
        { field: "mobile", permission: true },
        { field: "email", permission: true },
        {
          field: "totalInvoice",
          permission: true,
          label: "totalInvoice",
        },
        {
          field: "totalAmount",
          permission: true,
        },
        {
          field: "paidAmount",
          permission: true,
          sortable: false,
        },
        {
          field: "totalDue",
          permission: true,
          sortable: false,
        },
      ],
      filters: {
        client: this.$route.params.id,
        search: "",
        perPage: 25,
      },
      client_filters: {
        search: "",
        perPage: 25,
        trashed: "",
        status: "",
      },
    };
  },
  methods: {
    // Delete User
    async removeUser(id) {
      this.removeResource({
        apiUrl: `/admin/clients/${id}`,
        redirectUrl: "/admin/clients",
      });
    },
    // selectAll(field) {
    //   field.columns.map(col => (col.value = true));
    // },
    // unSelectAll(field) {
    //   field.columns.map(col => (col.value = false));
    // },
    async onDataSave() {
      try {
        await this.$axios.$put(`/admin/clients/${this.$route.params.id}`, {
          ...this.user,
          fields: this.permissions,
        });
        this.$toast.success("Update successfully.");
      } catch (error) {
        console.error(error);
      }
    },
    userInfoShow(id) {
      this.user_section_display = id;
    },
  },
  async fetch() {
    try {
      // Getting User
      const resUser = await this.$axios.$get(
        `/admin/clients/${this.$route.params.id}`
      );
      this.user = resUser.data;

      // Set permissions
      this.permissions = permissions;
      // Set selected permission
      this.selected = this.permissions[0];
      // Merge permissions
      this.mergePermissions(this.permissions, this.user.fields);
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="scss" scoped>
.nav-tabs .nav-link:hover,
.nav-tabs .nav-link:focus {
  border-color: transparent;
}

// permission Menu
.permission-menu {
  box-shadow: 0px 2px 10px #dedede;
  .list-group-item {
    cursor: pointer;
    border-left: 3px solid transparent !important;
    &.active {
      background-color: var(--white);
      color: var(--gray);
      border-color: var(--secondary) !important;
      border-left: 3px solid var(--primary) !important;
      font-weight: 500;
    }
    &:not(:last-child) {
      border-bottom: 2px solid #eee !important;
    }
  }
}

// Card Column
.card-col {
  background: #fff;
  box-shadow: 0px 2px 10px #dedede;
  .header {
    background: #f3f3f5;
    padding: 8px 10px;
    display: flex;
    align-items: center;
  }
  .body {
    padding: 5px 10px;
    .list {
      list-style: none;
      padding-left: 0;
      .item {
        padding: 5px 0;
      }
    }
  }
}
</style>
