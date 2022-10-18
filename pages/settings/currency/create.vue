<template>
	<form-view>
		<template #header> {{ $t("currency.title.add") }} </template>
		<template>
			<!-- Currency Name -->
			<input-control focus v-model="form.name"  :label="$t('fields.currencyName')" :error="validationErrors.currency_name"></input-control>
			<!-- Currency Code -->
			<input-control v-model="form.code" :label="$t('fields.currencyCode')" :error="validationErrors.currency_code"></input-control>
			<!-- Currency Symbol -->
			<input-control v-model="form.symbol" :label="$t('fields.currencySymbol')" :error="validationErrors.currency_symbol"></input-control>
		</template>

		<!-- Action Buttons -->
		<template #footer>
			<btn-link class="btn-secondary" to="/currency">
				{{ $t("buttons.cancel") }}
			</btn-link>
			<btn-success @click="save($event, true)">
				{{ $t("buttons.submitContinue") }}
			</btn-success>
			<btn-primary @click="save">
				{{ $t("buttons.submit") }}
			</btn-primary>
		</template>
	</form-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";

export default {
	name: "create-currency",
	mixins: [validation],
	meta: {
		permission: true,
	},
	data() {
		return {
			form: {
				name: "",
				code: "",
				symbol: "",
			},
			initialData: null,
		};
	},
	methods: {
		async save(event, createAndContinue = false) {
			try {
				await this.$axios.$post("/currency", this.form);
				this.$toast.success("Currency created successfully.");
				if (createAndContinue) {
					this.reset();
				} else {
					this.$router.push(this.localePath("/settings/currency"));
				}
			} catch (error) {
				console.log(error);
			}
		},
		reset() {
			this.form = { ...this.initialData };
		},
	},
	created() {
		this.initialData = { ...this.form };
	},
};
</script>

<style lang="scss" scoped></style>
