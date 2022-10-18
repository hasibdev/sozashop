<template>
   <loading-view :loading="$fetchState.pending">
      <detail-view v-if="permissions">
         <template #header>
            <h3 class="font-weight-normal">
               {{ $t("roles.title.details") }} : {{ roles.name }}
            </h3>
            <div>
               <action-dropdown iconVariant="light" variant="primary">
                  <b-dropdown-item v-if="hasPagePermission('staffs.edit-role')" :to="localePath(`/roles/${$route.params.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
                     Edit</b-dropdown-item>
                  <b-dropdown-item @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
                     Delete</b-dropdown-item>
               </action-dropdown>
            </div>
         </template>

         <template>
            <card>
               <h4>Permissions</h4>

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
                                 <p class="lead w-100 font-weight-bold mb-0">{{ selected.label }}</p>
                              </div>

                              <div class="body">
                                 <ul class="pl-0 list list-unstyled">
                                    <li v-for="col in selected.permissions" :key="col.id" class="font-weight-bold item font-size-15">
                                       <span class="dot mr-1" :class="{ primary: hasPermission(col.id) }"></span>

                                       {{ col.label }}
                                    </li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <!-- <div class="col-lg-3 col-md-4 col-sm-6" v-for="row in permissions" :key="row.id">
							<h5>
								{{ row.label }}
							</h5>

							<ul class="pl-0 list-unstyled">
								<li v-for="col in row.permissions" :key="col.id" class="font-weight-bold font-size-15">
									<span class="dot mr-1" :class="{ primary: hasPermission(col.id) }"></span>

									{{ col.label }}
								</li>
							</ul>
						</div> -->
            </card>
         </template>
      </detail-view>
   </loading-view>
</template>

<script>
export default {
   name: "roles-details",
   data() {
      return {
         roles: null,
         permissions: null,
         selected: null,
      }
   },
   methods: {
      hasPermission(id) {
         return this.roles.permissions.some((p) => p.id == id)
      },
      remove() {
         console.log("remove")
      },
   },
   async fetch() {
      const resRoles = await this.$axios.get(`/roles/${this.$route.params.id}`)
      const resPermissions = await this.$axios.get("/ajax/permissions")

      this.roles = resRoles.data.data
      this.permissions = resPermissions.data.data
      this.selected = resPermissions.data.data[0]
   },
};
</script>

<style lang="scss">
.dot {
   width: 8px;
   height: 8px;
   background: var(--danger);
   border-radius: 100%;
   display: inline-block;

   &.primary {
      background: var(--success);
   }
}

// Card Column
.card-col {
   background: #fff;
   box-shadow: 0px 2px 10px #dedede;
   .header {
      background: #f3f3f5;
      padding: 8px 10px;
      display: flex;
      align-items: center;
   }
   .body {
      padding: 5px 10px;
      .list {
         list-style: none;
         padding-left: 0;
         .item {
            padding: 5px 0;
         }
      }
   }
}
</style>
