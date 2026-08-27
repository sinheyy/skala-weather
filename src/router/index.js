import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/WeatherHomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/WeatherAboutView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'detail',
      component: () => import('@/views/WeatherDetailView.vue'),
    },
    {
      path: '/rainy',
      name: 'rainy',
      component: () => import('@/views/WeatherRainyView.vue'),
    },
    {
      path: '/travel',
      name: 'travel',
      component: () => import('@/views/TravelPickView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
