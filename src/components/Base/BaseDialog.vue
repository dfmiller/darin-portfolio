<script setup>
import BaseButton from './BaseButton.vue'
defineProps({ modelValue: Boolean, title: String, confirmLabel: { type: String, default: 'Save changes' }, danger: Boolean })
defineEmits(['update:modelValue', 'confirm'])
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="440" @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="pt-5 px-6">{{ title }}</v-card-title>
      <v-card-text class="px-6"><slot /></v-card-text>
      <v-card-actions class="px-6 pb-5">
        <v-spacer />
        <BaseButton variant="quiet" @click="$emit('update:modelValue', false)">Cancel</BaseButton>
        <BaseButton :variant="danger ? 'danger' : 'primary'" @click="$emit('confirm')">{{ confirmLabel }}</BaseButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
