
<template>
  <div ref="homePage" class="home-page">
    <LandingHero />
    <PageHeader
      :links="pageSections"
    />

    <section id="work">
      <div class="wrap">
        <SectionHeading title="Selected Work" />
        <CaseStudy />
      </div>
    </section>

    <section id="strengths">
      <div class="wrap">
        <SectionHeading title="What I Bring" />

        <div class="card-grid">
          <article v-for="item in strengths" :key="item.title" class="card">
            <span class="tag">{{ item.label }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="skills">
      <div class="wrap">
        <SectionHeading
          title="Technical Toolkit"
          description="Technologies and practices represented in my professional experience."
        />
        <SkillList :skills="skills" />
      </div>
    </section>

    <section id="experience">
      <div class="wrap">
        <SectionHeading title="Experience" />
        <ExperienceTimeline :experience="experience" />
      </div>
    </section>

    <section id="side-projects">
      <div class="wrap">
        <SectionHeading title="Personal Projects" />
        <SideProjects />
      </div>
    </section>

    <section id="contact">
      <div class="wrap">
        <SectionHeading
          title="Let's Talk"
            description="Interested in building maintainable front-end systems, improving product experiences, or untangling complicated interfaces?"
          />

        <div class="actions">
          <BaseButton
            class="text-none"
            href="https://www.linkedin.com/in/darinfmiller"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
            <span class="sr-only">(opens in a new tab)</span>
            <v-icon icon="mdi-arrow-top-right" size="small" aria-hidden="true" />
          </BaseButton>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import LandingHero from '../components/home/LandingHero.vue'
import PageHeader from '../components/PageHeader.vue'
import SectionHeading from '../components/home/SectionHeading.vue';
import CaseStudy from '../components/home/CaseStudy.vue';
import SkillList from '../components/home/SkillList.vue'
import ExperienceTimeline from '../components/home/ExperienceTimeline.vue'
import SideProjects from '../components/home/SideProjects.vue'
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
  --max: 1100px;

  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.home-page :deep(.eyebrow),
.home-page :deep(.case-label) {
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.home-page :deep(.hero h1) {
  max-width: 850px;
  margin: 18px 0 16px;
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.065em;
}

.home-page :deep(.actions) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.home-page :deep(section) {
  border-top: 1px solid var(--line);
}

.home-page :deep(section:not(.hero)) {
  padding: 86px 0;
}

.home-page :deep(.section-heading) {
  margin-bottom: 36px;
}

.home-page :deep(.section-heading h2) {
  margin: 0 0 14px;
  font-size: 2.3rem;
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.home-page :deep(.section-heading p) {
  max-width: 720px;
  margin: 0;
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}

.home-page :deep(.case-study-list) {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.home-page :deep(.case-study) {
  padding: 30px;
  background: var(--panel);
  color: white;
  border-radius: 20px;
}

.home-page :deep(.case-study-intro h3) {
  margin: 8px 0;
  font-size: 1.8rem;
}

.home-page :deep(.case-study-intro p),
.home-page :deep(.case-copy p) {
  max-width: 820px;
  color: var(--muted);
}

.home-page :deep(.case-study-details) {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 46px;
  margin-top: 42px;
}

.home-page :deep(.case-study-details h4) {
  margin: 8px 0 0;
  font-size: 1.5rem;
  line-height: 1.2;
}

.home-page :deep(.case-copy p:first-child) {
  margin-top: 0;
}

.home-page :deep(.tech-row) {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 32px;
}

.home-page :deep(.card-grid) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  color: white;
}

.home-page :deep(.card) {
  padding: 28px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 20px;
}

.home-page :deep(.card h3) {
  margin: 0 0 8px;
  font-size: 1.35rem;
}

.home-page :deep(.card p) {
  margin: 0;
  color: var(--muted);
}

.home-page :deep(.project-grid) {
  grid-template-columns: 1fr;
}

.home-page :deep(.project-card) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.home-page :deep(.project-cta) {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: var(--accent);
  color: var(--bg);
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease;
}

.home-page :deep(.project-cta:hover) {
  background: transparent;
  color: var(--accent);
}

.home-page :deep(.project-cta:focus-visible) {
  outline: 2px solid var(--text);
  outline-offset: 3px;
}

.home-page :deep(.tag) {
  display: inline-block;
  margin-bottom: 14px;
  color: var(--accent);
  font-size: 0.82rem;
}

.home-page :deep(.skills) {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.home-page :deep(.timeline) {
  display: grid;
}

.home-page :deep(.role) {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 30px;
  padding: 24px 0;
  border-top: 1px solid var(--line);
}

.home-page :deep(.role:first-child) {
  border-top: 0;
}

.home-page :deep(.role strong),
.home-page :deep(.role span) {
  display: block;
}

.home-page :deep(.role span) {
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}

.home-page :deep(.case-copy a) {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

@media (max-width: 760px) {
  .home-page :deep(section:not(.hero)) {
    padding: 32px 0 48px;
  }

  .home-page :deep(.card-grid),
  .home-page :deep(.case-study-details),
  .home-page :deep(.role) {
    grid-template-columns: 1fr;
  }

  .home-page :deep(.project-card) {
    align-items: flex-start;
    flex-direction: column;
  }

  .home-page :deep(.role) {
    gap: 8px;
  }
}
</style>
