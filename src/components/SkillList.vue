<template>
  <div class="skills">
    <v-chip v-for="skill in skills" :key="skill">
      {{ skill }}
    </v-chip>
  </div>
</template>

<script setup lang="ts">
defineProps<{ skills: string[] }>()
</script>

