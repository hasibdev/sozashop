<template>
  <form-view>
    <template #header> {{ $t("admins.title.add") }} </template>
    <template>
      <!-- First Name -->
      <input-control focus v-model="formData.firstName" :label="$t('fields.firstName')" :error="validationErrors.firstName"></input-control>
      <!-- Last Name -->
      <input-control v-model="formData.lastName" :label="$t('fields.lastName')" :error="validationErrors.lastName"></input-control>
      <!-- Email -->
      <input-control v-model="formData.email" :label="$t('fields.email')" :error="validationErrors.email" type="email"></input-control>

      <!-- Roles -->
      <multiselect-control v-model="formData.roles" :label="$t('fields.roles')" :options="roles" :error="validationErrors.roles"></multiselect-control>

      <!-- Password -->
      <input-control v-model="formData.password" :label="$t('fields.password')" :error="validationErrors.password" type="password"></input-control>
      <!-- Confirm Password -->
      <input-control v-model="formData.password_confirmation" :label="$t('fields.confirmPassword')" :error="validationErrors.password_confirmation" type="password"></input-control>
    </template>

    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" to="/admin/admins">
        {{ $t("buttons.cancel") }}
      </btn-link>
      <btn-success v-shortkey="['ctrl', 'enter']" @shortkey.native="save()" v-b-tooltip.hover title="Shotcut Press 'Ctrl+Enter'" :loading="savingState" @click="save($event, true)">
        {{ $t("buttons.submitContinue") }}
      </btn-success>
      <btn-primary :loading="savingState" @click="save">
        {{ $t("buttons.submit") }}
      </btn-primary>
    </template>
  </form-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";

export default {
  name: "create-admin",
  mixins: [validation],
  layout: "admin",
  meta: {
    permission: "create-admins",
  },
  data() {
    return {
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        roles: [],
        password: "",
        password_confirmation: "",
      },
      roles: [],
      initialData: null,
      savingState: false,
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      this.savingState = true;
      try {
        await this.$axios.$post("/admin/admins", this.formData);
        this.$toast.success("Admin created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/admin/admins"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.savingState = false;
      }
    },
    reset() {
      this.formData = { ...this.initialData };
    },
  },
  created() {
    this.initialData = { ...this.formData };
  },

  async fetch() {
    const resRoles = await this.$axios.get("/admin/roles");
    this.roles = resRoles.data.data;
  },
};
</script>

<style lang="scss" scoped></style>
