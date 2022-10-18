<template>
	<loading-view :loading="$fetchState.pending">
		<form-view v-if="loan">
			<!-- Header -->
			<template #header> {{ $t("loans.title.edit") }} </template>

			<!-- Default Content -->
			<template>
				<!-- Loaner -->
				<select-control v-model="loan.loanerId" :label="$t('fields.loaner')" :options="loaners" :error="validationErrors.loanerId">
				</select-control>
				<!-- Type -->
				<select-control v-model="loan.type" :label="$t('fields.loanType')" :options="loanTypes || []" track="value" :error="validationErrors.type">
				</select-control>
				<!-- Amount -->
				<input-control :label="$t('fields.amount')" type="number" v-model="loan.amount" :error="validationErrors.amount"></input-control>
				<!-- Contract Start Date -->
				<date-control v-model="loan.contractStartDate" :error="validationErrors.contractStartDate" :label="$t('fields.contractStartDate')">
				</date-control>
				<!-- Contract End Date -->
				<date-control v-model="loan.contractEndDate" :error="validationErrors.contractEndDate" :label="$t('fields.contractEndDate')">
				</date-control>
			</template>
			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" to="/loans">
					{{ $t("buttons.cancel") }}
				</btn-link>
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
import { mapGetters } from "vuex";
export default {
	name: "edit-loaner",
	mixins: [validation],
	meta: {
		permission: "update-loans",
	},
	data() {
		return {
			loan: null,
			loaners: [],
			savingState: false,
		};
	},
	computed: mapGetters({
		loanTypes: "config/getLoanTypes",
	}),

	methods: {
		async save(event, updateAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$put(
					"/loans/" + this.$route.params.id,
					this.loan
				);
				this.$toast.success("Loan updated successfully");
				if (updateAndContinue == false) {
					this.$router.push("/loans");
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},
	async fetch() {
		//   Fetch Loan
		const resLoan = await this.$axios.get(
			`/loans/${this.$route.params.id}`
		);
		this.loan = resLoan.data.data;

		//   Fetch Loaners
		const resLoaner = await this.$axios.get("/loaners");
		this.loaners = resLoaner.data.data;
	},
};
</script>

<style lang="scss" scoped></style>
