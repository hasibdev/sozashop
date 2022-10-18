<template>
  <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
export default {
  props: {
    received: {
      type: Number,
      default: 0,
    },
    receiveable: {
      type: Number,
      default: 0,
    },
    expenseAmount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: "donut",
        },
        labels: ["RECEIVABLE", "RECEIVED"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  },
  computed: {
    series() {
      return [this.getReceiveable, this.getReceived];
    },
    getReceiveable() {
      return this.receiveable;
    },
    getReceived() {
      return this.received;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
