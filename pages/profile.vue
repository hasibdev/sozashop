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
      <p><b>Profile</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
        <span v-if="$auth.user.client.clientVerified" class="badge badge-success">Verified
        </span>
        <span v-else>
          <button class="btn btn-sm btn-info" @click="onClientVerificationModal" v-if="!$auth.user.client.clientVerification">Please Submit & Verify Profile</button>
          <span v-else class="badge badge-danger">Unverified</span>
        </span>
      </p>
      <p><b>Account</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
        <span v-if="$auth.user.client.isVerified" class="badge badge-success">Verified
        </span>
        <span v-else class="badge badge-danger">Unverified
        </span>
      </p>
      <input-detail class="border-bottom-0" :label="$t('fields.clientID')" :value="clientId"></input-detail>

      <!-- First Name -->
      <input-control v-model="form.firstName" :label="$t('fields.firstName')" :error="validationErrors.firstName"></input-control>
      <!-- Last Name -->
      <input-control v-model="form.lastName" :label="$t('fields.lastName')" :error="validationErrors.lastName"></input-control>
      <!-- Email -->
      <input-control type="email" v-model="form.email" :label="$t('fields.email')" :error="validationErrors.email"></input-control>
      <!-- Country Name -->
      <input-control readonly v-model="form.countryName" :label="$t('fields.country')" :error="validationErrors.countryName"></input-control>
      <!-- industry Name -->
      <input-control readonly v-model="form.industryName" :label="$t('fields.industry')" :error="validationErrors.industryName"></input-control>

      <!-- Profile Image -->
      <image-upload v-model="form.photo" :url="$auth.user.profilePhotoUrl" :label="$t('fields.photo')" :error="validationErrors.photo"></image-upload>

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

    <!-- Add profile verification modal -->
    <modal-control title="Client Verification" v-model="openClientVerificationModal">
      <!-- Modal Body Content -->
      <template #body>

        <!-- name-->
        <validated-input focus :validation="$v.clientVerificationForm.name" v-model="clientVerificationForm.name" :label="$t('fields.name')" :error="validationErrors.name"></validated-input>
        <!-- name-->
        <validated-input :validation="$v.clientVerificationForm.address" v-model="clientVerificationForm.address" :label="$t('fields.address')" :error="validationErrors.address"></validated-input>
        <!--  Type -->
        <validated-select-field :validation="$v.clientVerificationForm.type" imedieate :label="$t('fields.type')" v-model="clientVerificationForm.type" track="value" :options="types || []" :error="validationErrors.type"></validated-select-field>
        <!-- passport No -->
        <validated-input v-if="clientVerificationForm.type =='passport'" :validation="$v.clientVerificationForm.passport_number" v-model="clientVerificationForm.passport_number" :label="$t('fields.passport_number')" :error="validationErrors.passport_number"></validated-input>
        <!-- nid_number -->
        <validated-input v-if="clientVerificationForm.type =='nid'" :validation="$v.clientVerificationForm.nid_number" v-model="clientVerificationForm.nid_number" :label="$t('fields.nid_number')" :error="validationErrors.nid_number"></validated-input>
        <!-- photo -->
        <image-upload v-model="clientVerificationForm.photo" :error="validationErrors.photo" :label="$t('fields.photo')"></image-upload>
        <!-- NID front -->
        <image-upload v-model="clientVerificationForm.frontPart" :error="validationErrors.frontPart" :label="$t('fields.frontPart')"></image-upload>
        <!-- NID back -->
        <image-upload v-model="clientVerificationForm.backPart" :error="validationErrors.backPart" :label="$t('fields.backPart')"></image-upload>

      </template>
      <!-- Modal Footer Content -->
      <template #footer="{ hide }">
        <button @click="hide()" class="btn btn-secondary">Close</button>
        <button @click="saveClientVerificationModal" class="btn btn-primary">
          Save
        </button>
      </template>
    </modal-control>
  </form-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
import { required, requiredIf } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
export default {
  name: "user-profile",
  mixins: [validation],

  data() {
    return {
      //user: this.$auth.user,
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
      openClientVerificationModal: false,
      clientVerificationForm: {
        type: "nid",
        name: "",
        address: "",
        passport_number: "",
        nid_number: "",
        frontPart: "",
        backPart: "",
        photo: "",
      },
    };
  },

  mounted() {
    const newForm = {
      firstName: this.$auth.user.firstName,
      lastName: this.$auth.user.lastName,
      email: this.$auth.user.email,
      countryName: this.$auth.user.client.countryName,
      industryName: this.$auth.user.client.industryName,
    };

    this.form = newForm;
  },

  computed: {
    clientId() {
      return this.$auth.user?.client?.readableId;
    },
    ...mapGetters({
      types: "config/getClientVerificationTypes",
    }),
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

        await this.$axios.$post("/profile", formData);
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
          "/client-check-old-password",
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
        await this.$axios.post("/client-change-password", this.changeForm);
        this.$toast.success("Password updated successfully");
        this.$refs["change-pass-modal"].hide();
        await this.$auth.logout();
        this.$router.push(this.localePath("/login"));
      } catch (error) {
        this.$toast.error("Something wrong!");
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    async saveClientVerificationModal() {
      // Delete unused fields
      if (this.clientVerificationForm.type == "nid") {
        delete this.clientVerificationForm.passport_number;
      } else if (this.clientVerificationForm.type == "passport") {
        delete this.clientVerificationForm.nid_number;
      }

      // Preparing Files NIDs and Statement
      const formData = new FormData();

      for (let key of Object.keys(this.clientVerificationForm)) {
        formData.append(key, this.clientVerificationForm[key]);
      }

      // Saving Data
      try {
        await this.$axios.post("/clientVerifications", formData);
        this.$toast.success(
          "Data Store successfully. Admin will be verify this information"
        );
        this.openClientVerificationModal = false;
        this.$router.go();
        this.reset();
      } catch (err) {
        console.log(err);
      }
    },

    onClientVerificationModal() {
      this.openClientVerificationModal = true;
    },
  },
  validations: {
    clientVerificationForm: {
      name: { required },
      address: { required },
      type: { required },
      passport_number: {
        required: requiredIf(function () {
          return this.clientVerificationForm.type == "passport";
        }),
      },
      nid_number: {
        required: requiredIf(function () {
          return this.clientVerificationForm.type == "nid";
        }),
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
