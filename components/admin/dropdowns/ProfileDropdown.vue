<template>
   <b-dropdown variant="link" no-caret :right="true">
      <template #button-content>
         <img class="rounded-circle header-profile-user" src="/images/users/user-4.jpg" alt="Header Avatar" />
      </template>
      <b-dropdown-item to="/admin/profile">
         <i class="mdi mdi-account-circle font-size-17 align-middle mr-1"></i>
         Profile
      </b-dropdown-item>
      <b-dropdown-item to="#">
         <i class="mdi mdi-wallet font-size-17 align-middle mr-1"></i> My Wallet
      </b-dropdown-item>

      <b-dropdown-item @click="logout">
         <i class="mdi mdi-lock-open-outline font-size-17 align-middle mr-1"></i>
         Logout
      </b-dropdown-item>
   </b-dropdown>
</template>

<script>
export default {
   methods: {
      async logout() {
         await this.$auth.logout()
         this.$router.push("/admin/login")
      },
   },
};
</script>

<style lang="scss" scoped>
</style>
