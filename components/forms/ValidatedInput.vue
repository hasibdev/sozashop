<template>
	<div class="mb-2 form-group row align-items-center">
		<!-- Input -->
		<label :for="getName" :class="getLabelclass">{{ label }}
			<span v-if="required" class="text-danger">*</span>
		</label>
		<div :class="getFieldclass">
			<input :ref="getName" :id="getName" :type="type" :placeholder="placeholder" :required="required" class="form-control" :class="{ 'border-danger': validation.$dirty && validation.$anyError }" :value="value" @input="onDarty" @blur="onBlue" />
		</div>
		<!-- Errors -->
		<span class="text-danger">{{ error[0] }}</span>
	</div>
</template>

<script>
export default {
	props: {
		type: { type: String, default: "text" },
		value: { type: String, required: true },
		required: { type: Boolean, default: false },
		label: { type: String },
		placeholder: { type: String },
		validation: { type: Object },
		imedieate: { type: Boolean, default: false },
		readonly: {
			type: Boolean,
			default: false,
		},
		// Stack label
		stack: {
			type: Boolean,
			default: false,
		},
		// Validation error
		error: {
			type: Array,
			default: () => [],
		},
		focus: {
			type: Boolean,
			default: false,
		},
		// update column for modal use
		inModal: {
			type: Boolean,
			default: false,
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
	created() {
		if (this.imedieate) {
			this.validation.$touch();
		}
	},
	mounted() {
		this.$nextTick(() => {
			if (this.focus) {
				setTimeout(() => {
					this.$refs[this.getName].focus();
				}, 0);
			}
		});
	},
	methods: {
		onDarty(e) {
			this.validation.$touch();
			this.$emit("input", e.target.value);
		},
		onBlue(e) {
			this.validation.$touch();
			this.$emit("blur", e.target.value);
		},
	},
};
</script>

<style lang="scss" scoped></style>
