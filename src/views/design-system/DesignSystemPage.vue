
<template>
  <div class="page-content">
    <BaseTabs v-model="tab" in-page-header hide-tabs>
      <template #tabs>
        <v-tab value="sample">Sample</v-tab>
        <v-tab value="info">Info</v-tab>
      </template>
      
      <v-tabs-window-item value="sample">
        <SampleTab />
        <!-- <CommentsTable /> -->
      </v-tabs-window-item>

      <v-tabs-window-item value="info">
        <InfoTab />
      </v-tabs-window-item>
    </BaseTabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
//import CommentsTable from './CommentsTable.vue'
import InfoTab from './InfoTab.vue'
import SampleTab from './SampleTab.vue'

const tab = ref('sample')
</script>

<style scoped>
.page-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}
</style>
