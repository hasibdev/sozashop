<template>
  <footer class="font-size-16 font-weight-bold" id="landing_footer">
    <div class="container">
      <!-- Top Row -->
      <div class="row">
        <!-- Follow us Col -->
        <div class="col-6 col-lg-3 col-sm-3 ml-auto">
          <h4 class="mb-3">Follow us</h4>

          <ul class="d-flex social-links">
            <li>
              <a href="https://www.facebook.com/sozashopltd" target="_blank"><i class="fab fa-facebook-f"></i></a>
            </li>
            <li>
              <a href="https://www.facebook.com/sozashopltd" target="_blank"><i class="fab fa-facebook-f"></i></a>
            </li>
            <!-- <li>
                     <a href="" target="_blank"><i class="fab fa-twitter"></i></a>
                  </li> -->
            <li>
              <a href="https://www.linkedin.com/company/sozashopltd" target="_blank"><i class="fab fa-linkedin-in"></i></a>
            </li>
            <li>
              <a href="https://www.youtube.com/channel/UC7_afg6-YoeYVEmktP9IGMQ" target="_blank"><i class="fab fa-youtube"></i></a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Botton Row -->
      <div class="row py-3 mt-5 border-top border-secondary">
        <div class="col-md-6">
          <p class="mb-0">
            © Copyright <nuxt-link to="/">sozashop</nuxt-link> 2022 all rights reserved.
          </p>
        </div>
        <div class="col-md-6">
          <ul class="d-flex justify-content-end">
            <!-- <li>
              <nuxt-link class="hover-on-underline text-dark  px-2 mx-2 border-dark border-right" to="/agent/register">Agent Register</nuxt-link>
            </li> -->
            <li>
              <nuxt-link class="hover-on-underline text-dark " to="/contact-us">Contact</nuxt-link>
            </li>
            <li>
              <nuxt-link class="hover-on-underline text-dark px-2 mx-2 border-left border-dark border-right" to="/blog">Blog</nuxt-link>
            </li>

            <li>
              <nuxt-link class=" hover-on-underline pr-2 mx-2 text-dark border-dark border-right" to="/terms">Terms Of Service</nuxt-link>
            </li>
            <li>
              <nuxt-link class=" hover-on-underline pr-2 mx-2 text-dark border-dark border-right" to="/privacy-policy">Privacy Policy</nuxt-link>
            </li>
            <li>
              <nuxt-link class="hover-on-underline text-dark" to="/">Help</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
