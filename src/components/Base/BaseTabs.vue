<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  inPageHeader?: boolean
  hideTabs?: boolean
  tabs?: readonly string[]
}>(), {
  inPageHeader: false,
  hideTabs: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const selectedTab = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <Teleport v-if="inPageHeader && !hideTabs" to="#page-header-tabs" defer>
    <v-tabs v-model="selectedTab">
      <v-tab v-for="tab in tabs" :key="tab" class="text-none" :value="tab">
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </v-tab>
      <slot name="tabs" />
    </v-tabs>
  </Teleport>
  <v-tabs v-else-if="!hideTabs" v-model="selectedTab">
    <v-tab v-for="tab in tabs" :key="tab" class="text-none" :value="tab">
      {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
    </v-tab>
    <slot name="tabs" />
  </v-tabs>

  <v-tabs-window v-model="selectedTab">
    <slot />
  </v-tabs-window>
</template>
