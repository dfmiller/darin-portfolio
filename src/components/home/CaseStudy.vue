<script setup lang="ts">
import { caseStudies } from '@/data/portfolio'
</script>

<template>
  <div class="case-study-list">
    <article
      v-for="study in caseStudies"
      :key="study.title"
      class="case-study"
    >
      <div class="case-study-intro">
        <div v-if="study.eyebrow" class="eyebrow">{{ study.eyebrow }}</div>
        <h3>{{ study.title }}</h3>
        <p>{{ study.intro }}</p>
      </div>

      <div
        v-for="section in study.sections"
        :key="section.label"
        class="case-study-details"
      >
        <div>
          <div class="case-label">{{ section.label }}</div>
          <h4>{{ section.heading }}</h4>
        </div>

        <div class="case-copy">
          <p v-for="(paragraph, i) in section.paragraphs" :key="i">
            {{ paragraph }}
          </p>
          <p v-if="section.sample">
            <a :href="section.sample.href" target="_blank" rel="noopener">
              {{ section.sample.label }}
            </a>
          </p>
        </div>
      </div>

      <div class="tech-row">
        <v-chip v-for="item in study.tech" :key="item">{{ item }}</v-chip>
      </div>
    </article>
  </div>
</template>