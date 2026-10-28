<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

const modules = import.meta.glob('@/assets/images/checkout*.png', { eager: true })
const images = ref(
  Object.values(modules).map((mod) => (mod as { default: string }).default)
)
</script>