<template>
   <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
export default {
   data() {
      return {
         series: [
            {
               name: 'TEAM A',
               type: 'column',
               data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
            }, {
               name: 'TEAM B',
               type: 'area',
               data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
            }, {
               name: 'TEAM C',
               type: 'line',
               data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
            }
         ],

         chartOptions: {
            chart: {
               height: 350,
               type: 'line',
               stacked: false,
            },
            stroke: {
               width: [0, 2, 5],
               curve: 'smooth'
            },
            plotOptions: {
               bar: {
                  columnWidth: '50%'
               }
            },
         }

      }
   }
}
</script>

<style lang="scss" scoped>
</style>
