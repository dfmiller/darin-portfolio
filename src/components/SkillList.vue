<template>
  <div class="skills">
    <v-chip v-for="skill in skills" :key="skill">
      {{ skill }}
    </v-chip>
  </div>
</template>

<script setup>
defineProps({
  skills: {
    type: Array,
    required: true,
  },
});
</script>
