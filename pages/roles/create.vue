<template>
   <loading-view :loading="$fetchState.pending">
      <form-view>
         <template #header> {{ $t("roles.title.add") }} </template>
         <template>
            <!-- Name -->
            <input-control focus v-model="formData.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>

            <!-- Permissions -->
            <div class="row">
               <div class="col-12 d-flex align-items-center mb-3">
                  <h4 class="mb-0 mr-3">Permissions</h4>

                  <div class="ml-auto">
                     <button @click="selectAll" type="button" class="btn btn-sm mx-2 btn-info">
                        Select All
                     </button>
                     <button type="button" class="btn btn-sm btn-danger" @click="unSelectAll">
                        UnSelect All
                     </button>
                  </div>
               </div>
            </div>

            <div class="row">
               <div class="col-3">
                  <ul class="list-group  rounded-0 permission-menu mb-1">
                     <li v-for="(per, i) in permissions" :key="i" @click="selected = per" class="list-group-item" :class="{ active: per.id == selected.id }" role="button">
                        {{ per.label }}
                     </li>
                  </ul>
               </div>

               <div class="col-9" v-if="selected">
                  <div class="row">
                     <div class="col-md-6 col-xl-5 mb-4">
                        <div class="card-col h-100">
                           <div class="header border-bottom">
                              <label class="lead w-100 font-weight-bold mb-0 d-flex justify-content-between" role="button">
                                 <p class="mb-1">{{ selected.label }}</p>
                                 <b-form-checkbox :value="selected.id" v-model="rowItems" @change="onSelectRow($event, selected)" name="row-check" switch></b-form-checkbox>
                              </label>
                           </div>

                           <div class="body">
                              <div class="list">
                                 <div v-for="col in selected.permissions" :key="col.id" class="item mt-1">
                                    <label class="mb-0 d-flex justify-content-between" role="button">
                                       <p class="mb-1">{{ col.label }}</p>

                                       <b-form-checkbox :value="col.id" v-model="formData.permissions" @change="onSelectCol($event, selected)" name="col-check" switch>
                                       </b-form-checkbox>
                                    </label>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Permissions Row -->
            <!-- <div class="col-lg-3 col-md-4 col-sm-6 my-3 " v-for="row in permissions" :key="row.id">
               <div class="">
                  <label class="lead font-weight-bold mb-0 d-flex justify-content-between" role="button">
                     <p class="mb-1">{{ row.label }}</p>
                     <b-form-checkbox :value="row.id" v-model="rowItems" @change="onSelectRow($event, row)" name="row-check" switch>
                     </b-form-checkbox>
                  </label>
               </div>

               <div v-for="col in row.permissions" :key="col.id" class="mt-1">
                  <label class="mb-0 d-flex justify-content-between" role="button">
                     <p class="mb-1">{{ col.label }}</p>

                     <b-form-checkbox :value="col.id" v-model="formData.permissions" @change="onSelectCol($event, row)" name="col-check" switch>
                     </b-form-checkbox>
                  </label>
               </div>
            </div> -->
         </template>

         <!-- Action Buttons -->
         <template #footer>
            <btn-link class="btn-secondary" to="/roles">
               {{ $t("buttons.cancel") }}
            </btn-link>
            <btn-success :loading="savingState" @click="save($event, true)">
               {{ $t("buttons.submitContinue") }}
            </btn-success>
            <btn-primary v-shortkey="['ctrl', 'enter']" @shortkey.native="save()" v-b-tooltip.hover title="Shotcut Press 'Ctrl+Enter'" :loading="savingState" @click="save">
               {{ $t("buttons.submit") }}
            </btn-primary>
         </template>
      </form-view>
   </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation"

export default {
   name: "create-role",
   mixins: [validation],
   data() {
      return {
         formData: {
            name: "",
            permissions: [],
         },
         permissions: null,
         rowItems: [],
         selected: null,

         initialData: null,

         savingState: false,
      }
   },
   methods: {
      async save(event, createAndContinue = false) {
         this.savingState = true
         try {
            await this.$axios.$post("/roles", {
               ...this.formData,
               name: `${this.formData.name}_${this.$auth.user.id}`
            })
            this.$toast.success("Roles created successfully.")
            if (createAndContinue) {
               this.reset()
            } else {
               this.$router.push(this.localePath("/roles"))
            }
         } catch (error) {
            console.log(error)
         } finally {
            this.savingState = false
         }
      },
      reset() {
         this.formData = { ...this.initialData }
         this.rowItems = []
      },
      /**
       * Select All
       */
      selectAll() {
         const allId = []
         for (const row of this.permissions) {
            this.rowItems.push(row.id)
            for (const col of row.permissions) {
               allId.push(col.id)
            }
         }
         this.formData.permissions = allId
      },
      /**
       * UnSelect All
       */
      unSelectAll() {
         this.rowItems = []
         this.formData.permissions = []
      },
      /**
       * Handle Select Row
       */
      onSelectRow(e, row) {
         // console.log(e, row);
         if (e.includes(row.id)) {
            for (const col of row.permissions) {
               if (!this.formData.permissions.includes(col.id)) {
                  this.formData.permissions.push(col.id)
               }
            }
         } else {
            for (const col of row.permissions) {
               this.formData.permissions = this.formData.permissions.filter(
                  (item) => item != col.id
               )
            }
         }
      },
      /**
       * Handle Select Column
       */
      onSelectCol(e, row) {
         const rowIds = row.permissions.map((p) => p.id)
         if (rowIds.every((id) => this.formData.permissions.includes(id))) {
            this.rowItems.push(row.id)
         } else {
            this.rowItems = this.rowItems.filter((item) => item !== row.id)
         }
      },
   },

   created() {
      this.initialData = { ...this.formData }
   },
   async fetch() {
      const res = await this.$axios.get("/ajax/permissions")
      this.permissions = res.data.data
      this.selected = res.data.data[0]
   },
};
</script>

<style lang="scss" scoped></style>
