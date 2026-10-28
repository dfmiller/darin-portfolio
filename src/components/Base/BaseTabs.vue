<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  inPageHeader?: boolean
  hideTabs?: boolean
  tabs?: readonly string[] | readonly { title: string; value: string; content?: string }[]
}>(), {
  inPageHeader: false,
  hideTabs: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const tabs = computed(() => (props.tabs ?? []).map(tab => typeof tab === 'string' ? { title: tab.charAt(0).toUpperCase() + tab.slice(1), value: tab } : tab))

const selectedTab = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const selectedTabContent = computed(() => tabs.value.find(tab => tab.value === selectedTab.value)?.content)
</script>

<template>
  <Teleport v-if="inPageHeader && !hideTabs" to="#page-header-tabs" defer>
    <v-tabs v-model="selectedTab">
      <v-tab v-for="tab in tabs" :key="tab.value" class="text-none" :value="tab.value">
        {{ tab.title }}
      </v-tab>
      <slot name="tabs" />
    </v-tabs>
  </Teleport>
  <v-tabs v-else-if="!hideTabs" v-model="selectedTab">
    <v-tab v-for="tab in tabs" :key="tab.value" class="text-none" :value="tab.value">
      {{ tab.title }}
    </v-tab>
    <slot name="tabs" />
  </v-tabs>

  <v-tabs-window v-model="selectedTab">
    <template v-if="selectedTabContent">
      {{ selectedTabContent }}
    </template>
    <slot />
  </v-tabs-window>
</template>
