<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  options: Array,
  hint: String,
  error: String,
  variant: { type: String, default: 'underlined' },
})
defineEmits(['update:modelValue'])
</script>
<template>
  <v-autocomplete :model-value="modelValue" :label="label" :items="options" item-title="label" item-value="value" :variant="variant"
    density="comfortable" :hint="hint" :persistent-hint="!!hint" :error-messages="error" clearable @update:model-value="$emit('update:modelValue', $event)" />
</template>
