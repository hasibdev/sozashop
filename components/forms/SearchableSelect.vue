<template>
   <div class="form-group row align-items-center">
      <label :for="getName" class="mb-0" :class="[label && stack === false ? 'col-sm-2' : 'col-sm-12']" v-if="label">{{ label }}</label>
      <div :class="[label && stack === false ? 'col-sm-10' : 'col-sm-12']">
         <div class="d-flex">
            <multiselect :internalSearch="internalSearch" :searchable="searchable" @search-change="$emit('search-change', $event)" :loading="loading" :placeholder="placeholder" :label="title" :options="options" :multiple="false" v-model="innerValue" :show-labels="false" @input="handleInput" :allow-empty="true" openDirection="bottom" :disabled="readonly" @select="$emit('select', innerValue)">
               <!-- singleLabel -->
               <template #singleLabel="{option}">
                  <slot name="singleLabel" :option="option" />
               </template>

               <!-- Option -->
               <template #option="{option}">
                  <slot name="option" :option="option" />
               </template>
            </multiselect>

            <slot name="action"></slot>
            <slot name="icon-right" />
         </div>

         <p class="text-muted mb-0">
            <slot name="help"></slot>
         </p>
         <span class="text-danger">{{ error[0] }}</span>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      // Select options
      options: {
         type: [Array, Object],
         required: true,
      },

      // Searchable or not
      searchable: {
         type: Boolean,
         default: true,
      },
      internalSearch: {
         type: Boolean,
         default: true,
      },

      // Loading
      loading: {
         type: Boolean,
         default: false,
      },

      // Input Label
      label: {
         type: String,
         required: false,
      },

      // Option title to show
      title: {
         type: String,
         default: "name",
      },

      // Return value for v-model
      track: {
         type: String,
         default: "id",
      },

      // Validation error
      error: {
         type: Array,
         default: () => [],
      },

      // Use for id and tag
      name: {
         type: [String, Number],
         required: false,
      },

      // Select placeholder
      placeholder: {
         type: String,
         default: "Choose Options",
      },

      // Default selected value
      value: {
         default: "",
      },

      // Control select placeholder
      showPlaceholder: {
         type: Boolean,
         default: true,
      },

      // Disable the field
      readonly: {
         type: Boolean,
         default: false,
      },

      // Stack label
      stack: {
         type: Boolean,
         default: false,
      },
   },
   data() {
      return {
         innerValue: null,
      }
   },
   computed: {
      getName() {
         if (this.label) {
            return this.name
               ? this.name
               : this.label
                  .replace(/([a-z])([A-Z])/g, "$1-$2")
                  .replace(/\s+/g, "-")
                  .toLowerCase()
         }
      },
   },
   methods: {
      handleInput(value) {
         if (this.track === "self") {
            return this.$emit("input", value)
         }
         if (value[this.track]) {
            this.$emit("input", value[this.track])
         }
      },
      setInnerValue() {
         if (this.track == "self") {
            this.innerValue = this.options.find((opt) => opt.id == this.value.id)
         } else {
            this.innerValue = this.options.find(
               (opt) => opt[this.track] == this.value
            )
         }
      },
   },
   mounted() {
      this.setInnerValue()
   },
   watch: {
      value() {
         this.setInnerValue()
      },
   },
};
</script>

<style lang="scss"></style>
