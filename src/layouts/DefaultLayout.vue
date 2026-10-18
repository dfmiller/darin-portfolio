```vue
<template>
  <v-app>
    <v-layout class="app-shell">
      <AppHeader
        :is-dark="isDark"
        @toggle-mobile-menu="mobileMenuOpen = !mobileMenuOpen"
        @toggle-theme="toggleTheme"
        @logout="handleLogout"
      />

      <AppNavigation
        v-model:mobile-open="mobileMenuOpen"
        :expanded="desktopExpanded"
        @toggle-expanded="toggleDesktopNavigation"
      />

      <v-main class="main-content">
        <PageHeader
          v-if="route.path !== '/'"
          :title="pageTitle"
          :subtitle="pageSubtitle"
        />

        <div class="page-scroll">
          <router-view />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'

import AppHeader from '../components/AppHeader.vue'
import AppNavigation from '../components/AppNavigation.vue'
import PageHeader from '../components/PageHeader.vue'

const route = useRoute()
const theme = useTheme()

const mobileMenuOpen = ref(true)
const desktopExpanded = ref(
  localStorage.getItem('desktop-navigation-expanded') !== 'false',
)

const isDark = computed(() => theme.global.current.value.dark)
const pageTitle = computed(() => String(route.meta.title ?? ''))
const pageSubtitle = computed(() => String(route.meta.subtitle ?? ''))

function toggleTheme() {
  const nextTheme = isDark.value ? 'light' : 'dark'

  theme.change(nextTheme)
  localStorage.setItem('site-theme', nextTheme)
}

function toggleDesktopNavigation() {
  desktopExpanded.value = !desktopExpanded.value

  localStorage.setItem(
    'desktop-navigation-expanded',
    String(desktopExpanded.value),
  )
}

function handleLogout() {
  window.dispatchEvent(new CustomEvent('app:logout-requested'))
}

onMounted(() => {
  const savedTheme = localStorage.getItem('site-theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.change(savedTheme)
  }
})

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false
  },
)
</script>

<style scoped>
.app-shell {
  height: 100%;
}

.main-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: rgb(var(--v-theme-background));
}

.page-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  .page-scroll {
    scroll-behavior: auto;
  }
}
</style>
```