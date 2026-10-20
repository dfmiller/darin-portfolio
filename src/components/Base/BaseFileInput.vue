<script setup>
defineProps({
  modelValue: [File, Array],
  label: String,
  accept: String,
  hint: String,
  error: String,
  variant: { type: String, default: 'underlined' },
})
defineEmits(['update:modelValue'])
</script>
<template>
  <v-file-input :model-value="modelValue" :label="label" :accept="accept" :variant="variant" density="comfortable"
    :hint="hint" :persistent-hint="!!hint" :error-messages="error" prepend-icon="" prepend-inner-icon="mdi-paperclip"
    @update:model-value="$emit('update:modelValue', $event)" />
</template>
