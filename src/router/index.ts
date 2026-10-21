
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import DesignSystemPage from '../views/design-system/DesignSystemPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'
import SettingsPage from '../views/SettingsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Home', showHero: true },
  },
  {
    path: '/design-systems',
    name: 'Reusable Components',
    component: DesignSystemPage,
    meta: { title: 'Reusable Components' },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: { title: 'Settings' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: { title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
