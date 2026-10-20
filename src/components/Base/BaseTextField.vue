<script setup>
// Label above field, error text, and hint are standardized here once.
defineProps({ modelValue: String, label: String, hint: String, error: String, type: { type: String, default: 'text' } })
defineEmits(['update:modelValue'])
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :type="type"
    :hint="hint"
    :persistent-hint="!!hint"
    :error-messages="error"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
