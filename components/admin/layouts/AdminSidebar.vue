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
      return this.windowWidth <= "992" ? true : false;
    },
    menuItems() {
      return [
        // Dashboard
        {
          href: this.localePath("/admin"),
          title: this.$t("menu.dashboard"),
          icon: "ti-home",
        },
        // Resources
        {
          title: this.$t("menu.resources"),
          icon: "fas fa-th",
          child: [
            // Categories
            {
              title: this.$t("menu.categories"),
              href: this.localePath("/admin/categories"),
              permission: true,
            },
            // Products
            {
              title: this.$t("menu.products"),
              href: this.localePath("/admin/products"),
              permission: true,
            },
            // Sales
            {
              title: this.$t("menu.saleInvoices"),
              href: this.localePath("/admin/sale-invoices"),
              permission: true,
            },
            // Customers
            {
              title: this.$t("menu.customers"),
              href: this.localePath("/admin/customers"),
              permission: true,
            },
            // Suppliers
            {
              title: this.$t("menu.suppliers"),
              href: this.localePath("/admin/suppliers"),
              permission: true,
            },
            // Staffs
            {
              title: this.$t("menu.staffs"),
              href: this.localePath("/admin/staffs"),
              permission: true,
            },
            // Services
            {
              title: this.$t("menu.services"),
              href: this.localePath("/admin/services"),
              permission: true,
            },

            // Loans
            {
              title: this.$t("menu.loans"),
              href: this.localePath("/admin/loans"),
              permission: true,
            },
            // Expenses
            {
              title: this.$t("menu.expenseInvoices"),
              href: this.localePath("/admin/expense-invoices"),
              permission: true,
            },
          ],
        },
        // Industries
        {
          href: this.localePath("/admin/industries"),
          title: this.$t("menu.industries"),
          icon: "ti-harddrives",
          permission:
            this.hasPermission("view-any-industries") ||
            this.hasRole("Super Admin"),
        },
        // Countries
        {
          href: this.localePath("/admin/countries"),
          title: this.$t("menu.countries"),
          icon: "far fa-flag",
          permission:
            this.hasPermission("view-any-countries") ||
            this.hasRole("Super Admin"),
        },
        // packages
        {
          href: this.localePath("/admin/packages"),
          title: this.$t("menu.packages"),
          icon: "fas fa-gifts",
          permission:
            this.hasPermission("view-any-packages") ||
            this.hasRole("Super Admin"),
        },

        //blog
        {
          title: this.$t("blog.label"),
          icon: "fas fa-blog",
          child: [
            {
              title: this.$t("blog.category"),
              href: this.localePath("/admin/blog/category"),
              permission: true,
            },
            {
              title: this.$t("blog.post"),
              href: this.localePath("/admin/blog/post"),
              permission: true,
            },
          ],
        },
        //login History
        {
          title: this.$t("headings.loginHistoryTracking"),
          icon: "ti-user",
          child: [
            {
              title: this.$t("headings.loginHistoryToday"),
              href: this.localePath("/admin/today-login-history"),
              permission: true,
            },
          ],
        },
        //contact us
        {
          title: this.$t("headings.contactUs"),
          icon: "fas fa-blog",
          child: [
            {
              title: this.$t("headings.contactList"),
              href: this.localePath("/admin/contact-us-information"),
              // permission: true,
            },
          ],
        },

        // Clients
        {
          title: this.$t("menu.clients"),
          icon: "ti-user",
          child: [
            {
              title: this.$t("menu.manageClients"),
              href: this.localePath("/admin/clients"),
              permission:
                this.hasPermission("view-any-clients") ||
                this.hasRole("Super Admin"),
            },
            {
              title: this.$t("menu.verifiedClients"),
              href: this.localePath("/admin/clients/verified"),
              permission:
                this.hasPermission("view-any-clients") ||
                this.hasRole("Super Admin"),
            },
            {
              title: this.$t("menu.unverifiedClients"),
              href: this.localePath("/admin/clients/unverified"),
              permission:
                this.hasPermission("view-any-clients") ||
                this.hasRole("Super Admin"),
            },
          ],
        },
        // Admins
        {
          title: this.$t("menu.admins"),
          icon: "fas fa-users",
          child: [
            // Add Admin
            {
              href: this.localePath("/admin/admins/create"),
              title: this.$t("menu.addAdmin"),
              permission:
                this.hasPermission("create-admins") ||
                this.hasRole("Super Admin"),
            },
            // Manage Admins
            {
              href: this.localePath("/admin/admins"),
              title: this.$t("menu.manageAdmins"),
              permission:
                this.hasPermission("view-any-admins") ||
                this.hasRole("Super Admin"),
            },

            // Manage Roles
            {
              href: this.localePath("/admin/roles"),
              title: this.$t("menu.manageRoles"),
              permission:
                this.hasPermission("view-any-roles") ||
                this.hasRole("Super Admin"),
            },
          ],
        },

        // Finance
        {
          title: this.$t("menu.finance"),
          icon: "fas fa-file-invoice-dollar",
          child: [
            // Accounts
            {
              href: this.localePath("/admin/accounts"),
              title: this.$t("menu.accounts"),
              permission:
                this.hasPermission("view-any-accounts") ||
                this.hasRole("Super Admin"),
            },
            // Withdraw
            {
              href: this.localePath("/admin/withdraws"),
              title: this.$t("menu.withdraws"),
              permission:
                this.hasPermission("view-any-withdraws") ||
                this.hasRole("Super Admin"),
            },
            // banks
            {
              href: this.localePath("/admin/banks"),
              title: this.$t("menu.banks"),
              permission:
                this.hasPermission("view-any-banks") ||
                this.hasRole("Super Admin"),
            },
            // mobile banks
            {
              href: this.localePath("/admin/mobile-banks"),
              title: this.$t("menu.mobileBanks"),
              permission:
                this.hasPermission("view-any-mobile-banks") ||
                this.hasRole("Super Admin"),
            },
            // Package transaction
            {
              href: this.localePath("/admin/package-transactions"),
              title: this.$t("menu.packageTransaction"),
              permission: true,
            },
          ],
        },
        // Support
        {
          title: this.$t("menu.support"),
          icon: "fas fa-headset",
          child: [
            // Categories
            {
              href: this.localePath("/admin/support-categories"),
              title: this.$t("menu.categories"),
              permission:
                this.hasPermission("view-any-support-categories") ||
                this.hasRole("Super Admin"),
            },
            // Tickets
            {
              href: this.localePath("/admin/tickets"),
              title: this.$t("menu.tickets"),
              permission:
                this.hasPermission("view-any-tickets") ||
                this.hasRole("Super Admin"),
            },
            // message
            {
              href: this.localePath("/admin/message/create"),
              title: this.$t("menu.message"),
              permission:
                this.hasPermission("view-any-tickets") ||
                this.hasRole("Super Admin"),
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
    background: #333547;
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

.v-sidebar-menu.vsm_collapsed .vsm--mobile-item .vsm--item .vsm--mobile-bg {
  background: red;
}
.v-sidebar-menu.vsm_collapsed .vsm--list .vsm--link:hover i {
  background: transparent;
}
</style>
