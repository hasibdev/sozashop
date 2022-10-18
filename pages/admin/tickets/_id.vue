<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="ticket">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("tickets.title.details") }} : {{ ticket.subject }}
        </h3>
        <div class="d-flex">
          <button @click="openReplayModal = true" class="btn btn-info">Replay</button>
          <action-dropdown iconVariant="light" class="ml-2" variant="primary">

            <b-dropdown-item @click="updateStatus" v-if="ticket.status == 'open'">
              <i class="far mr-1 fa-edit text-primary"></i>
              Close
            </b-dropdown-item>
            <!-- <b-dropdown-item @click="remove()"><i class="far mr-1 fa-trash-alt text-danger"></i>
							Delete
						</b-dropdown-item> -->
          </action-dropdown>
        </div>
      </template>

      <template>
        <!-- Details -->
        <card>
          <input-detail :label="$t('fields.subject')" :value="ticket.subject"></input-detail>
          <input-detail :label="$t('fields.message')" :value="ticket.message"></input-detail>
          <input-detail :label="$t('fields.name')" :value="ticket.clientName"></input-detail>
          <input-detail :label="$t('fields.shopNumber')" :value="ticket.shopNumber"></input-detail>
          <input-detail :label="$t('fields.shopName')" :value="ticket.shopName"></input-detail>
          <input-detail :label="$t('fields.mobile')" :value="ticket.mobileNumber"></input-detail>

          <input-detail :label="$t('fields.priority')">
            <badge v-if="ticket.priority" :value="ticket.priority"></badge>
          </input-detail>

          <input-detail :label="$t('fields.status')">
            <badge :value="ticket.status"></badge>
          </input-detail>
        </card>

        <!-- Replay Modal -->
        <modal-control title="Replay" v-model="openReplayModal">

          <template #body>
            <!-- Message -->
            <text-control focus v-model="form.message" :label="$t('fields.message')" :error="validationErrors.message"></text-control>
            <!-- Atachments -->
            <file-input :label="$t('fields.attachments')" v-model="attachments" name="attachments" multiple :error="validationErrors.attachments"></file-input>
          </template>

          <template #footer="{ hide }">
            <button @click="hide()" class="btn btn-secondary">Close</button>
            <button @click="sendReplay" class="btn btn-primary"> Send </button>
          </template>
        </modal-control>

        <!-- Replies -->
        <h3 v-if="ticket.replies.length" class="mb-3 mt-5">Replies</h3>
        <!-- Replay Loop -->
        <div v-for="replay in ticket.replies" :key="replay.id" :class="{'bg-secondary': replay.author.type == 'admin'}" class="card shadow-sm p-4 mb-3">
          <div class="d-flex justify-content-between align-items-center">

            <p class="font-weight-bold">
              <span class="text-primary mr-2">{{ replay.author.name }}</span>
              <span>{{replay.author.availableRoles}}</span>
            </p>

            <small>{{replay.date}}</small>
          </div>
          <div class="">
            <p class=""> {{replay.message}} </p>

            <template v-if="replay.attachmentUrls.length">
              <p class="font-weight-bold mt-3 mb-1">Attachments</p>
              <a v-for="attach in replay.attachmentUrls" :key="attach.id" :href="attach.url" target="_blank" class="d-block py-1">{{attach.fileName}}</a>
            </template>
          </div>
        </div>

      </template>
    </detail-view>
  </loading-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";

export default {
  name: "ticket-details",
  layout: "admin",
  mixins: [validation],
  meta: {
    permission: "view-tickets",
  },
  data() {
    return {
      ticket: null,
      form: {
        message: "",
      },
      attachments: "",
      openReplayModal: false,
    };
  },
  methods: {
    remove() {
      // Global Mixins ( removeResource )
      this.removeResource({
        apiUrl: `/admin/tickets/${this.$route.params.id}`,
        redirectUrl: "/admin/tickets",
      });
    },
    // Update Status
    async updateStatus() {
      try {
        const resStatus = await this.$axios.post(
          `/admin/tickets/${this.$route.params.id}/update-status`,
          {
            status: "close",
          }
        );
        this.$toast.success("Status updated successfully.");
        this.$router.app.refresh();
      } catch (error) {
        this.$toast.success("Status updated Fail.");
        console.log(error);
      }
    },

    handleAttachments(value) {
      console.log(value);
    },

    async sendReplay() {
      const formData = new FormData();

      for (const key of Object.keys(this.form)) {
        formData.append(key, this.form[key]);
      }

      if (this.attachments) {
        for (const i of Object.keys(this.attachments)) {
          formData.append(`attachments[${i}]`, this.attachments[i]);
        }
      }

      try {
        const resReplay = await this.$axios.post(
          `/admin/tickets/${this.$route.params.id}/reply`,
          formData
        );
        this.$toast.success("Replay successfully.");

        this.ticket.replies = resReplay.data.data.replies;

        this.form.message = "";
        this.attachments = null;
        this.openReplayModal = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {
    try {
      await this.$axios.post(
        `/admin/tickets/${this.$route.params.id}/mark-as-read`
      );
    } catch (error) {
      console.log(error);
    }
  },
  async fetch() {
    const resTicket = await this.$axios.$get(
      `/admin/tickets/${this.$route.params.id}`
    );
    this.ticket = resTicket.data;
  },
};
</script>

<style lang="scss" scoped></style>
