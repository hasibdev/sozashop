<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="category">
			<template #header>
				<h3 class="font-weight-normal mb-3">
					{{ $t("supportCategories.title.details") }} : {{ category.name }}
				</h3>
				<div>
					<action-dropdown iconVariant="light" variant="primary">
						<b-dropdown-item v-if="hasPermission('update-support-categories') || hasRole('Super Admin')" :to="localePath(`/admin/support-categories/${category.id}/edit`)"><i class="far mr-1 fa-edit text-primary"></i>
							Edit</b-dropdown-item>
						<b-dropdown-item v-if="hasPermission('delete-support-categories') || hasRole('Super Admin')" @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete</b-dropdown-item>
					</action-dropdown>
				</div>
			</template>

			<template>
				<card>
					<input-detail :label="$t('fields.name')" :value="category.name"></input-detail>
					<input-detail :label="$t('fields.description')" :value="category.description"></input-detail>
					<input-detail :label="$t('fields.status')">
						<badge :value="category.status"></badge>
					</input-detail>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "category-details",
	layout: "admin",
	meta: {
		permission: "view-support-categories",
	},
	data() {
		return {
			category: null,
		};
	},
	methods: {
		remove() {
			// Global Mixins ( removeResource )
			this.removeResource({
				apiUrl: `/admin/support-categories/${this.$route.params.id}`,
				redirectUrl: "/admin/support-categories",
			});
		},
	},
	async fetch() {
		const resCategory = await this.$axios.$get(
			`/admin/support-categories/${this.$route.params.id}`
		);
		this.category = resCategory.data;
	},
};
</script>

<style lang="scss" scoped></style>
