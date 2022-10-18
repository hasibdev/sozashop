<template>
  <!-- ========== Left Sidebar Start ========== -->
  <sidebar-menu @toggle-collapse="onToggleCollapse" :collapsed="isCollapsed" :menu="menu" width="240px" widthCollapsed="70px" showOneChild>
  </sidebar-menu>
</template>

<script>
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
export default {
  components: {
    SidebarMenu,
  },
  data() {
    return {
      windowWidth: null,
    };
  },
  computed: {
    isCollapsed() {
      return this.windowWidth <= "992";
    },
    menuItems() {
      return [
        // Dashboard
        {
          href: this.localePath("/dashboard"),
          title: this.$t("menu.dashboard"),
          icon: "fas fa-home",
        },

        // Categories
        {
          href: this.localePath("/categories"),
          title: this.$t("menu.categories"),
          icon: "fas fa-th-large",
          permission:
            this.hasPagePermission("categories.manage-categories") &&
            (this.hasPermission("view-any-categories") ||
              this.hasRole("Admin")),
        },

        // Products
        {
          title: this.$t("menu.products"),
          icon: "fas fa-cubes",

          child: [
            // Add Product
            {
              href: this.localePath("/products/create"),
              title: this.$t("menu.addProduct"),
              permission:
                this.hasPagePermission("products.add-product") &&
                (this.hasPermission("create-products") ||
                  this.hasRole("Admin")),
            },
            // Manage Product
            {
              href: this.localePath("/products"),
              title: this.$t("menu.manageProducts"),
              permission:
                this.hasPagePermission("products.manage-products") &&
                (this.hasPermission("view-any-products") ||
                  this.hasRole("Admin")),
            },
            // Expired Products
            {
              href: this.localePath("/expired-products"),
              title: this.$t("menu.expiredProducts"),
              permission:
                this.hasPagePermission("products.expired-products") &&
                (this.hasPermission("view-any-expire-products") ||
                  this.hasRole("Admin")),
            },
            // Manage Stocks
            {
              href: this.localePath("/manage-stocks"),
              title: this.$t("menu.manageStocks"),
              permission:
                this.hasPagePermission("products.manage-stocks") &&
                (this.hasPermission("can-add-product-stocks") ||
                  this.hasRole("Admin")),
            },
          ],
        },
        // Sells Invoice
        {
          title: this.$t("menu.sales"),
          icon: "fas fa-shopping-cart",
          child: [
            // New Sale
            {
              href: this.localePath("/sale-invoices/create"),
              title: this.$t("menu.addSale"),
              permission:
                this.hasPagePermission("sales.new-sales") &&
                (this.hasPermission("create-sale-invoices") ||
                  this.hasRole("Admin")),
            },
            // Manage Sale
            {
              href: this.localePath("/sale-invoices"),
              title: this.$t("menu.manageSales"),
              permission:
                this.hasPagePermission("sales.manage-sales") &&
                (this.hasPermission("view-any-sale-invoices") ||
                  this.hasRole("Admin")),
            },
            // Return Invoice
            {
              href: this.localePath("/return-invoices"),
              title: this.$t("menu.returnInvoices"),
              permission:
                this.hasPagePermission("sales.manage-return-invoice") &&
                (this.hasPermission("view-any-return-invoices") ||
                  this.hasRole("Admin")),
            },
          ],
        },

        // Expenses
        {
          title: this.$t("menu.expenses"),
          icon: "fas fa-upload",
          child: [
            {
              href: this.localePath("/expense-categories"),
              title: this.$t("menu.expenseType"),
              permission:
                this.hasPagePermission("expenses.manage-expenses-category") &&
                (this.hasPermission("view-any-expense-categories") ||
                  this.hasRole("Admin")),
            },
            {
              href: this.localePath("/expense-invoices"),
              title: this.$t("menu.expenseInvoices"),
              permission:
                this.hasPagePermission("expenses.manage-expenses-invoice") &&
                (this.hasPermission("view-any-expense-invoices") ||
                  this.hasRole("Admin")),
            },
          ],
        },

        // Customers
        {
          title: this.$t("menu.customers"),
          icon: "fas fa-user-tie",
          child: [
            {
              href: this.localePath("/customers/create"),
              title: this.$t("menu.createCustomer"),
              permission:
                this.hasPagePermission("customers.add-customer") &&
                (this.hasPermission("create-customers") ||
                  this.hasRole("Admin")),
            },
            {
              href: this.localePath("/customers"),
              title: this.$t("menu.manageCustomer"),
              permission:
                this.hasPagePermission("customers.manage-customer") &&
                (this.hasPermission("view-any-customers") ||
                  this.hasRole("Admin")),
            },
          ],
        },

        // Suppliers
        {
          title: this.$t("menu.suppliers"),
          icon: "fas fa-user-secret",
          child: [
            // Add Supplier
            {
              href: this.localePath("/suppliers/create"),
              title: this.$t("menu.createSupplier"),
              permission:
                this.hasPagePermission("suppliers.add-suppliers") &&
                (this.hasPermission("create-suppliers") ||
                  this.hasRole("Admin")),
            },
            // Manage Suppliers
            {
              href: this.localePath("/suppliers"),
              title: this.$t("menu.manageSupplier"),
              permission:
                this.hasPagePermission("suppliers.manage-suppliers") &&
                (this.hasPermission("view-any-suppliers") ||
                  this.hasRole("Admin")),
            },
            // Manage Invoices
            {
              href: this.localePath("/purchase-invoices"),
              title: this.$t("menu.manageInvoices"),
              permission:
                this.hasPagePermission("suppliers.manage-purchase-invoice") &&
                (this.hasPermission("view-any-purchase-invoices") ||
                  this.hasRole("Admin")),
            },
            // Return Invoices
            {
              href: this.localePath("/purchase-return-invoices"),
              title: this.$t("menu.returnInvoices"),
              permission: true,
            },
          ],
        },
        // Staff
        {
          title: this.$t("menu.staffs"),
          icon: "fas fa-users",
          child: [
            // Add Staff
            {
              href: this.localePath("/staffs/create"),
              title: this.$t("menu.addStaff"),
              permission:
                this.hasPagePermission("staffs.add-staff") &&
                (this.hasPermission("create-users") || this.hasRole("Admin")),
            },
            // Manage Staff
            {
              href: this.localePath("/staffs"),
              title: this.$t("menu.manageStaffs"),
              permission:
                this.hasPagePermission("staffs.manage-staffs") &&
                (this.hasPermission("view-any-users") || this.hasRole("Admin")),
            },
            // Manage Roles
            {
              href: this.localePath("/roles"),
              title: this.$t("menu.manageRoles"),
              permission:
                this.hasPagePermission("staffs.manage-roles") &&
                (this.hasPermission("view-any-roles") || this.hasRole("Admin")),
            },
          ],
        },

        // loan
        {
          title: this.$t("menu.loan"),
          icon: "fas fa-luggage-cart",
          child: [
            // Manage Loaner
            {
              href: this.localePath("/loaners"),
              title: this.$t("menu.loaners"),
              permission:
                this.hasPagePermission("loan.manage-loaners") &&
                (this.hasPermission("view-any-loaners") ||
                  this.hasRole("Admin")),
            },
            // Add Loan
            {
              href: this.localePath("/loans/create"),
              title: this.$t("menu.createLoan"),
              permission:
                this.hasPagePermission("loan.add-loan") &&
                (this.hasPermission("create-loans") || this.hasRole("Admin")),
            },
            // Manage Loans
            {
              href: this.localePath("/loans"),
              title: this.$t("menu.manageLoans"),
              permission:
                this.hasPagePermission("loan.manage-loan") &&
                (this.hasPermission("view-any-loans") || this.hasRole("Admin")),
            },
          ],
        },
        // Services
        {
          title: this.$t("menu.services"),
          icon: "fas fa-server",
          child: [
            // Manage Categories
            {
              href: this.localePath("/service-categories"),
              title: this.$t("menu.manageCategories"),
              permission:
                this.hasPagePermission("services.manage-service-categories") &&
                (this.hasPermission("view-any-service-categories") ||
                  this.hasRole("Admin")),
            },
            // Manage Service
            {
              href: this.localePath("/services"),
              title: this.$t("menu.manageServices"),
              permission:
                this.hasPagePermission("services.manage-services") &&
                (this.hasPermission("view-any-services") ||
                  this.hasRole("Admin")),
            },
          ],
        },

        // blog
        {
          href: this.localePath("/admin/blog"),
          title: this.$t("menu.blog"),
          permission:
            this.hasPagePermission("view-any-posts") && this.hasRole("Admin"),
        },

        // Report
        {
          title: this.$t("menu.report"),
          icon: "fas fa-file-medical-alt",
          child: [
            // Sale Invoices
            {
              href: this.localePath("/report/sale-invoices"),
              title: this.$t("menu.saleInvoices"),
              permission:
                this.hasPagePermission("report.sale-invoices") &&
                (this.hasPermission("view-sale-invoices-report") ||
                  this.hasRole("Admin")),
            },

            // Sale Items
            {
              href: this.localePath("/report/sale-items"),
              title: this.$t("menu.saleItems"),
              permission:
                this.hasPagePermission("report.sale-items") &&
                (this.hasPermission("view-sale-items-report") ||
                  this.hasRole("Admin")),
            },
            // Return Items
            {
              href: this.localePath("/report/return-items"),
              title: this.$t("menu.returnItems"),
              permission:
                this.hasPagePermission("report.return-items") &&
                (this.hasPermission("view-return-items-report") ||
                  this.hasRole("Admin")),
            },
            // Expense Invoices
            {
              href: this.localePath("/report/expense-invoices"),
              title: this.$t("menu.expenseInvoices"),
              permission:
                this.hasPagePermission("report.expense-invoices") &&
                (this.hasPermission("view-expense-invoices-report") ||
                  this.hasRole("Admin")),
            },
            // Expense Categories
            {
              href: this.localePath("/report/expense-categories"),
              title: this.$t("menu.expenseCategories"),
              permission:
                this.hasPagePermission("report.expense-categories") &&
                (this.hasPermission("view-expense-categories-report") ||
                  this.hasRole("Admin")),
            },
            // Purchase Invoices
            {
              href: this.localePath("/report/purchase-invoices"),
              title: this.$t("menu.purchaseInvoices"),
              permission:
                this.hasPagePermission("report.purchase-invoices") &&
                (this.hasPermission("view-purchase-invoices-report") ||
                  this.hasRole("Admin")),
            },
            // Suppliers Invoices
            {
              href: this.localePath("/report/suppliers"),
              title: this.$t("menu.suppliers"),
              permission:
                this.hasPagePermission("report.suppliers") &&
                (this.hasPermission("view-suppliers-report") ||
                  this.hasRole("Admin")),
            },
            // Stock Report
            {
              href: this.localePath("/report/stocks"),
              title: this.$t("menu.stockReport"),
              permission:
                this.hasPagePermission("report.stocks") &&
                (this.hasPermission("view-batches-report") ||
                  this.hasRole("Admin")),
            },
          ],
        },

        // Support
        {
          title: this.$t("menu.support"),
          icon: "fas fa-headset",
          child: [
            {
              href: this.localePath("/tickets"),
              title: this.$t("menu.tickets"),
              permission:
                this.hasPagePermission("support.manage-tickets") &&
                (this.hasPermission("view-any-tickets") ||
                  this.hasRole("Admin")),
            },
          ],
        },

        // Settings
        {
          title: this.$t("menu.settings"),
          icon: "fas fa-cog",
          child: [
            // General Settings
            {
              href: this.localePath("/settings/application"),
              title: this.$t("menu.generalSettings"),
              permission:
                this.hasPagePermission("settings.general-settings") &&
                this.hasRole("Admin"),
            },
            // Currency Settings
            {
              href: this.localePath("/settings/currency"),
              title: this.$t("menu.currencySettings"),
              permission:
                this.hasPagePermission("settings.currency-settings") &&
                this.hasRole("Admin"),
            },

            // Charges
            {
              href: this.localePath("/charges"),
              title: this.$t("menu.manageCharges"),
              permission:
                this.hasPagePermission("settings.manage-charges") &&
                this.hasRole("Admin"),
            },
            // Units
            {
              href: this.localePath("/units"),
              title: this.$t("menu.units"),
              permission:
                this.hasPagePermission("settings.manage-units") &&
                this.hasRole("Admin"),
            },
            // Packages
            {
              href: this.localePath("/settings/packages"),
              title: this.$t("menu.packages"),
              permission:
                this.hasPagePermission("settings.package-list") &&
                this.hasRole("Admin"),
            },
          ],
        },
      ];
    },
    menu() {
      const newItems = [];

      for (const item of this.menuItems) {
        if (item.hasOwnProperty("permission")) {
          if (item.permission) newItems.push(item);
        } else {
          if (item.hasOwnProperty("child")) {
            const newChild = {
              ...item,
              child: item.child.filter((c) => {
                if (c.hasOwnProperty("permission")) {
                  return c.permission;
                } else {
                  return c;
                }
              }),
            };
            if (newChild.child.length) newItems.push(newChild);
          } else newItems.push(item);
        }
      }

      return newItems;
    },
  },
  created() {
    this.windowWidth = window.innerWidth;
    window.addEventListener("resize", (e) => {
      this.windowWidth = e.currentTarget.innerWidth;
    });
  },

  methods: {
    onToggleCollapse(collapsed) {
      if (collapsed) {
        document.body.classList.add("sidebar-enable");
        document.body.classList.add("vertical-collpsed");
      } else {
        document.body.classList.remove("sidebar-enable");
        document.body.classList.remove("vertical-collpsed");
      }
    },
  },
};
</script>

