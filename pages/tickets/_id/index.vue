<template>
  <loading-view :loading="$fetchState.pending">
    <detail-view v-if="ticket">
      <template #header>
        <h3 class="font-weight-normal mb-3">
          {{ $t("tickets.title.details") }} : {{ ticket.subject }}
        </h3>
        <div>
          <button @click="openReplayModal = true" class="btn btn-info">Reply</button>
        </div>
      </template>

      <template>
        <card>
          <!-- Subject -->
          <input-detail v-if="hasFieldPermission('support.ticket-details.subject')" :label="$t('fields.subject')" :value="ticket.subject"></input-detail> <!-- Subject -->
          <input-detail v-if="hasFieldPermission('support.ticket-details.category')" :label="$t('fields.department')" :value="ticket.supportCategory.name"></input-detail>
          <!-- Message -->
          <input-detail v-if="hasFieldPermission('support.ticket-details.message')" :label="$t('fields.message')" :value="ticket.message"></input-detail>
          <input-detail v-if="hasFieldPermission('support.ticket-details.create_date')" :label="$t('fields.date')" :value="ticket.createdAt"></input-detail>

          <!-- Priority -->
          <input-detail v-if="hasFieldPermission('support.ticket-details.priority')" :label="$t('fields.priority')">
            <badge :value="ticket.priority"></badge>
          </input-detail>

          <!-- Status -->
          <input-detail v-if="hasFieldPermission('support.ticket-details.status')" :label="$t('fields.status')">
            <badge :value="ticket.status"></badge>
          </input-detail>

          <!-- Attachments -->
          <input-detail v-if="hasFieldPermission('support.ticket-details.attachments')" :label="$t('fields.attachments')">
            <a v-for="attach in ticket.attachmentUrls" :key="attach.id" :href="attach.url" target="_blank" class="d-block py-1">{{attach.fileName}}</a>
            <!-- <img v-for="attach in ticket.attachmentUrls" :key="attach.id" :src="attach.url" alt=""> -->
          </input-detail>
        </card>

        <!-- Replay Modal -->
        <modal-control size="lg" title="Reply" v-model="openReplayModal">

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
              <span>Customer Support</span>
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
      attachments: null,
      openReplayModal: false,
    };
  },
  methods: {
    remove() {
      // Global Mixins ( removeResource )
      this.removeResource({
        apiUrl: `/tickets/${this.$route.params.id}`,
        redirectUrl: "/tickets",
      });
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
          `/tickets/${this.$route.params.id}/reply`,
          formData
        );
        this.$toast.success("Reply successfully.");

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
    await this.$axios.post(`/tickets/${this.$route.params.id}/mark-as-read`);
  },
  async fetch() {
    const resTicket = await this.$axios.$get(
      `/tickets/${this.$route.params.id}`
    );
    this.ticket = resTicket.data;
  },
};
</script>

<style lang="scss" scoped></style>
