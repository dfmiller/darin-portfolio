<template>
  <div class="card-grid project-grid">
    <article v-for="project in projects" :key="project.title" class="card project-card">
      <div>
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
      </div>
      <a class="project-cta" :href="project.href" target="_blank" rel="noreferrer">
        View Projects
        <v-icon icon="mdi-arrow-top-right" size="small" />
      </a>
    </article>
  </div>
</template>

<script setup>
const projects = [
  {
    title: "Web & Mobile Apps",
    description: "Independent projects exploring web and mobile application development built with JavaScript, HTML, and CSS.",
    href: "https://javascript-apps-green.vercel.app",
  },
];
</script>
