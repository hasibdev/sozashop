<template>
   <div>
      <div :class="cardclass" class="card rounded-sm shadow-sm">
         <!-- card header -->
         <div v-if="!disableTableHeader" class="card-header rounded-top rounded-sm p-3 border-bottom border-gray bg-white">
            <div class="d-flex justify-content-between position-relative">
               <!-- All Check -->
               <div v-if="!disableCheck" class="d-flex align-items-center cursor-pointer">
                  <!-- <input v-model="allSelected" @change="handleAllSelect" type="checkbox" v-if="laravelData.data && laravelData.data.length" role="button" /> -->
                  <custom-check id="table_header_all" v-model="allSelected" @change="handleAllSelect" v-if="laravelData.data && laravelData.data.length"></custom-check>
               </div>
               <span v-if="disableCheck"></span>

               <!-- Right Side Actions -->
               <div class="d-flex align-items-center">
                  <!-- This Place for Buttons -->
                  <slot name="buttons"></slot>

                  <!-- This Place for Lens -->
                  <slot name="lens"></slot>

                  <!-- Action Dropdown -->
                  <action-dropdown :split="false" iconVariant="light" variant="primary" v-if="checkedList.length && hasBulkActionSlot">
                     <slot :ids="actionable" name="bulk-action"></slot>
                  </action-dropdown>
                  <!-- 2nd filter -->
                  <div v-click-outside="hide" class="ml-4" v-if="$slots.filter">
                     <button @click="showFilter = !showFilter" class="d-flex align-items-center bg-transparent border-0  outline-0 text-primary h4 mb-0">
                        <i class="fas fa-filter"></i>
                        <i class="fas fa-angle-down ml-1"></i>
                     </button>

                     <div class="filter shadow-lg" v-if="showFilter">
                        <card>
                           <slot name="filter">
                              <div class="text-center">
                                 <span class="text-muted">No Filter Added</span>
                              </div>
                           </slot>
                        </card>
                     </div>
                  </div>
                  <!-- Delete Dropdown -->
                  <div class="dropdown ml-2 position-relative" v-if="checkedList.length" v-click-outside="() => (showDeleteDrop = false)">
                     <button class=" d-flex align-items-center bg-transparent border-0 outline-0 text-danger h4 mb-0" @click="showDeleteDrop = !showDeleteDrop">
                        <i class="fas fa-trash-alt"></i>
                        <i class="fas fa-angle-down ml-1"></i>
                     </button>
                     <div class="delete-dropdown border" v-if="showDeleteDrop">
                        <!-- Delete All -->
                        <p @click="removeAll" role="button" class="dropdown-item mb-0" v-if="actionable.length">
                           Delete Selected ({{ actionable.length }})
                        </p>
                        <!-- Force Delete All -->
                        <!-- <p @click="forceDeleteAll" role="button" class="dropdown-item mb-0" v-if="softDelete">
									Force Delete Selected ({{ checkedList.length }})
								</p> -->
                        <!-- Restore All -->
                        <p @click="restoreAll" role="button" class="dropdown-item mb-0" v-if="restorable.length && softDelete">
                           Restore Selected ({{ restorable.length }})
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <!-- card header end -->

         <loading-card :loading="isLoading">
            <div ref="dataTable" class="card-body p-0" v-if="laravelData.data && laravelData.data.length">
               <div class="table-responsive">
                  <table class="table">
                     <thead class="bg-secondary">
                        <tr class="border-0">
                           <th v-if="!disableCheck"></th>
                           <th v-if="showIndex">#</th>
                           <th class="py-3 px-3" v-for="(col, index) in availableColumns" :key="index">
                              <div class="d-flex align-items-center">
                                 <span class="mr-2">{{
                        $t(`fields.${getLabel(col)}`)
                      }}</span>

                                 <!-- Sort Icon -->

                                 <!-- <span class="sort" role="button" @click="handleSort(col)" v-if="col.sortable !== false">
												<i class="fas fa-sort-up" :class="{ active: sort.key == getField(col) && sort.order == 'asc',}"></i>
												<i class="fas fa-sort-down" :class="{ active: sort.key == getField(col) && sort.order == 'desc',}"></i>
											</span> -->
                              </div>
                           </th>
                           <th class="text-right" v-if="action"></th>
                        </tr>
                     </thead>
                     <tbody>

                        <template v-for="(row, index) in laravelData.data">
                           <slot name='table-rows' :row="row" :index="index" :availableColumns="availableColumns" :getField="getField" :getLabel="getLabel" :remove="remove">
                              <tr :key="index">
                                 <td v-if="!disableCheck">
                                    <!-- <input v-model="checkedList" :value="row.id" type="checkbox" autocomplete="off" @change="onDataCheck" role="button" /> -->
                                    <custom-check :id="`check_id_${index}`" :value="row.id" v-model="checkedList" @change="onDataCheck"></custom-check>
                                 </td>
                                 <td v-if="showIndex">{{ index + 1 }}</td>
                                 <td class="px-3" v-for="(col, index) in availableColumns" :key="index" style="vertical-align: middle" :title="$t(`fields.${getLabel(col)}`)">
                                    <slot :name="getField(col)" :col="row[getField(col)]" :row="row">
                                       {{ getFieldOutput(row, col) }}
                                    </slot>
                                 </td>
                                 <td align="right">
                                    <!-- Action Column Slot -->
                                    <div class="d-flex justify-content-end align-items-center">
                                       <slot :row="row" :remove="remove" :index="index" name="action" v-if="row.deletedAt == null">
                                       </slot>
                                       <!-- Restore -->
                                       <btn-icon v-else @click="restore(row.id, index)">
                                          <i class="fas fa-retweet text-info"></i>
                                       </btn-icon>
                                    </div>
                                 </td>
                              </tr>
                           </slot>
                        </template>
                     </tbody>
                  </table>
               </div>
            </div>
            <no-data-card v-else></no-data-card>
         </loading-card>
      </div>

      <div class="d-flex align-items-center my-3" v-if="laravelData.data && laravelData.data.length">
         <!-- Table Pagination -->
         <pagination class="d-none d-md-flex mb-0" :limit="3" :data="laravelData" @pagination-change-page="getResults"></pagination>
         <pagination class="d-flex d-md-none mb-0" :limit="-1" :data="laravelData" @pagination-change-page="getResults"></pagination>

         <p class="mb-0 ml-auto">
            {{ laravelData.meta.from }}-{{ laravelData.meta.to }} of
            {{ laravelData.meta.total }}
         </p>
      </div>
   </div>
