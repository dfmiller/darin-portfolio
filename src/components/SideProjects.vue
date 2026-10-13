<template>
  <v-row class="project-grid" dense>
    <v-col v-for="project in projects" :key="project.title" cols="12" sm="6">
      <v-card class="project-card" color="surface" variant="flat">
        <div class="project-art" :class="`project-art--${project.art}`" aria-hidden="true">
          <span class="project-art-symbol">{{ project.symbol }}</span>
          <span class="project-art-detail project-art-detail--one"></span>
          <span class="project-art-detail project-art-detail--two"></span>
          <span class="project-art-detail project-art-detail--three"></span>
        </div>
        <v-card-text class="project-content">
          <a href="https://javascript-apps-green.vercel.app/" target="_blank">
          <v-chip class="project-category" color="primary" size="small" variant="tonal">
            {{ project.category }}
          </v-chip>
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <div class="tech-row">
            <v-chip v-for="technology in project.technologies" :key="technology">
              {{ technology }}
            </v-chip>
          </div>
          </a>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const projects = [
  {
    title: "Android Games",
    category: "Game development",
    description:
      "Independent JavaScript games packaged for Android with Apache Cordova. The original source code and art assets are available, although the games are no longer listed on Google Play.",
    technologies: ["JavaScript", "HTML", "CSS", "Cordova"],
    art: "android",
    href: "https://javascript-apps-green.vercel.app",
  },
];
</script>
