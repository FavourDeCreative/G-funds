import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
{
  path: '/login',
  name: 'Login',
  component: () => import('../views/Login.vue')
},
{
  path: '/register',
  name: 'Register',
  component: () => import('../views/Register.vue')
},
{
  path: '/market',
  name: 'Market',
  component: () => import('../views/Market.vue')
}


]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router