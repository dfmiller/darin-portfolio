
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

    <BaseTabs v-model="tab" in-page-header>
      <template #tabs>
        <v-tab v-for="tab in tabs" :key="tab" class="text-none" :value="tab">
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
        </v-tab>
      </template>

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
import { ref } from 'vue'
import ScreenshotsTab from '@/views/checkout/ScreenshotsTab.vue'
import CheckoutTab from '@/views/checkout/CheckoutTab.vue'

const tabs = ['screenshots', 'mockup'] as const
type Tab = typeof tabs[number]
const tab = ref<Tab>('screenshots') 
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
