import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/scratch-card',
      name: 'scratchCard',
      component: () => import('../views/ScratchCard.vue'),
    },
  ],
})

export default router
