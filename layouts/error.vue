<template>
	<div class="ex-page-content">
		<h1>{{ error.statusCode }}!</h1>
		<h4 v-if="error.statusCode === 404" class="mb-4">Sorry, Page not found.</h4>
		<h4 v-if="error.statusCode === 500" class="mb-4">Server Error.</h4>
		<h4 v-if="error.statusCode === 403" class="mb-4">
			Sorry, You are forbidden.
		</h4>
		<h4 v-if="error.statusCode === 401" class="mb-4">
			Sorry, You are unauthrized.
		</h4>
		<p class="mb-5">
			{{ error.message }}
		</p>
		<button class="btn btn-primary" @click="handleDashboarRoute"><i class="mdi mdi-home"></i> Back to Dashboard
		</button>
	</div>
</template>

<script>
export default {
	name: "error-page",
	props: ["error"],
	layout: "errorlayout",
	methods: {
		handleDashboarRoute() {
			const path = this.$route.path.split("/");

			if (path[1] == "admin") {
				this.$router.push("/admin");
			} else {
				this.$router.push("/dashboard");
			}
		},
	},
};
</script>
