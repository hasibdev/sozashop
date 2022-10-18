<template>
  <div>
    <Header height="70px" :scaleable="false" navbarClass="bg-white" />

    <!-- Breadcrumb -->
    <div class="landing-bg" id="header-observer" style="padding-top: 77px">
      <div class="container">
        <b-breadcrumb class="bg-transparent px-0">
          <b-breadcrumb-item v-for="(bc, i) in breadcrumbs" :key="i" :to="bc.to">
            <i v-if="bc.icon" :class="bc.icon"></i>
            {{ bc.text }}
          </b-breadcrumb-item>
        </b-breadcrumb>
      </div>
    </div>

    <!-- Hero Section -->
    <section id="hero-section">
      <div class="container">
        <!-- Hero Image -->
        <div>
          <img src="/images/about-us.jpg" class="img-fluid" alt="">
        </div>
        <!-- Hero Content -->
        <div class="mx-auto bg-white relative p-3 shadow-sm" style="width: 96%; margin-top: -20px;">
          <h1>Hello Buddy..! <br> Welcome to Smooth</h1>
          <div class="section-heading-icon my-2"></div>

          <p class="font-size-20 font-italic mt-4 mb-1"> <i class="fas fa-quote-left text-success mr-2 relative" style="top: -6px;"></i> We are build awesome marketing template</p>
        </div>

        <!-- Content -->
        <div class="mx-auto mt-4" style="width: 96%;">
          <p>Suas essent qualisque mel ad, cum ei cibo volutpat explicari. Ut reque veniam option ius, at sed dicat munere audire. Ne duo meliore definiebas, eam id ridens prompta. Ea ius integre impedit adversarium, ex nostrum forensibus vis, an vel numquam inermis omnesque. Vidit mentitum sed ad. Natum ipsum commune in has, nibh euismod no sed, ne sint consul nullam eum.</p>
          <b-button variant="outline-primary" class="rounded-pill font-size-16 px-5 py-3 mt-4">Get in touch with us</b-button>
        </div>
      </div>
    </section>

    <!-- Our Services -->
    <section id="our-services" style="padding: 80px 0;">
      <div class="container">
        <div class="text-center">
          <h1>Our services</h1>
          <div class="section-heading-icon my-2 mx-auto"></div>
        </div>

        <div class="row mt-5">
          <div v-for="(template, i) in templates" :key="i" class="col-sm-4 col-md-4">
            <div class="row">
              <span class="icon col-md-3 " :class="template.icon"></span>
              <div class="col-md-9">
                <p class="font-size-24 text-dark">{{ template.title }}</p>
                <p>{{ template.designation }}</p>
              </div>
            </div>
          </div>
          <b-button variant="outline-primary" class="rounded-pill font-size-16 px-5 py-3 mt-4 mx-auto">View our portfolio</b-button>
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
export default {
  layout: "website",
  components: {
    Header,
  },
  data() {
    return {
      templates: [
        {
          icon: "icon-gift",
          title: "All in one package",
          designation:
            "Unum liber commune in mel, ut pri tritani propriae menandri. Cum et magna porro intellegat.",
        },
        {
          icon: "icon-paper-plane",
          title: "Send Campaign",
          designation:
            "Unum liber commune in mel, ut pri tritani propriae menandri. Cum et magna porro intellegat.",
        },
        {
          icon: "icon-cogs",
          title: "Easy to use",
          designation:
            "Unum liber commune in mel, ut pri tritani propriae menandri. Cum et magna porro intellegat.",
        },
        {
          icon: "icon-flask",
          title: "New Technology",
          designation:
            "Unum liber commune in mel, ut pri tritani propriae menandri. Cum et magna porro intellegat.",
        },
        {
          icon: "icon-tree",
          title: "Branch system",
          designation:
            "Unum liber commune in mel, ut pri tritani propriae menandri. Cum et magna porro intellegat.",
        },
        {
          icon: "icon-hard-disk",
          title: "Large Storage",
          designation:
            "Unum liber commune in mel, ut pri tritani propriae menandri. Cum et magna porro intellegat.",
        },
      ],
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
          text: "About Us",
          to: this.localePath("/about-us"),
          active: true,
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>