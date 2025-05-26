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
  history: createWebHistory('/'),
  routes
})

// Handle GitHub Pages 404 redirect
router.beforeEach((to, from, next) => {
  if (to.path.includes('/?/')) {
    const path = to.path.split('/?/')[1]
    next(path)
  } else {
    next()
  }
})

export default router 