<template>
	<loading-view :loading="$fetchState.pending">
		<form-view v-if="formData">
			<template #header> {{ $t("expenseInvoices.title.edit") }} </template>
			<template>
				<!-- Date -->
				<date-control v-model="formData.date" :label="$t('fields.date')" :error="validationErrors.date" v-if="hasFieldPermission('expenses.edit-expenses-invoice.date')"></date-control>

				<!-- Category -->
				<searchable-select :error="validationErrors.expenseCategoryId" v-model="formData.expenseCategoryId" :label="$t('fields.category')" :options="categories" track="id"></searchable-select>

				<!-- Payment Select -->
				<select-control track="value" :label="$t('fields.paymentMethod')" :options="paymentMethods || []" v-model="formData.paymentMethod" :error="validationErrors.paymentMethod"></select-control>

				<!-- Dynamic Inputs -->
				<div class="mt-5">
					<dynamic-field :fields="fields" v-model="formData.expenseItems" errorName="expenseItems" @remove="deleteItem">
						<template #footer>
							<tr>
								<td class="font-weight-bold text-right" colspan="1">
									{{ $t("fields.total") }}
								</td>
								<td class="font-weight-bold text-left px-4">{{ total }}</td>
								<td></td>
							</tr>
							<tr>
								<td class="font-weight-bold text-right" colspan="1">
									{{ $t("fields.paidAmount") }}
								</td>
								<td class="font-weight-bold text-left px-3">
									<input-control :error="validationErrors.paidAmount" type="number" v-model="formData.paidAmount">
									</input-control>
								</td>
								<td></td>
							</tr>
							<tr>
								<td class="font-weight-bold text-right" colspan="1">
									{{ $t("fields.totalDue") }}
								</td>
								<td class="font-weight-bold text-left px-4">
									{{ total - parseFloat(formData.paidAmount) }}
								</td>
								<td></td>
							</tr>
						</template>
					</dynamic-field>
				</div>
			</template>

			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" to="/expense-invoices">
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
	name: "edit-expense-invoice",
	middleware: ["expense-invoice-status"],
	mixins: [validation],
	meta: {
		permission: "update-expense-invoices",
	},
	data() {
		return {
			categories: [],
			formData: {
				expenseCategoryId: "",
				date: new Date(),
				expenseItems: [{ description: "", amount: 0 }],
			},
			fields: [
				{
					name: "description", //For v-model
					component: "input-control", // Render component type
					value: "", // Initial value
					props: {
						type: "text",
					},
				},
				{
					name: "amount", //For v-model
					component: "input-control", // Render component type
					value: 0, // Initial value
					props: {
						type: "number",
					},
				},
			],

			savingState: false,
		};
	},
	computed: {
		...mapGetters({
			paymentMethods: "config/getPaymentMethods",
		}),
		total() {
			return this.formData.expenseItems
				.map((item) => parseFloat(item["amount"]))
				.reduce((total, current) => (total += current), 0);
		},
	},
	methods: {
		async save(event, createAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$put(
					`/expense-invoices/${this.$route.params.id}`,
					this.formData
				);
				this.$toast.success("Invoice Updated successfully.");

				if (!createAndContinue) {
					this.$router.push(this.localePath("/expense-invoices"));
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},

		// Delete a invoice item
		async deleteItem(item) {
			try {
				await this.$axios.$delete(`/expense-items/${item.id}/delete`);
				this.$toast.success("Deleted successfully.");
			} catch (error) {
				console.log(error);
			}
		},
	},
	async fetch() {
		// Get expense categories
		const res = await this.$axios.get("/expense-categories");
		this.categories = res.data.data;

		// Get the invoice
		const resInvoice = await this.$axios.get(
			`/expense-invoices/${this.$route.params.id}`
		);

		this.formData = resInvoice.data.data;
	},
};
</script>

<style lang="scss" scoped></style>
