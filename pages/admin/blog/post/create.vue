<template>
  <form-view>
    <template #header> {{ $t("categories.title.add") }} </template>

    <template>
      <div class="row">
        <div class="col-md-6">
          <!-- Title -->
          <input-control v-model="form.title" stack label="Title" :error="validationErrors.title"></input-control>
          <!-- Category id -->
          <select-control v-model="form.blogCategoryId" stack :options="categories" label="category" :error="validationErrors.blogCategoryId"></select-control>
          <!-- Author -->
          <input-control v-model="form.displayName" stack label="Author" :error="validationErrors.displayName"></input-control>
          <!-- Status  -->
          <select-control stack v-model="form.status" track="value" :options="getStatus || []" :label="$t('fields.status')" :error="validationErrors.status" id="active-status"></select-control>
          <!-- Date  -->
          <date-control stack v-model="form.date" label="Date" :error="validationErrors.date"></date-control>

          <!-- Is featured -->
          <checkbox-control v-model="form.isFeatured" :label="$t('fields.isFeatured')" name="isFeatured"></checkbox-control>
        </div>
        <!-- Product Image -->
        <div class="col-md-6">
          <image-upload v-model="postPhoto" :error="validationErrors.photo" :label="$t('fields.photo')"></image-upload>
        </div>
      </div>

     <div class="mt-3">
         <client-only>
           <VueEditor v-model="form.description" class="mb-4" />
         </client-only>
     </div>
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
import validation from "@/plugins/mixins/validation"
import { mapGetters } from 'vuex'
export default {
  name: "create-post",
  mixins: [validation],
  layout: "admin",
  components: {

  },
  data() {
    return {
      postPhoto: null,
      form: {
        description: '',
        title: '',
        blogCategoryId: '',
        displayName: '',
        isFeatured: false,
        date: new Date(),
        status: 'active'
      },
      categories: [],
      initialData: null,
      savingState: false,
    }
  },
  computed: {
    ...mapGetters({
      getStatus: "config/getStatus",
    }),
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true

      try {
        const post = await this.$axios.$post("/admin/blogs", this.form)

        const formData = new FormData()
        formData.append('photo', this.postPhoto)

        // Save Product image

        if (this.postPhoto) {
          await this.$axios.$post(
            `/admin/blogs/${post.data.id}/photo`,
            formData
          )
        }

        this.$toast.success("Category created successfully.")
        if (createAndContinue) {
          this.reset()
        } else {
          this.$router.push(this.localePath("/admin/blog/post"))
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.savingState = false
      }
    },
    reset() {
      this.form = { ...this.initialData }
    },
  },
  created() {
    this.initialData = { ...this.form }
  },

  async fetch() {
    try {
      const categoryRes = await this.$axios.get('/admin/get-blogCategories')
      this.categories = categoryRes.data.data
    } catch (error) {
      console.log(error)
    }
  }
};
</script>

<style>
</style>
