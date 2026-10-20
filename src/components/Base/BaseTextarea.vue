<script setup>
defineProps({
  modelValue: String,
  label: String,
  hint: String,
  error: String,
  rows: { type: Number, default: 3 },
  variant: { type: String, default: 'underlined' },
})
defineEmits(['update:modelValue'])
</script>
<template>
  <v-textarea :model-value="modelValue" :label="label" :rows="rows" auto-grow :variant="variant" density="comfortable"
    :hint="hint" :persistent-hint="!!hint" :error-messages="error" @update:model-value="$emit('update:modelValue', $event)" />
</template>
