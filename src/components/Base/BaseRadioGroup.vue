<script setup>
defineProps({ modelValue: String, label: String, options: Array, error: String })
defineEmits(['update:modelValue'])
</script>
<template>
  <v-radio-group :model-value="modelValue" :label="label" :error-messages="error" inline @update:model-value="$emit('update:modelValue', $event)">
    <v-radio v-for="o in options" :key="o.value" :label="o.label" :value="o.value" color="primary" />
  </v-radio-group>
</template>
