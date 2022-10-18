<template>
	<loading-view :loading="$fetchState.pending">
		<detail-view v-if="settings">
			<template #header>
				<h3 class="font-weight-normal">{{ $t("currencySettings.label") }}</h3>
<!-- 
				<action-dropdown iconVariant="light" :split="false" variant="primary">
					<b-dropdown-item :to="localePath(`/settings/currency/edit`)">
						<i class="far fa-edit text-primary mr-2"></i> Edit
					</b-dropdown-item>
				</action-dropdown> -->
			</template>
			<template>
				<card>
					<input-detail :label="$t('fields.currencyName')" :value="
              settings.data.currency_name ? settings.data.currency_name : '-'
            " v-if="
              hasFieldPermission('settings.currency-settings.currency-name')
            "></input-detail>
					<input-detail :label="$t('fields.currencyCode')" :value="
              settings.data.currency_code ? settings.data.currency_code : '-'
            " v-if="
              hasFieldPermission('settings.currency-settings.currency-code')
            "></input-detail>
					<input-detail v-if="
              hasFieldPermission('settings.currency-settings.currency-symbol')
            " :label="$t('fields.currencySymbol')" :value="
              settings.data.currency_symbol
                ? settings.data.currency_symbol
                : '-'
            "></input-detail>
				</card>
			</template>
		</detail-view>
	</loading-view>
</template>

<script>
export default {
	name: "currency-settings",
	data() {
		return {
			settings: null,
		};
	},

	async fetch() {
		const resSettings = await this.$axios.$get(
			`/client-settings?type=currency`
		);
		this.settings = resSettings;
	},
};
</script>

<style lang="scss" scoped></style>
