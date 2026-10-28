
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import DesignSystemPage from '../views/DesignSystemPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'
import CheckoutPage from '../views/CheckoutPage.vue'

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
    path: '/checkout',
    name: 'Custom Checkout',
    component: CheckoutPage,
    meta: { title: 'Custom Checkout' },
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
