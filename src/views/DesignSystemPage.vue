<template>
  <div class="page-content">
    <BaseTabs v-model="tab" :tabs="tabs" in-page-header>
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
import ComponentsTab from './design-system/ComponentsTab.vue'
import SampleTab from './design-system/SampleTab.vue'
import InfoTab from './design-system/InfoTab.vue'

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