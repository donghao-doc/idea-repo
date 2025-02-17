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
    // 刮刮卡
    {
      path: '/scratch-card',
      name: 'scratchCard',
      component: () => import('../views/ScratchCard.vue'),
    },
    // 序列帧动画
    {
      path: '/frame-animation',
      name: 'frameAnimation',
      component: () => import('../views/FrameAnimation.vue'),
    },
    // 加载器
    {
      path: '/loader-loading',
      name: 'loaderLoading',
      component: () => import('../views/LoaderLoading.vue'),
    },
  ],
})

export default router
