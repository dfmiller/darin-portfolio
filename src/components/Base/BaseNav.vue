<script setup>
// One navigation structure, defined as data. Every app page uses this.
defineProps({ items: Array, modelValue: String })
defineEmits(['update:modelValue'])
</script>

<template>
  <v-navigation-drawer permanent width="232">
    <v-list nav density="comfortable" :selected="[modelValue]" @update:selected="$emit('update:modelValue', $event[0] ?? modelValue)">
      <v-list-item v-for="i in items" :key="i.id" :value="i.id" :title="i.label" :prepend-icon="i.icon" rounded="md" color="primary" />
    </v-list>
  </v-navigation-drawer>
</template>
