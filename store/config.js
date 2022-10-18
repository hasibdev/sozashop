export const state = () => ({
  enums: null,
  options: null,
  settings: null,
  loaded: false
})

// Getters
export const getters = {
  getLoaded(state) {
    state.loaded
  },
  getStatus(state) {
    return state.options?.activeStatus
  },
  getIndustryStatusOptions(state) {
    return state.options?.industryStatus
  },
  getInvoiceStatus(state) {
    return state.options?.invoiceStatus
  },
  getApplicationSetting(state) {
    return state.settings?.find(s => s.type === "application")
  },
  getCurrencySettings(state) {
    return state.settings?.find(s => s.type === "currency")
  },
  getEnumsInvoiceStatus(state) {
    return state.enums?.invoiceStatus
  },
  getPaymentMethods(state) {
    return state.options?.paymentMethod
  },
  getPaymentable(state) {
    return state.enums?.paymentable
  },
  getLoanTypes(state) {
    return state.options?.loanType
  },
  getChargeTypes(state) {
    return state.options?.chargeType
  },
  getChargedBy(state) {
    return state.options?.chargedBy
  },
  getDiscountTypes(state) {
    return state.options?.discountType
  },
  getAccountTypes(state) {
    return state.options?.accountType
  },
  getClientVerificationTypes(state) {
    return state.options?.clientVerificationTypes
  },
  getWithdrawOptions(state) {
    return state.options?.withdrawStatus
  },
  getServiceTypeOptions(state) {
    return state.options?.serviceType
  },
  getOpenStatusOptions(state) {
    return state.options?.openStatus
  },
  getPriorityOptions(state) {
    return state.options?.priority
  },
  getPackageOptions(state) {
    return state.options?.packageType
  }
}

// Mutations
export const mutations = {
  SET_STATE(state, config) {
    state.enums = config.enums
    state.options = config.options
    state.settings = config.settings
    state.loaded = true
  },
  SET_DEFAULT_CUSTOMER(state, id) {
    const appSettings = state.settings?.find(s => s.type === "application")
    appSettings.data.defaultCustomer = id
  }
}

// Actions
export const actions = {
  async setConfig({ commit }, { url }) {
    try {
      const resConfig = await this.$axios.$post(url)
      commit("SET_STATE", resConfig)
    } catch (error) {
      console.log(error)
    }
  }
}
