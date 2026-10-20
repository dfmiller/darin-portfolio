<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: String,
  label: String,
  hint: String,
  error: String,
  variant: { type: String, default: 'underlined' },
})
const emit = defineEmits(['update:modelValue'])
const menu = ref(false)

const selectDate = (value) => {
  const date = Array.isArray(value) ? value[0] : value
  let isoDate

  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  } else if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    isoDate = date
  } else {
    return
  }

  emit('update:modelValue', isoDate)
  menu.value = false
}
</script>
<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template #activator="{ props: activatorProps }">
      <v-text-field
        v-bind="activatorProps"
        :model-value="modelValue"
        :label="label"
        :variant="variant"
        density="comfortable"
        readonly
        clearable
        append-inner-icon="mdi-calendar"
        :hint="hint"
        :persistent-hint="!!hint"
        :error-messages="error"
        @click:clear.stop="emit('update:modelValue', '')"
      />
    </template>
    <v-date-picker :model-value="modelValue" @update:model-value="selectDate" />
  </v-menu>
</template>
