<template>
	<button :disabled="loading" ref="btn-success" @click.prevent="$emit('click')" class="btn btn-success px-4 d-flex justify-content-center align-items-center">
		<b-spinner v-if="loading" small label="Spinning" :variant="variant"></b-spinner>
		<span v-else class="d-block">
			<slot></slot>
		</span>
	</button>
</template>

<script>
export default {
	mounted() {
		// Set permanent width for button
		// this width will stay permanent in loading
		this.$nextTick(() => {
			setTimeout(() => {
				const btn = this.$refs["btn-success"];
				btn.style.width = `${btn.offsetWidth + 1}px`;
			}, 0);
		});
	},
	props: {
		variant: {
			type: String,
			default: "secondary",
		},

		loading: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
