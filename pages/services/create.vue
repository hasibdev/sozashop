<template>
	<loading-view :loading="$fetchState.pending">
		<form-view>
			<template #header> {{ $t("services.title.add") }} </template>
			<template>
				<!-- Name -->
				<input-control focus v-model="form.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>
				<!-- Description -->
				<text-control v-if="hasFieldPermission('services.add-service.description')" v-model="form.description" :label="$t('fields.description')" :error="validationErrors.description"></text-control>
				<!-- Amount -->
				<input-control v-model="form.amount" :label="$t('fields.amount')" :error="validationErrors.amount" type="number"></input-control>
				<!-- Category -->
				<select-control v-model="form.categoryId" :label="$t('fields.category')" :error="validationErrors.categoryId" :options="serviceCategories || []" track="id"></select-control>
				<!-- Service type -->
				<select-control v-model="form.type" :label="$t('fields.serviceType')" :error="validationErrors.type" :options="serviceTypeOptions || []" track="value"></select-control>
			</template>

			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" to="/services">
					{{ $t("buttons.cancel") }}
				</btn-link>
				<btn-success :loading="savingState" @click="save($event, true)">
					{{ $t("buttons.submitContinue") }}
				</btn-success>
				<btn-primary :loading="savingState" @click="save">
					{{ $t("buttons.submit") }}
				</btn-primary>
			</template>
		</form-view>
	</loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";

export default {
	name: "service-create",
	mixins: [validation],
	meta: {
		permission: "create-services",
	},
	data() {
		return {
			form: {
				name: "",
				description: "",
				amount: "",
				type: "",
				categoryId: "",
			},
			serviceCategories: null,
			initialData: null,

			savingState: false,
		};
	},
	computed: {
		...mapGetters({
			serviceTypeOptions: "config/getServiceTypeOptions",
		}),
	},
	methods: {
		async save(event, createAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$post("/services", this.form);
				this.$toast.success("Service created successfully.");
				if (createAndContinue) {
					this.reset();
				} else {
					this.$router.push(this.localePath("/services"));
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
		reset() {
			this.form = { ...this.initialData };
		},
	},
	created() {
		this.initialData = { ...this.form };
	},
	async fetch() {
		const resCategories = await this.$axios.get("service-categories");
		this.serviceCategories = resCategories.data.data;
	},
};
</script>

<style lang="scss" scoped>
</style>
