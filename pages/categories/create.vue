<template>
    <form-view>
        <template #header> {{ $t("categories.title.add") }} </template>
        <template>
            <!-- Name -->
            <input-control focus v-model="formData.categoryName" :label="$t('fields.name')" :error="validationErrors.categoryName"></input-control>

            <!-- Description -->
            <text-control v-model="formData.description" :label="$t('fields.description')" :error="validationErrors.description" v-if="hasFieldPermission('categories.add-category.description')"></text-control>
        </template>

        <!-- Action Buttons -->
        <template #footer>
            <btn-link class="btn-secondary" :to="localePath('/categories')">
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
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
    name: "create-category",
    mixins: [validation],
    meta: {
        permission: "create-categories",
    },
    data() {
        return {
            formData: {
                categoryName: "",
                description: "",
            },
            initialData: null,
            savingState: false,
        };
    },
    methods: {
        async save(event, createAndContinue = false) {
            this.savingState = true;
            try {
                await this.$axios.$post("/categories", this.formData);
                this.$toast.success("Category created successfully.");
                if (createAndContinue) {
                    this.reset();
                } else {
                    this.$router.push(this.localePath("/categories"));
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.savingState = false;
            }
        },
        reset() {
            this.formData = { ...this.initialData };
        },
    },
    created() {
        this.initialData = { ...this.formData };
    },
};
</script>

<style lang="scss" scoped></style>
