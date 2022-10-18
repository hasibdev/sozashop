export default [
  // Categories Permissions
  {
    label: "Categories",
    name: "categories",
    id: 1,
    // Category Fields
    pages: [
      // Add Category Field
      {
        label: "Add Category",
        name: "add-category",
        value: true,
        fields: [
          {
            label: "Description",
            name: "description",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Manage Category Field
      {
        label: "Manage Categories",
        name: "manage-categories",
        value: true,
        // Col Fields
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Description",
            name: "description",
            value: true
          },
          {
            label: "Product Type",
            name: "total-product",
            value: true
          },
          {
            label: "Total Sale",
            name: "total-sale",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ],
      },
      // Edit Category Field
      {
        label: "Edit Category",
        name: "edit-category",
        value: true,
        fields: [
          {
            label: "Description",
            name: "description",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Category Details Field
      {
        label: "Category Detail",
        name: "category-detail",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Description",
            name: "description",
            value: true
          },
          {
            label: "Product Type",
            name: "total-product",
            value: true
          },
          {
            label: "Total Sale",
            name: "total-sale",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ],
      }
    ]
  },
  // Products Permissions
  {
    label: "Products",
    name: "products",
    id: 2,
    // Products Permissions Fields
    pages: [
      // Add Products
      {
        label: "Add Product",
        name: "add-product",
        value: true,
        fields: [
          {
            label: "Code",
            name: "code",
            value: true
          },
          {
            label: "Store In",
            name: "store-in",
            value: true
          },
          {
            label: "Size",
            name: "size",
            value: true
          },
          {
            label: "Color",
            name: "color",
            value: true
          },
          {
            label: "Brand",
            name: "brand",
            value: true
          },
          {
            label: "Alert Quantity",
            name: "alert-quantity",
            value: true
          },
          {
            label: "Purchase Units",
            name: "purchase-units",
            value: true
          },
          {
            label: "Selling Units",
            name: "selling-units",
            value: true
          },
          {
            label: "Manufacture Date",
            name: "manufacture-date",

            value: true
          },
          {
            label: "Expire Date",
            name: "expire-date",
            value: true
          },

          {
            label: "Product Image",
            name: "product-image",
            value: true
          },

          {
            label: "Generate Invoice",
            name: "generate-invoice",
            value: true
          },
          {
            label: "Date",
            name: "date",
            value: true
          },

          {
            label: "Invoice No",
            name: "invoice-no",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Manage Products
      {
        label: "Manage Products",
        name: "manage-products",
        value: true,
        // Manage Products Fields
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Code",
            name: "code",
            value: true
          },
          {
            label: "Store In",
            name: "store-in",
            value: true
          },
          {
            label: "Size",
            name: "size",
            value: true
          },
          {
            label: "Color",
            name: "color",
            value: true
          },
          {
            label: "Category",
            name: "category",
            value: true
          },

          {
            label: "Brand",
            name: "brand",
            value: true
          },

          {
            label: "Unit",
            name: "unit",
            value: true
          },
          {
            label: "Purchase Units",
            name: "purchase-units",
            value: true
          },
          {
            label: "Selling Units",
            name: "selling-units",
            value: true
          },

          {
            label: "Total Quantity",
            name: "total-quantity",
            value: true
          },
          {
            label: "Total Sale Items",
            name: "total-sale-item",
            value: true
          },
          {
            label: "Total Return Items",
            name: "total-return-items",
            value: true
          },
        ],
        // Actions
        actions: [
          {
            label: "Barcode",
            name: "barcode",
            value: true
          }
        ]
      },
      // Edit Products
      {
        label: "Edit Product",
        name: "edit-product",
        value: true,
        fields: [
          {
            label: "Code",
            name: "code",
            value: true
          },
          {
            label: "Store In",
            name: "store-in",
            value: true
          },
          {
            label: "Size",
            name: "size",
            value: true
          },
          {
            label: "Color",
            name: "color",
            value: true
          },
          {
            label: "Brand",
            name: "brand",
            value: true
          },
          {
            label: "Purchase Units",
            name: "purchase-units",
            value: true
          },
          {
            label: "Selling Units",
            name: "selling-units",
            value: true
          },
          {
            label: "Product Image",
            name: "product-image",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Products Details
      {
        label: "Product Detail",
        name: "product-detail",
        value: true,
        fields: [
          {
            label: "Product Image",
            name: "product-image",
            value: true
          },
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Code",
            name: "code",
            value: true
          },
          {
            label: "Store In",
            name: "store-in",
            value: true
          },
          {
            label: "Size",
            name: "size",
            value: true
          },
          {
            label: "Color",
            name: "color",
            value: true
          },
          {
            label: "Category",
            name: "category",
            value: true
          },

          {
            label: "Brand",
            name: "brand",
            value: true
          },

          {
            label: "Unit",
            name: "unit",
            value: true
          },

          {
            label: "Purchase Units",
            name: "purchase-units",
            value: true
          },
          {
            label: "Selling Units",
            name: "selling-units",
            value: true
          },
          {
            label: "Total Quantity",
            name: "total-quantity",
            value: true
          },
          {
            label: "Alert  Quantity",
            name: "alert-quantity",
            value: true
          },
        ],
        // Actions
        actions: [
          {
            label: "History",
            name: "history",
            value: true
          },

        ]
      },
      // Expired Products
      {
        label: "Expired Products",
        name: "expired-products",
        value: true,
        fields: [
          {
            label: "Batch",
            name: "batch",
            value: true
          },
          {
            label: "Product",
            name: "product",
            value: true
          },
          {
            label: "Category",
            name: "category",
            value: true
          },
          {
            label: "Color",
            name: "color",
            value: true
          },
          {
            label: "Code",
            name: "code",
            value: true
          },
          {
            label: "Expired Date",
            name: "expired-date",
            value: true
          },
          {
            label: "Quantity",
            name: "quantity",
            value: true
          },
        ]
      },
      // Manage stock
      {
        label: "Manage Stocks",
        name: "manage-stocks",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Code",
            name: "code",
            value: true
          },
          {
            label: "Store In",
            name: "store-in",
            value: true
          },
          {
            label: "Size",
            name: "size",
            value: true
          },
          {
            label: "Color",
            name: "color",
            value: true
          },
          {
            label: "Category",
            name: "category",
            value: true
          },
          {
            label: "Batch No",
            name: "batch-no",
            value: true
          },
          {
            label: "Brand",
            name: "brand",
            value: true
          },

          {
            label: "Unit",
            name: "unit",
            value: true
          },
          {
            label: "Purchase Units",
            name: "purchase-units",
            value: true
          },
          {
            label: "Selling Units",
            name: "selling-units",
            value: true
          },

          {
            label: "Total Quantity",
            name: "total-quantity",
            value: true
          },
          {
            label: "Alert  Quantity",
            name: "alert-quantity",
            value: true
          },

        ],
        // Actions
        actions: [
          {
            label: "Add Stock",
            name: "add-stock",
            value: true
          },

        ]
      },
      // Manage stock (Add stock)
      {
        label: "Manage Stocks (Add Stock)",
        name: "add-stock",
        value: true,
        fields: [
          {
            label: "Quantity",
            name: "quantity",
            value: true
          },
          {
            label: "Purchase Rate",
            name: "purchaseRate",
            value: true
          },
          {
            label: "Selling Rate",
            name: "sellingRate",
            value: true
          },
          {
            label: "Batch No",
            name: "batchNo",
            value: true
          },
          {
            label: "Unit Id",
            name: "unitId",
            value: true
          },
          {
            label: "Mfg Date",
            name: "mfgDate",
            value: true
          },
          {
            label: "Exp Date",
            name: "expDate",
            value: true
          },
          {
            label: "Generate Invoice",
            name: "generateInvoice",
            value: true
          },

        ],

      },
      // Manage batch
      {
        label: "Manage Batch",
        name: "manage-batch",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "unit Name",
            name: "unitName",
            value: true
          },
          {
            label: "Quantity",
            name: "quantity",
            value: true
          },
          {
            label: "Purchase Rate",
            name: "purchaseRate",
            value: true
          },
          {
            label: "Selling Rate",
            name: "sellingRate",
            value: true
          },
          {
            label: "Total Selling Rate",
            name: "totalSellingRate",
            value: true
          },
          {
            label: "Total Sale",
            name: "totalSale",
            value: true
          },
          {
            label: "mfg Date",
            name: "mfgDate",
            value: true
          },

          {
            label: "exp Date",
            name: "expDate",
            value: true
          },


        ],
        // Actions
        actions: [
          {
            label: "Batch Selling Rate Edit",
            name: "edit-batch-sellingRate",
            value: true
          }, {
            label: "Batch Stock Quantity",
            name: "batch-stock-quantity",
            value: true
          },

        ]
      }
    ]
  },
  // Sales Permissions
  {
    label: "Sales",
    name: "sales",
    id: 3,
    // Sales Permissions Fields
    pages: [
      // New Sales
      {
        label: "New Sales",
        name: "new-sales",
        value: true,
        fields: [
          {
            label: "Due Date",
            name: "due-date",
            value: true
          },
          {
            label: "Discount",
            name: "discount",
            value: true
          },
          {
            label: "Note",
            name: "note",
            value: true
          },
        ]
      },
      // Manage Sales
      {
        label: "Manage Sales",
        name: "manage-sales",
        value: true,
        // Manage Sales Fields
        fields: [
          {
            label: "Invoice No",
            name: "invoice-no",
            value: true
          },
          {
            label: "Date",
            name: "date",
            value: true
          },
          {
            label: "Due Date",
            name: "due-date",
            value: true
          },
          {
            label: "Creator",
            name: "creator",
            value: true
          },
          {
            label: "Customer",
            name: "customer",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Charge",
            name: "total-charge",
            value: true
          },
          {
            label: "Total Discount",
            name: "total-discount",
            value: true
          },
          {
            label: "Total Cost",
            name: "total-cost",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },
          {
            label: "Note",
            name: "note",
            value: true
          },
        ],
        // Actions
        actions: [
          {
            label: "Share Button",
            name: "share-button",
            value: true
          }
        ],
      },
      // Edit Sales
      {
        label: "Edit Sales",
        name: "edit-sales",
        value: true,
        // Edit Sales Fields
        fields: [
          {
            label: "Discount",
            name: "discount",
            value: true
          }
        ]
      },
      // Sales Details
      {
        label: "Sales Details",
        name: "sales-details",
        value: true,
        // Sales Details Fields
        fields: [
          {
            label: "Date",
            name: "date",
            value: true
          },
          {
            label: "Due Date",
            name: "due-date",
            value: true
          },
          {
            label: "Customer",
            name: "customer",
            value: true
          },
          {
            label: "Created At",
            name: "created-at",
            value: true
          },
          {
            label: "Updated At",
            name: "updated-at",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },
          {
            label: "Note",
            name: "note",
            value: true
          },
        ]
      },
      // Add Return Invoice
      {
        label: "Add Return Invoice",
        name: "add-return-invoice",
        value: true
      },
      // Manage Return Invoice
      {
        label: "Manage Return Invoice",
        name: "manage-return-invoice",
        value: true,
        fields: [
          {
            label: "Invoice No",
            name: "invoice-no",
            value: true
          },
          {
            label: "Sale Invoice No",
            name: "sale-invoice-no",
            value: true
          },
          {
            label: "Date",
            name: "date",
            value: true
          },
          {
            label: "Customer",
            name: "customer",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Return Invoice Details
      {
        label: "Return Invoice Details",
        name: "return-invoice-details",
        value: true,
        fields: [
          {
            label: "Date",
            name: "date",
            value: true
          },
          {
            label: "Invoice No",
            name: "invoice-no",
            value: true
          },
          {
            label: "Sale Invoice No",
            name: "sale-invoice-no",
            value: true
          },
          {
            label: "Customer",
            name: "customer",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Edit Return Invoice
      {
        label: "Edit Return Invoice",
        name: "edit-return-invoice",
        value: true
      }
    ]
  },
  // Expenses Permissions
  {
    label: "Expenses",
    name: "expenses",
    id: 4,
    // Expenses Permissions Fields
    pages: [
      // Expenses Category
      {
        label: "Manage Expenses Category",
        name: "manage-expenses-category",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Description",
            name: "description",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Total Invoice",
            name: "total-invoice",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Add Expenses Category
      {
        label: "Add Expenses Category",
        name: "add-expenses-category",
        value: true,
        fields: [
          {
            label: "Description",
            name: "description",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Edit Expenses Category
      {
        label: "Edit Expenses Category",
        name: "edit-expenses-category",
        value: true,
        fields: [
          {
            label: "Description",
            name: "description",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Details Expenses Category
      {
        label: "Expenses Category Details",
        name: "expenses-category-details",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Description",
            name: "description",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Total Invoice",
            name: "total-invoice",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Expenses Invoice
      {
        label: "Manage Expense Invoice",
        name: "manage-expenses-invoice",
        value: true,
        fields: [
          {
            label: "Invoice Number",
            name: "invoice-number",
            value: true
          },
          {
            label: "Date",
            name: "date",
            value: true
          },
          {
            label: "Creator",
            name: "creator",
            value: true
          },
          {
            label: "Expense Type",
            name: "category",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Paid Amount",
            name: "paid-amount",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Add Expenses Invoice
      {
        label: "Add Expense Invoice",
        name: "add-expenses-invoice",
        value: true,
        fields: [
          {
            label: "Payment Method",
            name: "payment-method",
            value: true
          }
        ]
      },
      // Edit Expenses Invoice
      {
        label: "Edit Expense Invoice",
        name: "edit-expenses-invoice",
        value: true,
        fields: [
          {
            label: "Date",
            name: "date",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Expenses Invoice Details
      {
        label: "Expense Invoice Details",
        name: "expenses-invoice-details",
        value: true,
        fields: [
          {
            label: "Invoice No",
            name: "invoice-no",
            value: true
          },
          {
            label: "Date",
            name: "date",
            value: true
          },
          {
            label: "Expense Type",
            name: "expense-type",
            value: true
          },
          {
            label: "Payment Method",
            name: "payment-method",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },
          {
            label: "Created At",
            name: "created-at",
            value: true
          },
          {
            label: "Updated At",
            name: "updated-at",
            value: true
          },
        ]
      }
    ]
  },
  // Customers
  {
    label: "Customers",
    name: "customers",
    id: 5,
    pages: [
      // Add Customer
      {
        label: "Add Customer",
        name: "add-customer",
        value: true,
        fields: [
          {
            label: "Address",
            name: "address",
            value: true
          },
          {
            label: "Opening Balance",
            name: "opening-balance",
            value: true
          }, {
            label: "Password",
            name: "password",
            value: true
          },
          {
            label: "Password Confirmation",
            name: "password_confirmation",
            value: true
          },
        ]
      },
      // Manage Customers
      {
        label: "Manage Customers",
        name: "manage-customer",
        value: true,
        fields: [
          {
            label: "ID",
            name: "id",
            value: true
          },
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Mobile",
            name: "mobile",
            value: true
          },
          {
            label: "Email",
            name: "email",
            value: true
          },
          {
            label: "Address",
            name: "address",
            value: true
          },
          {
            label: "Total Invoice",
            name: "total-invoice",
            value: true
          },
          {
            label: "Total Return",
            name: "total-return",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Edit Customer
      {
        label: "Edit Customer",
        name: "edit-customer",
        value: true,
        fields: [
          {
            label: "Address",
            name: "address",
            value: true
          }
        ]
      },
      // Customers Details
      {
        label: "Customers Details",
        name: "customer-details",
        value: true,
        fields: [
          {
            label: "ID",
            name: "id",
            value: true
          },
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Mobile",
            name: "mobile",
            value: true
          },
          {
            label: "Email",
            name: "email",
            value: true
          },
          {
            label: "Address",
            name: "address",
            value: true
          },
          {
            label: "Total Invoice",
            name: "total-invoice",
            value: true
          },
          {
            label: "Total Return",
            name: "total-return",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Opening Balance",
            name: "opening-balance",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ],
        // Actions
        actions: [
          {
            label: "History",
            name: "history",
            value: true
          },

        ]
      }
    ]
  },
  // Suppliers
  {
    label: "Suppliers",
    name: "suppliers",
    id: 6,
    pages: [
      // Add Suppliers
      {
        label: "Add Suppliers",
        name: "add-suppliers",
        value: true,
        fields: [
          {
            label: "Telephone",
            name: "telephone",
            value: true
          },
          {
            label: "Fax",
            name: "fax",
            value: true
          },
          {
            label: "Vat Number",
            name: "vat-number",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Manage Suppliers
      {
        label: "Manage Suppliers",
        name: "manage-suppliers",
        value: true,
        fields: [
          {
            label: "ID",
            name: "id",
            value: true
          },
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Mobile",
            name: "mobile",
            value: true
          },
          {
            label: "Telephone",
            name: "telephone",
            value: true
          },
          {
            label: "Fax",
            name: "fax",
            value: true
          },
          {
            label: "Email",
            name: "email",
            value: true
          },
          {
            label: "Vat Number",
            name: "vat-number",
            value: true
          },
          {
            label: "Opening Balance",
            name: "opening-balance",
            value: true
          },
          {
            label: "Total Invoice",
            name: "total-invoice",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },

      // Edit Suppliers
      {
        label: "Edit Suppliers",
        name: "edit-suppliers",
        value: true,
        fields: [
          {
            label: "Telephone",
            name: "telephone",
            value: true
          },
          {
            label: "Fax",
            name: "fax",
            value: true
          },
          {
            label: "Vat Number",
            name: "vat-number",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Suppliers Details
      {
        label: "Suppliers Details",
        name: "suppliers-details",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Mobile",
            name: "mobile",
            value: true
          },
          {
            label: "Telephone",
            name: "telephone",
            value: true
          },
          {
            label: "Fax",
            name: "fax",
            value: true
          },
          {
            label: "Email",
            name: "email",
            value: true
          },
          {
            label: "Vat Number",
            name: "vat-number",
            value: true
          },
          {
            label: "Opening Balance",
            name: "opening-balance",
            value: true
          },
          {
            label: "Total Invoice",
            name: "total-invoice",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },


        ],
        // Actions
        actions: [
          {
            label: "History",
            name: "history",
            value: true
          },

        ]
      },
      // Manage Purchase Invoice
      {
        label: "Manage Purchase Invoice",
        name: "manage-purchase-invoice",
        value: true,
        fields: [
          {
            label: "ID",
            name: "id",
            value: true
          },
          {
            label: "Invoice No",
            name: "invoice-no",
            value: true
          },
          {
            label: "Date",
            name: "date",
            value: true
          },
          {
            label: "Creator",
            name: "creator",
            value: true
          },
          {
            label: "Supplier Name",
            name: "supplier-name",
            value: true
          },

          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Total Selling Amount",
            name: "total-selling-amount",
            value: true
          },
          {
            label: "Profit",
            name: "profit",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },
        ]
      },
      // Purchase Invoice Edit
      {
        label: "Edit Purchase Invoice",
        name: "edit-purchase-invoice",
        value: true,
        fields: [
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Purchase Invoice Details
      {
        label: "Purchase Invoice Details",
        name: "purchase-invoice-details",
        value: true,
        fields: [
          {
            label: "Invoice No",
            name: "invoice-no",
            value: true
          },
          {
            label: "Date",
            name: "date",
            value: true
          },
          {
            label: "Creator",
            name: "creator",
            value: true
          },
          {
            label: "Supplier Name",
            name: "supplier-name",
            value: true
          },

          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Total Selling Amount",
            name: "total-selling-amount",
            value: true
          },
          {
            label: "Profit",
            name: "profit",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      //  Return Invoice details
      {
        label: "Return Invoice Details",
        name: "return-invoice-details",
        value: true
      },
    ]
  },
  // Staffs
  {
    label: "Staffs",
    name: "staffs",
    id: 7,
    pages: [
      // Add Staff
      {
        label: "Add Staff",
        name: "add-staff",
        value: true,
        fields: [
          {
            label: "Designation",
            name: "designation",
            value: true
          },
          {
            label: "Roles",
            name: "roles",
            value: true
          }
          , {
            label: "Photo",
            name: "photo",
            value: true
          }, {
            label: "First Name",
            name: "firstName",
            value: true
          }, {
            label: "Last Name",
            name: "lastName",
            value: true
          }, {
            label: "Email",
            name: "email",
            value: true
          }, {
            label: "Mobile",
            name: "mobile",
            value: true
          },
          {
            label: "Password",
            name: "password",
            value: true
          },
          {
            label: "Password Confirmation",
            name: "password_confirmation",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },

        ]
      },
      // Manage Staffs
      {
        label: "Manage Staffs",
        name: "manage-staffs",
        value: true,
        fields: [
          {
            label: "ID",
            name: "id",
            value: true
          },
          {
            label: "Name",
            name: "name",
            value: true
          },

          {
            label: "Designation",
            name: "designation",
            value: true
          },
          {
            label: "Email",
            name: "email",
            value: true
          },
          {
            label: "Mobile",
            name: "mobile",
            value: true
          },
          {
            label: "Roles",
            name: "roles",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Edit Staffs
      {
        label: "Edit Staff",
        name: "edit-staff",
        value: true,
        fields: [
          {
            label: "Designation",
            name: "designation",
            value: true
          },
          {
            label: "Roles",
            name: "roles",
            value: true
          }
          , {
            label: "Photo",
            name: "photo",
            value: true
          }, {
            label: "First Name",
            name: "firstName",
            value: true
          }, {
            label: "Last Name",
            name: "lastName",
            value: true
          }, {
            label: "Email",
            name: "email",
            value: true
          }, {
            label: "Mobile",
            name: "mobile",
            value: true
          },
          {
            label: "Password",
            name: "password",
            value: true
          }, {
            label: "Password Confirmation",
            name: "password_confirmation",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },
        ]
      },
      // Staff Details
      {
        label: "Staff Details",
        name: "staff-details",
        value: true,
        fields: [
          {
            label: "Photo",
            name: "photo",
            value: true
          },
          {
            label: "First Name",
            name: "first-name",
            value: true
          },
          {
            label: "Last Name",
            name: "last-name",
            value: true
          },
          {
            label: "Designation",
            name: "designation",
            value: true
          },
          {
            label: "Email",
            name: "email",
            value: true
          },
          {
            label: "Mobile",
            name: "mobile",
            value: true
          },
          {
            label: "Roles",
            name: "roles",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Manage Roles
      {
        label: "Manage Roles",
        name: "manage-roles",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Total User",
            name: "total-user",
            value: true
          }
        ]
      },
      // Add Role
      {
        label: "Add Role",
        name: "add-role",
        value: true
      },
      // Edit Role
      {
        label: "Edit Role",
        name: "edit-role",
        value: true
      },
      // Role Details
      {
        label: "Role Details",
        name: "role-details",
        value: true
      }
    ]
  },
  // Loan
  {
    label: "Loan",
    name: "loan",
    id: 8,
    pages: [
      // Add Loaner
      {
        label: "Add Loaner",
        name: "add-loaner",
        value: true,
        fields: [
          {
            label: "Address",
            name: "address",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },
        ]
      },
      // Manage Loaner
      {
        label: "Manage Loaners",
        name: "manage-loaners",
        value: true,
        fields: [
          {
            label: "ID",
            name: "id",
            value: true
          },
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Mobile",
            name: "mobile",
            value: true
          },
          {
            label: "Email",
            name: "email",
            value: true
          },
          {
            label: "Address",
            name: "address",
            value: true
          },
          {
            label: "Total Loan",
            name: "total-loan",
            value: true
          },
          {
            label: "Opening Balance",
            name: "opening-balance",
            value: true
          },
          {
            label: "Total Paid",
            name: "paid-amount",
            value: true
          },
          {
            label: "Balance",
            name: "balance",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },
        ]
      },
      // Edit Loaner
      {
        label: "Edit Loaner",
        name: "edit-loaner",
        value: true,
        fields: [
          {
            label: "Address",
            name: "address",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },
        ]
      },
      // Loaner Details
      {
        label: "Loaner Details",
        name: "loaner-details",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Mobile",
            name: "mobile",
            value: true
          },
          {
            label: "Email",
            name: "email",
            value: true
          },
          {
            label: "Address",
            name: "address",
            value: true
          },
          {
            label: "Total Loan",
            name: "total-loan",
            value: true
          },
          {
            label: "Opening Balance",
            name: "opening-balance",
            value: true
          },
          {
            label: "Total Paid",
            name: "paid-amount",
            value: true
          },
          {
            label: "Balance",
            name: "balance",
            value: true
          },

          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Add Loan
      {
        label: "Add Loan",
        name: "add-loan",
        value: true,
        // fields: []
      },
      // Manage Loan
      {
        label: "Manage Loan",
        name: "manage-loan",
        value: true,
        fields: [
          {
            label: "ID",
            name: "id",
            value: true
          },
          {
            label: "Loaner",
            name: "loaner",
            value: true
          },
          {
            label: "Type",
            name: "type",
            value: true
          },
          {
            label: "Amount",
            name: "amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Contract Start",
            name: "contract-start",
            value: true
          },
          {
            label: "Contract End",
            name: "contract-end",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      },
      // Edit Loan
      {
        label: "Edit Loan",
        name: "edit-loan",
        value: true,
        // fields: []
      },
      // Loan Details
      {
        label: "Loan Details",
        name: "loan-details",
        value: true,
        fields: [

          {
            label: "Loaner",
            name: "loaner",
            value: true
          },
          {
            label: "Email",
            name: "email",
            value: true
          },
          {
            label: "Address",
            name: "address",
            value: true
          },
          {
            label: "Type",
            name: "type",
            value: true
          },
          {
            label: "Amount",
            name: "amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Contract Start",
            name: "contract-start",
            value: true
          },
          {
            label: "Contract End",
            name: "contract-end",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          }
        ]
      }
    ]
  },
  // Finance
  {
    label: "Finance",
    name: "finance",
    id: 9,
    pages: [
      // Add Account
      {
        label: "Add Account",
        name: "add-account",
        value: true,
        fields: [
          {
            label: "Statement",
            name: "statement",
            value: true,
          }
        ]
      },
      // Manage Accounts
      {
        label: "Manage Accounts",
        name: "manage-accounts",
        value: true,
        fields: [
          {
            label: "ID",
            name: "id",
            value: true,
          },
          {
            label: "Account No",
            name: "account-no",
            value: true,
          },
          {
            label: "Account Type",
            name: "account-type",
            value: true,
          },
          {
            label: "Account Holder Name",
            name: "account-holder-name",
            value: true,
          },
          {
            label: "City",
            name: "city",
            value: true,
          },
          {
            label: "Account Mobile",
            name: "account-mobile",
            value: true,
          },
          {
            label: "Account Email",
            name: "account-email",
            value: true,
          },
          {
            label: "Bank Name",
            name: "bank-name",
            value: true,
          },
          {
            label: "Branch Name",
            name: "branch-name",
            value: true,
          },
          {
            label: "Routing No",
            name: "routing-no",
            value: true,
          },
          {
            label: "Statement",
            name: "statement",
            value: true,
          },
          {
            label: "Status",
            name: "status",
            value: true,
          },
        ]
      },
      // Account Details
      {
        label: "Account Details",
        name: "account-details",
        value: true,
        fields: [
          {
            label: "ID",
            name: "id",
            value: true,
          },
          {
            label: "Account Photo",
            name: "account-photo",
            value: true,
          },
          {
            label: "Account No",
            name: "account-no",
            value: true,
          },
          {
            label: "Account Type",
            name: "account-type",
            value: true,
          },
          {
            label: "Account Holder Name",
            name: "account-holder-name",
            value: true,
          },
          {
            label: "City",
            name: "city",
            value: true,
          },
          {
            label: "Account Mobile",
            name: "account-mobile",
            value: true,
          },
          {
            label: "Account Email",
            name: "account-email",
            value: true,
          },
          {
            label: "Bank Name",
            name: "bank-name",
            value: true,
          },
          {
            label: "Branch Name",
            name: "branch-name",
            value: true,
          },
          {
            label: "Routing No",
            name: "routing-no",
            value: true,
          },

          {
            label: "NID Front",
            name: "nid-front",
            value: true,
          },
          {
            label: "NID Back",
            name: "nid-back",
            value: true,
          },
          {
            label: "Statement",
            name: "statement",
            value: true,
          },
          {
            label: "Status",
            name: "status",
            value: true,
          },
        ]
      },
      // Add Withdraws
      {
        label: "Add Withdraws",
        name: "add-withdraw",
        value: true,
        fields: [
          {
            label: "Reason",
            name: "reason",
            value: true,
          }
        ]
      },
      // Manage Withdraws
      {
        label: "Manage Withdraws",
        name: "manage-withdraws",
        value: true,
        fields: [
          {
            label: "Reason",
            name: "reason",
            value: true,
          }
        ]
      },
      // Edit withdraws
      {
        label: "Edit Withdraw",
        name: "edit-withdraw",
        value: true,
        fields: [
          {
            label: "Reason",
            name: "reason",
            value: true,
          }
        ]
      },
      // Withdraw Details
      {
        label: "withdraw Details",
        name: "withdraw-details",
        value: true,
        fields: [
          {
            label: "Reason",
            name: "reason",
            value: true,
          }
        ]
      },

    ]
  },
  // Services
  {
    label: "Services",
    name: "services",
    id: 10,
    pages: [
      // Manage Service Categories
      {
        label: "Manage Service Categories",
        name: "manage-service-categories",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true,
          },
          {
            label: "Description",
            name: "description",
            value: true,
          },
          {
            label: "Status",
            name: "status",
            value: true,
          },
        ]
      },
      // Add Service Category
      {
        label: "Add Service Category",
        name: "add-service-category",
        value: true,
        fields: [
          {
            label: "Description",
            name: "description",
            value: true,
          }
        ]
      },
      // Edit Service Category
      {
        label: "Edit Service Category",
        name: "edit-service-category",
        value: true,
        fields: [
          {
            label: "Description",
            name: "description",
            value: true,
          }
        ]
      },
      // Service Category details
      {
        label: "Service Category Details",
        name: "service-category-details",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true,
          },
          {
            label: "Description",
            name: "description",
            value: true,
          },
          {
            label: "Status",
            name: "status",
            value: true,
          },
        ]
      },

      // Manage Services
      {
        label: "Manage Services",
        name: "manage-services",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true,
          },
          {
            label: "Description",
            name: "description",
            value: true,
          },
          {
            label: "Type",
            name: "type",
            value: true,
          },
          {
            label: "Amount",
            name: "amount",
            value: true,
          },
          {
            label: "Status",
            name: "status",
            value: true,
          },
        ]
      },
      // Add Service
      {
        label: "Add Service",
        name: "add-service",
        value: true,
        fields: [
          {
            label: "Description",
            name: "description",
            value: true,
          }
        ]
      },
      // Edit Service
      {
        label: "Edit Service",
        name: "edit-service",
        value: true,
        fields: [
          {
            label: "Description",
            name: "description",
            value: true,
          }
        ]
      },
      // Service details
      {
        label: "Service Details",
        name: "service-details",
        value: true,
        fields: [
          {
            label: "Description",
            name: "description",
            value: true,
          }
        ]
      },
    ]
  },

  // Report
  {
    label: "Report",
    name: "report",
    id: 11,
    pages: [
      // Sale Invoice Report
      {
        label: "Sale Invoices",
        name: "sale-invoices",
        value: true,
        fields: [
          {
            label: "Invoice No",
            name: "invoice-no",
            value: true
          },
          {
            label: "Date",
            name: "date",
            value: true
          },
          {
            label: "Due Date",
            name: "due-date",
            value: true
          },
          {
            label: "Creator",
            name: "creator",
            value: true
          },
          {
            label: "Customer",
            name: "customer",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Charge",
            name: "total-charge",
            value: true
          },
          {
            label: "Total Discount",
            name: "total-discount",
            value: true
          },
          {
            label: "Total Cost",
            name: "total-cost",
            value: true
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true
          },
          {
            label: "Status",
            name: "status",
            value: true
          },
          {
            label: "Note",
            name: "note",
            value: true
          },
        ],
      },
      // Sale Items Report
      {
        label: "Sale Items",
        name: "sale-items",
        value: true,
        fields: [
          {
            label: "Product Name",
            name: "product-name",
            value: true,
          },
          {
            label: "Invoice",
            name: "invoice-no",
            value: true,
          },
          {
            label: "Purchase Rate",
            name: "purchase-rate",
            value: true,
          },
          {
            label: "Quantity",
            name: "quantity",
            value: true,
          },
          {
            label: "Total Cost",
            name: "total-cost",
            value: true,
          },
          {
            label: "Sale Rate",
            name: "sale-rate",
            value: true,
          },
          {
            label: "Discount",
            name: "discount",
            value: true,
          },
          {
            label: "Total",
            name: "total-amount",
            value: true,
          },
          {
            label: "Profit",
            name: "profit",
            value: true,
          },
        ]
      },
      // Return Items Report
      {
        label: "Return Items",
        name: "return-items",
        value: true,
        fields: [
          {
            label: "Product Name",
            name: "product-name",
            value: true,
          },
          {
            label: "Batch Name",
            name: "batch-name",
            value: true,
          },
          {
            label: "Invoice",
            name: "invoice-no",
            value: true,
          },
          {
            label: "Quantity",
            name: "quantity",
            value: true,
          },
          {
            label: "Sale Rate",
            name: "return-rate",
            value: true,
          },
          {
            label: "Total",
            name: "total-amount",
            value: true,
          },

        ]
      },
      // Expense Invoices Report
      {
        label: "Expense Invoices",
        name: "expense-invoices",
        value: true,
        fields: [
          {
            label: "Date",
            name: "date",
            value: true,
          },
          {
            label: "Invoice No",
            name: "invoice-no",
            value: true,
          },
          {
            label: "Expense Type",
            name: "category-name",
            value: true,
          },
          {
            label: "Created By",
            name: "created-by",
            value: true,
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true,
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true,
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true,
          },
        ]
      },
      // Expense Categories Report
      {
        label: "Expense Categories",
        name: "expense-categories",
        value: true,
        fields: [
          {
            label: "Expense Type",
            name: "expense-type",
            value: true,
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true,
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true,
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true,
          },
          {
            label: "Last Expense",
            name: "last-expense",
            value: true,
          },
        ]
      },
      // Purchase Invoices Report
      {
        label: "Purchase Invoices",
        name: "purchase-invoices",
        value: true,
        fields: [
          {
            label: "Invoice No",
            name: "invoice-no",
            value: true,
          },
          {
            label: "Date",
            name: "date",
            value: true,
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true,
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true,
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true,
          },
          {
            label: "Profit",
            name: "profit",
            value: true,
          },
        ]
      },
      // Suppliers Report
      {
        label: "Suppliers",
        name: "suppliers",
        value: true,
        fields: [
          {
            label: "Supplier",
            name: "supplier",
            value: true,
          },
          {
            label: "Mobile",
            name: "mobile",
            value: true,
          },
          {
            label: "Total Invoice",
            name: "total-invoice",
            value: true,
          },
          {
            label: "Total Purchase",
            name: "total-purchase",
            value: true,
          },
          {
            label: "Total Paid",
            name: "total-paid",
            value: true,
          },
          {
            label: "Total Due",
            name: "total-due",
            value: true,
          },
        ]
      },
      // Stock Report
      {
        label: "Stocks",
        name: "stocks",
        value: true,
        fields: [
          {
            label: "Product",
            name: "product",
            value: true,
          },
          {
            label: "Batch",
            name: "batch",
            value: true,
          },
          {
            label: "Category",
            name: "category",
            value: true,
          },
          {
            label: "Purchase Rate",
            name: "purchase-rate",
            value: true,
          },
          {
            label: "Sale Rate",
            name: "sale-rate",
            value: true,
          },
          {
            label: "Quantity",
            name: "quantity",
            value: true,
          },
          {
            label: "Stock Balance",
            name: "stock-balance",
            value: true,
          },
          {
            label: "Sold",
            name: "sold",
            value: true,
          },
          {
            label: "Profit",
            name: "profit",
            value: true,
          },
        ]
      },
    ]
  },

  // Support
  {
    label: "Support",
    name: "support",
    id: 12,
    pages: [
      {
        label: "Manage Tickets",
        name: "manage-tickets",
        value: true,
        fields: [
          {
            label: "Subject",
            name: "subject",
            value: true,
          },
          {
            label: "Message",
            name: "message",
            value: true,
          },
          {
            label: "priority",
            name: "priority",
            value: true,
          },
          {
            label: "Status",
            name: "status",
            value: true,
          },
        ]
      },
      {
        label: "Add Ticket",
        name: "add-ticket",
        value: true,
        fields: [

          {
            label: "Subject",
            name: "subject",
            value: true,
          },
          {
            label: "Department",
            name: "category",
            value: true,
          },

          {
            label: "Message",
            name: "message",
            value: true,
          },
          {
            label: "priority",
            name: "priority",
            value: true,
          },
          {
            label: "Status",
            name: "status",
            value: true,
          },
          {
            label: "Attachments",
            name: "attachments",
            value: true,
          },
        ]
      },
      // {
      //   label: "Edit Ticket",
      //   name: "edit-ticket",
      //   value: true,
      // },
      {
        label: "Ticket Details",
        name: "ticket-details",
        value: true,
        fields: [
          {
            label: "Subject",
            name: "subject",
            value: true,
          },
          {
            label: "Department",
            name: "category",
            value: true,
          },
          {
            label: "Date",
            name: "create_date",
            value: true,
          },
          {
            label: "Message",
            name: "message",
            value: true,
          },
          {
            label: "priority",
            name: "priority",
            value: true,
          },
          {
            label: "Status",
            name: "status",
            value: true,
          },
          {
            label: "Attachments",
            name: "attachments",
            value: true,
          },

        ]
      },
    ]
  },

  // Settings
  {
    label: "Settings",
    name: "settings",
    id: 13,
    pages: [
      // General Settings
      {
        label: "General Settings",
        name: "general-settings",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "logo",
            name: "logo",
            value: true
          },
          {
            label: "Address",
            name: "address",
            value: true
          },
          {
            label: "City",
            name: "city",
            value: true
          },
          {
            label: "Country",
            name: "country",
            value: true
          },
          {
            label: "Industry",
            name: "industry",
            value: true
          },
          {
            label: "Phone",
            name: "phone",
            value: true
          },
          {
            label: "Fax",
            name: "fax",
            value: true
          },
          {
            label: "Website",
            name: "website",
            value: true
          },
          {
            label: "Default Customer",
            name: "default-customer",
            value: true
          },
          {
            label: "Invoice Footer",
            name: "invoice-footer",
            value: true
          }, {
            label: "Reset Account",
            name: "reset-account",
            value: true
          },
        ]
      },
      // Currency Settings
      {
        label: "Currency Settings",
        name: "currency-settings",
        value: true,
        fields: [
          {
            label: "Currency Name",
            name: "currency-name",
            value: true
          },
          {
            label: "Currency Code",
            name: "currency-code",
            value: true
          },
          {
            label: "Currency Symbol",
            name: "currency-symbol",
            value: true
          }
        ]
      },

      // Add Charges
      {
        label: "Add Charge",
        name: "add-charges",
        value: true,
        fields: [
          {
            label: "Charge Name",
            name: "name",
            value: true
          },
          {
            label: "Charge Amount",
            name: "amount",
            value: true
          },
          {
            label: "Charge Type",
            name: "charge-type",
            value: true
          },
          {
            label: "Charge By",
            name: "charge-by",
            value: true
          },
          {
            label: "Profitable",
            name: "profitable",
            value: true
          }, {
            label: "Status",
            name: "status",
            value: true
          },
        ]
      },
      // Manage Charges
      {
        label: "Manage Charges",
        name: "manage-charges",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Charged By",
            name: "charged-by",
            value: true
          },
          {
            label: "Amount",
            name: "amount",
            value: true
          },

          {
            label: "Type",
            name: "type",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },
          {
            label: "Total Paid",
            name: "total_paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total_due",
            value: true
          },
          {
            label: "Total Invoice",
            name: "total-invoice",
            value: true
          },
          {
            label: "Profitable",
            name: "profitable",
            value: true
          },
        ]
      },
      // Edit Charges
      {
        label: "Edit Charges",
        name: "edit-charges",
        value: true,
        fields: [
          {
            label: "Charge Name",
            name: "name",
            value: true
          },
          {
            label: "Charge Amount",
            name: "amount",
            value: true
          },
          {
            label: "Charge Type",
            name: "charge-type",
            value: true
          },
          {
            label: "Charge By",
            name: "charge-by",
            value: true
          },

          {
            label: "Total Paid",
            name: "total_paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total_due",
            value: true
          },
          {
            label: "Profitable",
            name: "profitable",
            value: true
          }, {
            label: "Status",
            name: "status",
            value: true
          },
        ]
      },
      // Charges Details
      {
        label: "Charges Details",
        name: "charges-details",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Charged By",
            name: "charged-by",
            value: true
          },
          {
            label: "Amount",
            name: "amount",
            value: true
          },
          {
            label: "Type",
            name: "type",
            value: true
          },
          {
            label: "Total Amount",
            name: "total-amount",
            value: true
          },

          {
            label: "Total Paid",
            name: "total_paid",
            value: true
          },
          {
            label: "Total Due",
            name: "total_due",
            value: true
          },

          {
            label: "Total Invoice",
            name: "total-invoice",
            value: true
          },
          {
            label: "Profitable",
            name: "profitable",
            value: true
          },
        ]
      },
      // Manage Units
      {
        label: "Manage Units",
        name: "manage-units",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Code",
            name: "code",
            value: true
          },
        ]
      },
      // Add Unit
      {
        label: "Add Unit",
        name: "add-unit",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Code",
            name: "code",
            value: true
          },
        ]
      },
      // Edit Unit
      {
        label: "Edit Unit",
        name: "edit-unit",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Code",
            name: "code",
            value: true
          },
        ]
      },
      // Unit Details
      {
        label: "Unit Details",
        name: "unit-details",
        value: true,
        fields: [
          {
            label: "Name",
            name: "name",
            value: true
          },
          {
            label: "Code",
            name: "code",
            value: true
          },
        ]
      },
      // packages
      {
        label: "Package",
        name: "package-list",
        value: true,

      },

    ]
  },
  //walet
  {
    label: "Wallets",
    name: "wallets",
    id: 14,
    // Category Fields
    pages: [
      {
        label: "My Wallet",
        name: "show-wallet",
        value: true,
      },
    ]
  },
  //cash balance history
  {
    label: "Cash Balance History",
    name: "balanceCash",
    id: 15,
    pages: [
      {
        label: "Manage Cash Balance",
        name: "manage-cash",
        value: true,
        fields: [
          {
            label: "Date",
            name: "date",
            value: true,
          },
          {
            label: "Type",
            name: "type",
            value: true,
          },
          {
            label: "Purpose",
            name: "purpose",
            value: true,
          },
          {
            label: "ReveiveType",
            name: "receiveType",
            value: true,
          },
          {
            label: "Amount",
            name: "amount",
            value: true,
          },
        ]
      },

    ]
  },

  //bank balance history
  {
    label: "Bank Balance History",
    name: "balanceBank",
    id: 16,
    pages: [
      {
        label: "Manage Bank Balance",
        name: "manage-bank",
        value: true,
        fields: [
          {
            label: "Date",
            name: "date",
            value: true,
          },
          {
            label: "Type",
            name: "type",
            value: true,
          },
          {
            label: "Purpose",
            name: "purpose",
            value: true,
          },
          {
            label: "ReveiveType",
            name: "receiveType",
            value: true,
          },
          {
            label: "Amount",
            name: "amount",
            value: true,
          },
        ]
      },

    ]
  },

  //Dashboard
  {
    label: "Dashboard",
    name: "dashboard",
    id: 17,
    pages: [
      {
        label: "Client Dashboard",
        name: "client",
        value: true,
        fields: [
          {
            label: "Total Product Category",
            name: "totalProductCategory",
            value: true,
          },
          {
            label: "Total Product",
            name: "totalProduct",
            value: true,
          },
          {
            label: "Total Invoice",
            name: "totalInvoice",
            value: true,
          },
          {
            label: "Total Staff",
            name: "totalStaff",
            value: true,
          },
          {
            label: "Total Customer",
            name: "totalCustomer",
            value: true,
          },
          {
            label: "Stock Amount",
            name: "stockAmount",
            value: true,
          },
          {
            label: "Monthly Report Graph",
            name: "monthlyReportGraph",
            value: true,
          },
          {
            label: "Recent Sales Report",
            name: "recentSalesReport",
            value: true,
          },
          {
            label: "Receiveable & Received Graph",
            name: "receiveableReceivedGraph",
            value: true,
          },
          {
            label: "Cash Balance",
            name: "cashBalance",
            value: true,
          },
          {
            label: "Bank Balance",
            name: "bankBalance",
            value: true,
          },
          {
            label: "Expense Amount",
            name: "expenseAmount",
            value: true,
          },
          {
            label: "Revenue",
            name: "revenue",
            value: true,
          },

        ]
      },

    ]
  },
]
