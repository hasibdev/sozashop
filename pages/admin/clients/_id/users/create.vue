<template>
	<loading-view :loading="$fetchState.pending">
		<form-view>
			<template #header> {{ $t("users.title.add") }} </template>
			<template>
				<!-- First Name -->
				<input-control v-model="formData.firstName" :label="$t('fields.firstName')" :error="validationErrors.firstName"></input-control>
				<!-- Last Name -->
				<input-control v-model="formData.lastName" :label="$t('fields.lastName')" :error="validationErrors.lastName"></input-control>
				<!-- Email -->
				<input-control v-model="formData.email" :label="$t('fields.email')" :error="validationErrors.email"></input-control>
				<!-- Mobile -->
				<input-control v-model="formData.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile"></input-control>
				<!-- designation -->
				<input-control v-model="formData.designation" :label="$t('fields.designation')" :error="validationErrors.designation"></input-control>
				<!-- Roles -->
				<multiselect-control v-model="formData.roles" :label="$t('fields.roles')" :options="roles" :error="validationErrors.roles"></multiselect-control>
				<!-- Password -->
				<input-control v-model="formData.password" :label="$t('fields.password')" :error="validationErrors.password" type="password"></input-control>
				<!-- Confirm Password -->
				<input-control v-model="formData.password_confirmation" :label="$t('fields.confirmPassword')" :error="validationErrors.password_confirmation" type="password"></input-control>
			</template>

			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" :to="`/admin/clients/${$route.params.id}`">
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

export default {
	layout: "admin",
	name: "create-user",
	mixins: [validation],
	data() {
		return {
			formData: {
				firstName: "",
				lastName: "",
				email: "",
				mobile: "",
				password: "",
				roles: [],
				password_confirmation: "",
				clientId: this.$route.params.id,
			},
			initialData: null,
			roles: [],

			savingState: false,
		};
	},
	methods: {
		async save(event, createAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$post("/admin/users", this.formData);
				this.$toast.success("User created successfully.");
				if (createAndContinue) {
					this.reset();
				} else {
					this.$router.push(
						this.localePath(`/admin/clients/${this.$route.params.id}`)
					);
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
		reset() {
			this.formData = { ...this.initialData };
			this.formData.roles = [];
		},
	},
	created() {
		this.initialData = { ...this.formData };
	},
	async fetch() {
		const resRoles = await this.$axios.get(
			`/ajax/roles?client=${this.$route.params.id}`
		);
		this.roles = resRoles.data.data;
	},
};
</script>

<style lang="scss" scoped></style>
