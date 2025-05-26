import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Projects from '../pages/Projects.vue'
import Songs from '../pages/Songs.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/songs',
    name: 'Songs',
    component: Songs
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 