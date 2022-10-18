<template>
  <loading-view :loading="$fetchState.pending">
    <form-view v-if="post">
      <template #header> {{ $t("categories.title.add") }} </template>

      <template>
        <div class="row">
          <div class="col-md-6">
            <!-- Title -->
            <input-control v-model="post.title" stack label="Title" :error="validationErrors.title"></input-control>
            <!-- category  -->
            <select-control v-model="post.blogCategoryId" stack :options="categories" label="category" :error="validationErrors.blogCategoryId"></select-control>
            <!-- Author -->
            <input-control v-model="post.displayName" stack label="Author" :error="validationErrors.displayName"></input-control>
            <!-- Status  -->
            <select-control stack v-model="post.status" :options="getStatus" track="value" :label="$t('fields.status')" :error="validationErrors.status" id="active-status"></select-control>
            <!-- Date  -->
            <date-control stack v-model="post.date" label="Date" :error="validationErrors.date"></date-control>

            <!-- Is featured -->
            <checkbox-control v-model="post.isFeatured" :label="$t('fields.isFeatured')" name="isFeatured"></checkbox-control>

          </div>
          <!-- Product Image -->
          <div class="col-md-6">
            <image-upload v-model="postPhoto" :url="post.imageUrl" :error="validationErrors.photo" :label="$t('fields.photo')"></image-upload>
          </div>
        </div>

        <div class="mt-3">
          <client-only>
            <VueEditor v-model="post.description" class="mb-4" />
          </client-only>
        </div>
      </template>

      <!-- Action Buttons -->
      <template #footer>
        <btn-link class="btn-secondary" :to="localePath('/admin/blog/post')">
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
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
  name: "edit-post",
  layout: "admin",
  mixins: [validation],
  data() {
    return {
      postPhoto: null,
      post: null,
      categories: [],
      savingState: false,
    };
  },
  computed: {
    ...mapGetters({
      getStatus: "config/getStatus",
    }),
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        const post = await this.$axios.$put(
          `/admin/blogs/${this.$route.params.id}`,
          this.post
        );

        const formData = new FormData();
        formData.append("photo", this.postPhoto);

        // Save Post image
        if (this.postPhoto) {
          await this.$axios.$post(
            `/admin/blogs/${post.data.id}/photo`,
            formData
          );
        }

        this.$toast.success("Updated successfully.");

        if (!createAndContinue) {
          this.$router.push(this.localePath("/admin/blog/post"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
  },
  async fetch() {
    try {
      const categoryRes = await this.$axios.get("/admin/get-blogCategories");
      this.categories = categoryRes.data.data;

      const postRes = await this.$axios.get(
        `/admin/blogs/${this.$route.params.id}`
      );
      this.post = postRes.data.data;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
