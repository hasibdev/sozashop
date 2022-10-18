<template>
  <index-view>
    <template #title> {{ $t("withdraw.title.manage") }} </template>

    <!-- List Header -->
    <template #header>
      <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>
    </template>

    <!-- Data Table -->
    <template>
      <data-table :key="tableKey" :columns="columns" url="/admin/withdraws" :filters="filters">
        <!-- Action Slot -->
        <template v-slot:action="{ row }">
          <action-dropdown>
            <!-- Details  -->
            <b-dropdown-item v-if="hasPermission('view-withdraws') || hasRole('Super Admin')" :to="localePath(`/admin/withdraws/${row.id}`)">
              <i class="far mr-1 fa-share-square text-success"></i>
              Details
            </b-dropdown-item>
            <!-- Update status -->
            <b-dropdown-item v-if="row.status != 'completed'" @click="onStatusAction(row)">
              <i class="fas mr-1 fa-toggle-on text-info"></i>
              Update Status
            </b-dropdown-item>
          </action-dropdown>
        </template>

        <!-- Status Column -->
        <template v-slot:status="{ col }">
          <badge :value="col"></badge>
        </template>
        <!-- <template v-slot:createdAt="{ col }">
					<span>{{ formatDate(col) }}</span>
				</template> -->

        <!-- Filter slot -->
        <template #filter>
          <page-filter v-model="filters.perPage"></page-filter>

        </template>
      </data-table>

      <!-- Status Modal -->
      <modal-control @hide="hideStatusModal" title="Update Status" v-model="openStatusModal">

        <!-- Modal Body Content -->
        <template #body>
          <form @submit.prevent="updateWithdrawStatus">
            <select-control v-model="form.status" :options="statusOptions" track="value"></select-control>
          </form>
        </template>
        <!-- Modal Footer Content -->
        <template #footer>
          <button @click="hideStatusModal" class="btn btn-secondary">Close</button>
          <button @click="updateWithdrawStatus" class="btn btn-primary">
            Save
          </button>
        </template>
      </modal-control>
    </template>

  </index-view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "admin-withdraw",
  layout: "admin",
  meta: {
    permission: "view-any-withdraws",
  },
  computed: {
    ...mapGetters({
      statusOptions: "config/getWithdrawOptions",
    }),
  },
  data() {
    return {
      tableKey: 1,
      form: {
        status: "",
      },
      columns: [
        "clientName",
        { label: "withdrawDate", field: "createdAtFormatted" },
        "amount",
        "reason",
        "status",
      ],
      filters: {
        search: "",
        perPage: 25,
      },
      openStatusModal: false,
      activeId: null,
    };
  },
  methods: {
    onStatusAction(withdraw) {
      this.openStatusModal = true;

      this.form.status = withdraw.status;
      this.activeId = withdraw.id;
    },
    async updateWithdrawStatus() {
      try {
        const response = await this.$axios.post(
          `/admin/withdraws/${this.activeId}/update-status`,
          this.form
        );

        this.tableKey++;
        this.$toast.success("Status Updated successfully.");
        this.hideStatusModal();
      } catch (error) {
        this.$toast.error("Status Update Fail.");
        console.log(error);
      }
    },
    hideStatusModal() {
      this.openStatusModal = false;
      this.activeId = null;
      this.form.status = "";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
