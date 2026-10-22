<script setup>
// App-facing API: variant + loading. Vuetify props stay hidden.
import { computed } from 'vue'
const props = defineProps({
  variant: { type: String, default: 'primary', validator: v => ['primary', 'secondary', 'danger', 'warning', 'info', 'success', 'quiet'].includes(v) },
  loading: Boolean,
  disabled: Boolean,
})
const map = {
  primary: { color: 'primary', variant: 'flat' },
  secondary: { color: 'primary', variant: 'outlined' },
  danger: { color: 'error', variant: 'flat' },
  warning: { color: 'warning', variant: 'flat' },
  info: { color: 'info', variant: 'flat' },
  success: { color: 'success', variant: 'flat' },
  quiet: { color: 'secondary', variant: 'text' },
}
const v = computed(() => map[props.variant])
</script>

<template>
  <v-btn v-bind="v" :loading="loading" :disabled="disabled" class="text-none" rounded><slot /></v-btn>
</template>
