<template>
	<div id="create_module_page">
		<h3>Create a new Module</h3>
		<!-- Country -->
		<multiselect-control label="Country" :options="countries" v-model="formData.countryId" :error="validationErrors.countryId"></multiselect-control>

		<!-- Permission and Fields -->
		<h4 class="mb-4">Permission and Fields</h4>
		<div class="row">
			<div class="col-3">
				<ul class="list-group  rounded-0 permission-menu mb-1">
					<li v-for="(per, i) in permissions" :key="i" @click="selected = per" class="list-group-item" :class="{ active: per.id == selected.id }" role="button">
						{{ per.label }}
					</li>
				</ul>
			</div>
			<div class="col-9">
				<div class="row">
					<div class="col-md-6 col-xl-4 mb-4" v-for="(row, i) in selected.pages" :key="i">
						<div class="card-col h-100">
							<div class="header border-bottom d-flex justify-content-between ">
								<p class="mb-0 font-weight-medium">{{ row.label }}</p>
								<b-form-checkbox v-model="row.value" name="check-button" switch>
								</b-form-checkbox>
							</div>
							<div class="body">
								<ul class="list mb-1">
									<!-- Field List -->
									<li v-if="!row.fields">
										No Fields Avilable.
									</li>
									<li v-for="(col, i) in row.fields" :key="i" class="item d-flex justify-content-between">
										<p class="mb-0">{{ col.label }}</p>
										<b-form-checkbox v-model="col.value" name="check-button" switch>
										</b-form-checkbox>
									</li>
									<template v-if="row.actions && row.actions.length">
										<!-- Line -->
										<li>
											<hr />
										</li>

										<li class="font-weight-bold">Actions</li>

										<!-- Action list -->
										<li v-for="action in row.actions" :key="action.name" class="item d-flex justify-content-between">
											<p>{{ action.label }}</p>

											<b-form-checkbox v-model="action.value" name="check-button" switch>
											</b-form-checkbox>
										</li>
									</template>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Actions -->
		<div class="d-flex justify-content-end mb-5 mt-3">
			<btn-link class="btn-secondary" :to="`/admin/industries/${$route.query.industryId}`">
				{{ $t("buttons.cancel") }}
			</btn-link>
			<btn-success :loading="savingState" @click="save($event, true)" class="mx-2">
				{{ $t("buttons.submitContinue") }}
			</btn-success>
			<btn-primary :loading="savingState" @click="save">
				{{ $t("buttons.submit") }}
			</btn-primary>
		</div>
	</div>
</template>

<script>
import permissions from "../../../permissions";
import validation from "@/plugins/mixins/validation";

export default {
	layout: "admin",
	name: "create-module",
	mixins: [validation],
	data() {
		return {
			formData: {
				countryId: null,
			},
			countries: [],
			permissions,
			selected: permissions[0],
			initialData: null,

			savingState: false,
		};
	},

	methods: {
		async save() {
			this.savingState = true;
			try {
				await this.$axios.$post("/admin/modules", {
					countryId: this.formateCountries(this.formData.countryId),
					industryId: this.$route.query.industryId,
					fields: this.permissions,
				});
				this.$toast.success("Module created successfully.");
				this.$router.push(`/admin/industries/${this.$route.query.industryId}`);
			} catch (error) {
				console.log(error);
			} finally {
				this.savingState = false;
			}
		},
		formateCountries(values) {
			if (values?.includes("all")) {
				return this.countries
					.filter((country) => country.id !== "all")
					.map((country) => country.id);
			} else {
				return values;
			}
		},
	},
	async fetch() {
		// Get Countrys
		const resCountry = await this.$axios.$get("/ajax/countries");
		this.countries = [{ id: "all", code: "all", name: "All" }, ...resCountry];
	},
};
</script>

<style lang="scss" scoped>
// permission Menu
.permission-menu {
	box-shadow: 0px 2px 10px #dedede;
	.list-group-item {
		cursor: pointer;
		border-left: 3px solid transparent !important;
		&.active {
			background-color: var(--white);
			color: var(--gray);
			border-color: var(--secondary) !important;
			border-left: 3px solid var(--primary) !important;
			font-weight: 500;
		}
		&:not(:last-child) {
			border-bottom: 2px solid #eee !important;
		}
	}
}

// Card Column
.card-col {
	background: #fff;
	box-shadow: 0px 2px 10px #dedede;
	.header {
		background: #f3f3f5;
		padding: 8px 10px;
		display: flex;
		align-items: center;
	}
	.body {
		padding: 5px 10px;
		.list {
			list-style: none;
			padding-left: 0;
			.item {
				padding: 5px 0;
			}
		}
	}
}
</style>
