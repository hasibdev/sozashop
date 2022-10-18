<template>
	<form-view>
		<template #header> {{ $t("unit.title.add") }} </template>

		<!-- Default Slot -->
		<template>
			<!--Root Unit -->
			<select-control :label="$t('fields.baseUnitId')" v-model="formData.baseUnitId" :options="baseUnitIdOptions" :disabled="true"></select-control>
			<!-- Base Unit Url -->
			<select-control :label="$t('fields.unit')" v-model="formData.unitId" :options="baseUnitIdOptions" name="base-unit-id" track="id"></select-control>

			<!-- Operators -->
			<select-control :label="$t('fields.operator')" v-model="formData.operator" :options="operators" name="operator" track="name"></select-control>
			<!-- Value -->
			<input-control v-model="formData.value" :label="$t('fields.value')" :error="validationErrors.value" type="number">
				<template #help>
					Formula: (Base Unit * Value = Unit) Or (Base Unit / Value = Unit)
				</template>
			</input-control>
		</template>

		<!-- Action Buttons -->
		<template #footer>
			<btn-link class="btn-secondary" :to="`/units/${$route.params.id}`">
				{{ $t("buttons.cancel") }}
			</btn-link>
			<btn-success :loading="savingState" @click="save($event, true)">
				{{ $t("buttons.submitContinue") }}
			</btn-success>
			<btn-primary :loading="savingState" @click="save">
				{{ $t("buttons.submit") }}
			</btn-primary>
		</template>
	</form-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
	name: "create-conversion",
	mixins: [validation],
	data() {
		return {
			formData: {
				baseUnitId: this.$route.params.id,
				unitId: "",
				operator: "",
				value: "",
			},
			operators: [{ name: "*" }, { name: "/" }],
			initialData: null,

			savingState: false,
		};
	},
	async asyncData({ app, params }) {
		const resBaseUnit = await app.$axios.get("/units");
		return {
			baseUnitIdOptions: resBaseUnit.data.data,
		};
	},
	methods: {
		async save(event, createAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$post("/unit-conversions", this.formData);
				this.$toast.success("Unit Conversions created successfully.");
				if (createAndContinue) {
					this.reset();
				} else {
					this.$router.push(this.localePath(`/units/${this.$route.params.id}`));
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.savingState = false;
			}
		},
		reset() {
			this.formData = { ...this.initialData };
		},
	},
	created() {
		this.initialData = { ...this.formData };
	},
};
</script>

<style lang="scss" scoped></style>
