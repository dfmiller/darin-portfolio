
<template>
  <v-app-bar flat border>
    <v-app-bar-nav-icon
      class="d-md-none"
      :aria-label="mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
      aria-controls="primary-navigation"
      :aria-expanded="mobileMenuOpen"
      @click="$emit('toggle-mobile-menu')"
    />

    <v-app-bar-title>
      <a href="/" class="logo-link" @click.prevent="$emit('go-home')">
        <v-icon class="mr-2" color="primary" aria-hidden="true">mdi-code-tags</v-icon> &nbsp;
        Darin F Miller
      </a>
    </v-app-bar-title>

    <v-btn
      icon
      aria-label="Toggle dark mode"
      @click="$emit('toggle-theme')"
    >
      <v-icon aria-hidden="true">
        {{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}
      </v-icon>
    </v-btn>

    <v-btn
      icon
      aria-label="Log out"
      disabled
      @click="$emit('logout')"
    >
      <v-icon aria-hidden="true">mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
defineProps<{
  isDark: boolean
  mobileMenuOpen: boolean
}>()

defineEmits<{
  'go-home': []
  'toggle-mobile-menu': []
  'toggle-theme': []
  logout: []
}>()
</script>

<style scoped>
.logo-link {
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  font-weight: 600;
}
</style>
