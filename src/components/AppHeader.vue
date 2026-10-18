
<template>
  <v-app-bar flat border>
    <v-app-bar-nav-icon
      class="d-md-none"
      aria-label="Open navigation menu"
      @click="$emit('toggle-mobile-menu')"
    />

    <v-app-bar-title>
      <a href="/" class="logo-link" @click.prevent="$emit('go-home')">
        <v-icon class="mr-2" color="primary">mdi-code-tags</v-icon> &nbsp;
        Darin F Miller
      </a>
    </v-app-bar-title>

    <v-btn
      icon
      aria-label="Toggle dark mode"
      @click="$emit('toggle-theme')"
    >
      <v-icon>
        {{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}
      </v-icon>
    </v-btn>

    <v-btn
      icon
      aria-label="Log out"
      disabled
      @click="$emit('logout')"
    >
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
defineProps<{
  isDark: boolean
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
