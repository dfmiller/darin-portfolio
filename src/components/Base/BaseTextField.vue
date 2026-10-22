<script setup>
defineProps({
  modelValue: [Number, String],
  label: String,
  min: Number,
  max: Number,
  step: Number,
  hint: String,
  error: String,
  type: { type: String, default: 'text' },
  variant: { type: String, default: 'underlined' },
  density: { type: String, default: 'comfortable' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :type="type"
    :min="min"
    :max="max"
    :step="step"
    :variant="variant"
    :density="density"
    :hint="hint"
    :persistent-hint="!!hint"
    :error-messages="error"  
    @update:model-value="$emit('update:modelValue', type === 'number' ? ($event === '' ? null : Number($event)) : $event)"
  />
</template>
