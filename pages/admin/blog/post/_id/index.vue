<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="post">

      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("categories.title.details") }} : {{ post.title }}
        </h3>
        <div>
          <action-dropdown variant="primary" iconVariant="light">
            <b-dropdown-item :to="localePath(`/admin/blog/category/${post.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
              Edit</b-dropdown-item>
            <b-dropdown-item @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
              Delete</b-dropdown-item>
          </action-dropdown>
        </div>
      </template>

      <template>
        <card>
           <image-detail :label="$t('fields.image')" :value="post.imageUrl" ></image-detail>

          <!-- Title -->
          <input-detail :label="$t('fields.title')" :value="post.title"></input-detail>

          <!-- Status -->
          <input-detail :label="$t('fields.status')">
            <badge :value="post.status"></badge>
          </input-detail>

          <!-- Body -->
          <div v-html="post.description" class="mt-4"></div>
        </card>
      </template>

    </detail-view>
  </loading-view>

</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      post: null
    }
  },
  async fetch() {
    try {
      const postRes = await this.$axios.get(`/admin/blogs/${this.$route.params.id}`)
      this.post = postRes.data.data
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
