<template>
  <nav>
    <!-- Desktop navigation -->
      <template v-if="!smAndDown">
        <v-btn
          v-for="link in links"
          :key="link.href"
          variant="text"
          class="text-none"
          :href="link.href"
        >
          {{ link.title }}
        </v-btn>
      </template>

      <!-- Mobile navigation -->
      <v-menu v-else>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-menu"
            aria-label="Open navigation menu"
            variant="text"
          />
        </template>

        <v-list>
          <v-list-item
            v-for="link in links"
            :key="link.href"
            :title="link.title"
            :href="link.href"
          />
        </v-list>
      </v-menu>
  </nav>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

const links = [
  { title: 'Work', href: '#work' },
  { title: 'Strengths', href: '#strengths' },
  { title: 'Skills', href: '#skills' },
  { title: 'Experience', href: '#experience' },
  { title: 'Contact', href: '#contact' },
]
</script>
