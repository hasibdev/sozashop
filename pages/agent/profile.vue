<template>
  <form-view>
    <!-- <template #header> {{ $t("profile.title.edit") }} </template> -->
    <template #titlebar>
      <div class="mb-4 d-flex justify-content-between">
        <h4>{{ $t("profile.title.edit") }}</h4>

        <div>
          <action-dropdown variant="primary" iconVariant="light">
            <b-dropdown-item @click="$refs['change-pass-modal'].show()">
              <i class="fas mr-1 fa-key text-primary"></i>
              Change Password
            </b-dropdown-item>
          </action-dropdown>
        </div>
      </div>
    </template>
    <template>
      <!-- First Name -->
      <input-control v-model="form.firstName" :label="$t('fields.firstName')" :error="validationErrors.firstName"></input-control>
      <!-- Last Name -->
      <input-control v-model="form.lastName" :label="$t('fields.lastName')" :error="validationErrors.lastName"></input-control>
      <!-- Email -->
      <input-control type="email" v-model="form.email" :label="$t('fields.email')" :error="validationErrors.email"></input-control>

    </template>

    <!-- Action Buttons -->
    <template #footer>
      <btn-primary @click="save" :loading="savingState">
        {{ $t("buttons.submit") }}
      </btn-primary>
    </template>

    <b-modal ref="change-pass-modal" hide-footer title="Change Password">
      <p v-if="changePassError" class="text-danger">{{changePassError}}</p>

      <form v-if="!oldPassMatch" @submit.prevent="checkOldPass">
        <!-- Old Password -->
        <input-control focus inModal type="password" v-model="checkPassword.old_password" :label="$t('fields.oldpassword')" :error="validationErrors.password"></input-control>
        <!-- <b-button type="submit" class="mt-2" variant="primary" block @click="checkOldPass">Check Password</b-button> -->
        <btn-primary block @click="checkOldPass" :loading="savingState" type="submit" class="mt-2">
          {{ $t("buttons.checkPassword") }}
        </btn-primary>
      </form>

      <form v-if="oldPassMatch" @submit.prevent="saveNewPass">
        <!-- Password -->
        <input-control inModal type="password" v-model="changeForm.new_password" :label="$t('fields.newpassword')" :error="validationErrors.password"></input-control>
        <!-- Confirm Password -->
        <input-control inModal type="password" v-model="changeForm.confirm_password" :label="$t('fields.confirmPassword')"></input-control>

        <btn-primary block @click="saveNewPass" :loading="savingState" type="submit" class="mt-2">
          {{ $t("buttons.save") }}
        </btn-primary>
      </form>
    </b-modal>
  </form-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";

export default {
  name: "agent-profile",
  mixins: [validation],
  layout: "agent",

  data() {
    return {
      // user: this.$auth.user,
      form: {
        firstName: "",
        lastName: "",
        email: "",
      },
      photo: null,

      oldPassMatch: false,
      checkPassword: {
        old_password: "",
      },
      changeForm: {
        new_password: "",
        confirm_password: "",
      },
      changePassError: "",
      savingState: false,
    };
  },
  mounted() {
    const newForm = {
      firstName: this.$auth.user.firstName,
      lastName: this.$auth.user.lastName,
      email: this.$auth.user.email,
    };

    this.form = newForm;
  },

  computed: {
    clientId() {
      return this.$auth.user?.client?.readableId;
    },
  },

  methods: {
    async save() {
      // Form Data
      const formData = new FormData();

      for (let key in this.form) formData.append(key, this.form[key]);

      if (this.photo) formData.append(this.photo);

      // Sending Request
      try {
        this.savingState = true;

        await this.$axios.$post("/agents/profile", formData);
        this.$toast.success("Profile updated successfully");
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    async checkOldPass() {
      this.changePassError = "";
      this.savingState = true;
      try {
        const result = await this.$axios.post(
          "/agents/check-old-password",
          this.checkPassword
        );
        if (result.data) this.oldPassMatch = true;
        else this.changePassError = "Password dosen't match";
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    async saveNewPass() {
      if (this.changeForm.new_password !== this.changeForm.confirm_password) {
        this.changePassError = "Password dosen't match";
        return;
      }
      try {
        this.savingState = true;
        await this.$axios.post("/agents/change-password", this.changeForm);
        this.$toast.success("Password updated successfully");
        this.$refs["change-pass-modal"].hide();
        await this.$auth.logout();
        this.$router.push(this.localePath("/admin/login"));
      } catch (error) {
        this.$toast.error("Something wrong!");
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
