
<template>
  <div class="page-content">
    <div class="intro mb-6">
      <p>
        This was a custom checkout page built with Vue 3 and Vuetify 3. It
        featured a responsive design, form validation, and a smooth user
        experience. Designed to funnel from multiple websites, it showed separate
        theming and branding options from each parent site.
      </p>
    </div>

    <BaseTabs v-model="tab" in-page-header :tabs="tabs">
      <v-tabs-window-item value="screenshots">
        <ScreenshotsTab />
      </v-tabs-window-item>

      <v-tabs-window-item value="mockup">
        <CheckoutTab />
      </v-tabs-window-item>
    </BaseTabs>

  </div>
</template>

<script setup lang="ts">
import ScreenshotsTab from '@/views/checkout/ScreenshotsTab.vue'
import CheckoutTab from '@/views/checkout/CheckoutTab.vue'


import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const tabs = ['screenshots', 'mockup'] as const

type Tab = typeof tabs[number]

const tab = computed<Tab>({
  get: () => {
    const hashTab = route.hash.slice(1)
    return tabs.find(candidate => candidate === hashTab) ?? 'screenshots'
  },
  set: value => {
    const hash = `#${value}`
    if (route.hash !== hash) void router.push({ hash })
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

.intro p {
  opacity: 0.7;
}

</style>
