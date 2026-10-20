<script setup>
// label is required so icon-only buttons always have an accessible name.
defineProps({ icon: String, label: { type: String, required: true }, danger: Boolean })
</script>
<template>
  <v-btn :icon="icon" :aria-label="label" :title="label" variant="text" size="small" :color="danger ? 'error' : 'secondary'" />
</template>
