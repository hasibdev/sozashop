<template>
   <!-- Header Section -->
   <header id="page-header">
      <b-navbar id="landing-navbar" toggleable="lg" type="dark" :class="`fixed-top ${navbarClass} ${scaleable && 'scaleable'}`">
         <div class="container">
            <b-navbar-brand :to="localePath('/')">
               <img src="@/static/images/logo/SozaShop-1.png" class="mx-auto" style="height: 50px;width=280px" alt="Sozashop">
            </b-navbar-brand>

            <b-navbar-toggle target="nav-collapse">
               <template>
                  <i class="fas fa-bars text-dark font-size-20"></i>
               </template>
            </b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>

               <!-- Right aligned nav items -->
               <b-navbar-nav class="ml-auto">
                  <b-navbar-nav class="align-items-center">
                     <b-nav-item :to="localePath('/contact-us')">Contact</b-nav-item>
                     <b-nav-item :to="localePath('/about-us')">About Us</b-nav-item>
                     <b-nav-item :to="localePath('/blog')">Blog</b-nav-item>

                     <template v-if="!$auth.user">
                        <b-nav-item>
                           <nuxt-link :to="localePath('/login')"><button type="button" class="btn btn-primary">Log In</button></nuxt-link>
                        </b-nav-item>
                        <b-nav-item>
                           <nuxt-link :to="localePath('/register')"><button type="button" class="btn btn-primary">Sign Up</button></nuxt-link>
                        </b-nav-item>
                     </template>

                     <template v-else>
                        <b-nav-item @click="dashboardNavigation">
                           Dashboard
                        </b-nav-item>
                     </template>

                  </b-navbar-nav>
               </b-navbar-nav>
            </b-collapse>
         </div>
      </b-navbar>

      <!-- End Header Section -->
   </header>
</template>

<script>
export default {
   name: "website-header",
   methods: {
      dashboardNavigation() {
         const user = this.$auth.user
         if (user.type == "admin") this.$router.push(this.localePath("/admin"))
         else this.$router.push(this.localePath("/dashboard"))
      },
      observeHeader() {
         const observeEl = document.querySelector('body')
         const navbar = document.querySelector("#landing-navbar")

         const options = {
            rootMargin: this.rootMargin,
            threshold: 1.0,
         }

         const observerCallback = (entries) => {
            if (entries[0].isIntersecting) navbar.classList.remove("active")
            else navbar.classList.add("active")
         }

         const observer = new IntersectionObserver(observerCallback, options)
         observer.observe(observeEl)
      },
   },
   mounted() {
      this.observeHeader()
   },
   props: {
      navbarClass: {
         type: String,
         default: "landing-bg",
      },
      scaleable: {
         type: Boolean,
         default: true,
      },
      height: {
         type: String,
         default: "100px",
      },
      rootMargin: {
         type: String,
         default: "0px",
      },
   },
};
</script>

<style lang="scss" scoped>
#page-header {
   .navbar-brand img {
      height: 30px;
   }

   .nav-item .nav-link {
      color: var(--dark);
      font-weight: 600;
      transition: all 0.2s ease-in-out;
      font-size: 15px;
      letter-spacing: 1px;
      &:hover {
         color: var(--primary);
      }
   }

   .navbar-toggler-icon {
      color: var(--gray-dark);
   }
}

#landing-navbar {
   transition: all 0.3s ease-in-out !important;
   &.scaleable {
      &.active,
      &:hover {
         height: 75px;
         background: white !important;
      }
      .navbar:hover {
         background: #fff !important;
         transition: all 0.5s;
      }
   }
   &.active {
      box-shadow: 0 3px 20px #0000001f;
   }

   #nav-collapse {
      &.navbar-collapse.show {
         background-color: white;
         box-shadow: 0 5px 13px #00000010;
         margin-top: 6px;
      }
   }
}
</style>
