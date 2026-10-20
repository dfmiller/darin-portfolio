<script setup lang="ts">
withDefaults(defineProps<{
  src?: string
  alt?: string
  size?: number | string
}>(), {
  src: '',
  alt: 'User avatar',
  size: 32,
})
</script>

<template>
  <v-avatar :size="size" color="surface-variant">
    <v-img v-if="src" :src="src" :alt="alt" cover />
    <v-icon v-else icon="mdi-account" aria-hidden="true" />
  </v-avatar>
</template>
