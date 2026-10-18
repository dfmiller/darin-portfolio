
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import DesignSystemPage from '../views/DesignSystemPage.vue'
import SettingsPage from '../views/SettingsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Home', showHero: true },
  },
  {
    path: '/design-system',
    name: 'Design System',
    component: DesignSystemPage,
    meta: { title: 'Design System' },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: { title: 'Settings' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
