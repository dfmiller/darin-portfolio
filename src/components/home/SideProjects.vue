<template>
  <div class="card-grid project-grid">
    <article v-for="project in projects" :key="project.title" class="card project-card">
      <div>
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
      </div>

      <BaseButton v-if="project.to" :to="project.to">
        {{ project.cta }}
        <v-icon icon="mdi-arrow-right" size="small" aria-hidden="true" />
      </BaseButton>

      <BaseButton v-else :href="project.href" target="_blank" rel="noreferrer">
        {{ project.cta }}
        <span class="sr-only">(opens in a new tab)</span>
        <v-icon icon="mdi-arrow-top-right" size="small" aria-hidden="true" />
      </BaseButton>
    </article>
  </div>
</template>

<script setup lang="ts">
interface Project {
  title: string
  description: string
  cta: string
  to?: string
  href?: string
}

const projects: Project[] = [
  {
    title: 'Reusable Component Library',
    description:
      'A representative design system built on Vue 3, TypeScript and Vuetify, with accessible, responsive, themeable components and a sample users table showing them working together.',
    cta: 'Explore the Library',
    to: '/design-systems',
  },
  {
    title: 'Web & Mobile Apps',
    description:
      'Independent projects exploring web and mobile application development built with JavaScript, HTML, and CSS.',
    cta: 'View Projects',
    href: 'https://javascript-apps-green.vercel.app',
  },
]
</script>