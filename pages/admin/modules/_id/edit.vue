<template>
  <loading-view :loading="$fetchState.pending">
    <form-view v-if="module">
      <h4>Edit Module</h4>
      <div class="row mt-3">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <!-- Country Select Form -->
              <select-control label="Country" :options="countries" v-model="module.countryId" :error="validationErrors.countryId"></select-control>

              <!-- Fields Checkbox (Country, Roles, Industrys) -->
              <!-- Permission and Fields -->
              <h4 class="mb-4">Permission and Fields</h4>
              <div class="row">
                <div class="col-3">
                  <ul class="list-group rounded-0 permission-menu mb-1">
                    <li v-for="(per, i) in permissions" :key="i" @click="selected = per" class="list-group-item" :class="{ active: per.id == selected.id }" role="button">
                      {{ per.label }}
                    </li>
                  </ul>
                </div>
                <div class="col-9">
                  <div class="row">
                    <div class="col-md-6 col-xl-4 mb-4" v-for="(row, i) in selected.pages" :key="i">
                      <div class="card-col h-100">
                        <div class="header border-bottom ">
                          <label class="d-flex justify-content-between w-100" role="button">
                            <p class="mb-0 font-weight-medium"> {{ row.label }} </p>
                            <b-form-checkbox v-model="row.value" name="check-button" switch>
                            </b-form-checkbox>
                          </label>
                        </div>
                        <div class="body">
                          <ul class="list mb-1">
                            <!-- Field List -->
                            <li v-if="!row.fields">
                              No Fields Avilable.
                            </li>
                            <li v-for="(col, i) in row.fields" :key="i">
                              <label class="item d-flex justify-content-between" role="button">
                                <p class="mb-0">{{ col.label }}</p>
                                <b-form-checkbox v-model="col.value" name="check-button" switch>
                                </b-form-checkbox>
                              </label>
                            </li>
                            <template v-if="row.actions && row.actions.length">
                              <!-- Line -->
                              <li>
                                <hr />
                              </li>

                              <li class="font-weight-bold">Actions</li>

                              <!-- Action list -->
                              <li v-for="action in row.actions" :key="action.name">
                                <label class="item d-flex justify-content-between" role="button">
                                  <p>{{ action.label }}</p>

                                  <b-form-checkbox v-model="action.value" name="check-button" switch>
                                  </b-form-checkbox>
                                </label>
                              </li>
                            </template>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Bottom content -->
              <div class="d-flex justify-content-end mt-4">
                <btn-link class="btn-secondary" :to="`/admin/industries/${module.industryId}`">
                  {{ $t("buttons.cancel") }}
                </btn-link>
                <btn-success :loading="savingState" @click="save($event, true)" class="mx-2">
                  {{ $t("buttons.updateContinue") }}
                </btn-success>
                <btn-primary :loading="savingState" @click="save">
                  {{ $t("buttons.update") }}
                </btn-primary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form-view>
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import permissions from "~/permissions";

export default {
  layout: "admin",
  name: "module-edit",

  mixins: [validation],
  data() {
    return {
      errors: [],
      countries: {},
      module: null,
      initialData: null,
      countryId: null,
      selected: null,
      permissions: [],

      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$put("/admin/modules/" + this.$route.params.id, {
          ...this.module,
          fields: this.permissions,
        });
        this.$toast.success("Module Update successfully.");
        if (!createAndContinue) {
          this.$router.push(`/admin/industries/${this.module.industryId}`);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    onColClick(col, field) {
      col.value = !col.value;
      if (field.columns.every((c) => c.value)) {
        field.value = true;
      } else {
        field.value = false;
      }
    },
    selectAll(e, index, field) {
      field.value = !field.value;
      if (e.target.checked) {
        this.module.fields[index].columns.map((col) => (col.value = true));
      } else {
        this.module.fields[index].columns.map((col) => (col.value = false));
      }
    },
  },
  async fetch() {
    // Get Country
    const resCountry = await this.$axios.$get("/ajax/countries");
    this.countries = resCountry;

    // Get modules
    const resModule = await this.$axios.$get(
      `/admin/modules/${this.$route.params.id}`
    );
    this.module = resModule.data;
    // this.selected = this.module.fields[0];
    // Set permissions
    this.permissions = permissions;
    // Set selected permission
    this.selected = this.permissions[0];
    // Merge permissions
    this.mergePermissions(this.permissions, this.module.fields);
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
