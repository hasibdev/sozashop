<template>
	<div>
		<MultiselectFilterControl v-model="innerValue" @input="handleInput" :options="options" :label="label" :title="title" stack></MultiselectFilterControl>
	</div>
</template>

<script>
import MultiselectFilterControl from "@/components/forms/MultiselectFilterControl.vue";
export default {
	components: {
		MultiselectFilterControl,
	},
	data() {
		return {
			innerValue: this.value,
		};
	},
	methods: {
		handleInput(value) {
			this.$emit("input", value);
		},
	},
	props: {
		// Select options
		options: {
			type: [Array, Object],
			required: true,
		},

		// Input Label
		label: {
			type: String,
			required: false,
		},

		// Option title to show
		title: {
			type: String,
			default: "name",
		},
		// Default selected value
		value: {
			default: "",
		},
	},
	watch: {
		value: {
			immediate: true,
			handler(value) {
				this.innerValue = value;
			},
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
