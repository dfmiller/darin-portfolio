<template>
  <div class="card-grid project-grid">
    <article v-for="project in projects" :key="project.title" class="card project-card">
      <div>
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
      </div>
      <BaseButton :href="project.href" target="_blank" rel="noreferrer">
        View Projects
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
  href: string
}

const projects: Project[] = [
  {
    title: 'Web & Mobile Apps',
    description:
      'Independent projects exploring web and mobile application development built with JavaScript, HTML, and CSS.',
    href: 'https://javascript-apps-green.vercel.app',
  },
]
</script>
