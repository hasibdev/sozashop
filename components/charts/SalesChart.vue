<template>
  <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
// let colors = ["green", "red", "yellow"]
export default {
  props: {
    datas: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      category: [],
    };
  },
  methods: {},

  computed: {
    monthList: () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    series() {
      const y_axis_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.datas.forEach((item) => {
        const monthIndex = this.monthList.findIndex((m) => m === item.month);
        y_axis_data[monthIndex] = item.total_amount.toFixed(2);
        // y_axis_data.push(item.total_amount)
      });
      return [{ data: y_axis_data, name: "Amount" }];
    },
    chartOptions() {
      // let x_axis_data = []
      // this.datas.forEach((item) => {
      //    x_axis_data.push(item.month)
      // })
      return {
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              //console.log(chart, w, e)
            },
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "10%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        plotOptions: {
          bar: {
            columnWidth: "70%",
            distributed: true,
          },
        },
        xaxis: {
          categories: this.monthList,
          labels: {
            style: {
              // colors: colors,
              fontSize: "12px",
            },
          },
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
