<template>
  <b-tab active :title="$t('fields.transitions')">
    <data-table :key="transitionKey" cardclass="mt-0" :columns="transactionscolumns" url="/transactions" :filters="transactionsfilters">
      <!-- Method Column -->
      <template #method="{col}">
        {{col | capitalize}}
      </template>
      <!-- Amount Column -->
      <template #amount="{col}">
        <b-badge :variant="col < 0 ? `danger` : `success`">{{col}}</b-badge>
      </template>
    </data-table>
  </b-tab>
</template>

<script>
export default {
  data() {
    return {
      transactionscolumns: ["id", "description", "method", "amount"],
      transactionsfilters: {
        search: "",
        perPage: 25,
      },
    };
  },
  props: {
    transitionKey: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>