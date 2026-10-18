
<template>
  <div ref="homePage" class="home-page">
    <LandingHero />
    <PageHeader
      :links="pageSections"
    />

    <section id="work">
      <v-container class="wrap">
        <SectionHeading title="Selected Work" />
        <CaseStudy />
      </v-container>
    </section>

    <section id="strengths">
      <v-container class="wrap">
        <SectionHeading title="What I Bring" />

        <div class="card-grid">
          <article v-for="item in strengths" :key="item.title" class="card">
            <span class="tag">{{ item.label }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </v-container>
    </section>

    <section id="skills">
      <v-container class="wrap">
        <SectionHeading
          title="Technical Toolkit"
          description="Technologies and practices represented in my professional experience."
        />
        <SkillList :skills="skills" />
      </v-container>
    </section>

    <section id="experience">
      <v-container class="wrap">
        <SectionHeading title="Experience" />
        <ExperienceTimeline :experience="experience" />
      </v-container>
    </section>

    <section id="side-projects">
        <v-container class="wrap">
          <SectionHeading title="Personal Projects" />
          <SideProjects />
        </v-container>
      </section>

      <section id="contact">
        <v-container class="wrap">
          <SectionHeading
            title="Let's Talk"
            description="Interested in building maintainable front-end systems, improving product experiences, or untangling complicated interfaces?"
          />

          <div class="actions">
            <v-btn
              class="text-none"
              href="https://www.linkedin.com/in/darinfmiller"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </v-btn>
          </div>
        </v-container>
      </section>

  </div>
</template>

<script setup lang="ts">
import LandingHero from '../components/LandingHero.vue'
import PageHeader from '../components/PageHeader.vue'
import SectionHeading from '../components/SectionHeading.vue';
import CaseStudy from '../components/CaseStudy.vue';
import SkillList from '../components/SkillList.vue'
import ExperienceTimeline from '../components/ExperienceTimeline.vue'
import SideProjects from '../components/SideProjects.vue'
import { experience, skills, strengths } from '../data/portfolio.ts'

const pageSections = [
  { label: 'Work', href: '#work' },
  { label: 'Strengths', href: '#strengths' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Side Projects', href: '#side-projects' },
  { label: 'Contact', href: '#contact' },
]

</script>

<style scoped>
.home-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.welcome-section {
  padding-top: 36px;
}

.welcome-section h2 {
  margin-bottom: 6px;
  font-size: 1.5rem;
  font-weight: 600;
}

.welcome-section > p {
  color: rgb(var(--v-theme-on-background));
  opacity: 0.7;
}

.shortcut-card {
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.shortcut-card:hover {
  border-color: rgb(var(--v-theme-primary));
  transform: translateY(-2px);
}

.shortcut-card h3 {
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.shortcut-card p {
  line-height: 1.5;
  opacity: 0.75;
}
</style>
