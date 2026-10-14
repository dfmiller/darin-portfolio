<template>
  <v-app>
    <v-app-bar scroll-behavior="elevate">
      <v-app-bar-title>
        <a class="brand" href="#top" aria-label="Darin F. Miller home">
          {{ title }}
        </a>
      </v-app-bar-title>

      <v-spacer />

      <BaseNav />
    </v-app-bar>
    <slot />
  </v-app>
</template>

<script setup lang="ts">
import BaseNav from './BaseNav.vue'

defineProps<{ title: string }>()
</script>
