<template>
	<loading-view :loading="isLoading">
		<form-view v-if="industry">
			<template #header>
				<h3 class="font-weight-normal">
					{{ $t("industries.title.edit") }}
				</h3>
			</template>

			<template>
				<div>
					<!-- Name -->
					<input-control v-model="industry.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>

					<!-- Description -->
					<text-control v-model="industry.description" :label="$t('fields.description')" :error="validationErrors.description"></text-control>

					<!-- Status -->
					<select-control :label="$t('fields.status')" :options="getStatus" track="value" name="industry-status" :showPlaceholder="false" v-model="industry.status">
					</select-control>
				</div>
			</template>

			<template #footer>
				<btn-link class="btn-secondary" to="/admin/industries">{{
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
	name: "edit-industry",
	mixins: [validation],
	meta: {
		permission: "update-industries",
	},
	data() {
		return {
			industry: null,
			errors: [],
			savingState: false,
		};
	},
	computed: {
		...mapGetters({
			getStatus: "config/getIndustryStatusOptions",
		}),
	},

	methods: {
		async save(event, updateAndContinue = false) {
			this.savingState = true;
			try {
				await this.$axios.$put(
					"/admin/industries/" + this.$route.params.id,
					this.industry
				);
				this.$toast.success("Industry updated successfully");
				if (updateAndContinue == false) {
					this.$router.push("/admin/industries");
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
	},
	async fetch() {
		const res = await this.$axios.$get(
			`/admin/industries/${this.$route.params.id}`
		);
		this.industry = res.data;

		this.isLoading = false;
	},
};
</script>

<style lang="scss" scoped></style>
