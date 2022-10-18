<template>
    <index-view>
        <template #title> {{ $t("roles.title.manage") }} </template>
        <!-- List Header -->
        <template #header>
            <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
            <btn-link v-if="hasPermission('create-roles') || hasRole('Super Admin')" class="btn-primary" :to="localePath('/admin/roles/create')">
                {{ $t("buttons.add") }} {{ $t("roles.label") }}
            </btn-link>
        </template>

        <template>
            <data-table :columns="columns" url="/admin/roles" :filters="filters" :showIndex="true">
                <!-- Action Slot -->
                <template v-slot:action="{ row, remove, index }">
                    <action-dropdown>
                        <b-dropdown-item v-if="hasPermission('view-roles') || hasRole('Super Admin')" :to="localePath(`/admin/roles/${row.id}`)">
                            <i class="far mr-1 fa-share-square text-success"></i>
                            Details
                        </b-dropdown-item>
                        <b-dropdown-item v-if="hasPermission('update-roles') || hasRole('Super Admin')" :to="localePath(`/admin/roles/${row.id}/edit`)">
                            <i class="far mr-1 fa-edit text-primary"></i>
                            Edit
                        </b-dropdown-item>
                        <b-dropdown-item v-if="hasPermission('delete-roles') || hasRole('Super Admin')" @click="remove(row.id, index)">
                            <i class="far mr-1 fa-trash-alt text-danger"></i>
                            Delete
                        </b-dropdown-item>
                    </action-dropdown>
                </template>

                <!-- Filter slot -->
                <template #filter>
                    <page-filter v-model="filters.perPage"></page-filter>

                </template>
            </data-table>
        </template>
    </index-view>
</template>

<script>
export default {
    name: "roles",
    layout: "admin",
    meta: {
        permission: "view-any-roles",
    },
    data() {
        return {
            columns: ["name", { field: "totalUser", sortable: false }],
            filters: {
                search: "",
                perPage: 25,

                // client: this.$auth.user.clientId,
            },
        };
    },
};
</script>

<style lang="scss" scoped></style>
