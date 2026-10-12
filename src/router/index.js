import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/test', component: () => import('../views/TestView.vue') },
  { path: '/result', component: () => import('../views/ResultView.vue') },
  { path: '/types', component: () => import('../views/TypesView.vue') },
  { path: '/profile', component: () => import('../views/ProfileBuilderView.vue') },
  { path: '/p', component: () => import('../views/ProfileView.vue') },
  { path: '/p/:payload(.*)', component: () => import('../views/ProfileView.vue') },
  { path: '/compare', component: () => import('../views/CompareView.vue') },
  { path: '/explore', component: () => import('../views/ExploreView.vue') },
  { path: '/quiz/:testId', component: () => import('../views/SceneQuizView.vue') },
  { path: '/quiz/:testId/result', component: () => import('../views/SceneResultView.vue') },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
