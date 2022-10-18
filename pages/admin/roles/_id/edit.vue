<template>
    <loading-view :loading="$fetchState.pending">
        <form-view v-if="permissions">
            <!-- Header -->
            <template #header>
                <h3 class="font-weight-normal">{{ $t("roles.title.edit") }}</h3>
            </template>
            <!-- Body -->
            <template>
                <!-- Name -->
                <input-control v-model="formData.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>

                <!-- Permissions -->
                <div class="row">
                    <div class="col-12 d-flex align-items-center mb-3">
                        <h4 class="mb-0 mr-3">Permissions</h4>

                        <div class="ml-auto">
                            <button @click="selectAll" type="button" class="btn btn-sm mx-2 btn-info">
                                Select All
                            </button>
                            <button type="button" class="btn btn-sm btn-danger" @click="unSelectAll">
                                UnSelect All
                            </button>
                        </div>
                    </div>
                    <!-- Permissions Row -->
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-3" v-for="row in permissions" :key="row.id">
                        <div class="d-flex align-items-center">
                            <label class="lead font-weight-bold mb-0 d-flex justify-content-between align-items-center w-100" role="button">
                                <!-- <input type="checkbox" class="mr-2" :value="row.id" v-model="rowItems" @change="onSelectRow($event, row)" />
								{{ row.label }} -->
                                <p class="mb-1">{{ row.label }}</p>

                                <b-form-checkbox :value="row.id" v-model="rowItems" @change="onSelectRow($event, row)" name="row-check" switch>
                                </b-form-checkbox>
                            </label>
                        </div>

                        <!-- Permissions Columns -->
                        <div v-for="col in row.permissions" :key="col.id" class="mt-1">
                            <label class="mb-0 d-flex justify-content-between align-items-center" role="button">
                                <!-- <input type="checkbox" :value="col.id" v-model="formData.permissions" class="mr-2" @change="onSelectCol(row)" />
								{{ col.label }} -->
                                <p class="mb-1">{{ col.label }}</p>

                                <b-form-checkbox :value="col.id" v-model="formData.permissions" @change="onSelectCol($event, row)" name="col-check" switch>
                                </b-form-checkbox>
                            </label>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Footer -->
            <!-- Action Buttons -->
            <template #footer>
                <btn-link class="btn-secondary" to="/admin/roles">
                    {{ $t("buttons.cancel") }}
                </btn-link>
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
    name: "edit-role",
    mixins: [validation],
    layout: "admin",
    meta: {
        permission: "update-roles",
    },
    data() {
        return {
            formData: {
                name: "",
                permissions: [],
            },
            permissions: null,
            rowItems: [],
            initialData: null,

            savingState: false,
        };
    },

    methods: {
        async save(event, createAndContinue = false) {
            this.savingState = true;
            try {
                await this.$axios.$put(
                    `/admin/roles/${this.$route.params.id}`,
                    this.formData
                );
                this.$toast.success("Roles Updated successfully.");
                if (!createAndContinue) {
                    this.$router.push(this.localePath("/admin/roles"));
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.savingState = false;
            }
        },

        /**
         * Select All
         */
        selectAll() {
            const allId = [];
            for (const row of this.permissions) {
                this.rowItems.push(row.id);
                for (const col of row.permissions) {
                    allId.push(col.id);
                }
            }
            this.formData.permissions = allId;
        },
        /**
         * UnSelect All
         */
        unSelectAll() {
            this.rowItems = [];
            this.formData.permissions = [];
        },
        /**
         * Handle Select Row
         */
        onSelectRow(e, row) {
            if (e.includes(row.id)) {
                for (const col of row.permissions) {
                    if (!this.formData.permissions.includes(col.id)) {
                        this.formData.permissions.push(col.id);
                    }
                }
            } else {
                for (const col of row.permissions) {
                    this.formData.permissions =
                        this.formData.permissions.filter(
                            (item) => item != col.id
                        );
                }
            }
        },
        /**
         * Handle Select Column
         */
        onSelectCol(e, row) {
            this.checkAllCol(row);
        },
        /**
         * Check all fields of each row
         */
        checkAllCol(row) {
            const rowIds = row.permissions.map((p) => p.id);
            if (rowIds.every((id) => this.formData.permissions.includes(id))) {
                this.rowItems.push(row.id);
            } else {
                this.rowItems = this.rowItems.filter((item) => item !== row.id);
            }
        },
    },
    created() {
        this.initialData = { ...this.formData };
    },

    async fetch() {
        const resPermissions = await this.$axios.get("/ajax/permissions");
        const resRole = await this.$axios.get(
            `/admin/roles/${this.$route.params.id}`
        );

        const role = resRole.data.data;

        this.permissions = resPermissions.data.data;
        this.formData.name = role.name;
        this.formData.permissions = role.permissions.map((p) => p.id);

        resPermissions.data.data.forEach((row) => this.checkAllCol(row));
    },
};
</script>

<style lang="scss" scoped></style>
