<template>
  <!-- Page-content -->
  <index-view>
    <template #title> {{ $t("blog.title.manage") }} </template>
    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
      <nuxt-link class="btn btn-primary" to="/admin/blog/post/create">Create</nuxt-link>
    </template>

    <template>
      <data-table :columns="columns" url="/admin/blogs" :filters="filters">

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>

        <!-- Action Slot -->
        <template v-slot:action="{ row, remove, index }">
          <action-dropdown>
            <!-- Details -->
            <b-dropdown-item :to="localePath(`/admin/blog/post/${row.id}`)">
              <i class="far mr-1 fa-share-square text-success"></i>
              Details
            </b-dropdown-item>
            <!-- Edit -->
            <b-dropdown-item :to="localePath(`/admin/blog/post/${row.id}/edit`)">
              <i class="far mr-1 fa-edit text-primary"></i>
              Edit
            </b-dropdown-item>
            <!-- Delete -->
            <b-dropdown-item @click="remove(row.id, index)">
              <i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>
          <trash-filter v-model="filters.trashed"></trash-filter>
        </template>
      </data-table>
    </template>
  </index-view>
  <!-- End Page-content -->
</template>

<script>
export default {
  name: "blog",
  layout: "admin",
  data() {
    return {
      columns: [
        { field: "id", label: "id", permission: true },
        { field: "title", label: "title", permission: true },
        { field: "displayName", label: "author", permission: true },
      ],
      filters: {
        search: "",
        perPage: 25,
        trashed: "",
      },
    }
  },
};
</script>

<style lang="scss" scoped></style>
