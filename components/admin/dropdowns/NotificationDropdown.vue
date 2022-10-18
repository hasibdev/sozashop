<template>
   <!-- Notification -->
   <b-dropdown variant="link" no-caret :right="true">
      <template #button-content>
         <span class="relative">
            <i class="mdi mdi-bell-outline h3 text-dark"></i>
            <span class="badge badge-danger badge-pill" style="top: -15px; right: 10px" v-if="unreadNotifications.length">{{ unreadNotifications.length }}</span>
         </span>
      </template>
      <div class="p-3 border-bottom">
         <div class="d-flex align-items-center">
            <h5 class="m-0 font-size-16">
               Notifications ({{ notifications.length }})
            </h5>
            <span v-if="notifications.length" role="button" @click="markAllAsRead" class="ml-auto text-primary">Mark As Read</span>
         </div>
      </div>

      <!-- Notification List -->
      <div style="max-height: 230px; min-width: 300px; overflow: auto">
         <div v-if="notifications.length">
            <b-dropdown-item href="javascript:void(0)" v-for="notification in notifications" :key="notification.id" :class="{ 'bg-active': notification.read_at === null }">
               <div @click="handleClick(notification)" class="media">
                  <div class="avatar-xs mr-3">
                     <span class="avatar-title rounded-circle font-size-16" :class="bgColor(notification)">
                        <i :class="notification.data.icon"></i>
                     </span>
                  </div>
                  <div class="media-body">
                     <h6 class="mt-0 mb-1">{{ notification.data.title }}</h6>
                     <div class="font-size-12 text-muted">
                        <p class="mb-1">
                           {{ notification.data.subtitle }}
                        </p>
                     </div>
                  </div>
               </div>
            </b-dropdown-item>
         </div>
         <div v-else>
            <b-dropdown-item href="javascript:void(0)">
               <div class="text-muted text-center">No notifications found</div>
            </b-dropdown-item>
         </div>
      </div>

      <div class="p-2 border-top">
         <a class="btn btn-sm btn-link font-size-14 btn-block text-center" href="javascript:void(0)" @click="clearAll">Clear All</a>
      </div>
   </b-dropdown>
   <!-- End Notification -->
</template>

<script>
export default {
   data() {
      return {
         notifications: [],
      }
   },
   computed: {
      // Filter unread notifications
      unreadNotifications() {
         return this.notifications.filter(
            (notification) => notification.read_at === null
         )
      },
   },
   methods: {
      // Set icon background color class
      bgColor(notification) {
         return `bg-${notification.data.type}`
      },

      // Handle notification click event
      async handleClick(notification) {
         const res = await this.$axios.$post(
            `/admin/notifications/${notification.id}`
         )
         // Set read at
         notification.read_at = res.data.read_at
         // Push to the link
         this.$router.push(notification.data.link)
      },

      //Mark all notifications as read
      async markAllAsRead() {
         const res = await this.$axios.$post("/admin/notifications")
         this.notifications = res.data
         this.$toast.success("All marked as read")
      },

      //Clear all notifications
      async clearAll() {
         await this.$axios.$delete("/admin/notifications")
         this.notifications = []
      },
   },
   mounted() {
      // Listen for new notification
      this.$echo
         .private("App.Models.Admin." + this.$auth.user.id)
         .notification((notification) => {
            this.notifications.unshift(notification)
            // console.log(notification)
         })
   },
   async fetch() {
      const res = await this.$axios.$get("/admin/notifications")
      this.notifications = res.data
   },
};
</script>

<style lang="scss">
.bg-active {
   background-color: whitesmoke;
}
</style>
