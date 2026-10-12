<template>
  <div id="top">
    <SiteNav />

    <main>
      <header class="hero">
        <div class="wrap">
          <div class="eyebrow">Senior Front-End Engineer</div>

          <h1>Simplifying Complex Interfaces</h1>

          <p class="lead">
            Front-end engineer specializing in design systems,
            responsive web applications, and maintainable interfaces. I work
            across product, design, and engineering to turn requirements into
            reliable experiences.
          </p>

          <div class="actions">
            <a class="button primary" href="#work">View selected work</a>
            <a class="button" href="mailto:darinfmiller@gmail.com">Get in touch</a>
          </div>
        </div>
      </header>

      <section id="work">
        <div class="wrap">
          <SectionHeading
            title="Selected work"
          />
          <CaseStudy />
        </div>
      </section>

      <section id="strengths">
        <div class="wrap">
          <SectionHeading title="What I bring" />

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
            title="Technical toolkit"
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

      <section id="contact">
        <div class="wrap">
          <SectionHeading
            title="Let's talk"
            description="Interested in building maintainable front-end systems, improving product experiences, or untangling complicated interfaces?"
          />

          <div class="actions">
            <a class="button primary" href="mailto:darinfmiller@gmail.com">
              darinfmiller@gmail.com
            </a>
            <a
              class="button"
              href="https://www.linkedin.com/in/darinfmiller"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="wrap">© {{ year }} Darin F. Miller</div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from "vue";
import SiteNav from "./components/SiteNav.vue";
import SectionHeading from "./components/SectionHeading.vue";
import CaseStudy from "./components/CaseStudy.vue";
import SkillList from "./components/SkillList.vue";
import ExperienceTimeline from "./components/ExperienceTimeline.vue";
import { experience, skills, strengths } from "./data/portfolio";

const year = computed(() => new Date().getFullYear());
</script>
