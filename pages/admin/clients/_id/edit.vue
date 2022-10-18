<template>
	<loading-view :loading="$fetchState.pending">
		<form-view v-if="user">
			<template #header>
				<h3 class="font-weight-normal">{{ $t("clients.title.edit") }}</h3>
			</template>

			<template>
				<!-- First Name -->
				<input-control v-model="user.firstName" :label="$t('fields.firstName')" :error="validationErrors.firstName"></input-control>

				<!-- Last Name -->
				<input-control v-model="user.lastName" :label="$t('fields.lastName')" :error="validationErrors.lastName"></input-control>

				<!-- Shop Name -->
				<input-control v-model="user.shopName" :label="$t('fields.shopName')" :error="validationErrors.shopName"></input-control>

				<!-- Email -->
				<email-control v-model="user.email" :label="$t('fields.email')" :error="validationErrors.email"></email-control>

				<!-- Mobile -->
				<input-control v-model="user.mobile" :label="$t('fields.mobile')" :error="validationErrors.mobile"></input-control>

				<!-- Industry -->
				<select-control @input="onIndustryChange" :label="$t('fields.industry')" v-model="user.industryId" :options="industries" placeholder="Select Industry" :error="validationErrors.mobile"></select-control>

				<!-- Country -->
				<select-control v-model="user.moduleId" :label="$t('fields.country')" :options="modules" placeholder="Select Country" :error="validationErrors.moduleId">
					<template v-slot:default="props">
						{{ props.option.country.name }}
					</template>
				</select-control>

				<!-- change Status -->
				<select-control :label="$t('fields.status')" v-model="user.status" :options="getStatus" name="category-status" track="value"></select-control>
			</template>

			<template #footer>
				<btn-link class="btn-secondary" to="/admin/clients">{{
          $t("buttons.cancel")
        }}</btn-link>
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
	meta: {
		permission: "update-clients",
	},
	data() {
		return {
			user: null,
			industries: [],
			modules: [],
			savingState: false,
		};
	},
	computed: {
		...mapGetters({
			getStatus: "config/getStatus",
		}),
	},

	methods: {
		async onIndustryChange(value) {
			const res = await this.$axios.$get("/admin/modules?industryId=" + value);
			this.modules = res.data;
		},

		async save(event, createAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$put(`/admin/clients/${this.user.id}`, this.user);
				this.$toast.success("User updated successfully");
				if (!createAndContinue) {
					this.$router.push("/admin/clients");
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},

	async fetch() {
		// Get the user
		const resUser = await this.$axios.$get(
			"/admin/clients/" + this.$route.params.id
		);
		this.user = resUser.data;

		// Get the industries
		const res = await this.$axios.$get("/ajax/industries");
		this.industries = res.data;

		// Get the module of the selected industry
		this.onIndustryChange(this.user.industryId);
	},
};
</script>

<style lang="scss" scoped></style>
