<template>
	<loading-view :loading="$fetchState.pending">
		<form-view>
			<!-- Header -->
			<template #header>
				<h3 class="font-weight-normal">Change Primary Logo</h3>
			</template>

			<template>
				<image-upload :url="settings && settings.primaryMediaUrl" v-model="form.primary" :label="$t('fields.logo')" :error="validationErrors.primary"></image-upload>
			</template>

			<!-- Footer -->
			<template #footer>
				<btn-link class="btn-secondary" to="/settings/application">{{
          $t("buttons.cancel")
        }}</btn-link>

				<btn-primary :loading="savingState" @click="save"> {{ $t("buttons.update") }} </btn-primary>
			</template>
		</form-view>
	</loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
	name: "primary-media",
	mixins: [validation],
	data() {
		return {
			form: {
				primary: null,
			},
			settings: null,
			savingState: false,
		};
	},
	methods: {
		async save() {
			const formData = new FormData();
			for (const key in this.form) {
				formData.append(key, this.form[key]);
			}

			this.savingState = true;
			try {
				const res = await this.$axios.post(
					`/client-settings/${this.$route.params.id}/primary-media`,
					formData
				);

				this.$toast.success("Logo updated successfully");
				this.$router.push("/settings/application");
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},

	async fetch() {
		const resSettings = await this.$axios.$get(
			`/client-settings?type=application`
		);
		this.settings = resSettings;
	},
};
</script>

<style lang="scss" scoped>
</style>
