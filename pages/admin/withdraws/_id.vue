<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="withdraw">
			<template #header>
				<h3 class="font-weight-normal mb-3">
					Withdraw
				</h3>

				<button v-if="withdraw.status != 'completed'" @click="openStatusModal = true" class="btn btn-primary">Update Status</button>
			</template>

			<template>
				<card>
					<input-detail :label="$t('fields.amount')" :value="withdraw.amount"></input-detail>
					<input-detail :label="$t('fields.reason')" :value="withdraw.reason"></input-detail>
					<input-detail :label="$t('fields.status')">
						<badge :value="withdraw.status"></badge>
					</input-detail>
				</card>

				<!-- Status Modal -->
				<modal-control title="Update Status" v-model="openStatusModal">

					<!-- Modal Body Content -->
					<template #body>
						<form @submit.prevent="updateWithdrawStatus">
							<select-control v-model="form.status" :options="statusOptions" track="value"></select-control>
						</form>
					</template>
					<!-- Modal Footer Content -->
					<template #footer="{ hide }">
						<button @click="hide()" class="btn btn-secondary">Close</button>
						<button @click="updateWithdrawStatus" class="btn btn-primary">
							Save
						</button>
					</template>
				</modal-control>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	name: "withdraw-details",
	layout: "admin",
	meta: {
		permission: "view-withdraws",
	},
	computed: {
		...mapGetters({
			statusOptions: "config/getWithdrawOptions",
		}),
	},
	data() {
		return {
			withdraw: null,
			form: {
				status: "",
			},
			openStatusModal: false,
		};
	},
	methods: {
		async updateWithdrawStatus() {
			try {
				const response = await this.$axios.post(
					`/admin/withdraws/${this.$route.params.id}/update-status`,
					this.form
				);

				this.$toast.success("Status Updated successfully.");
				this.openStatusModal = false;
				console.log(response);
				this.withdraw.status = response.data.data.status;
			} catch (error) {
				this.$toast.error("Status Update Fail.");
				console.log(error);
			}
		},
	},
	async fetch() {
		const res = await this.$axios.$get(
			`/admin/withdraws/${this.$route.params.id}`
		);
		this.withdraw = res.data;
		this.form.status = this.withdraw.status;
	},
};
</script>

<style lang="scss" scoped>
</style>
