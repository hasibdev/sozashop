<template>
    <table class="table table-bordered">
        <thead>
            <th v-for="(field, index) in fields" :key="index" style="vertical-align: middle" :width="field.width">
                {{ $t(`fields.${field.name}`) }}
            </th>
            <th class="text-right" width="5%" style="vertical-align: middle">
                <btn-primary @click="add">
                    <i class="fas fa-plus"></i>
                </btn-primary>
            </th>
        </thead>
        <tbody>
            <tr v-for="(item, index) in items" :key="index">
                <td v-for="(field, fieldIndex) in fields" :key="fieldIndex">
                    <!-- Fields -->
                    <slot :name="field.name" :index="index" :item="item" :field="field" :getError="getError">
                        <component :is="field.component" v-model="item[field.name]" v-bind="{ ...field.props }" :error="getError(field.name, index)" @input="handleComponentChange(
                            {
                                name: field.name,
                                index: index,
                                value: item[field.name]
                            },
                            field.listen
                            )
              "></component>
                    </slot>
                </td>
                <td>
                    <btn-danger @click="remove(index, item)">
                        <i class="fas fa-trash-alt"></i>
                    </btn-danger>
                </td>
            </tr>
        </tbody>

        <!-- If showTotal props is true -->
        <tfoot v-if="showTotal">
            <td class="font-weight-bold text-right" :colspan="fields.length - 1">
                {{ $t("fields.total") }}
            </td>
            <td class="font-weight-bold text-left px-4">{{ total }}</td>
            <td></td>
        </tfoot>

        <!-- Else default slot -->
        <tfoot v-else>
            <slot name="footer" :items="items"> </slot>
        </tfoot>
    </table>
</template>

<script>
import validation from "@/plugins/mixins/validation"
export default {
    name: "dynamic-field",
    mixins: [validation],
    props: {
        /**
         * Available field to show on table row
         */
        fields: {
            type: Array,
            required: true,
        },

        /**
         * Initial Value
         */
        value: {
            type: [Array, Object],
            default: () => [],
        },

        /**
         * Validation Error object key name
         */
        errorName: {
            type: String,
            default: null,
        },

        /**
         * Sumable key props
         */
        sumKey: {
            type: String,
            default: "amount",
        },

        /**
         * Configure show total at footer
         */
        showTotal: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            items: [],
        }
    },
    computed: {
        /**
         * Calculate the item total
         */
        total() {
            return this.items
                .map((item) => parseFloat(item[this.sumKey]))
                .reduce((total, current) => (total += current), 0)
        },
    },
    methods: {
        /**
         * Component field change
         */
        handleComponentChange(value, listen) {
            if (listen) {
                this.$nuxt.$emit(`${value.name}-${value.index}-changed`, value)
            }
        },
        /**
         * Add new row to the table
         */
        add() {
            this.items.push(this.getFields())
        },

        /**
         * Remove row from the table
         */
        remove(index, item = null) {
            this.$swal
                .fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    confirmButtonColor: "var(--danger)",
                    cancelButtonColor: "var(--primary)",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        this.items.splice(index, 1)
                        // Emit remove event
                        this.$emit("remove", item)
                    }
                })
        },

        /**
         * Get the field for bind
         */
        getFields() {
            let result = {}
            this.fields.forEach((item) => {
                result[item.name] = item.value
            })

            return result
        },

        /**
         * Get the validation error
         */
        getError(name, index) {
            return this.validationErrors[`${this.errorName}.${index}.${name}`]
        },
    },
    created() {
        // Set the initial value
        this.items = this.value
    },
    watch: {
        value(newValue, oldValue) {
            this.items = newValue
        }
    },
};
</script>

<style lang="scss"></style>
