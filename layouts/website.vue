<template>
   <div id="landing-page">
      <NuxtChild />
      <Footer />

      <!-- Scroll To Top Floating Action button -->
      <!-- <ScrollTop /> -->
   </div>
</template>


<script>
import Footer from "@/components/website/Footer.vue"
// import ScrollTop from "@/components/utils/ScrollTop.vue"
export default {
   name: "website-layout",
   components: {
      Footer,
      // ScrollTop,
   },
};
</script>

<style lang="scss" scoped>
</style>
