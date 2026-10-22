<template>
  <v-app>
    <v-layout class="app-shell">
      <a class="skip-link" href="#main-content">Skip to main content</a>
      <AppHeader
        :is-dark="isDark"
        :mobile-menu-open="mobileMenuOpen"
        @go-home="goHome"
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

        <div id="main-content" ref="pageScroll" class="page-scroll" tabindex="-1">
          <router-view />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import AppHeader from '../components/AppHeader.vue'
import AppNavigation from '../components/AppNavigation.vue'
import PageHeader from '../components/PageHeader.vue'

const route = useRoute()
const router = useRouter()
const theme = useTheme()

const mobileMenuOpen = ref(true)
const pageScroll = ref<HTMLElement | null>(null)
const desktopExpanded = ref(
  localStorage.getItem('desktop-navigation-expanded') !== 'false',
)

const isDark = computed(() => theme.global.current.value.dark)
const pageTitle = computed(() => String(route.meta.title ?? 'Home'))
const pageSubtitle = computed(() => String(route.meta.subtitle ?? ''))

watch(
  () => route.path,
  async () => {
    document.title = pageTitle.value === 'Home'
      ? 'Darin F Miller - Senior Software Engineer'
      : `${pageTitle.value} | Darin F Miller`
    mobileMenuOpen.value = false
    await nextTick()
    pageScroll.value?.scrollTo({ top: 0, behavior: 'instant' })
  },
  { immediate: true },
)

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

async function goHome() {
  if (route.path !== '/') {
    await router.push('/')
  }

  await nextTick()
  pageScroll.value?.scrollTo({ top: 0 })
}

onMounted(() => {
  const savedTheme = localStorage.getItem('site-theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.change(savedTheme)
  }
})

</script>

<style scoped>
.app-shell {
  height: 100%;
}

.skip-link {
  position: fixed;
  z-index: 2000;
  top: 8px;
  left: 8px;
  padding: 12px 16px;
  transform: translateY(-160%);
  border-radius: 4px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
}

.skip-link:focus {
  transform: translateY(0);
}

.page-scroll:focus {
  outline: none;
}

.page-scroll:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: -2px;
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
