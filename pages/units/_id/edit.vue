<template>
	<loading-view :loading="isLoading">
		<form-view v-if="unit">
			<!-- Header -->
			<template #header> {{ $t("unit.title.edit") }} </template>
			<!-- Default slot -->
			<template>
				<!-- Name -->
				<input-control v-if="hasFieldPermission('settings.edit-unit.name')" v-model="unit.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>

				<!-- Description -->
				<input-control v-model="unit.code" v-if="hasFieldPermission('settings.add-unit.code')" :label="$t('fields.code')" :error="validationErrors.code"></input-control>
			</template>

			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" to="/units">{{
          $t("buttons.cancel")
        }}</btn-link>
				<btn-success :loading="savingState" @click="save($event, true)">
					{{ $t("buttons.updateContinue") }}
				</btn-success>
				<btn-primary :loading="savingState" @click="save">
					{{ $t("buttons.update") }}
				</btn-primary>
			</template>
		</form-view>
	</loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";

export default {
	name: "EditUnit",
	mixins: [validation],
	data() {
		return {
			unit: null,
			savingState: false,
		};
	},
	async fetch() {
		const unitRes = await this.$axios.get(`/units/${this.$route.params.id}`);

		this.unit = unitRes.data.data;
		// Disable loading
		this.isLoading = false;
	},
	methods: {
		async save(event, createAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$put(`/units/${this.$route.params.id}`, this.unit);
				this.$toast.success("Unit Update successfully.");
				if (!createAndContinue) {
					this.$router.push(this.localePath("/units"));
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
