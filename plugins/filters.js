import Vue from "vue";


// Filters
import PageFilter from "@/filters/PageFilter";
import TrashFilter from "@/filters/TrashFilter";
import InvoiceStatusFilter from "@/filters/InvoiceStatusFilter";
import DateFilter from "@/filters/DateFilter";
import MultiSelectFilter from "@/filters/MultiSelectFilter";

Vue.component("multi-select-filter", MultiSelectFilter);
Vue.component("date-filter", DateFilter);
Vue.component("page-filter", PageFilter);
Vue.component("trash-filter", TrashFilter);
Vue.component("invoice-status-filter", InvoiceStatusFilter);
