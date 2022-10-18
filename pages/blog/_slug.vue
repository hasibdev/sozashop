<template>
  <div id="blog_wrapper">
    <Header height="70px" :scaleable="false" navbarClass="bg-white" />
    <Header height="70px" :scaleable="false" navbarClass="bg-white" />

    <div class="container">

      <!-- .row -->

      <!-- .blog-side -->
      <div v-if="blogCategories.length" class="blog-side mt-1">
        <div class="row">
          <div class="col-md-3">
            <div class="menu-ta">
              <ul>
                <li>
                  <router-link :to="localePath(`/blog`)" class="text-primary mb-1 pointer">All</router-link>
                </li>
                <li v-for="cat in blogCategories" :key="cat.id">
                  <router-link :to="localePath(`/blog/category/${cat.id}`)" class="text-primary mb-1 pointer">{{ cat.name }}</router-link>
                </li>
              </ul>
            </div>
          </div>

          <!-- Loading -->
          <div class="d-flex justify-content-center">
            <b-spinner v-if="$fetchState.pending" variant="primary" label="Spinning"></b-spinner>
          </div>

          <div class="col-md-9">
            <div class="row">

              <h1>{{blogDetails.title}}</h1>
              <div v-if="blogDetails.imageUrl" class="col-12 pl-0">
                <img :src="blogDetails.imageUrl" class="img-fluid" style="height: 300px;
    width: 100%;" alt="">
              </div>
              <p class="my-2">
                <span>
                  <b>Publish Date: </b>{{blogDetails.date}}
                </span> <span>
                  <b>Author: </b>{{blogDetails.displayName}}
                </span>
              </p>

              <div class="col-12 pl-0" v-html="blogDetails.description"></div>
              <!--overlay box-->
              <ul class="post-meta clearfix">
                <li>
                  <div class="inner" style="background: rgb(52, 86, 142);padding: 10px 13px;">
                    <a href="#" style="
                        text-decoration: none;
                        font-weight: bold;
                        font-size: 14px;
                        cursor: unset;
                        color: white;
                      ">Share With:</a>
                    <ShareNetwork class="social-a" network="facebook" :url="baseurl + '/blog/' + blogDetails.slug" title="Share with facebook" description="Share with facebook" quote="Share with facebook" hashtags="sozashop,blog">
                      <i class="fab fa-facebook-f"></i>
                    </ShareNetwork>

                    <ShareNetwork class="social-a" network="Skype" :url="baseurl + '/blog/' + blogDetails.slug" title="Share with Skype	" description="Share with Skype	" quote="Share with Skype	" hashtags="sozashop,blog">
                      <i class="fab fa-skype"></i>
                    </ShareNetwork>

                    <ShareNetwork class="social-a" network="WhatsApp" :url="baseurl + '/blog/' + blogDetails.slug" title="Share with WhatsApp	" description="Share with WhatsApp	" quote="Share with WhatsApp	" hashtags="sozashop,blog">
                      <i class="fab fa-whatsapp"></i>
                    </ShareNetwork>

                    <ShareNetwork class="social-a" network="Twitter" :url="baseurl + '/blog/' + blogDetails.slug" title="Share with Twitter	" description="Share with Twitter	" quote="Share with Twitter	" hashtags="sozashop,blog">
                      <i class="fab fa-twitter"></i>
                    </ShareNetwork>

                    <ShareNetwork class="social-a" network="LinkedIn" :url="baseurl + '/service/' + blogDetails.slug" title="Share with LinkedIn" description="Share with LinkedIn" quote="Share with LinkedIn" hashtags="sozashop,blog">
                      <i class="fab fa-linkedin"></i>
                    </ShareNetwork>
                  </div>
                </li>
              </ul>

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
      blogCategories: [],
      blogDetails: null,
      baseurl: window.location.origin,
    };
  },
  methods: {
    getBlogDescription(text) {
      if (text.length > 200) {
        return `${text.substring(0, 200)}...`;
      } else {
        return text;
      }
    },
    async getData() {
      const [categories, blogDetails] = await Promise.all([
        this.$axios("/ajax/get-blogCategories"),
        this.$axios("/ajax/blog-details/" + this.$route.params.slug),
      ]);

      this.blogCategories = categories.data.data;
      this.blogDetails = blogDetails.data.data;
    },
  },
  fetch() {
    this.getData();
  },
  watch: {
    $route: {
      handler() {
        this.getData();
      },
      immediate: true,
    },
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
.social-a {
  padding: 7px 24px;
  font-weight: bold;
  color: rgb(255 255 255);
  font-size: 20px;
}
</style>