<style lang="scss">
// Overright Default v-sidebar-menu plugin
.v-sidebar-menu {
  background: #333547;
  top: 69px;
  z-index: 1005;
}
.vsm--dropdown .vsm--list .vsm--item .vsm--link {
  padding-left: 1.5rem;
}
.nuxt-link-active {
  background: transparent;
}
.v-sidebar-menu .vsm--link {
  color: #8699ad;
  font-size: 15.7px;
  font-weight: normal;
}
.v-sidebar-menu.vsm_expanded .vsm--item_open {
  color: #8699ad !important;
}
.v-sidebar-menu .vsm--header {
  color: #8699ad !important;
  padding: 10px 20px !important;
  letter-spacing: 0.05em;
  pointer-events: none;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 500;
}
.v-sidebar-menu .vsm--link_exact-active,
.v-sidebar-menu .vsm--link_active {
  color: #b4c9de !important;
  background-color: #383b4e;
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon,
.v-sidebar-menu .vsm--dropdown .vsm--list,
.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1,
.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 .vsm--icon {
  background: transparent;
}
.v-sidebar-menu .vsm--icon {
  margin-right: 0;
}
.v-sidebar-menu.vsm_collapsed .vsm--list .vsm--item > a i {
  // display: block;
  // text-align: center;
  padding-left: 12px;
}
.v-sidebar-menu .vsm--dropdown > .vsm--list {
  background: #383b4e;
  .nuxt-link-exact-active {
    background: #292b38;
  }
}
.vsm--mobile-item
  .vsm--item.vsm--item_open
  .vsm--link.vsm--link_mobile-item
  .vsm--title {
  color: white;
}
.navbar-brand-box {
  transition: width 0.3s ease !important;
}
.v-sidebar-menu.vsm_collapsed
  .vsm--mobile-item
  .vsm--item
  .vsm--link.vsm--link_mobile-item {
  color: white !important;
}

.v-sidebar-menu.vsm_collapsed .vsm--list .vsm--link:hover i {
  background: transparent;
}
// Overright Primary Color
.v-sidebar-menu .vsm--link_level-1.vsm--link_exact-active,
.v-sidebar-menu .vsm--link_level-1.vsm--link_active {
  box-shadow: 3px 0px 0px 0px var(--primary) inset;
}
.v-sidebar-menu .vsm--mobile-bg {
  background: var(--primary);
}
.v-sidebar-menu.vsm_collapsed .vsm--link_level-1.vsm--link_hover .vsm--icon,
.v-sidebar-menu.vsm_collapsed .vsm--link_level-1:hover .vsm--icon {
  background: var(--primary);
}

// Scrollbar Customize
.vsm--scroll-wrapper {
  // Webkit
  &::-webkit-scrollbar {
    width: 0px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px var(--primary);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--primary);
  }
  &:hover {
    &::-webkit-scrollbar {
      width: 5px;
    }
  }
}
</style>
