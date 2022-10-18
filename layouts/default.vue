<template>
	<!-- Begin page -->
	<div id="layout-wrapper">
		<the-header></the-header>
		<the-sidebar></the-sidebar>

		<!-- ============================================================== -->
		<!-- Start right Content here -->
		<!-- ============================================================== -->
		<div class="main-content">
			<div class="page-content mt-4 px-4 calc-ml">
				<Nuxt />
			</div>
			<!-- End Page-content -->
			<the-footer></the-footer>
		</div>
		<!-- end main content-->
	</div>
	<!-- END layout-wrapper -->
</template>

<script>
import TheHeader from "@/components/layouts/TheHeader.vue";
import TheSidebar from "@/components/layouts/TheSidebar.vue";
import TheFooter from "@/components/layouts/TheFooter.vue";
export default {
	name: "default-layout",
	components: { TheHeader, TheSidebar, TheFooter },
	middleware: ["user", "permission"],

	beforeCreate() {
		document.body.setAttribute("data-sidebar", "dark");
		// document.body.setAttribute('class', 'sidebar-enable vertical-collpsed');
	},
	fetch() {
		this.$store.dispatch("config/setConfig", { url: "/users/config" });
	},
};
</script>

<style lang="scss">
@import "vue-multiselect/dist/vue-multiselect.min.css";

.dropdown-btn {
	* {
		pointer-events: none;
	}
}

button:focus {
	outline: none !important;
	box-shadow: none !important;
}

body[data-sidebar="dark"].vertical-collpsed {
	min-height: 100vh !important;
}
.calc-ml {
	margin-left: 70px;
	@media (min-width: 992px) {
		margin-left: 0;
	}
}
.page-content {
	min-height: calc(100vh - 70px);
}

.main-content {
	transition: margin 0.3s ease !important;
}
</style>
