<template>
    <!-- Page-content -->
    <index-view>
        <template #title> {{ $t("categories.label") }} </template>
        <!-- List Header -->
        <template #header>
            <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
            <!-- Create button -->
            <btn-link v-if=" hasPagePermission('categories.add-category') && (hasPermission('create-categories') || hasRole('Admin'))" class="btn-primary" :to="localePath('/categories/create')">
                {{ $t("buttons.add") }} {{ $t("categories.label") }}
            </btn-link>
        </template>

        <template>
            <data-table :columns="columns" url="/categories" :filters="filters">
                <!-- Action Slot -->
                <template v-slot:action="{ row, remove, index }">
                    <action-dropdown>
                        <!-- Details -->
                        <b-dropdown-item :to="localePath(`/categories/${row.id}`)" v-if="hasPagePermission('categories.category-detail') && (hasPermission('view-categories') || hasRole('Admin'))  ">
                            <i class="far mr-1 fa-share-square text-success"></i>
                            Details
                        </b-dropdown-item>
                        <!-- Edit -->
                        <b-dropdown-item :to="localePath(`/categories/${row.id}/edit`)" v-if="hasPagePermission('categories.edit-category') && (hasPermission('update-categories') || hasRole('Admin')) ">
                            <i class="far mr-1 fa-edit text-primary"></i>
                            Edit
                        </b-dropdown-item>
                        <!-- Delete -->
                        <b-dropdown-item @click="remove(row.id, index)" v-if="hasPermission('delete-categories') || hasRole('Admin')">
                            <i class="far mr-1 fa-trash-alt text-danger"></i>
                            Delete
                        </b-dropdown-item>
                    </action-dropdown>
                </template>

                <!-- Status Column -->
                <template v-slot:status="{ col }">
                    <badge :value="col"></badge>
                </template>
                <!-- Filter slot -->
                <template #filter>
                    <page-filter v-model="filters.perPage"></page-filter>

                </template>
            </data-table>
        </template>
    </index-view>
    <!-- End Page-content -->
</template>

<script>
export default {
    name: "categories",
    meta: {
        permission: "view-any-categories",
    },
    data() {
        return {
            columns: [
                {
                    field: "name",
                    permission: "categories.manage-categories.name",
                },
                {
                    field: "description",
                    permission: "categories.manage-categories.description",
                },
                {
                    field: "totalProduct",
                    label: "productType",
                    permission: "categories.manage-categories.total-product",
                    sortable: false,
                },
                {
                    field: "totalSaleAmount",
                    label: "totalSale",
                    permission: "categories.manage-categories.total-sale",
                    sortable: false,
                },
                {
                    field: "status",
                    permission: "categories.manage-categories.status",
                },
            ],
            filters: {
                search: "",
                perPage: 25,
            },
        };
    },
};
</script>

<style lang="scss" scoped></style>
