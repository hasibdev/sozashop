<template>
	<loading-view :loading="$fetchState.pending">
		<form-view v-if="user">
			<template #header>
				<h3 class="font-weight-normal">{{ $t("users.title.edit") }}</h3>
			</template>

			<template>
				<!-- First Name -->
				<input-control v-model="user.firstName" :label="$t('fields.firstName')" :error="validationErrors.firstName"></input-control>

				<!-- Last Name -->
				<input-control v-model="user.lastName" :label="$t('fields.lastName')" :error="validationErrors.lastName"></input-control>

				<!-- Email -->
				<email-control v-model="user.email" :label="$t('fields.email')" :error="validationErrors.email"></email-control>

				<!-- Mobile -->
				<input-control v-model="user.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile"></input-control>

				<!-- change Status -->
				<select-control :label="$t('fields.status')" v-model="user.status" :options="getStatus" name="category-status" track="value"></select-control>
			</template>

			<template #footer>
				<btn-link class="btn-secondary" :to="`/admin/clients/${$route.params.id}`">{{ $t("buttons.cancel") }}</btn-link>
				<btn-success :loading="savingState" @click="save($event, true)">
					{{ $t("buttons.updateContinue") }}
				</btn-success>
				<btn-primary :loading="savingState" @click="save"> {{ $t("buttons.update") }} </btn-primary>
			</template>
		</form-view>
	</loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { mapGetters } from "vuex";
export default {
	layout: "admin",
	name: "edit-user",
	mixins: [validation],
	data() {
		return {
			user: null,

			savingState: false,
		};
	},
	computed: {
		...mapGetters({
			getStatus: "config/getStatus",
		}),
	},
	methods: {
		async save(event, createAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$put(
					`/admin/users/${this.$route.params.user}`,
					this.user
				);
				this.$toast.success("User updated successfully");
				if (!createAndContinue) {
					this.$router.push(`/admin/clients/${this.$route.params.id}`);
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},
	async fetch() {
		const resUser = await this.$axios.get(
			`/admin/users/${this.$route.params.user}`
		);

		this.user = resUser.data.data;
	},
};
</script>

<style lang="scss" scoped></style>
