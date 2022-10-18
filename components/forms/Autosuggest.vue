<template>
  <div class="form-group row align-items-center">
    <label :for="getName" class="mb-0" :class="[label && stack === false ? 'col-sm-2' : 'col-sm-12']" v-if="label">{{ label }}</label>
    <div :class="[label && stack === false ? 'col-sm-10' : 'col-sm-12']">
      <VueAutosuggest :limit="5" v-model="innerValue" :get-suggestion-value="suggestionValue" :suggestions="[
          {
            data: suggestions
          }
        ]" :input-props="{
          id: `autosuggest__input_${index}`,
          placeholder: placeholder,
          class: 'form-control',
          readonly: readonly,
          disabled: disabled
        }" @selected="selectHandler" @input="onInputChange">
        <!-- Default Slot -->
        <template slot-scope="{suggestion}">
          <slot :suggestion="suggestion"></slot>
        </template>

        <template v-if="loading" slot="after-input">
          <div class="spinner-wrapper">
            <b-spinner small label="Loading..."></b-spinner>
          </div>
        </template>
      </VueAutosuggest>
      <p class="text-muted mb-0">
        <slot name="help"></slot>
      </p>
      <span>
        <slot name="action"></slot>
      </span>
      <span class="text-danger">{{ error[0] }}</span>
    </div>
  </div>
</template>

<script>
import { VueAutosuggest } from "vue-autosuggest";
export default {
  name: "Autosuggest",
  components: {
    VueAutosuggest,
  },
  data() {
    return {
      innerValue: null,
    };
  },
  computed: {
    getName() {
      if (this.label) {
        return this.name
          ? this.name
          : this.label
              .replace(/([a-z])([A-Z])/g, "$1-$2")
              .replace(/\s+/g, "-")
              .toLowerCase();
      }
    },
  },
  methods: {
    selectHandler(value) {
      if (value && value.item) {
        this.$emit("input", value.item);
      }
    },
    onInputChange(value) {
      this.$emit("onSearch", value);
    },
    suggestionValue(suggestion) {
      return this.getSuggestionValue(suggestion);
    },
  },
  mounted() {
    if (this.autofocus) {
      const input = document.getElementById(`autosuggest__input_${this.index}`);
      input.focus();
    }
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        this.innerValue = newValue;
      }

      if (this.watchProduct) {
        if (newValue) {
          this.innerValue = `${newValue.productName} - ${newValue.name}`;
        }
      }
    },
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    track: {
      type: String,
      default: "name",
    },
    getSuggestionValue: {
      type: Function,
      default: (suggestion) => suggestion.item,
    },
    watchProduct: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    value: {
      required: false,
    },
    error: {
      type: Array,
      default: () => [],
    },
    name: {
      type: [String, Number],
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      default: "text",
      validator: (val) => val == "text" || val == "number" || val == "password",
    },
    row: {
      type: [String, Number],
      default: "5",
    },
    placeholder: {
      type: String,
      required: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // Stack label
    stack: {
      type: Boolean,
      default: false,
    },
    // Disabled
    disabled: {
      type: Boolean,
      default: false,
    },
    // Suggestions
    suggestions: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss">
#autosuggest {
  position: relative;
  .autosuggest__results > ul {
    list-style: none;
    padding-left: 0;
    margin-top: 5px;
    margin-bottom: 0;
    border-radius: 5px;
    border: 1px solid #ddd;
    .autosuggest__results-item {
      padding: 7px 15px;
    }
    .autosuggest__results-item--highlighted {
      background: var(--primary);
      color: #fff;
    }
  }

  #autosuggest-autosuggest__results {
    position: absolute;
    z-index: 99;
    background: #fff;
    width: 100%;
  }
}

.spinner-wrapper {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
