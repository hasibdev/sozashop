<template>
	<loading-view :loading="isLoading">
		<detail-view v-if="industry">
			<template #header>
				<h3 class="font-weight-normal">
					{{ $t("industries.title.details") }} : {{ industry.name }}
				</h3>
				<div>
					<action-dropdown iconVariant="light" variant="primary">
						<b-dropdown-item v-if="hasPermission('update-industries') || hasRole('Super Admin')" :to="localePath(`/admin/industries/${industry.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
							Edit</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('delete-industries') || hasRole('Super Admin')" @click="removeIndustry(industry.id)"><i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete</b-dropdown-item>
					</action-dropdown>
				</div>
			</template>

			<template>
				<card>
					<!-- Id -->
					<input-detail :label="$t('fields.id')" :value="industry.id"></input-detail>
					<!-- Name -->
					<input-detail :label="$t('fields.name')" :value="industry.name">
					</input-detail>

					<!-- Description -->
					<input-detail :label="$t('fields.description')" :value="industry.description"></input-detail>
					<!-- Status -->
					<input-detail :label="$t('fields.status')">
						<badge :value="industry.status"></badge>
					</input-detail>
				</card>

				<!-- Module Data Table -->
				<div class="d-flex justify-content-between mt-5">
					<search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
					<btn-link class="btn-primary" :to="`/admin/modules/create?industryId=${$route.params.id}`">
						{{ $t("modules.title.add") }}
					</btn-link>
				</div>
				<!-- country, code -->
				<data-table :columns="columns" url="/admin/modules" :filters="filters">
					<!-- Action Slot -->
					<template v-slot:action="{ row, remove, index }">
						<action-dropdown>
							<b-dropdown-item :to="localePath(`/admin/modules/${row.id}`)"><i class="far mr-1 fa-share-square text-success"></i>
								Details</b-dropdown-item>
							<b-dropdown-item :to="localePath(`/admin/modules/${row.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
								Edit</b-dropdown-item>
							<b-dropdown-item @click="remove(row.id, index)"><i class="far mr-1 fa-trash-alt text-danger"></i>
								Delete</b-dropdown-item>
						</action-dropdown>
					</template>

					<!-- Status Column -->

					<!-- Filter slot -->
					<template #filter>
						<page-filter v-model="filters.perPage"></page-filter>

					</template>
				</data-table>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
import Badge from "~/components/utils/Badge.vue";
export default {
	components: { Badge },
	layout: "admin",
	name: "industry-details",
	meta: {
		permission: "view-industries",
	},
	data() {
		return {
			industry: null,
			columns: [
				{ field: "countryName", sortable: false },
				{ field: "countryCode", sortable: false },
			],
			filters: {
				search: "",
				perPage: 25,

				industryId: this.$route.params.id,
			},
		};
	},

	methods: {
		async removeIndustry(id) {
			this.removeResource({
				apiUrl: `/admin/industries/${id}`,
				redirectUrl: "/admin/industries",
			});
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
