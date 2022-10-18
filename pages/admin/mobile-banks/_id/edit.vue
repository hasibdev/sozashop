<template>
	<loading-view :loading="$fetchState.pending">
		<form-view>
			<template #header> {{ $t("banks.title.edit") }} </template>

			<template>
				<!-- Name -->
				<input-control v-model="form.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
				<!-- email -->
				<input-control v-model="form.email" :label="$t('fields.email')" :error="validationErrors.email" type="email"></input-control>

				<!-- mobile -->
				<input-control v-model="form.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile" type="tel"></input-control>
				<!-- telephone -->
				<input-control v-model="form.telephone" :label="$t('fields.telephone')" :error="validationErrors.telephone" type="tel"></input-control>
				<!-- Address -->
				<input-control v-model="form.address" :label="$t('fields.address')" :error="validationErrors.address"></input-control>

				<!-- country -->
				<select-control v-model="form.countryId" :options="countries" :label="$t('fields.country')" :error="validationErrors.countryId"></select-control>

			</template>
			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" to="/admin/mobile-banks">{{
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
	name: "edit-bank",
	mixins: [validation],
	layout: "admin",
	meta: {
		permission: "update-mobile-banks",
	},
	data() {
		return {
			form: {
				name: "",
				email: "",
				mobile: "",
				telephone: "",
				address: "",
				countryId: "",
			},
			countries: [],
			savingState: false,
		};
	},
	methods: {
		async save(event, createAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$put(
					`/admin/mobile-banks/${this.$route.params.id}`,
					this.form
				);
				this.$toast.success("Bank Updated successfully.");
				if (!createAndContinue) {
					this.$router.push(this.localePath("/admin/mobile-banks"));
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},
	async fetch() {
		const resBank = await this.$axios.$get(
			`/admin/mobile-banks/${this.$route.params.id}`
		);
		this.form = resBank.data;

		const resCountries = await this.$axios.get("/ajax/countries");
		this.countries = resCountries.data;
	},
};
</script>

<style lang="scss" scoped></style>
