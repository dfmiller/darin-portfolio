<script setup>
defineProps({
  modelValue: [Number, String],
  label: String,
  min: Number,
  max: Number,
  hint: String,
  error: String,
  variant: { type: String, default: 'underlined' },
})
defineEmits(['update:modelValue'])
</script>
<template>
  <v-text-field :model-value="modelValue" :label="label" type="number" :min="min" :max="max" :variant="variant" density="comfortable"
    :hint="hint" :persistent-hint="!!hint" :error-messages="error"
    @update:model-value="$emit('update:modelValue', $event === '' ? null : Number($event))" />
</template>
