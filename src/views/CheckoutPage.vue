
<template>
  <div class="page-content">
    <div class="intro mb-6">
      <p>
        This is a custom checkout page built with Vue 3 and Vuetify 3. It
        features a responsive design, form validation, and a smooth user
        experience. Designed to funnel from multiple websites, it shows separate
        themeing and branding options from each parent site.
      </p>
    </div>

    <v-container>
      <v-carousel 
        cycle 
        :interval="4000"
        show-arrows="hover" 
      >
        <v-carousel-item
          v-for="(image, index) in images"
          :key="index"
          :src="image"
          contain
        ></v-carousel-item>
      </v-carousel>
    </v-container>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'

const modules = import.meta.glob('@/assets/images/checkout*.png', { eager: true })
const images = ref(
  Object.values(modules).map((mod) => (mod as { default: string }).default)
)

</script>

<style scoped>
.page-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.intro h2 {
  margin-bottom: 6px;
  font-size: 1.5rem;
  font-weight: 600;
}

.intro p {
  opacity: 0.7;
}

.settings-card {
  max-width: 720px;
}
</style>
