<template>
	<div>
		<back-btn v-if="hasBack"></back-btn>
		<h3>
			<slot name="title"></slot>
		</h3>
		<div class="d-flex justify-content-between">
			<slot name="header"></slot>
		</div>
		<div class="row">
			<div class="col-12">
				<slot></slot>
			</div>
			<!-- end col -->
		</div>

		<slot name="pagination"></slot>
	</div>
</template>

<script>
export default {
	props: {
		hasBack: {
			type: Boolean,
			default: false,
		},
	},
	created() {
		// console.log(this.$nuxt.$loading);
	},
};
</script>

<style lang="scss" scoped></style>
