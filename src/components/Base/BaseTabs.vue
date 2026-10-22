<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  inPageHeader?: boolean
  hideTabs?: boolean
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
      <slot name="tabs" />
    </v-tabs>
  </Teleport>
  <v-tabs v-else-if="!hideTabs" v-model="selectedTab">
    <slot name="tabs" />
  </v-tabs>

  <v-tabs-window v-model="selectedTab">
    <slot />
  </v-tabs-window>
</template>
