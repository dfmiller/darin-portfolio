<script setup>
defineProps({ modelValue: Boolean, message: String, color: { type: String, default: 'primary' } })
defineEmits(['update:modelValue'])
</script>
<template>
  <v-snackbar :model-value="modelValue" :timeout="3000" location="top right" :color="color" @update:model-value="$emit('update:modelValue', $event)">{{ message }}</v-snackbar>
</template>
