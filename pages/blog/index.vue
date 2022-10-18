<template>
  <div id="blog_wrapper">
    <Header height="70px" :scaleable="false" navbarClass="bg-white" />
    <Header height="70px" :scaleable="false" navbarClass="bg-white" />

    <div class="container">

      <div class="row">
        <div class="col-md-12">
          <div class="section_title">
            <h1>Featured Posts</h1>
          </div>
        </div>
      </div>
      <!-- .row -->

      <div class="row mb-3" v-if="featuredPosts.length">
        <div v-for="post in featuredPosts" :key="post.id" class="col-md-4">
          <div class="single-blog card p-4">
            <div class="single-blog-img">
              <router-link :to="localePath(`/blog/${post.slug}`)">
                <img :src="post.imageUrl" alt="" />
              </router-link>
              <div class="author-meta d-flex justify-content-between">
                <p class="mb-0 text-primary">{{ post.displayName }}</p>
                <p class="mb-0">{{ post.date }}</p>
              </div>
            </div>
            <div class="single-blog-content">
              <h3 class="">
                <router-link :to="localePath(`/blog/${post.slug}`)">{{ post.title }}</router-link>
              </h3>

              <!-- description -->
              <div class="mark-content" v-html="getBlogDescription(post.description,100)"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Loading -->
      <div class="d-flex justify-content-center">
        <b-spinner v-if="$fetchState.pending" variant="primary" label="Spinning"></b-spinner>
      </div>

      <!-- .row -->

      <!-- .blog-side -->
      <div v-if="blogCategories.length" class="blog-side mt-5 mb-5">
        <div class="row">
          <div class="col-md-3">
            <div class="menu-ta">
              <ul>
                <li>
                  <p @click="setAllPosts" class="text-primary mb-1 pointer">All</p>
                </li>
                <li v-for="cat in blogCategories" :key="cat.id">
                  <router-link :to="localePath(`/blog/category/${cat.id}`)" class="text-primary mb-1 pointer">{{ cat.name }}</router-link>
                </li>
              </ul>
            </div>
          </div>

          <div class="col-md-9">
            <div v-for="post in activePosts" :key="post.id" class="row mb-2">
              <div class="col-md-3">
                <router-link :to="localePath(`/blog/${post.slug}`)">
                  <img :src="post.imageUrl" alt="" class="img-fluid">
                </router-link>

              </div>
              <div class="col-md-9">
                <h3>
                  <router-link :to="localePath(`/blog/${post.slug}`)">{{ post.title }}</router-link>
                </h3>
                <p v-html="getBlogDescription(post.description,150)"></p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Header from "@/components/website/Header.vue";
export default {
  layout: "website",
  name: "Blog",
  components: {
    Header,
  },
  data() {
    return {
      featuredPosts: [],
      blogCategories: [],
      activePosts: [],
      allPosts: [],
    };
  },
  methods: {
    getBlogDescription(text, length) {
      if (text.length > 200) {
        return `${text.substring(0, length)}...`;
      } else {
        return text;
      }
    },
    setAllPosts() {
      this.activePosts = [...this.allPosts];
    },
  },
  async fetch() {
    const [featured, categories, blogPosts] = await Promise.all([
      this.$axios("/ajax/get-featured-blogs"),
      this.$axios("/ajax/get-blogCategories"),
      this.$axios("/ajax/get-blogs"),
    ]);

    this.featuredPosts = featured.data.data;
    this.blogCategories = categories.data.data;
    this.allPosts = blogPosts.data.data;
    this.activePosts = blogPosts.data.data;
  },
};
</script>


<style scoped >
.card {
  border-radius: 47px;
}
#blog_wrapper {
  background: rgba(244, 245, 249, 1);
}
#blog_wrapper .blog-side .card {
  background: transparent;
}
#blog_wrapper .single-blog-content h3 {
  font-size: 23px;
  font-weight: bold;
  color: #000;
  line-height: 35px;
  margin-bottom: 24px;
  margin-top: 20px;
}
#blog_wrapper .single-blog-img a img {
  max-width: 90%;
  height: auto;
  margin: 0px auto 35px auto;
  display: block;
  border-radius: 35px;
}
div#blog_wrapper {
  /* background: rgb(244 245 249, 0.1); */
  padding: 140px 0;
}
#blog_wrapper .section_title h1 {
  margin-bottom: 60px;
}
.blog-single-listing {
  display: flex;
}

.blog-img a img {
  max-width: 100%;
}

.blog-single-listing .blog-img {
  flex-basis: 45%;
}
.blog-content {
  padding-left: 40px;
}
.pointer {
  cursor: pointer;
}
</style>
