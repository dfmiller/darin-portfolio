<template>
  <v-navigation-drawer
    id="primary-navigation"
    :model-value="!mobile || mobileOpen"
    @update:model-value="emit('update:mobile-open', $event)"
    :permanent="!mobile"
    :temporary="mobile"
    :rail="!mobile && !expanded"
    :width="240"
    :rail-width="64"
    location="left"
    color="surface"
    class="app-navigation"
    aria-label="Primary navigation"
  >
    <v-list nav density="comfortable">
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="lg"
        color="primary"
        link
      />
      <v-divider v-if="!mobile" class="mb-2" />
      <v-btn
        v-if="!mobile"
        class="mb-2"
        :icon="expanded ? 'mdi-chevron-left' : 'mdi-chevron-right'"
        :aria-label="expanded ? 'Collapse navigation' : 'Expand navigation'"
        :aria-expanded="expanded"
        variant="text"
        @click="emit('toggle-expanded')"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

defineProps<{
  expanded: boolean
  mobileOpen: boolean
}>()

const emit = defineEmits<{
  'toggle-expanded': []
  'update:mobile-open': [value: boolean]
}>()

const { mdAndUp } = useDisplay()
const mobile = computed(() => !mdAndUp.value)

const items = [
  { title: 'Profile', icon: 'mdi-card-account-details-outline', to: '/' },
  { title: 'Reusable Components', icon: 'mdi-pencil-ruler-outline', to: '/design-systems' },
  //{ title: 'Settings', icon: 'mdi-cog-outline', to: '/settings' },
]
</script>

<style scoped>
.app-navigation {
  height: 100%;
  z-index: 10;
}
</style>
