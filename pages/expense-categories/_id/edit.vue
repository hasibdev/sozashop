<template>
	<loading-view :loading="isLoading">
		<form-view>
			<template #header> {{ $t("expenseCategories.title.edit") }} </template>

			<template>
				<!-- Name -->
				<input-control v-model="formData.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>

				<!-- Description -->
				<text-control v-model="formData.description" :label="$t('fields.description')" :error="validationErrors.description" v-if="
            hasFieldPermission('expenses.edit-expenses-category.description')
          "></text-control>
				<!-- change Status -->
				<select-control :label="$t('fields.status')" v-model="formData.status" :options="getStatus" name="category-status" track="value" v-if="hasFieldPermission('expenses.edit-expenses-category.status')"></select-control>
			</template>
			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" to="/categories">{{
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
import { mapGetters } from "vuex";
export default {
	name: "edit-category",
	mixins: [validation],
	meta: {
		permission: "update-expense-categories",
	},
	data() {
		return {
			formData: {
				name: "",
				description: "",
				status: "",
			},

			savingState: false,
		};
	},
	methods: {
		async save(event, createAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$put(
					`/expense-categories/${this.$route.params.id}`,
					this.formData
				);
				this.$toast.success("Category Update successfully.");
				if (!createAndContinue) {
					this.$router.push(this.localePath("/expense-categories"));
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},
	computed: {
		...mapGetters({
			getStatus: "config/getStatus",
		}),
	},
	async fetch() {
		const resCategorys = await this.$axios.$get(
			`/expense-categories/${this.$route.params.id}`
		);
		this.formData = resCategorys.data;
		this.isLoading = false;
	},
};
</script>

<style lang="scss" scoped></style>
