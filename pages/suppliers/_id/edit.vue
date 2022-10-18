<template>
	<loading-view :loading="isLoading">
		<form-view v-if="supplier">
			<!-- Header -->
			<template #header> {{ $t("suppliers.title.edit") }} </template>

			<!-- Default Content -->
			<template>
				<!-- Name -->
				<input-control v-model="supplier.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
				<!-- Mobile -->
				<input-control v-model="supplier.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile"></input-control>
				<!-- Telephone -->
				<input-control v-model="supplier.telephone" :label="$t('fields.telephone')" :error="validationErrors.telephone" v-if="hasFieldPermission('suppliers.edit-suppliers.telephone')"></input-control>
				<!-- Email -->
				<input-control v-model="supplier.email" :label="$t('fields.email')" :error="validationErrors.email"></input-control>
				<!-- fax -->
				<input-control v-model="supplier.fax" :label="$t('fields.fax')" :error="validationErrors.fax" v-if="hasFieldPermission('suppliers.edit-suppliers.fax')"></input-control>
				<!-- Vat Number -->
				<input-control v-model="supplier.vatNumber" :label="$t('fields.vatNumber')" :error="validationErrors.vatNumber" v-if="hasFieldPermission('suppliers.edit-suppliers.vat-number')"></input-control>

				<!-- Status -->
				<select-control :label="$t('fields.status')" v-model="supplier.status" :options="getStatus ? getStatus : {}" name="supplier-status" track="value" v-if="hasFieldPermission('suppliers.edit-suppliers.status')"></select-control>
			</template>
			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" to="/suppliers">
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
	name: "edit-supplier",
	mixins: [validation],
	meta: {
		permission: "update-suppliers",
	},
	data() {
		return {
			supplier: null,
			savingState: false,
		};
	},
	computed: {
		...mapGetters({
			getStatus: "config/getStatus",
		}),
	},
	methods: {
		async save(event, updateAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$put(
					"/suppliers/" + this.$route.params.id,
					this.supplier
				);
				this.$toast.success("Supplier updated successfully");
				if (updateAndContinue == false) {
					this.$router.push("/suppliers");
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},
	async fetch() {
		//   Fetch Supplier
		const resSupplier = await this.$axios.$get(
			`/suppliers/${this.$route.params.id}`
		);
		this.supplier = resSupplier.data;

		//   Disable Loading
		this.isLoading = false;
	},
};
</script>

<style lang="scss" scoped></style>
