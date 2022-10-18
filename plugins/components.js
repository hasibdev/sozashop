import Vue from "vue"
import Vuelidate from 'vuelidate'
import VueApexCharts from 'vue-apexcharts'

// Plugins
Vue.use(Vuelidate)
Vue.use(VueApexCharts)

// Form
import InputControl from "@/components/forms/InputControl"
import EmailControl from "@/components/forms/EmailControl"
import SelectControl from "@/components/forms/SelectControl"
import TextControl from "@/components/forms/TextControl"
import MultiselectControl from "@/components/forms/MultiselectControl"
import SearchControl from "@/components/forms/SearchControl"
import DateControl from "@/components/forms/DateControl"
import CheckboxControl from "@/components/forms/CheckboxControl"
import DynamicField from "@/components/forms/DynamicField"
import ModalControl from "@/components/forms/ModalControl"
import SearchableSelect from "@/components/forms/SearchableSelect"
import SaleItemField from "@/components/forms/SaleItemField"
import Multiselect from "vue-multiselect"
import Autosuggest from "@/components/forms/Autosuggest"
import InputTags from "@/components/forms/InputTags"
import ImageUpload from "@/components/forms/ImageUpload"
import fileInput from "@/components/forms/fileInput"
import ValidatedInput from "@/components/forms/ValidatedInput"
import ValidatedSelectField from "@/components/forms/ValidatedSelectField"
import DateRange from "@/components/forms/DateRange"
import CustomCheck from "@/components/forms/CustomCheck"

Vue.component('apexchart', VueApexCharts)
Vue.component("custom-check", CustomCheck)
Vue.component("date-range", DateRange)
Vue.component("validated-select-field", ValidatedSelectField)
Vue.component("validated-input", ValidatedInput)
Vue.component("file-input", fileInput)
Vue.component("image-upload", ImageUpload)
Vue.component("input-tags", InputTags)
Vue.component("input-control", InputControl)
Vue.component("email-control", EmailControl)
Vue.component("select-control", SelectControl)
Vue.component("text-control", TextControl)
Vue.component("multiselect-control", MultiselectControl)
Vue.component("search-control", SearchControl)
Vue.component("date-control", DateControl)
Vue.component("checkbox-control", CheckboxControl)
Vue.component("dynamic-field", DynamicField)
Vue.component("modal-control", ModalControl)
Vue.component("searchable-select", SearchableSelect)
Vue.component("sale-item-field", SaleItemField)
Vue.component("multiselect", Multiselect)
Vue.component("autosuggest", Autosuggest)

// Buttons
import BtnPrimary from "@/components/buttons/BtnPrimary"
import BtnSecondary from "@/components/buttons/BtnSecondary"
import BtnSuccess from "@/components/buttons/BtnSuccess"
import BtnDanger from "@/components/buttons/BtnDanger"
import BtnLink from "@/components/buttons/BtnLink"
import BtnIconLink from "@/components/buttons/BtnIconLink"
import BtnIcon from "@/components/buttons/BtnIcon"
import BtnAction from "@/components/buttons/BtnAction"
import BackButton from "@/components/buttons/BackButton"

Vue.component("back-btn", BackButton)
Vue.component("btn-primary", BtnPrimary)
Vue.component("btn-secondary", BtnSecondary)
Vue.component("btn-success", BtnSuccess)
Vue.component("btn-danger", BtnDanger)
Vue.component("btn-link", BtnLink)
Vue.component("btn-icon-link", BtnIconLink)
Vue.component("btn-icon", BtnIcon)
Vue.component("btn-action", BtnAction)

// Details
import InputDetail from "@/components/details/InputDetail"
import EmailDetail from "@/components/details/EmailDetail"
import MobileDetail from "@/components/details/MobileDetail"
import ImageDetail from "@/components/details/ImageDetail"

Vue.component("image-detail", ImageDetail)
Vue.component("input-detail", InputDetail)
Vue.component("email-detail", EmailDetail)
Vue.component("mobile-detail", MobileDetail)

// Layouts
import Card from "@/components/layouts/Card"
import NoDataCard from "@/components/layouts/NoDataCard"
import Panel from "@/components/layouts/Panel"

Vue.component("card", Card)
Vue.component("no-data-card", NoDataCard)
Vue.component("panel", Panel)

// Uitls
import Badge from "@/components/utils/Badge"
import ActionDropdown from "@/components/utils/ActionDropdown"
import CopyToClipboard from 'vue-copy-to-clipboard'

Vue.component("copy-to-clipboard", CopyToClipboard)
Vue.component("badge", Badge)
Vue.component("action-dropdown", ActionDropdown)

// Views
import IndexView from "@/components/views/IndexView"
import DetailView from "@/components/views/DetailView"
import FormView from "@/components/views/FormView"
import LoadingView from "@/components/views/LoadingView"
import InvoiceLoading from "@/components/views/InvoiceLoading"
import LoadingCard from "@/components/views/LoadingCard"

Vue.component("index-view", IndexView)
Vue.component("detail-view", DetailView)
Vue.component("form-view", FormView)
Vue.component("loading-view", LoadingView)
Vue.component("invoice-loading", InvoiceLoading)
Vue.component("loading-card", LoadingCard)

// Tables
import DataTable from "@/components/tables/DataTable"

Vue.component("data-table", DataTable)

// Third Party Package
const printoptions = {
  name: "_blank",
  specs: ["fullscreen=yes"],
  styles: ["/css/print.css"]
}
import VueHtmlToPaper from "vue-html-to-paper"
Vue.use(VueHtmlToPaper, printoptions)
