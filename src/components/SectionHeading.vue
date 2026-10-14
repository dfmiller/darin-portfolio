<template>
  <div class="section-heading">
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

