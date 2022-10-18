<template>
  <div class="container">
    <div class="row">
      <div class="col-md-7 col-lg-6 mx-auto" style="margin-top: 200px;">
        <div class="card">

          <div class="card-body">
            <div class="alert alert-success" role="alert">
              <h4 class="alert-heading">Success!</h4>
              <p>Successfully Send Email. Please Check your Email and Reset Password.</p>
              <hr> <br>
              <a href="/" class="mb-0 btn btn-sm btn-info">Go to Home Page</a>
            </div>
            <p class="lead"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "forgot-password-success",
  layout: "auth",
  middleware: ["guest"],
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
</style>