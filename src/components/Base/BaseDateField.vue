<script setup>
// Native date input keeps this wrapper dependency-free. Value is an ISO string (YYYY-MM-DD).
defineProps({ modelValue: String, label: String, hint: String, error: String })
defineEmits(['update:modelValue'])
</script>
<template>
  <v-text-field :model-value="modelValue" :label="label" type="date" variant="outlined" density="comfortable"
    :hint="hint" :persistent-hint="!!hint" :error-messages="error" @update:model-value="$emit('update:modelValue', $event)" />
</template>
