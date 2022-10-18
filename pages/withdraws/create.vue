<template>
  <form-view>
    <template #header> {{ $t("withdraw.title.add") }} </template>

    <template>
      <!-- Amount -->
      <input-control focus type="number" v-model="form.amount" :label="$t('fields.amount')" :error="validationErrors.amount"></input-control>
      <!-- Reason -->
      <text-control v-if="hasFieldPermission(
						`finance.add-withdraw.reason`
					)" v-model="form.reason" :label="$t('fields.reason')" :error="validationErrors.reason"></text-control>
    </template>
    <!-- Action Buttons -->
    <template #footer>
      <btn-link class="btn-secondary" to="/withdraws">
        {{ $t("buttons.cancel") }}
      </btn-link>
      <btn-success @click="save($event, true)">
        {{ $t("buttons.submitContinue") }}
      </btn-success>
      <btn-primary v-shortkey="['ctrl', 'enter']" @shortkey.native="save()" v-b-tooltip.hover title="Shotcut Press 'Ctrl+Enter'" @click="save">
        {{ $t("buttons.submit") }}
      </btn-primary>
    </template>
  </form-view>
</template>

<script>
import validation from "@/plugins/mixins/validation";
export default {
  mixins: [validation],
  meta: {
    permission: "create-withdraws",
  },
  data() {
    return {
      form: {
        amount: "",
        reason: "",
      },
    };
  },
  methods: {
    async save(event, createAndContinue = false) {
      try {
        const res = await this.$axios.post("/withdraws", this.form);
        this.$toast.success("Withdraw created successfully.");
        if (createAndContinue) {
          this.reset();
        } else {
          this.$router.push(this.localePath("/withdraws"));
        }
      } catch (error) {
        console.log(error);
      }
    },
    reset() {
      this.form = { ...this.initialData };
    },
  },
  created() {
    this.initialData = { ...this.form };
  },
};
</script>

<style lang="scss" scoped>
</style>
