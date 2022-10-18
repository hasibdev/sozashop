<template>
	<div>
		<back-btn></back-btn>
		<div class="d-flex align-items-center justify-content-between mb-2">
			<slot name="header"></slot>
		</div>
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: "details-view",
};
</script>

<style lang="scss" scoped></style>
