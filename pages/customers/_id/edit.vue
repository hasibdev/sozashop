<template>
	<loading-view :loading="$fetchState.pending">
		<form-view v-if="customer">
			<!-- Header -->
			<template #header> {{ $t("customers.title.edit") }} </template>

			<!-- Default Content -->
			<template>
				<!-- Name -->
				<input-control v-model="customer.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
				<!-- Mobile -->
				<input-control v-model="customer.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile"></input-control>
				<!-- Email -->
				<input-control v-model="customer.email" :label="$t('fields.email')" :error="validationErrors.email"></input-control>
				<!-- Address -->
				<text-control v-model="customer.address" :label="$t('fields.address')" :error="validationErrors.address" v-if="hasFieldPermission('customers.edit-customer.address')"></text-control>
			</template>
			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" to="/customers">
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
	name: "edit-customer",
	mixins: [validation],
	meta: {
		permission: "update-customers",
	},
	data() {
		return {
			customer: {
				name: "",
				mobile: "",
				email: "",
				address: "",
			},
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
					"/customers/" + this.$route.params.id,
					this.customer
				);
				this.$toast.success("Customer updated successfully");
				if (updateAndContinue == false) {
					this.$router.push("/customers");
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},
	async fetch() {
		//   Fetch customer
		const rescustomer = await this.$axios.$get(
			`/customers/${this.$route.params.id}`
		);
		this.customer = {
			name: rescustomer.data.name,
			mobile: rescustomer.data.mobile,
			email: rescustomer.data.email,
			address: rescustomer.data.address,
		};
	},
};
</script>

<style lang="scss" scoped></style>
