<template>
	<div class="form-group row align-items-center">
		<label :for="getName" class="mb-0" :class="[label && stack === false ? 'col-sm-2' : 'col-sm-12']" v-if="label">{{ label }}</label>
		<div :class="[label && stack === false ? 'col-sm-10' : 'col-sm-12']">
			<b-form-file :id="getName" drop-placeholder="Drop file here..." :placeholder="placeholder" :readonly="readonly" v-model="innerValue" @input="onFile" :multiple="multiple"></b-form-file>
			<a class="mt-1 d-block" v-if="previousLink" :href="previousLink">{{
        getPreviousName
      }}</a>
			<p class="text-muted mb-0">
				<slot name="help"></slot>
			</p>
			<span>
				<slot name="action"></slot>
			</span>
			<span class="text-danger">{{ error[0] }}</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		readonly: {
			type: Boolean,
			default: false,
		},
		value: {
			required: false,
			default: null,
		},
		error: {
			type: Array,
			default: () => [],
		},
		name: {
			type: [String, Number],
			required: false,
		},
		label: {
			type: String,
			require: true,
		},
		type: {
			type: String,
			default: "text",
			validator: (val) => val == "text" || val == "number" || val == "password",
		},
		placeholder: {
			type: String,
			required: false,
		},
		// Stack label
		stack: {
			type: Boolean,
			default: false,
		},
		multiple: {
			type: Boolean,
			default: false,
		},
		clearonfocus: {
			type: Boolean,
			default: false,
		},
		previousLink: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			innerValue: null,
		};
	},
	methods: {
		onFile(file) {
			this.$emit("input", file);
		},
	},

	computed: {
		getName() {
			if (this.label) {
				return this.name
					? this.name
					: this.label
							.replace(/([a-z])([A-Z])/g, "$1-$2")
							.replace(/\s+/g, "-")
							.toLowerCase();
			}
		},
		getPreviousName() {
			if (this.previousLink) {
				return this.previousLink.split("/").pop();
			}
		},
	},

	watch: {
		value(newValue) {
			this.innerValue = newValue;
		},
	},
};
</script>

<style lang="scss"></style>
