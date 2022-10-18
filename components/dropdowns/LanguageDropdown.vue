<template>
  <div class="lang-dropdown">
    <b-dropdown
      variant="white"
      right
      no-caret
      toggle-class="header-item bg-transparent"
    >
      <template v-slot:button-content>
        <img class :src="currentLang.flag" alt="Header Language" height="16" />
        <span class="ml-2">{{ currentLang.name }}</span>
        <span class="mdi mdi-chevron-down"></span>
      </template>
      <b-dropdown-item
        class="notify-item"
        v-for="(entry, i) in $i18n.locales"
        :key="`Lang${i}`"
        :value="entry"
        :link-class="{ active: entry.code === currentLang.code }"
      >
        <nuxt-link class="dropdown-lang" :to="switchLocalePath(entry.code)">
          <img
            :src="`${entry.flag}`"
            alt="user-image"
            class="mr-1"
            height="12"
          />
          <span class="align-middle">{{ entry.name }}</span>
        </nuxt-link>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    currentLang() {
      return this.$i18n.locales.filter(
        local => local.code === this.$i18n.locale
      )[0];
    }
  }
};
</script>

<style lang="scss">
.lang-dropdown {
  .dropdown-item {
    padding: 0 !important;
  }
  .dropdown-lang {
    background: transparent;
    padding: 0.55rem 1.5rem;
    display: block;
  }
}
</style>
