<template>
   <div>
      <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
   </div>
</template>

<script>
export default {
   props: {
      currentMonth: {
         type: Array,
         required: true
      },
   },
   computed: {
      series() {
         return [
            {
               name: 'Last Month',
               data: [
                  { x: 2, y: 28 },
                  { x: 6, y: 61 },
                  { x: 10, y: 45 },
               ]
            },
            {
               name: 'This Month',
               data: [
                  { x: 2, y: 15 },
                  { x: 8, y: 76 },
               ]
            },
         ]
      },
      chartOptions() {
         return {
            chart: {
               height: 350,
               type: 'area'
            },
            dataLabels: {
               enabled: false
            },
            stroke: {
               curve: 'smooth'
            },
            xaxis: {
               type: 'xaxis',
               categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
            },
            tooltip: {
               x: {
                  format: 'dd/MM/yy HH:mm'
               },
            },
         }
      },
      categories() {
         return this.currentMonth
      }
   },
}
</script>

<style lang="scss" scoped>
</style>
