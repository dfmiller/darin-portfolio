
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import ResourcesPage from '../views/ResourcesPage.vue'
import SettingsPage from '../views/SettingsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Home', showHero: true },
  },
  {
    path: '/resources',
    name: 'Resources',
    component: ResourcesPage,
    meta: { title: 'Resources' },
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
