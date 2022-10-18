<template>
   <div>
      <div class="mb-2">
         <a href="javascript:void(0)" @click="$router.back()" class="text-primary p-1">
            &#60; Go Back</a>
      </div>

      <slot name="titlebar"></slot>

      <h4 class="mb-2">
         <slot name="header"></slot>
      </h4>

      <div class="row mt-3">
         <div class="col-12">
            <card>
               <slot></slot>
               <div class="form-footer">
                  <slot name="footer"></slot>
               </div>
            </card>
         </div>
      </div>
   </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.form-footer {
   display: flex;
   justify-content: flex-end;

   .btn:not(:last-child) {
      margin-right: 10px;
   }
}
</style>
