import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from './views/Admin.vue'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
