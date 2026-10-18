
<template>
  <div class="page-content">
    <div class="intro">
      <h2>Preferences</h2>
      <p>Customize how your website looks and behaves.</p>
    </div>

    <v-card class="settings-card mt-6" variant="outlined" rounded="lg">
      <v-card-title>Appearance</v-card-title>

      <v-card-text>
        <v-switch
          v-model="darkMode"
          color="primary"
          label="Dark mode"
          hint="Use a darker color scheme across the site."
          persistent-hint
          inset
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const darkMode = computed({
  get: () => theme.global.current.value.dark,
  set: (enabled: boolean) => {
    const name = enabled ? 'dark' : 'light'
    theme.global.name.value = name
    localStorage.setItem('site-theme', name)
  },
})
</script>

<style scoped>
.page-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.intro h2 {
  margin-bottom: 6px;
  font-size: 1.5rem;
  font-weight: 600;
}

.intro p {
  opacity: 0.7;
}

.settings-card {
  max-width: 720px;
}
</style>
