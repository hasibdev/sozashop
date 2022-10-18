<template>
    <loading-view :loading="$fetchState.pending">
        <detail-view v-if="packageData">
            <template #header>
                <h3 class="font-weight-normal mb-3">
                    {{ $t("packages.title.details") }} : {{ packageData.name }}
                </h3>
                <div>
                    <action-dropdown variant="primary" iconVariant="light">
                        <b-dropdown-item :to="localePath(`/admin/packages/${packageData.id}/edit`)">
                            <i class="far mr-1 fa-edit text-primary"></i>
                            Edit
                        </b-dropdown-item>
                        <b-dropdown-item v-if="hasPermission('delete-packages') || hasRole('Super Admin')" @click="remove()">
                            <i class="far mr-1 fa-trash-alt text-danger"></i>
                            Delete
                        </b-dropdown-item>
                    </action-dropdown>
                </div>
            </template>

            <template>
                <card>
                    <!-- Name -->
                    <input-detail :label="$t('fields.name')" :value="packageData.name"></input-detail>
                    <!-- Price -->
                    <input-detail :label="$t('fields.price')" :value="packageData.price"></input-detail>
                    <!-- Type -->
                    <input-detail :label="$t('fields.type')" :value="packageData.type.split('_').join(' ') | capitalize"></input-detail>
                    <!-- Recommended -->
                    <input-detail :label="$t('fields.recommended')" :value="packageData.recommended ? 'Yes' : 'No'"></input-detail>
                    <!-- Description -->
                    <input-detail :label="$t('fields.plan')">
                        <p v-for="d in packageData.description" :key="d.id" class="mb-1">{{ d.description }}</p>
                    </input-detail>

                </card>
            </template>
        </detail-view>
    </loading-view>
</template>

<script>
export default {
    name: "package-details",
    layout: "admin",
    meta: {
        permission: "view-packages",
    },
    data() {
        return {
            packageData: null,
        }
    },
    methods: {
        remove() {
            // Global Mixins ( removeResource )
            this.removeResource({
                apiUrl: `/admin/packages/${this.$route.params.id}`,
                redirectUrl: "/admin/packages",
            })
        },
    },
    async fetch() {
        const respackage = await this.$axios.$get(
            `/admin/packages/${this.$route.params.id}`
        )
        this.packageData = respackage.data
    },
};
</script>

<style lang="scss" scoped></style>
