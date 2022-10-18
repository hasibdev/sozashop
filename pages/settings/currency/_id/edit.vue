<template>
	<loading-view :loading="$fetchState.pending">
		<form-view v-if="currency">
			<!-- Header -->
			<template #header>
				<h3 class="font-weight-normal">
					{{ $t("currency.title.edit") }}
				</h3>
			</template>

			<!-- Content -->
			<template>
				<!-- Currency Name -->
				<input-control v-model="currency.name" :label="$t('fields.currencyName')" :error="validationErrors.currency_name"></input-control>
				<!-- Currency Code -->
				<input-control v-model="currency.code" :label="$t('fields.currencyCode')" :error="validationErrors.currency_code"></input-control>
				<!-- Currency Symbol -->
				<input-control v-model="currency.symbol" :label="$t('fields.currencySymbol')" :error="validationErrors.currency_symbol"></input-control>
			</template>

			<!-- Footer -->
			<template #footer>
				<btn-link class="btn-secondary" to="/settings/currency">{{
          $t("buttons.cancel")
        }}</btn-link>

				<btn-primary @click="save"> {{ $t("buttons.update") }} </btn-primary>
			</template>
		</form-view>
	</loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";

export default {
	name: "edit-currency-settings",
	mixins: [validation],
	data() {
		return {
			currency: null,
		};
	},
	methods: {
		async save() {
			try {
				await this.$axios.$put(
					`/currency/${this.$route.params.id}`,
					this.currency
				);
				this.$toast.success("Currency updated successfully");
				this.$router.push("/settings/currency");
			} catch (error) {
				console.log(error);
			}
		},
	},
	async fetch() {
		const resCurrency = await this.$axios.$get(
			`/currency/${this.$route.params.id}`
		);
		this.currency = resCurrency.data;
	},
};
</script>

<style lang="scss" scoped></style>
