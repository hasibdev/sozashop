<template>
	<loading-view :loading="$fetchState.pending">
		<form-view v-if="formData">
			<template #header> {{ $t("admins.title.edit") }} </template>

			<template>

				<!-- First Name -->
				<input-control v-model="formData.firstName" :label="$t('fields.firstName')" :error="validationErrors.firstName"></input-control>
				<!-- Last Name -->
				<input-control v-model="formData.lastName" :label="$t('fields.lastName')" :error="validationErrors.lastName"></input-control>
				<!-- Email -->
				<input-control v-model="formData.email" :label="$t('fields.email')" :error="validationErrors.email" type="email"></input-control>
				<!-- Roles -->
				<multiselect-control v-model="formData.roles" :label="$t('fields.roles')" :options="roles" :error="validationErrors.roles"></multiselect-control>

			</template>
			<!-- Action Buttons -->
			<template #footer>
				<btn-link class="btn-secondary" to="/admin/admins">{{
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
	name: "edit-admin",
	mixins: [validation],
	layout: "admin",
	meta: {
		permission: "update-admins",
	},
	data() {
		return {
			formData: null,
			roles: [],
			savingState: false,
		};
	},
	methods: {
		async save(event, createAndContinue = false) {
			// Maping out only 'id' if the data type is object
			const fixRoles = this.formData.roles.map((role) => {
				if (typeof role === "object") {
					return role.id;
				}
				return role;
			});

			this.savingState = true;
			try {
				await this.$axios.$put(`/admin/admins/${this.$route.params.id}`, {
					...this.formData,
					roles: fixRoles,
				});
				this.$toast.success("Admin Update successfully.");
				if (!createAndContinue) {
					this.$router.push(this.localePath("/admin/admins"));
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},

	async fetch() {
		const resCategorys = await this.$axios.$get(
			`/admin/admins/${this.$route.params.id}`
		);
		this.formData = resCategorys.data;

		// Fetch Roles
		const resRoles = await this.$axios.get("/admin/roles");
		this.roles = resRoles.data.data;
	},
};
</script>

<style lang="scss" scoped></style>
