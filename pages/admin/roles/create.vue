<template>
    <loading-view :loading="$fetchState.pending">
        <form-view>
            <template #header> {{ $t("roles.title.add") }} </template>
            <template>
                <!-- Name -->
                <input-control focus v-model="formData.name" :label="$t('fields.name')" :error="validationErrors.name"></input-control>

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
                            <label class="lead font-weight-bold mb-0 d-flex align-items-center justify-content-between w-100" role="button">
                                <!-- <input type="checkbox" class="mr-2" :value="row.id" v-model="rowItems" @change="onSelectRow($event, row)" />
                {{ row.label }} -->
                                <p class="mb-0">{{ row.label }}</p>

                                <b-form-checkbox :value="row.id" v-model="rowItems" @change="onSelectRow($event, row)" name="row-check" switch>
                                </b-form-checkbox>

                            </label>
                        </div>

                        <!-- Permissions Columns -->
                        <div v-for="col in row.permissions" :key="col.id" class="mt-1">
                            <label class="mb-0 d-flex align-items-center justify-content-between" role="button">
                                <!-- <input type="checkbox" :value="col.id" v-model="formData.permissions" class="mr-2" @change="onSelectCol($event, row)" />
                {{ col.label }} -->
                                <p class="mb-0">{{ col.label }}</p>

                                <b-form-checkbox :value="col.id" v-model="formData.permissions" @change="onSelectCol($event, row)" name="col-check" switch>
                                </b-form-checkbox>
                            </label>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Action Buttons -->
            <template #footer>
                <btn-link class="btn-secondary" to="/admin/roles">
                    {{ $t("buttons.cancel") }}
                </btn-link>
                <btn-success :loading="savingState" @click="save($event, true)">
                    {{ $t("buttons.submitContinue") }}
                </btn-success>
                <btn-primary v-shortkey="['ctrl', 'enter']" @shortkey.native="save()" v-b-tooltip.hover title="Shotcut Press 'Ctrl+Enter'" :loading="savingState" @click="save">
                    {{ $t("buttons.submit") }}
                </btn-primary>
            </template>
        </form-view>
    </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";

export default {
    name: "create-role",
    mixins: [validation],
    layout: "admin",
    meta: {
        permission: "create-roles",
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
                await this.$axios.$post("/admin/roles", this.formData);
                this.$toast.success("Roles created successfully.");
                if (createAndContinue) {
                    this.reset();
                } else {
                    this.$router.push(this.localePath("/admin/roles"));
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.savingState = false;
            }
        },
        reset() {
            this.formData = { ...this.initialData };
            this.rowItems = [];
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
        const res = await this.$axios.get("/ajax/permissions");
        this.permissions = res.data.data;
    },
};
</script>

<style lang="scss" scoped></style>
