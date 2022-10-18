<template>
  <div class="authentication-bg d-flex align-items-center pb-0 vh-100">
    <div class="content-center w-100">
      <div class="container">
        <div class="card mo-mt-2">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-lg-4 ml-auto">
                <nuxt />
              </div>
              <div class="col-lg-5 mx-auto">
                <img
                  src="@/static/images/error.png"
                  alt=""
                  class="img-fluid mx-auto d-block"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end container -->
    </div>
  </div>
</template>

<script>
export default {
  name: "error-layout"
};
</script>

<style lang="scss" scoped></style>
