<template>
  <div class="skills">
    <span v-for="skill in skills" :key="skill" class="skill">
      {{ skill }}
    </span>
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
