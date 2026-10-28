<script setup>
defineProps({ modelValue: Boolean, label: String, disabled: Boolean })
defineEmits(['update:modelValue'])
</script>
<template>
  <v-checkbox :model-value="modelValue" :label="label" :disabled="disabled" color="primary" hide-details @update:model-value="$emit('update:modelValue', $event)">
    <template v-if="$slots.label" #label>
      <slot name="label"></slot>
    </template>
  </v-checkbox>
</template>
