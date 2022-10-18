<template>
	<loading-view :loading="$fetchState.pending">
		<form-view>
			<template #header> {{ $t("countries.title.edit") }} </template>

			<template v-if="form">
				<!-- Name -->
				<input-control v-model="form.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
				<!-- Code -->
				<input-control v-model="form.code" :label="$t('fields.code')" :error="validationErrors.code"></input-control>
				<!-- Currency -->
				<input-control v-model="form.currency" :label="$t('fields.currency')" :error="validationErrors.currency"></input-control>
				<!-- Currency Code -->
				<input-control v-model="form.currencyCode" :label="$t('fields.currencyCode')" :error="validationErrors.currencyCode"></input-control>
				<!-- Currency symbol -->
				<input-control v-model="form.currencySymbol" :label="$t('fields.currencySymbol')" :error="validationErrors.currencySymbol"></input-control>
			</template>
			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" to="/admin/countries">{{
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
	name: "edit-country",
	mixins: [validation],
	layout: "admin",
	meta: {
		permission: "update-countries",
	},
	data() {
		return {
			form: null,
			savingState: false,
		};
	},
	methods: {
		async save(event, createAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$put(
					`/admin/countries/${this.$route.params.id}`,
					this.form
				);
				this.$toast.success("Country Update successfully.");
				if (!createAndContinue) {
					this.$router.push(this.localePath("/admin/countries"));
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},

	async fetch() {
		const response = await this.$axios.$get(
			`/admin/countries/${this.$route.params.id}`
		);
		this.form = response.data;
	},
};
</script>

<style lang="scss" scoped></style>
