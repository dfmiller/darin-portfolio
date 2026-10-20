<script setup>
// options: [{ value, label }]
defineProps({ modelValue: [String, Number], label: String, options: Array, hint: String, error: String })
defineEmits(['update:modelValue'])
</script>
<template>
  <v-select :model-value="modelValue" :label="label" :items="options" item-title="label" item-value="value" variant="outlined"
    density="comfortable" :hint="hint" :persistent-hint="!!hint" :error-messages="error" @update:model-value="$emit('update:modelValue', $event)" />
</template>
