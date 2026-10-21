<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: null,
  mode: {
    type: String,
    default: 'combobox',
    validator: value => ['combobox', 'autocomplete', 'select'].includes(value),
  },
  label: String,
  options: { type: Array, default: () => [] },
  hint: String,
  error: String,
  variant: { type: String, default: 'underlined' },
  density: { type: String, default: 'comfortable' },
  disabled: Boolean,
  clearable: Boolean,
  multiple: Boolean,
})
const emit = defineEmits(['update:modelValue'])

const selectionComponent = computed(() => ({
  combobox: 'v-combobox',
  autocomplete: 'v-autocomplete',
  select: 'v-select',
})[props.mode])
</script>

<template>
  <component
    :is="selectionComponent"
    :model-value="modelValue"
    :label="label"
    :items="options"
    item-title="label"
    item-value="value"
    :variant="variant"
    :density="density"
    :hint="hint"
    :persistent-hint="!!hint"
    :error-messages="error"
    :disabled="disabled"
    :clearable="clearable"
    :multiple="multiple"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
