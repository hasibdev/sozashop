import Vue from 'vue'

import VueSimplebar from 'vue-simplebar'
import 'vue-simplebar/dist/vue-simplebar.min.css'




Vue.use(VueSimplebar)

Vue.component('pagination', require('laravel-vue-pagination'));
