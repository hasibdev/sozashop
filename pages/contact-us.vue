<template>
  <div>
    <Header height="70px" :scaleable="false" navbarClass="bg-white" />

    <!-- Breadcrumb -->
    <div class="landing-bg" id="header-observer" style="padding-top: 77px">
      <div class="container">
        <b-breadcrumb class="bg-transparent px-0 mb-0">
          <b-breadcrumb-item v-for="(bc, i) in breadcrumbs" :key="i" :to="bc.to">
            <i v-if="bc.icon" :class="bc.icon"></i>
            {{ bc.text }}
          </b-breadcrumb-item>
        </b-breadcrumb>
      </div>
    </div>

    <!-- Contact Area -->
    <section id="contact_area">
      <div class="container-fluid px-lg-0">
        <div class="row">
          <!-- Left Content -->
          <div class="col-lg-5 pt-5 pr-lg-5 order-1 order-lg-0 contact-left-content text-lg-right">

          </div>
          <!-- Right Content -->
          <div class="col-lg-6 pl-lg-5 pt-5">
            <div class="mb-5">
              <h1 class="mb-3 text-dark">Contact us</h1>
              <div class="section-heading-icon my-2"></div>
            </div>

            <p class="mb-5 text-dark font-size-16">Sed in everti deleniti qualisque. Eum epicurei disputando te. Vero veri et qui, quis reque eu eos. Has modo vituperatoribus in, dicunt neglegentur ea vis. Cu nibh tamquam mea, causae suscipit splendide no mei.</p>

            <form @submit.prevent="storeContactInfo">
              <div class="row mb-2">
                <div class="col-md-6">
                  <input-control stack label="Name" v-model="form.name" :error="validationErrors.name" placeholder="Enter your name"></input-control>
                </div>
                <div class="col-md-6">
                  <input-control stack label="Email address" v-model="form.email" :error="validationErrors.email" placeholder="Enter your email address"></input-control>
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-md-6">
                  <input-control class="mb-4" v-model="form.subject" :error="validationErrors.subject" label="Subject" placeholder="Subject" stack></input-control>
                </div>
                <div class="col-md-6">
                  <input-control stack label="Mobile" v-model="form.mobile" :error="validationErrors.mobile" placeholder="Mobile"></input-control>
                </div>
              </div>

              <!-- Comment -->
              <text-control :row="10" label="Comment" v-model="form.description" :error="validationErrors.description" stack></text-control>
              <btn-primary @click="storeContactInfo" :loading="savingState" class="btn btn-primary text-white font-weight-bold px-5 py-3 rounded-pill font-size-16 mt-4 mb-5" type="submit">
                Send a Message
              </btn-primary>

            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Get Started -->
    <section id="get_started" style="padding: 100px 0; background: url(/images/cta-bg.png) center no-repeat #403595;">
      <div class="container">
        <div class="text-center text-white">
          <h1 class="mb-5">Need help's... Feel fee to contact us</h1>
          <nuxt-link class="btn btn-outline-secondary font-size-17 px-5 py-3 rounded-pill" :to="localePath('/contact-us')">Get in Touch <i class="fas fa-long-arrow-alt-right ml-3"></i></nuxt-link>
        </div>
      </div>
    </section>
    <!-- // Get Started -->
  </div>
</template>

<script>
import Header from "@/components/website/Header.vue";
import validation from "@/plugins/mixins/validation";
import { required, requiredIf } from "vuelidate/lib/validators";
export default {
  name: "home",
  layout: "website",
  mixins: [validation],
  components: {
    Header,
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        mobile: "",
        subject: "",
        description: "",
      },
      savingState: false,
    };
  },

  computed: {
    breadcrumbs() {
      return [
        {
          text: "Home",
          to: this.localePath("/"),
          icon: "fas fa-home",
        },
        {
          text: "Contact Us",
          to: this.localePath("/contact-us"),
          active: true,
        },
      ];
    },
  },
  methods: {
    async storeContactInfo() {
      this.savingState = true;
      try {
        const res = await this.$axios.$post(
          "/ajax/store-contactInformation",
          this.form
        );
        console.log(res.data);
        this.$toast.success("Contact Information send to Admin.");
        this.form = {
          name: "",
          email: "",
          mobile: "",
          subject: "",
          description: "",
        };
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.error(error.response.data.message);
        }
      } finally {
        this.savingState = false;
      }
    },
  },
  validations: {
    form: {
      name: { required },
      email: { required },
      subject: { required },
      description: { required },
    },
  },
};
</script>

<style lang="scss">
#contact_area {
  .contact-left-content {
    background-color: #f4f7fc;
    background-image: url("/images/megamenu-bg.svg");
    background-repeat: no-repeat;
    background-position-y: bottom;
    background-size: contain;
    .contact-left-item {
      position: relative;
      padding-bottom: 15px;
      margin-bottom: 35px;
      &::after {
        content: "";
        position: absolute;
        width: 100px;
        height: 1px;
        background: #333;
        right: 0;
        bottom: 0;
      }
    }
  }

  .form-control {
    min-height: 45px;
  }
}
</style>