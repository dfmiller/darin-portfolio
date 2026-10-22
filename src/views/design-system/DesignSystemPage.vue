<template>
  <div class="page-content">
    <div class="page-intro">
      <p>
        This page is a working example of a reusable component library, the kind of shared front-end foundation I
        have built and maintained on product teams. Because the code from my professional work is proprietary, I
        built this representative library to show how I approach it.
      </p>
      <p>
        Every control is a small wrapper around Vuetify, designed for consistent behavior, keyboard and screen reader
        accessibility, light and dark themes, and layouts that work on phones. Use the tabs below to explore it:
        <strong>Components</strong> is a catalog of each component and its states,
        <strong>Sample</strong> puts them together in a realistic searchable, sortable and editable users table, and
        <strong>Info</strong> explains what a design system is and why teams use one.
      </p>
    </div>

    <BaseTabs v-model="tab" in-page-header>
      <template #tabs>
        <v-tab v-for="tab in tabs" :key="tab" class="text-none" :value="tab">
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
        </v-tab>
      </template>

      <v-tabs-window-item value="components">
        <ComponentsTab />
      </v-tabs-window-item>
      
      <v-tabs-window-item value="sample">
        <SampleTab />
      </v-tabs-window-item>

      <v-tabs-window-item value="info">
        <InfoTab />
      </v-tabs-window-item>
    </BaseTabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentsTab from './ComponentsTab.vue'
import SampleTab from './SampleTab.vue'
import InfoTab from './InfoTab.vue'

const route = useRoute()
const router = useRouter()
const tabs = ['components', 'sample', 'info'] as const
type Tab = typeof tabs[number]

const tab = computed<Tab>({
  get: () => {
    const hashTab = route.hash.slice(1)
    return tabs.find(candidate => candidate === hashTab) ?? 'components'
  },
  set: value => {
    const hash = `#${value}`
    if (route.hash !== hash) void router.push({ hash })
  },
})
</script>

<style scoped>
.page-intro {
  max-width: 75ch;
  margin-bottom: 8px;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  line-height: 1.6;
}

.page-intro p {
  margin: 0 0 0.75em;
}

.page-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

@media (max-width: 600px) {
  .page-content {
    padding: 16px;
  }
}
</style>