<template>
  <div class="timeline">
    <article v-for="role in experience" :key="`${role.company}-${role.dates}`" class="role">
      <div>
        <strong>{{ role.dates }}</strong>
        <span>{{ role.title }}</span>
      </div>

      <div>
        <strong>{{ role.company }}</strong>
        <span>{{ role.description }}</span>
      </div>
    </article>
  </div>
</template>

<script setup>
defineProps({
  experience: {
    type: Array,
    required: true,
  },
});
</script>
