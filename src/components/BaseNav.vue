<template>
  <nav>
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

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface NavLink {
  title: string
  href: string
}

const { smAndDown } = useDisplay()

const links: NavLink[] = [
  { title: 'Work', href: '#work' },
  { title: 'Strengths', href: '#strengths' },
  { title: 'Skills', href: '#skills' },
  { title: 'Experience', href: '#experience' },
  { title: 'Personal Projects', href: '#side-projects' },
  { title: 'Contact', href: '#contact' },
]
</script>

