<template>
	<div class="form-group row align-items-center">
		<label :for="getName" :class="getLabelclass" v-if="label">{{ label }}
			<span v-if="required" class="text-danger">*</span>
		</label>
		<div :class="`d-flex align-items-center ${getFieldclass}`">
			<select :id="getName" class="form-control" :value="value" @input="onDarty" @blur="onDarty" :disabled="disabled" :class="{
          'bg-light': disabled,
          'border-danger': validation.$dirty && validation.$anyError
        }">
				<option value="" v-if="showPlaceholder">{{ placeholder }}</option>
				<option v-for="(option, index) in options" :key="index" :selected="value == getSelected(option)" :value="getValue(option)">
					<slot :option="option">{{ getTitle(option) }}</slot>
				</option>
			</select>

		</div>
		<span class="text-danger">{{ error[0] }}</span>
	</div>
</template>

<script>
export default {
	props: {
		readonly: {
			type: Boolean,
			default: false,
		},
		// Stack label
		stack: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			required: true,
		},
		required: {
			type: Boolean,
			default: false,
		},
		options: {
			type: Array,
			default: () => [],
		},
		// Option title to show
		title: {
			type: String,
			default: "name",
		},
		// Return value for v-model
		track: {
			type: String,
			default: "id",
		},
		// Select placeholder
		placeholder: {
			type: String,
			default: "Select One",
		},
		// Default selected value
		value: {
			default: "",
		},
		// Control select placeholder
		showPlaceholder: {
			type: Boolean,
			default: true,
		},

		// Validation error
		error: {
			type: Array,
			default: () => [],
		},

		// Disabled
		disabled: {
			type: Boolean,
			default: false,
		},

		validation: { type: Object },
		imedieate: { type: Boolean, default: false },
		// update column for modal use
		inModal: {
			type: Boolean,
			default: false,
		},
	},
	created() {
		if (this.imedieate) {
			this.validation.$touch();
		}
	},
	methods: {
		onDarty(e) {
			this.validation?.$touch();
			this.$emit("input", e.target.value);
		},
		getSelected(option) {
			if (typeof option == "object") {
				return option[this.track];
			}
			return option;
		},
		getValue(option) {
			if (typeof option == "object") {
				return option[this.track];
			}
			return option;
		},

		getTitle(option) {
			if (typeof option == "object") {
				return option[this.title];
			}
			return option;
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
		isValidated() {
			return this.value?.length ? true : false;
		},
		getLabelclass() {
			return this.label && this.stack === false
				? this.inModal
					? "col-sm-4"
					: "col-sm-2"
				: "col-sm-12";
		},
		getFieldclass() {
			return this.label && this.stack === false
				? this.inModal
					? "col-sm-8"
					: "col-sm-10"
				: "col-sm-12";
		},
	},
};
</script>

<style lang="scss" scoped></style>