</template>

<script>
import ClickOutside from "vue-click-outside"
import Datatable from "@/plugins/mixins/datatable"
export default {
   props: {
      /**
       * Available columns name
       */
      columns: {
         type: Array,
         required: true,
      },

      /**
       * Api url to get data
       */
      url: {
         type: String,
         required: true,
      },

      /**
       * Show or Hide action column
       */
      action: {
         type: Boolean,
         default: true,
      },

      /**
       * Filters for the datatable
       */
      filters: {
         type: [Object, Array],
         default: {},
      },

      /**
       * Enable softdelete methods
       */
      softDelete: {
         type: Boolean,
         default: true,
      },

      /**
       * Show the row number
       */
      showIndex: {
         type: Boolean,
         default: false,
      },
      /**
       * Disable Checkbox
       */
      disableCheck: {
         type: Boolean,
         default: false,
      },
      /**
       * Disable Checkbox
       */
      disableTableHeader: {
         type: Boolean,
         default: false,
      },
      /**
       * Custom calss for card
       */
      cardclass: {
         type: String,
         default: "mt-3",
      },
   },
   mixins: [Datatable],
   data() {
      return {
         laravelData: {},
         checkedList: [],
         sort: {
            key: "id",
            order: "desc",
         },
         showFilter: false,
         showDeleteDrop: false,
         allSelected: false,
      }
   },

   computed: {
      availableColumns() {
         return this.columns.filter((item) => {
            if (typeof item === "object") {
               if (item.hasOwnProperty("permission")) {
                  return this.hasFieldPermission(item.permission)
               }
            }
            return item
         })
      },
   },

   watch: {
      /**
       * Watch for search value changes
       */
      filters: {
         handler: function () {
            this.getResults()
         },
         deep: true,
      },
      /**
       * Watch for checkedList value changes
       */
      checkedList(value) {
         this.$emit("onCheck", value)
      },
      showFilter(value) {
         this.$emit("toggledFilter", value)
      },
   },

   methods: {
      // /**
      //  * Get the Field Output
      //  */
      // getFieldOutput(row, col) {
      //   return row[this.getField(col)] ?? "-";
      // },

      /**
           * A function to take a string written in dot notation style, and use it to
           * find a nested object property inside of an object.
           *
           * @param String nested A dot notation style parameter reference (ie "urls.small")
           * @param Object object (optional) The object to search
           *
           * @return the value of the property in question
           */
      getProperty(o, s) {
         s = s.replace(/\[(\w+)\]/g, ".$1") // convert indexes to properties
         s = s.replace(/^\./, "") // strip a leading dot
         var a = s.split(".")
         for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i]
            if (k in o) {
               o = o[k]
            } else {
               return
            }
         }
         return o
      },

      /**
       * Get the Field Output
       */
      getFieldOutput(row, col) {
         return this.getProperty(row, this.getField(col)) ?? "-"
      },

      /**
       * Get the column label
       */
      getLabel(value) {
         if (typeof value === "object") {
            return value.label || value.field
         }
         return value
      },

      /**
       * Get the column field name
       */
      getField(value) {
         if (typeof value === "object") {
            return value.field
         }
         return value
      },

      sortString() {
         return `${this.sort.key},${this.sort.order}`
      },

      /**
       * Get the result from laravel endpoint
       */
      getResults(page = 1) {
         // Set the loading
         this.isLoading = true
         this.$axios
            .get(
               `${this.url}?page=${page}${this.getQueries(
                  this.filters
               )}&sort=${this.sortString()}`
            )
            .then((response) => {
               // Set data
               this.laravelData = response.data
               // Disable loading
               this.isLoading = false

               this.allSelected = false
               this.checkedList = []

               // NextTick call After data render
               // this.$nextTick(() => {
               // 	this.fixedTableHeader();
               // });
            })
            .catch((err) => {
               console.log(err)
               this.allSelected = false
               this.checkedList = []
            })
      },

      /**
       * Hide the filter
       */
      hide() {
         this.showFilter = false
      },

      /**
       * Handle data sorting
       */
      handleSort(column) {
         const key = this.getField(column)

         if (key === this.sort.key) {
            this.sort.order = this.sort.order === "asc" ? "desc" : "asc"
         } else {
            this.sort.order = "asc"
         }

         // Set the sort key
         this.sort.key = key

         // Get the data
         this.getResults()

         // // Set sort order
         // this.sort.order = (this.sort.key == key) ? ! this.sort.order : false;

         // console.log(JSON.stringify(this.sort));
      },

      /**
       * Handle All Select
       */
      handleAllSelect(e) {
         if (this.allSelected)
            this.checkedList = this.laravelData.data.map((data) => data.id)
         else this.checkedList = []
      },
      /**
       * When Check on Single Data Checkbox
       */
      onDataCheck() {
         // Toggle All Select Checkbox
         if (this.checkedList.length === this.laravelData.data.length)
            this.allSelected = true
         else this.allSelected = false
      },
   },

   /**
    * Add outside click directive
    */
   directives: {
      ClickOutside,
   },

   mounted() {
      /**
       * Fetch the initial result
       */
      this.getResults()
   },
   created() {
      // Listening to global event.
      this.$nuxt.$on("getResults", () => {
         this.getResults()
      })
   },
};
</script>

<style lang="scss">
.table-responsive {
   min-height: 330px;
}

.filter {
   position: absolute;
   right: 0;
   top: calc(100% + 7px);
   width: 100%;
   z-index: 50;

   @media (min-width: 576px) {
      width: 400px;
   }
}

.delete-dropdown {
   position: absolute;
   right: 0;
   top: calc(100% + 7px);
   background: white;
   z-index: 9;
}

.sort {
   display: inline-flex;
   align-items: center;
   flex-direction: column;
   i {
      line-height: 0;
      font-size: 1rem;
      color: gray;
   }

   i.active {
      color: black;
   }
}
.table th,
.table td {
   vertical-align: middle;
}
</style>
