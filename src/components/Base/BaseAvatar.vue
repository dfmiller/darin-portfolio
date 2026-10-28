<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  size?: number | string
  initials?: string
}>(), {
  src: '',
  alt: 'User avatar',
  size: 32,
  initials: '',
})

const hasError = ref(false)

watch(() => props.src, () => {
  hasError.value = false
})

const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'deep-purple', 'indigo', 'teal']

const randomColor = computed(() => {
  if (!props.initials) return 'surface-variant'
  let hash = 0
  for (let i = 0; i < props.initials.length; i++) {
    hash = props.initials.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
})

const numericSize = computed(() => {
  const parsed = typeof props.size === 'number' ? props.size : parseInt(props.size, 10)
  return isNaN(parsed) ? 32 : parsed
})

const iconSize = computed(() => numericSize.value * 0.55)

const fontSize = computed(() => `${numericSize.value * 0.4}px`)
</script>

<template>
  <v-avatar :size="size" :color="src && !hasError ? 'surface-variant' : randomColor" data-testid="base-avatar">
    <v-img 
      v-if="src && !hasError" 
      :src="src" 
      :alt="alt" 
      cover 
      @error="hasError = true" 
    />

    <template v-if="!src || hasError">
      <span 
        v-if="initials" 
        class="text-uppercase font-weight-medium" 
        :style="{ fontSize }"
        data-testid="avatar-initials"
      >
        {{ initials }}
      </span>
      <v-icon 
        v-else 
        icon="mdi-account" 
        aria-hidden="true" 
        :size="iconSize" 
        data-testid="fallback-icon" 
      />
    </template>
  </v-avatar>
</template>