
<template>
  <div class="page-content">
    <BaseTabs v-model="tab" in-page-header>
      <template #tabs>
        <v-tab value="components">Components</v-tab>
        <v-tab value="sample">Sample Use</v-tab>
        <v-tab value="info">Info</v-tab>
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
import { ref } from 'vue'
import ComponentsTab from './ComponentsTab.vue'
import SampleTab from './SampleTab.vue'
import InfoTab from './InfoTab.vue'

const tab = ref('components')
</script>

<style scoped>
.page-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}
</style>
