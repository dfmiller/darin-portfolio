<template>
  <v-row>
    <v-col v-for="(item, index) in images" :key="index" cols="12" sm="4" class="d-flex">
      <v-card class="flex-d-column w-100" @click="dialogVisible = true; currentItem = index">
        <v-img :src="item" max-height="30vmin" contain></v-img>
      </v-card>
    </v-col>
  </v-row>

  <BaseDialog v-model="dialogVisible" min-width="calc(100vw - 250px)" closeLabel="Close">
    <v-carousel
      v-model="currentItem"
      :interval="4000"
      show-arrows="hover"
      hide-delimiter-background
      height="100vh"
    >
      <v-carousel-item
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        :value="index"
        contain
      ></v-carousel-item>
    </v-carousel>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/Base/BaseDialog.vue';
import { ref } from 'vue'
const dialogVisible = ref(false)
const currentItem = ref(0)

const modules = import.meta.glob('@/assets/images/checkout*.png', { eager: true })
const images = ref(
  Object.values(modules).map((mod) => (mod as { default: string }).default)
)
</script>