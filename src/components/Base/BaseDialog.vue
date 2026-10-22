<script setup>
import { useId } from 'vue'
import BaseButton from './BaseButton.vue'
defineProps({
  modelValue: Boolean,
  title: String,
  confirmLabel: { type: String, default: 'Save changes' },
  confirmLoading: Boolean,
  maxWidth: { type: [Number, String], default: 440 },
  danger: Boolean,
})
defineEmits(['update:modelValue', 'confirm'])
const titleId = useId()
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    :aria-labelledby="titleId"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title :id="titleId" class="pt-5 px-6">{{ title }}</v-card-title>
      <v-card-text class="px-6"><slot /></v-card-text>
      <v-card-actions class="px-6 pb-5">
        <v-spacer />
        <BaseButton variant="quiet" @click="$emit('update:modelValue', false)">Cancel</BaseButton>
        <BaseButton :variant="danger ? 'danger' : 'primary'" :loading="confirmLoading" @click="$emit('confirm')">{{ confirmLabel }}</BaseButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
