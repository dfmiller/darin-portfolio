<script setup>
import BaseIconButton from './BaseIconButton.vue'
defineProps({ modelValue: Boolean, title: String })
defineEmits(['update:modelValue'])
</script>
<template>
  <v-navigation-drawer
    :model-value="modelValue"
    location="right"
    temporary
    width="420"
    :style="{ top: '0px', height: '100vh', 'max-height': '100dvh' }"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="d-flex align-center pa-4">
      <h2 class="text-h6">{{ title }}</h2><v-spacer />
      <BaseIconButton icon="mdi-close" label="Close panel" @click="$emit('update:modelValue', false)" />
    </div>
    <div class="px-4"><slot /></div>
    <template #append><div class="pa-4 d-flex ga-2 justify-end"><slot name="footer" /></div></template>
  </v-navigation-drawer>
</template>
