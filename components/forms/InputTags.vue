<template>
	<div class="form-group row align-items-center">
		<label class="mb-0" :class="[label && stack === false ? 'col-sm-2' : 'col-sm-12']" v-if="label">{{ label }}</label>
		<div :class="[label && stack === false ? 'col-sm-10' : 'col-sm-12']">
			<input-tag :placeholder="placeholder" class="rounded" v-model="tagValue" :add-tag-on-blur="true" @input="onAddTag"></input-tag>
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
import InputTag from "vue-input-tag";
export default {
	components: {
		"input-tag": InputTag,
	},
	data() {
		return {
			tagValue: this.value,
		};
	},
	methods: {
		onAddTag(value) {
			this.$emit("input", this.tagValue);
		},
	},
	watch: {
		value() {
			this.tagValue = this.value;
		},
	},
	props: {
		label: {
			type: String,
		},
		placeholder: {
			type: String,
			default: "Type and enter for multiple item",
		},
		value: {
			type: Array,
			default: () => [],
		},
		error: {
			type: Array,
			default: () => [],
		},
		options: {
			type: Array,
			default: () => [],
		},
		// Stack label
		stack: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss">
.vue-input-tag-wrapper {
	&:focus,
	&:active,
	&.vue-input-tag-wrapper--active {
		border-color: var(--primary);
	}
	.input-tag {
		background-color: var(--primary);
		border: none;
		color: #fff;
		padding-left: 10px;
		padding-right: 10px;
		font-size: 14px;
		display: flex;
		justify-content: center;
		align-items: center;
		.remove {
			color: var(--danger);
			margin-left: 5px;
		}
	}
	.new-tag {
		padding: 2px 7px;
		font-size: 14px;
		color: #495057;
	}
}
</style>
