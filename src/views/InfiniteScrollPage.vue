<template>
    <div class="page-content">
    <BaseTabs v-model="tab" :tabs="tabs" in-page-header>
      <v-tabs-window-item value="products">
        <ProductsTab />
      </v-tabs-window-item>
      
      <v-tabs-window-item value="users">
        <UsersTab />
      </v-tabs-window-item>
    </BaseTabs>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'  
import ProductsTab from './infinite-scroll/ProductsTab.vue'
import UsersTab from './infinite-scroll/UsersTab.vue'

const route = useRoute()
const router = useRouter()

const tabs = ['products', 'users'] as const
type Tab = typeof tabs[number]

const tab = computed<Tab>({
  get: () => {
    const hashParams = new URLSearchParams(route.hash.slice(1))
    return tabs.find(candidate => hashParams.has(candidate)) ?? 'products'
  },
  set: value => {
    const hash = `#${value}`
    if (route.hash !== hash) void router.push({ hash })
  },
})
</script>