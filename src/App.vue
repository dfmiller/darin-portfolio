<template>
  <BaseApp id="top" title="Darin F. Miller">
    <v-main>
      <header class="hero">        
        <v-container class="wrap">
          <div class="eyebrow">Senior Front-End Engineer</div>

          <h1>Simplifying Complex Interfaces</h1>

          <p class="lead">
            Front-end engineer specializing in design systems,
            responsive web applications, and maintainable interfaces. I work
            across product, design, and engineering to turn requirements into
            reliable experiences.
          </p>

          <div class="actions">
            <v-btn href="#work">View selected work</v-btn>
          </div>
        </v-container>
      </header>

      <section id="work">
        <v-container class="wrap">
          <SectionHeading
            title="Selected work"
          />
          <CaseStudy />
        </v-container>
      </section>

      <section id="strengths">
        <v-container class="wrap">
          <SectionHeading title="What I bring" />

          <div class="card-grid">
            <article v-for="item in strengths" :key="item.title" class="card">
              <span class="tag">{{ item.label }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </v-container>
      </section>

      <section id="side-projects">
          <v-container class="wrap">
            <SectionHeading
              title="Personal projects"
              description="Independent applications and games built with JavaScript, HTML, and CSS."
            />
            <SideProjects />
          </v-container>
        </section>

      <section id="skills">
        <v-container class="wrap">
          <SectionHeading
            title="Technical toolkit"
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

      <section id="contact">
        <v-container class="wrap">
          <SectionHeading
            title="Let's talk"
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
    </v-main>

    <footer>
      <v-container class="wrap">&copy; {{ year }} Darin F. Miller</v-container>
    </footer>
  </BaseApp>
</template>

<script setup>
import { computed } from "vue";

import BaseApp from './components/BaseApp.vue';
import SectionHeading from "./components/SectionHeading.vue";
import CaseStudy from "./components/CaseStudy.vue";
import SideProjects from './components/SideProjects.vue';
import SkillList from "./components/SkillList.vue";
import ExperienceTimeline from "./components/ExperienceTimeline.vue";
import { experience, skills, strengths } from "./data/portfolio";

const year = computed(() => new Date().getFullYear());
</script>
