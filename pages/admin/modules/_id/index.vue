<template>
  <div v-if="module">
    <div class="card shadow-sm mt-3">
      <div class="card-body py-1">
        <div class="row py-3">
          <div class="col-6 col-sm-3">
            <h5 class="text-gray">{{ $t("fields.country") }}:</h5>
          </div>
          <div class="col-6 col-sm-9">
            <h5 class="font-weight-normal">{{ module.country.name }}</h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Permission and Fields -->
    <h4 class="mb-4">Permission and Fields</h4>
    <div class="row">
      <div class="col-3">
        <ul class="list-group  rounded-0 permission-menu mb-1">
          <li
            v-for="(per, i) in module.fields"
            :key="i"
            @click="selected = per"
            class="list-group-item"
            :class="{ active: per.id == selected.id }"
            role="button"
          >
            {{ per.label }}
          </li>
        </ul>
      </div>
      <div class="col-9">
        <div class="row">
          <div
            class="col-md-6 col-xl-4 mb-4"
            v-for="(row, i) in selected.pages"
            :key="i"
          >
            <div class="card-col h-100">
              <div class="header border-bottom d-flex justify-content-between ">
                <p class="mb-0 font-weight-medium">{{ row.label }}</p>
                <span
                  class="dot rounded-circle"
                  :class="[row.value ? 'bg-primary' : 'bg-danger']"
                ></span>
              </div>
              <div class="body">
                <ul class="list mb-1">
                  <!-- Field List -->
                  <li v-if="!row.fields">
                    No Fields Avilable.
                  </li>
                  <li
                    v-for="(col, i) in row.fields"
                    :key="i"
                    class="item d-flex justify-content-between"
                  >
                    <p class="mb-0">{{ col.label }}</p>
                    <span
                      class="dot rounded-circle"
                      :class="[col.value ? 'bg-primary' : 'bg-danger']"
                    ></span>
                  </li>
                  <template v-if="row.actions && row.actions.length">
                    <!-- Line -->
                    <li><hr /></li>

                    <li class="font-weight-bold">Actions</li>

                    <!-- Action list -->
                    <li
                      v-for="action in row.actions"
                      :key="action.name"
                      class="item d-flex justify-content-between"
                    >
                      <p>{{ action.label }}</p>

                      <span
                        class="dot rounded-circle"
                        :class="[action.value ? 'bg-primary' : 'bg-danger']"
                      ></span>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end" v-if="module.industry">
      <nuxt-link
        :to="`/admin/industries/${module.industry.id}`"
        class="btn btn-secondary"
        >Back</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  name: "module-detail",

  data() {
    return {
      module: null,
      selected: null
    };
  },
  async fetch() {
    const res = await this.$axios.$get(`/admin/modules/${this.$route.params.id}`);
    this.module = res.data;
    this.selected = this.module.fields[0];
  }
};
</script>

<style lang="scss" scoped>
.dot {
  height: 11px;
  width: 11px;
}

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
