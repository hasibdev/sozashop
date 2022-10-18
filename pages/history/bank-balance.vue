<template>
   <index-view>
      <template #title> {{ $t("dashboard.bankHistory") }} </template>

      <!-- List Header -->
      <template #header>
         <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

      </template>

      <template>
         <data-table disableCheck :key="tableKey" @onCheck="onCheck" :columns="columns" url="/balance-history/bank" :filters="filters">

            <!-- Type Column -->
            <template v-slot:type="{ col }">
               <span class="text-capitalize">{{ col.split('-').join(' ') }}</span>
            </template>

            <!-- receiveType Column -->
            <template v-slot:receiveType="{ col }">
               <span class="text-capitalize">{{ col.split('-').join(' ') }}</span>
            </template>

            <!-- Date Column -->
            <template v-slot:date="{ col }">
               {{ $moment(col).format('Do MMM YY') }}
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
import { mapGetters } from "vuex"
import validation from "@/plugins/mixins/validation"

export default {
   name: "bank-balance",
   mixins: [validation],

   data() {
      return {
         tableKey: 1,
         columns: [
            {
               field: "date",
               permission: "balanceBank.manage-bank.date",
            },
            {
               field: "type",
               permission: "balanceBank.manage-bank.type",
            },
            {
               field: "purpose",
               permission: "balanceBank.manage-bank.purpose",
            },
            {
               field: "receiveType",
               permission: "balanceBank.manage-bank.receiveType",
            },
            {
               field: "amount",
               permission: "balanceBank.manage-bank.amount",
            },
         ],
         filters: {
            search: "",
            perPage: 25,
         },
         checkedList: [],
         calculateData: null,
         paySavingState: false,
      }
   },
   computed: {
      ...mapGetters({
         paymentMethods: "config/getPaymentMethods",
         paymentable: "config/getPaymentable",
      }),
   },
   methods: {
      // Tigger when select or checked any data
      onCheck(val) {
         this.checkedList = val
      },
   },
};
</script>

<style lang="scss" scoped></style>
