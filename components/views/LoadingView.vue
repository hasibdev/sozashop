<template>
	<div class="relative" :class="{ 'overflow-hidden': loading }">
		<div v-if="loading" class="d-flex align-items-center justify-content-center p-5" style="height: calc(100vh - 150px); z-index: 50;">
			<loader></loader>
		</div>

		<slot v-else />
	</div>
</template>

<script>
import Loader from "@/components/icons/Loader";
export default {
	props: {
		loading: {
			type: Boolean,
			default: true,
		},
	},
	components: {
		Loader,
	},
};
</script>

<style lang="scss">
</style>
