<script setup>
defineProps({ modelValue: Boolean, label: String, disabled: Boolean })
defineEmits(['update:modelValue'])
</script>
<template>
  <v-switch :model-value="modelValue" :label="label" :disabled="disabled" color="primary" inset hide-details @update:model-value="$emit('update:modelValue', $event)" />
</template>
