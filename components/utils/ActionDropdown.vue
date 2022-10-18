<template>
	<div class="action-dropdown-wrapper" v-if="hasSlots">
		<b-dropdown :split="split" right :variant="variant">
			<template #button-content>
				<span class="d-flex align-items-center">
					<i :class="`text-${iconVariant}`" class="fas fa-list-ul font-size-20"></i>
				</span>
			</template>
			<slot />
		</b-dropdown>
	</div>
</template>

<script>
export default {
	computed: {
		hasSlots() {
			return Object.keys(this.$slots).length;
		},
	},

	props: {
		split: {
			type: Boolean,
			default: false,
		},
		text: {
			type: String,
			default: "Actions",
		},
		variant: {
			type: String,
			default: "light",
		},
		iconVariant: {
			type: String,
			default: "primary",
		},
	},
};
</script>

<style lang="scss">
.fa-ellipsis-h.text-muted {
	font-size: 1.4rem;
}

.action-dropdown-wrapper .b-dropdown .dropdown-toggle::after {
	display: none;
}
</style>
