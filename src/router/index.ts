
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: { title: 'Home', showHero: true },
  },
  {
    path: '/design-systems',
    name: 'Reusable Components',
    component: () => import('../views/DesignSystemPage.vue'),
    meta: { title: 'Reusable Components' },
  },
  {
    path: '/checkout',
    name: 'Custom Checkout',
    component: () => import('../views/CheckoutPage.vue'),
    meta: { title: 'Custom Checkout' },
  },
  {
    path: '/infinite-scroll',
    name: 'Infinite Scroll',
    component: () => import('../views/InfiniteScrollPage.vue'),
    meta: { title: 'Infinite Scroll' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundPage.vue'),
    meta: { title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
