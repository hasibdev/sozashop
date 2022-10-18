<template>
	<div class="relative" :class="{ 'overflow-hidden': loading }">
		<div v-if="loading" class="loader-wrapper d-flex align-items-center justify-content-center p-5">
			<loader></loader>
		</div>

		<slot v-show="!loading" />
	</div>
</template>

<script>
import Loader from "@/components/icons/Loader";
export default {
	props: {
		loading: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		Loader,
	},
};
</script>

<style lang="scss">
.loader-wrapper {
	position: absolute;
	top: 70px;
	right: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #fff;
	z-index: 99999;
}
</style>
