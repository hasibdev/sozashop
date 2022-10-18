<template>
	<div :class="`badge bg-${map[value]} text-white`">
		{{ value | capitalize }}
	</div>
</template>

<script>
export default {
	props: {
		/**
		 * Avilable Value for Badge
		 */
		value: {
			type: String,
			require: true,
		},
	},
	data() {
		return {
			map: {
				active: "success",
				inactive: "danger",
				draft: "warning",
				return: "danger",
				confirmed: "primary",
				partial: "info",
				paid: "success",
				private: "info",
				public: "primary",
				unverified: "danger",
				verified: "info",
				pending: "warning",
				approved: "success",
				rejected: "danger",
				completed: "info",
				low: "info",
				high: "danger",
				medium: "warning",
				open: "primary",
				close: "warning",
			},
		};
	},
};
</script>

<style lang="scss" scoped></style>
